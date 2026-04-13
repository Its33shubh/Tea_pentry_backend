const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: String,
        enum: ['tea', 'coffee', 'water', 'snack'],
        required: true
    },
    note: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'delivered'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);