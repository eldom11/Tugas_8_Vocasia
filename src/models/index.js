const mongoose = require('mongoose');
const AuthorSchema = require('./authors_model');
const BookSchema = require('./books_model');
const BorrowerSchema = require('./borrowers_model');
const CategorySchema = require('./categories_model');
const BorrowedBookSchema = require('./borrowedBooks_model');
const StockLogSchema = require('./stockLog_model');

module.exports = {
    Author: mongoose.model('authors', AuthorSchema),
    Book: mongoose.model('books', BookSchema),
    Borrower: mongoose.model('borrowers', BorrowerSchema),
    Category: mongoose.model('categories', CategorySchema),
    BorrowedBook: mongoose.model('borrowedBooks', BorrowedBookSchema),
    StockLog: mongoose.model('stockLogs', StockLogSchema),
};
