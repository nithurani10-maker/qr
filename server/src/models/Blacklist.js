const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    pattern: {
        type: String, // Regex string or exact match
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['DOMAIN', 'UPI', 'KEYWORD', 'EXACT_PAYLOAD'],
        required: true
    },
    severity: {
        type: String,
        enum: ['DANGER', 'WARN'],
        default: 'DANGER'
    },
    category: {
        type: String, // e.g., 'Phishing', 'Malware', 'FakePayment'
        default: 'General'
    },
    source: {
        type: String,
        default: 'System Internal'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
