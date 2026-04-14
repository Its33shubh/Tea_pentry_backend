const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    role: {
        type: String,
        enum: ['employee', 'staff', 'admin', 'super_admin'],
        default: 'employee'
    },
    isActive: {  //  true = user can access, false = blocked (not deleted) 
        type: Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);