const borrowerRoutes = require('express').Router()
const borrowerController = require('../controllers/borrowers_controller')

borrowerRoutes.get('/borrowers',borrowerController.getAllBorrowers)
borrowerRoutes.get('/borrower/:id',borrowerController.getBorrowerById)    
borrowerRoutes.post('/borrower',borrowerController.createBorrower)
borrowerRoutes.put('/borrower/:id',borrowerController.updateBorrower)
borrowerRoutes.delete('/borrower/:id',borrowerController.deleteBorrower)

module.exports = borrowerRoutes;