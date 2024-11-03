const mongoose = require('mongoose')

const author = new mongoose.Schema({
    name: { type: String, required: true },
    bio: String,
    photo: String,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
})

module.exports = author