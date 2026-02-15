const mongoose = require('mongoose');

const ScanResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow anonymous scans for now, or strict? Let's allow anonymous but encourage login.
    },
    payload: {
        type: String,
        required: true
    },
    decodedData: {
        type: Object, // Stores parsed structure (UPI params, URL parts, etc)
        default: {}
    },
    verdict: {
        type: String,
        enum: ['SAFE', 'SUSPICIOUS', 'SCAM', 'DANGER', 'UNKNOWN', 'WARN'], // Aligned with existing
        required: true
    },
    riskScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    detectedType: {
        type: String,
        enum: ['URL', 'UPI', 'TEXT', 'product', 'ISBN', 'vCard', 'WiFi', 'Geo', 'Unknown'],
        required: true
    },
    flags: [{
        type: String
    }],
    explanation: {
        type: String, // Human readable summary
        default: ''
    },
    metadata: {
        clientIp: String,
        userAgent: String,
        geo: Object
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true // For sorting history
    }
});

module.exports = mongoose.model('ScanResult', ScanResultSchema);
