const mongoose = require('mongoose')

const book = mongoose.model("book", {
    title: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Array of ObjectId
    description: String,
    stock: { type: Number, default: 1 },
    coverImage: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

module.exports = book