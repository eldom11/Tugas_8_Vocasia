const mongoose = require('mongoose')

const author = new mongoose.Schema({
    name: { type: String, required: true },
    bio: String,
    photo: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: Date,
})

module.exports = author