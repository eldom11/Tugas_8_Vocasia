const mongoose = require('mongoose')

const book = new mongoose.Schema({
    title: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'authors', required: true },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }],
    description: String,
    stock: { type: Number, default: 1},
    coverImage: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: Date,
})

module.exports = book