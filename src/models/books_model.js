const mongoose = require('mongoose')

const book = mongoose.model("book", {
    title : String,
    authorId : String,
    description : String,
    categoryId : String,
    stock : {type: Number, default:1},
    coverImage : String,
    createdAt : Date,
    updatedAt : Date
})

module.exports = book