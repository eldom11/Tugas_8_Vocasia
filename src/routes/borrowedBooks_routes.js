const borrowedBookRoutes = require('express').Router()
const borrowedBookController = require('../controllers/borrowedBooks_controller')

borrowedBookRoutes.post('/borrow/book',borrowedBookController.createBorrowedBook)
borrowedBookRoutes.get('/borrow/book/list',borrowedBookController.getAllActiveborrowedBooks)
borrowedBookRoutes.post('/borrow/book/return',borrowedBookController.returnBook)

module.exports = borrowedBookRoutes;