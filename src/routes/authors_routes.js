const authorRoutes = require('express').Router()
const authorsController = require('../controllers/authors_controller')

authorRoutes.get('/authors',authorsController.getAllAuthors)
authorRoutes.get('/authors/:id',authorsController.getAuthorById)    
authorRoutes.post('/authors',authorsController.createAuthor)
authorRoutes.put('/authors/:id',authorsController.updateAuthor)
authorRoutes.delete('/authors/:id',authorsController.deleteAuthor)
authorRoutes.post('/authors/upload',authorsController.uploadImage)

module.exports = authorRoutes;