const { Author, Book, Borrower, Category, BorrowedBook, StockLog } = require('../models');
const {upload} = require('../middleware/uploadCoverBooks');
const { errorMsg, errorName } = require("../utils/error");

const booksController = {};

booksController.getAllBooks = async (req, res, next) => {
  try {
    const book = await Book.find({ deletedAt: null }).populate('authorId', 'name bio').populate('categoryIds', 'name description');
    res.status(200).json({ book });
  } catch (error) {
    next(error);
  }
}


booksController.getBookById = async (req,res, next) => {
    try{
      const bookId = req.params.id
      const book = await Book.findById(bookId).populate('authorId', 'name').populate('categoryIds', 'name')
      if(!book){
        return res.status(404).json({ message: "Book not found" })
      }
      if (book.deletedAt !== undefined){
        return res.status(400).json({ message: "Buku telah dihapus" });
      }
      res.status(200).json({
          book
      })
    } catch (error) {
      next(error);
    }
}

booksController.createBook = async (req, res, next) => {
    try {
      const { title, authorId, description, categoryIds, stock } = req.body;
  
      const authorExists = await Author.findById(authorId);
      if (!authorExists) {
        return res.status(400).json({ message: "Invalid Author ID" });
      }
  
      const validCategories = [];
      const invalidCategories = [];
  
      for (const catId of categoryIds) {
        const category = await Category.findById(catId);
        if (!category || category.deletedAt !== undefined) {
          invalidCategories.push(catId); 
        } else {
          validCategories.push(catId); 
        }
      }

      const book = new Book({
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
        response.warning = `category id berikut belum dimasukkan dalam database categories atau telah dihapus: ${invalidCategories.join(", ")}`;
      }
  
      res.status(201).json(response).populate('authorId', 'name').populate('categoryIds', 'name');
    } catch (error) {
      next(error);
    }
};

booksController.updateBook = async (req, res, next) => {
    try {
      const bookId = req.params.id;
      const { title, authorId, description, categoryIds, stock } = req.body;
  
      const author = await Author.findById(authorId);
      if (authorId !== undefined){
        if (!author) {
          return res.status(400).json({ message: "Invalid Author ID" });
        }
      }
      
      if (categoryIds !== undefined) {
        const validCategories = [];
        const invalidCategories = [];
        for (const catId of categoryIds) {
          const category = await Category.findById(catId);
          if (!category || category.deletedAt !== undefined) {
            invalidCategories.push(catId); 
          } else {
            validCategories.push(catId); 
          }
        };

        const updateData = {
          title,
          authorId,
          description,
          categoryIds: validCategories,
          stock,
          updatedAt: new Date(),
        };
        const book = await Book.findByIdAndUpdate(bookId, updateData, { new: true }).populate('authorId', 'name').populate('categoryIds', 'name');
        if (!book) return res.status(404).json({ message: "Book not found" });
    
        const response = { message: "Book updated successfully", book };
        if (invalidCategories.length > 0) {
          response.warning = `category id berikut belum ada di database categories atau telah dihapus: ${invalidCategories.join(", ")}`;
        }
        res.status(200).json(response);
      }

      const updateData = {
        title,
        authorId,
        description,
        stock,
        updatedAt: new Date(),
      };
  
      const book = await Book.findByIdAndUpdate(bookId, updateData, { new: true }).populate('authorId', 'name').populate('categoryIds', 'name');
      if (!book || book.deletedAt !== undefined) {
        return res.status(404).json({ message: "Book not found" });
      }
      const response = { message: "Book updated successfully", book };
  
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  
booksController.deleteBook = async (req,res, next) => {
  try{
    const bookId = req.params.id
    const book = await Book.findById(bookId)
    if (!book || book.deletedAt !== undefined){ 
        return res.status(404).json({ message: "Book not found" });
    }
    book.deletedAt = new Date()
    await book.save() 
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    next(error);
  }
}

booksController.uploadImage = async (req, res, next) => {
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