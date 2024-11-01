const borrowers = require('../models/borrowers_model')
const { errorMsg, errorName } = require("../utils/error");

const borrowerController = {};

borrowerController.getAllBorrowers = async (req,res) => {
    const borrower = await borrowers.find()
    res.status(200).json({
        borrower
    })
}

borrowerController.getBorrowerById = async (req,res) => {
    const borrowerId = req.params.id
    const borrower = await borrowers.findById(borrowerId)
    res.status(200).json({
        borrower
    })
}

borrowerController.createBorrower = async (req,res, next) => {
    try {
        const { 
            name,
            contact,
        } = req.body;

        if (!name || !contact) {
          // bad request
          throw { name: errorName.BAD_REQUEST, message: errorMsg.WRONG_INPUT };
        }
    
        const borrower = new borrowers({
            name,
            contact,
            updatedAt: new Date(),
            joinAt: new Date()
        });
    
        await borrower.save();
        res.status(201).json(borrower);
      } catch (error) {
        next(error);
      }
}

borrowerController.updateBorrower = async (req,res) => {
    const borrowerId = req.params.id
    const borrower = await borrowers.findByIdAndUpdate(borrowerId,req.body)
    res.status(201).json({
        borrower
    })
}

borrowerController.deleteBorrower = async (req,res) => {
    const borrowerId = req.params.id
    const borrower = await borrowers.findByIdAndDelete(borrowerId)
    res.status(204).json({})
}


module.exports = borrowerController;