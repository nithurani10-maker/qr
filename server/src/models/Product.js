const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        default: 'Unknown Product'
    },
    brand: {
        type: String,
        default: 'Unknown Brand'
    },
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manufacturer'
    },
    category: {
        type: String, // e.g., 'Food', 'Electronics'
        default: 'General'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    scanCount: {
        type: Number,
        default: 0
    },
    lastScanned: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
