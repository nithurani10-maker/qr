const crypto = require('crypto');
const forensicsLayer = require('./layers/ForensicsLayer');
const consistencyLayer = require('./layers/ConsistencyLayer');
const threatLayer = require('./layers/ThreatLayer');
const behaviorLayer = require('./layers/BehaviorLayer');
const intelligenceLayer = require('./layers/IntelligenceLayer');
const productLayer = require('./layers/ProductLayer');
const reputationLayer = require('./layers/ReputationLayer');

class ScamDeductionEngine {
    constructor() {
        this.VERSION = '4.0.0';
    }

    async analyze(payload, clientInfo = {}) {
        // 0. Fingerprinting
        const fingerprint = crypto.createHash('md5').update(payload).digest('hex');

        const result = {
            verdict: 'SAFE',
            riskScore: 0,
            detectedType: 'UNKNOWN',
            findings: [],
            layers: {},
            fingerprint,
            clientInfo
        };

        // --- EXECUTION OF LAYERS ---

        // 1. Forensics Layer
        const forensics = forensicsLayer.analyze(payload);
        result.layers.forensics = forensics;
        result.riskScore += forensics.riskScore;
        result.findings.push(...forensics.findings);

        // Update detected type
        if (payload.startsWith('upi://')) result.detectedType = 'UPI';
        else if (payload.startsWith('http')) result.detectedType = 'URL';
        else if (/^\d{12,14}$/.test(payload)) result.detectedType = 'PRODUCT';
        else result.detectedType = 'TEXT';

        // 2. Consistency Layer
        const consistency = consistencyLayer.analyze(payload);
        result.layers.consistency = consistency;
        result.riskScore += consistency.riskScore;
        result.findings.push(...consistency.findings);

        // 3. Threat Layer
        const threat = await threatLayer.analyze(payload);
        result.layers.threat = threat;
        result.riskScore += threat.riskScore;
        result.findings.push(...threat.findings);

        const finalUrl = threat.details ? threat.details.finalUrl : null;

        // 4. Intelligence Layer
        const intelligence = await intelligenceLayer.analyze(payload, finalUrl);
        result.layers.intelligence = intelligence;
        result.riskScore += intelligence.riskScore;
        result.findings.push(...intelligence.findings);

        // 5. Behavior Layer
        const behavior = await behaviorLayer.analyze(fingerprint);
        result.layers.behavior = behavior;
        result.riskScore += behavior.riskScore;
        result.findings.push(...behavior.findings);

        // 6. Product Layer
        if (result.detectedType === 'PRODUCT') {
            const productAnalysis = await productLayer.analyze(payload);
            result.layers.product = productAnalysis;
            result.riskScore += productAnalysis.riskScore;
            result.findings.push(...productAnalysis.findings);

            if (productAnalysis.riskScore >= 60) result.verdict = 'DANGER';
            else if (productAnalysis.riskScore >= 20) result.verdict = 'WARN';
        }

        // 7. Reputation Layer (Phase 4)
        if (result.detectedType === 'URL') {
            const targetUrl = finalUrl || payload;
            const reputation = await reputationLayer.analyze(targetUrl);
            result.layers.reputation = reputation;
            result.riskScore += reputation.riskScore;
            result.findings.push(...reputation.findings);

            if (reputation.details && reputation.details.score < 30) {
                result.verdict = 'DANGER';
            }
        }

        // --- FINAL SCORING ---
        if (result.riskScore > 100) result.riskScore = 100;

        // Verdict Rules
        if (result.riskScore >= 80) {
            result.verdict = 'DANGER';
        } else if (result.riskScore >= 40) {
            result.verdict = 'WARN';
        } else if (result.riskScore > 0) {
            result.verdict = 'SUSPICIOUS';
        } else {
            result.verdict = 'SAFE';
        }

        return result;
    }
}

module.exports = new ScamDeductionEngine();
