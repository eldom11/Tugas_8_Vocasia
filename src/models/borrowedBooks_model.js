const mongoose = require('mongoose')

const borrowedBook = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Books', required: true },
    borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Borrowers', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: Date,
    status: { type: String, enum: ['active', 'returned'], default: 'active' },
    createdAt: Date,
    updatedAt: Date
})

module.exports = borrowedBook