const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const Book = require('../models/Book.js')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    readCount: { type: Number, default: 0 },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }
    ]
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);