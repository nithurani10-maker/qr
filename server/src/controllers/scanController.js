const ScanResult = require('../models/ScanResult');
const deductionEngine = require('../engine/ScamDeductionEngineV4');
const Blacklist = require('../models/Blacklist');
const AuditLog = require('../models/AuditLog');
const crypto = require('crypto');

exports.analyzeScan = async (req, res) => {
    try {
        const { payload, clientInfo } = req.body;

        // 1. Strict Input Hardening
        if (!payload || typeof payload !== 'string') {
            return res.status(400).json({ error: 'Invalid Payload Format' });
        }
        if (payload.length > 2048) {
            return res.status(413).json({ error: 'Payload Too Large' });
        }

        // 2. Sanitization (Remove control characters)
        // eslint-disable-next-line no-control-regex
        const cleanPayload = payload.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();

        if (cleanPayload.length === 0) {
            return res.status(400).json({ error: 'Empty Payload' });
        }

        // 3. Analysis (Phase 4 Engine)
        const analysisResult = await deductionEngine.analyze(cleanPayload, clientInfo);

        // 4. Persistence
        const scanEntry = new ScanResult({
            payload: cleanPayload,
            ...analysisResult
        });
        await scanEntry.save();

        // 5. Audit Logging for High Risk
        if (analysisResult.verdict === 'DANGER' || analysisResult.verdict === 'SCAM') {
            await AuditLog.create({
                action: 'SCAN',
                target: crypto.createHash('md5').update(cleanPayload).digest('hex'),
                verdict: analysisResult.verdict,
                actor: clientInfo?.ip || 'ANONYMOUS',
                metadata: {
                    riskScore: analysisResult.riskScore,
                    detectedType: analysisResult.detectedType
                }
            });
        }

        res.status(200).json({
            success: true,
            data: analysisResult
        });

    } catch (error) {
        console.error("Analysis Error:", error);

        try {
            await AuditLog.create({
                action: 'SYSTEM_ERROR',
                metadata: { error: error.message }
            });
        } catch (e) { /* ignore */ }

        res.status(500).json({ error: 'Analysis Failed' });
    }
};

exports.getScanHistory = async (req, res) => {
    try {
        const history = await ScanResult.find().sort({ timestamp: -1 }).limit(10);
        res.status(200).json({ success: true, count: history.length, data: history });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getScanById = async (req, res) => {
    try {
        const result = await ScanResult.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Scan not found' });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getBlacklistStatus = async (req, res) => {
    res.status(501).json({ message: 'Blacklist Status Endpoint (Implemented in Phase 2)' });
};

exports.getIntelligence = async (req, res) => {
    res.status(501).json({ message: 'Intelligence Query Endpoint (Implemented in Future Phase)' });
};

exports.analyzeDomain = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: 'URL required' });

        const reputationLayer = require('../engine/layers/ReputationLayer');
        const result = await reputationLayer.analyze(url);

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Domain Analyze Error", error);
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
