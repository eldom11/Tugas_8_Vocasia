const mongoose = require('mongoose')

const category = mongoose.model("category", {
    name: { type: String, required: true },
    description: String,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
})

module.exports = category