const mongoose = require('mongoose')

const borrower = mongoose.model("borrower", {
    name: { type: String, required: true },
    contact: String,
    joinAt: Date,
    updatedAt: Date,
    borrowCount: { type: Number, default: 0 },
    deletedAt: Date
})

module.exports = borrower