const mongoose = require('mongoose')

const author = mongoose.model("author", {
    name: { type: String, required: true },
    bio: String,
    photo: String,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
})

module.exports = author