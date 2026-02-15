const mongoose = require('mongoose');

const ScanResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    payload: {
        type: String,
        required: true
    },
    decodedData: {
        type: Object,
        default: {}
    },
    verdict: {
        type: String,
        enum: ['SAFE', 'SUSPICIOUS', 'SCAM', 'DANGER', 'UNKNOWN', 'WARN'],
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
        type: String, // Stored as JSON string to handle structure
        default: '{}'
    },
    metadata: {
        clientIp: String,
        userAgent: String,
        geo: Object
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('ScanResult', ScanResultSchema);
