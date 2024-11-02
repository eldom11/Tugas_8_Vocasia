const authorRoutes = require('express').Router()
const authorsController = require('../controllers/authors_controller')
const {upload} = require('../middleware/uploadFotoAuthor');

authorRoutes.get('/authors',authorsController.getAllAuthors)
authorRoutes.get('/author/:id',authorsController.getAuthorById)    
authorRoutes.post('/author',authorsController.createAuthor)
authorRoutes.put('/author/:id',authorsController.updateAuthor)
authorRoutes.delete('/author/:id',authorsController.deleteAuthor)
authorRoutes.post('/author/upload', upload.single('image'), authorsController.uploadImage)

module.exports = authorRoutes;