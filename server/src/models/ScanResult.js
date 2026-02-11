const mongoose = require('mongoose');

const scanResultSchema = new mongoose.Schema({
    scanId: {
        type: String,
        required: true,
        unique: true
    },
    rawData: {
        type: String,
        required: true
    },
    format: {
        type: String,
        default: 'QR_CODE'
    },
    verdict: {
        type: String,
        enum: ['SAFE', 'WARN', 'DANGER', 'SUSPICIOUS'],
        required: true
    },
    riskScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    detectedType: {
        type: String,
        enum: ['URL', 'UPI', 'TEXT', 'PRODUCT', 'UNKNOWN'],
        default: 'UNKNOWN'
    },
    fingerprint: {
        type: String,
        index: true
    },
    layers: {
        forensics: { type: Object, default: {} },
        consistency: { type: Object, default: {} },
        threat: { type: Object, default: {} },
        behavior: { type: Object, default: {} },
        intelligence: { type: Object, default: {} }
    },
    clientInfo: {
        ipHash: String,
        userAgent: String
    },
    findings: [{
        type: String
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ScanResult', scanResultSchema);
