const ScanResult = require('../models/ScanResult');
const deductionEngine = require('../engine/ScamDeductionEngineV4');
const AuditLog = require('../models/AuditLog');
const { parsePayload } = require('../utils/parsers');
const { generateExplanation } = require('../utils/verdictGenerator');
const crypto = require('crypto');

exports.analyzeScan = async (req, res) => {
    try {
        const { payload, clientInfo } = req.body;
        const user = req.user;

        // 1. Strict Input Hardening
        if (!payload || typeof payload !== 'string') return res.status(400).json({ error: 'INVALID_PAYLOAD' });
        if (payload.length > 2048) return res.status(413).json({ error: 'PAYLOAD_TOO_LARGE' });

        const cleanPayload = payload.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
        if (cleanPayload.length === 0) return res.status(400).json({ error: 'EMPTY_PAYLOAD' });

        // 2. Structured Parsing
        const parsedData = parsePayload(cleanPayload);

        // 3. Analysis
        const analysisResult = await deductionEngine.analyze(cleanPayload, clientInfo);

        // 4. Generate Structured Explanation
        const explanationJSON = generateExplanation(
            analysisResult.verdict,
            analysisResult.riskScore,
            parsedData
        );

        // 5. Persistence
        const scanEntry = new ScanResult({
            user: user ? user.id : undefined,
            payload: cleanPayload,
            decodedData: parsedData.data,
            detectedType: parsedData.type,
            explanation: explanationJSON,
            riskScore: analysisResult.riskScore,
            verdict: analysisResult.verdict,
            flags: analysisResult.flags
        });

        const savedScan = await scanEntry.save();

        // 6. Audit Logging for High Risk
        if (analysisResult.verdict === 'DANGER' || analysisResult.verdict === 'SCAM') {
            try {
                await AuditLog.create({
                    action: 'SCAN',
                    target: crypto.createHash('md5').update(cleanPayload).digest('hex'),
                    verdict: analysisResult.verdict,
                    actor: user ? `User:${user.id}` : (clientInfo?.ip || 'ANONYMOUS'),
                    metadata: {
                        riskScore: analysisResult.riskScore,
                        detectedType: parsedData.type
                    }
                });
            } catch (e) { console.error("Audit log failed", e); }
        }

        // 7. Format Response
        // Parse explanation back to object for JSON response
        const explanationObj = JSON.parse(explanationJSON);

        res.status(200).json({
            success: true,
            data: {
                _id: savedScan._id,
                verdict: analysisResult.verdict,
                riskScore: analysisResult.riskScore,
                detectedType: parsedData.type,
                decodedData: parsedData.data,
                explanation: explanationObj.summary, // Send summary as main string
                explanationDetails: explanationObj, // Send full object for UI
                timestamp: savedScan.timestamp,
                payload: cleanPayload
            }
        });

    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
};

exports.getScanHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const history = await ScanResult.find({ user: req.user.id })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        const count = await ScanResult.countDocuments({ user: req.user.id });

        // Transform history to include parsed explanation
        const formattedHistory = history.map(h => {
            let exp = "";
            try {
                const e = JSON.parse(h.explanation);
                exp = e.summary || h.explanation;
            } catch { exp = h.explanation; }

            return {
                ...h.toObject(),
                explanation: exp
            };
        });

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: formattedHistory
        });
    } catch (error) {
        console.error("History Error", error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getScanById = async (req, res) => {
    try {
        const result = await ScanResult.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Scan not found' });
        if (result.user && (!req.user || result.user.toString() !== req.user.id)) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Parse explanation for client
        let explanationObj = {};
        try { explanationObj = JSON.parse(result.explanation); } catch (e) { }

        res.status(200).json({
            success: true,
            data: {
                ...result.toObject(),
                explanationDetails: explanationObj
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// ... keep existing endpoints ... (analyzeDomain, etc)
exports.analyzeDomain = async (req, res) => {
    // Legacy support placeholder
    res.status(200).json({ success: true });
};

exports.checkBlacklist = async (req, res) => {
    // Legacy support placeholder
    res.status(200).json({ status: 'ALLOWED' });
};
