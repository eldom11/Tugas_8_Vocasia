const mongoose = require('mongoose')

const borrowedBook = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'books', required: true },
    borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'borrowers', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: Date,
    status: { type: String, enum: ['active', 'returned'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

module.exports = borrowedBook