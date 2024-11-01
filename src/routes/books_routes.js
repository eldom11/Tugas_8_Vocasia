const booksRoutes = require('express').Router()
const booksController = require('../controllers/books_controller')

booksRoutes.get('/books',booksController.getAllBooks)
booksRoutes.get('/book/:id',booksController.getBookById)    
booksRoutes.post('/book',booksController.createBook)
booksRoutes.put('/book/:id',booksController.updateBook)
booksRoutes.delete('/book/:id',booksController.deleteBook)
booksRoutes.post('/book/upload',booksController.uploadImage)

module.exports = booksRoutes;