const mongoose = require('mongoose')

const borrower = mongoose.model("borrower", {
    name: { type: String, required: true },
    contact: String,
    joinAt: Date,
    updatedAt: Date
})

module.exports = borrower