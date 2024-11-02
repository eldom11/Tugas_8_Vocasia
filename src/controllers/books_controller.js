const books = require('../models/books_model')
const categories = require('../models/categories_model')
const authors = require('../models/authors_model')
const upload = require('../middleware/upload');

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

booksController.createBook = async (req, res, next) => {
    try {
      const { title, authorId, description, categoryIds, stock } = req.body;
  
      const authorExists = await authors.findById(authorId);
      if (!authorExists) {
        return res.status(400).json({ message: "Invalid Author ID" });
      }
  
      const validCategories = [];
      const invalidCategories = [];
  
      for (const catId of categoryIds) {
        const category = await categories.findById(catId);
        if (category) {
          validCategories.push(catId); 
        } else {
          invalidCategories.push(catId); 
        }
      }

      const book = new books({
        title,
        authorId,
        description,
        categoryIds: validCategories, 
        stock,
        updatedAt: new Date(),
        createdAt: new Date()
      });
  
      await book.save();
  
      const response = {
        message: "Book created successfully.",
        book: book,
      };
  
      if (invalidCategories.length > 0) {
        response.warning = `category id berikut belum dimasukkan dalam database kategori: ${invalidCategories.join(", ")}`;
      }
  
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
};

booksController.updateBook = async (req, res, next) => {
    try {
      const bookId = req.params.id;
      const { title, authorId, description, categoryIds, stock } = req.body;
  
      const authorExists = await authors.findById(authorId);
      if (!authorExists) {
        return res.status(400).json({ message: "Invalid Author ID" });
      }
  
      const validCategories = [];
      const invalidCategories = [];
      for (const catId of categoryIds) {
        const category = await categories.findById(catId);
        if (category) {
          validCategories.push(catId);
        } else {
          invalidCategories.push(catId);
        }
      }
  
      const updateData = {
        title,
        authorId,
        description,
        categoryIds: validCategories,
        stock,
        updatedAt: new Date(),
      };
  
      const book = await books.findByIdAndUpdate(bookId, updateData, { new: true });
      if (!book) return res.status(404).json({ message: "Book not found" });
  
      const response = { message: "Book updated successfully", book };
      if (invalidCategories.length > 0) {
        response.warning = `category id berikut belum ada di database: ${invalidCategories.join(", ")}`;
      }
  
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  
  

booksController.deleteBook = async (req,res) => {
    const bookId = req.params.id
    const book = await books.findByIdAndDelete(bookId)
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
    res.status(200).json({ message: "Book deleted successfully" });
}

booksController.uploadImage = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : null;
        res.status(200).json({
            image: req.file.path
        });
    } catch (error) {
        res.status(500).json({
            message: 'File upload failed',
            error: error.message
        });
    }
};


module.exports = booksController;