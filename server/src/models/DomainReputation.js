const mongoose = require('mongoose');

const domainReputationSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 50 // Neutral start
    },
    riskCategory: {
        type: String, // 'SAFE', 'WARN', 'DANGER', 'UNKNOWN'
        default: 'UNKNOWN'
    },
    signals: {
        entropyScore: Number,
        tldRisk: String,
        keywordMatch: [String]
    },
    scamsDetected: {
        type: Number,
        default: 0
    },
    scanCount: {
        type: Number,
        default: 1
    },
    firstSeen: {
        type: Date,
        default: Date.now
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DomainReputation', domainReputationSchema);
