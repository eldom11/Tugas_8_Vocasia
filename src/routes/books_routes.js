const booksRoutes = require('express').Router()
const booksController = require('../controllers/books_controller')

booksRoutes.get('/books',booksController.getAllBooks)
booksRoutes.get('/books/:id',booksController.getBookById)    
booksRoutes.post('/books',booksController.createBook)
booksRoutes.put('/books/:id',booksController.updateBook)
booksRoutes.delete('/books/:id',booksController.deleteBook)
booksRoutes.post('/books/upload',booksController.uploadImage)

module.exports = booksRoutes;