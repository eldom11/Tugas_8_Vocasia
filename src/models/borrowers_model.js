const mongoose = require('mongoose')

const borrower = new mongoose.Schema({
    name: { type: String, required: true },
    contact: String,
    joinAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    borrowCount: { type: Number, default: 0 },
    deletedAt: Date
})

module.exports = borrower