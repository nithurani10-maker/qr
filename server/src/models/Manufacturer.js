const mongoose = require('mongoose');

const manufacturerSchema = new mongoose.Schema({
    prefix: {
        type: String, // e.g. "890" or "000-019"
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true
    },
    region: String,
    riskLevel: {
        type: String,
        enum: ['SAFE', 'MODERATE', 'HIGH'],
        default: 'SAFE'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Manufacturer', manufacturerSchema);
