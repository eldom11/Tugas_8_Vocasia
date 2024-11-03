const mongoose = require('mongoose')

const borrower = new mongoose.Schema({
    name: { type: String, required: true },
    contact: String,
    joinAt: Date,
    updatedAt: Date,
    borrowCount: { type: Number, default: 0 },
    deletedAt: Date
})

module.exports = borrower