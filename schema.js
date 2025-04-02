const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true,
    }
});

// Add pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified('pass')) return next();
    
    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.pass = await bcrypt.hash(this.pass, salt);
        next();
    } catch (error) {
        console.log('Error in hashing password:', error);
        next(error);
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
