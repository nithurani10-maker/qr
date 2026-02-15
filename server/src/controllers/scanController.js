const ScanResult = require('../models/ScanResult');
const deductionEngine = require('../engine/ScamDeductionEngineV4');
const AuditLog = require('../models/AuditLog');
const { parsePayload } = require('../utils/parsers');
const { generateExplanation } = require('../utils/verdictGenerator');
const crypto = require('crypto');

exports.analyzeScan = async (req, res) => {
    try {
        const { payload, clientInfo } = req.body;
        const user = req.user; // From auth middleware (optional)

        // 1. Strict Input Hardening
        if (!payload || typeof payload !== 'string') return res.status(400).json({ error: 'Invalid Payload' });
        if (payload.length > 2048) return res.status(413).json({ error: 'Payload Too Large' });

        const cleanPayload = payload.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
        if (cleanPayload.length === 0) return res.status(400).json({ error: 'Empty Payload' });

        // 2. Structured Parsing (New Parser)
        const parsedData = parsePayload(cleanPayload);

        // 3. Analysis (Existing Engine)
        // Pass parsed type hint to engine if possible, or just raw
        const analysisResult = await deductionEngine.analyze(cleanPayload, clientInfo);

        // 4. Generate Human Explanation
        const explanation = generateExplanation(
            analysisResult.verdict,
            analysisResult.riskScore,
            parsedData
        );

        // 5. Persistence
        const scanEntry = new ScanResult({
            user: user ? user.id : undefined,
            payload: cleanPayload,
            decodedData: parsedData.data, // Store structured info
            detectedType: parsedData.type,
            explanation: explanation,
            ...analysisResult
        });
        await scanEntry.save();

        // 6. Audit Logging for High Risk
        if (analysisResult.verdict === 'DANGER' || analysisResult.verdict === 'SCAM') {
            await AuditLog.create({
                action: 'SCAN',
                target: crypto.createHash('md5').update(cleanPayload).digest('hex'),
                verdict: analysisResult.verdict,
                actor: user ? `User:${user.id}` : (clientInfo?.ip || 'ANONYMOUS'),
                metadata: {
                    riskScore: analysisResult.riskScore,
                    detectedType: analysisResult.detectedType
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                ...analysisResult,
                decodedData: parsedData.data,
                explanation: explanation,
                detectedType: parsedData.type // Ensure frontend gets the specific type
            }
        });

    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: 'Analysis Failed' });
    }
};

exports.getScanHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const history = await ScanResult.find({ user: req.user.id })
            .sort({ timestamp: -1 })
            .limit(50);

        res.status(200).json({ success: true, count: history.length, data: history });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getScanById = async (req, res) => {
    try {
        const result = await ScanResult.findById(req.params.id);

        if (!result) return res.status(404).json({ error: 'Scan not found' });

        // Security: Only allow owner to view details if bound to a user
        if (result.user && (!req.user || result.user.toString() !== req.user.id)) {
            return res.status(403).json({ error: 'Not authorized to view this scan' });
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// ... keep existing domain/blacklist endpoints ...
exports.analyzeDomain = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: 'URL required' });
        const reputationLayer = require('../engine/layers/ReputationLayer');
        const result = await reputationLayer.analyze(url);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.checkBlacklist = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: 'Query required' });
        const Blacklist = require('../models/Blacklist');
        const DomainReputation = require('../models/DomainReputation');
        const directMatch = await Blacklist.findOne({ pattern: { $regex: new RegExp(q, 'i') } });
        let reputationBad = false;
        if (!directMatch && q.includes('.')) {
            const repo = await DomainReputation.findOne({ domain: q.toLowerCase() });
            if (repo && repo.score < 30) reputationBad = true;
        }
        if (directMatch || reputationBad) {
            return res.status(200).json({ status: 'BLOCKED', reason: directMatch ? 'Blacklisted Pattern' : 'Low Reputation' });
        }
        res.status(200).json({ status: 'ALLOWED' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getBlacklistStatus = async (req, res) => {
    res.status(501).json({ message: 'Not Implemented' });
};

exports.getIntelligence = async (req, res) => {
    res.status(501).json({ message: 'Not Implemented' });
};
