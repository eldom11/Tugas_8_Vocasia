const books = require('../models/books_model')
const { errorMsg, errorName } = require("../utils/error");

const booksController = {};

booksController.getAllBooks = async (req,res) => {
    const book = await books.find()
    res.status(200).json({
        book
    })
}

booksController.getBookById = async (req,res) => {
    const bookId = req.params.id
    const book = await books.findById(bookId)
    res.status(200).json({
        book
    })
}

booksController.createBook = async (req,res, next) => {
    // const book = await book.create(req.body)
    // res.status(201).json({
    //     book
    // })

    try {
        // cek payload
        const { title,
            authorId,
            description,
            categoryId,
            stock,
            coverImage} = req.body;
    
        // // cek falsy dari input
        // // null undefined '' akan falsy
        if (!title) {
          // bad request
          throw { name: errorName.BAD_REQUEST, message: errorMsg.WRONG_INPUT };
        }
    
        // create by model Note
        const book = new books({
            title,
            authorId,
            description,
            categoryId,
            stock,
            coverImage,
            updatedAt: new Date(),
            createdAt: new Date()
        });
    
        await book.save();
        res.status(201).json(book);
      } catch (error) {
        next(error);
      }
}

booksController.updateBook = async (req,res) => {
    const bookId = req.params.id
    const book = await books.findByIdAndUpdate(bookId,req.body)
    res.status(201).json({
        book
    })
}

booksController.deleteBook = async (req,res) => {
    const bookId = req.params.id
    const book = await books.findByIdAndDelete(bookId)
    res.status(204).json({})
}

booksController.uploadImage = async (req,res) => {
    res.status(200).json({
        image : req.file.path
    })
}

module.exports = booksController;