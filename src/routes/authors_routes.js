const authorRoutes = require('express').Router()
const authorsController = require('../controllers/authors_controller')

authorRoutes.get('/authors',authorsController.getAllAuthors)
authorRoutes.get('/author/:id',authorsController.getAuthorById)    
authorRoutes.post('/author',authorsController.createAuthor)
authorRoutes.put('/author/:id',authorsController.updateAuthor)
authorRoutes.delete('/author/:id',authorsController.deleteAuthor)
authorRoutes.post('/author/upload',authorsController.uploadImage)

module.exports = authorRoutes;