const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: String,
        enum: ['tea', 'coffee', 'water', 'snacks'],
        required: true
    },
    note: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'delivered'],
        default: 'pending'
    },
    statusUpdatedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);