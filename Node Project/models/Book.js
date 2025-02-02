const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: String,
    totalPages: Number,
    currentPage: { type: Number, default: 0 },
    status: { type: String, enum: ["to-read", "reading", "finished"], default: "to-read"},
    format: { type: String, enum: ["ebook", "paperback", "audiobook"], default: "paperback"},
    reviews: [
        {
            rating: { type: Number, min: 1, max: 5 },
            comment: String,
            date: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model("Book", bookSchema);
