const categoryRoutes = require('express').Router()
const categoryController = require('../controllers/categories_controller')

categoryRoutes.get('/categories',categoryController.getAllCategories)
categoryRoutes.get('/category/:id',categoryController.getCategoryById)    
categoryRoutes.post('/category',categoryController.createCategory)
categoryRoutes.put('/category/:id',categoryController.updateCategory)
categoryRoutes.delete('/category/:id',categoryController.deleteCategory)

module.exports = categoryRoutes;