const { Author, Book, Borrower, Category, BorrowedBook, StockLog } = require('../models');
const { errorMsg, errorName } = require("../utils/error");

const borrowerController = {};

borrowerController.getAllBorrowers = async (req,res) => {
    const borrower = await Borrower.find({ deletedAt: null })
    res.status(200).json({
        borrower
    })
}

borrowerController.getBorrowerById = async (req,res) => {
    const borrowerId = req.params.id
    const borrower = await Borrower.findById(borrowerId)
    if(!borrower){
        return res.status(404).json({ message: "Borrower not found" })
    }
    if(borrower.deletedAt !== undefined){
        return res.status(404).json({ message: "Borrower is Deleted" })
    }
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
          throw { name: errorName.BAD_REQUEST, message: errorMsg.WRONG_INPUT };
        }
    
        const borrower = new Borrower({
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

borrowerController.updateBorrower = async (req,res, next) => {
    try {
        const borrowerId = req.params.id
        const {name, contact} = req.body
        
        const update = {
            name,
            contact,
            updatedAt: new Date()
        }

        const borrower = await Borrower.findByIdAndUpdate(borrowerId,update, {new: true})
        if(!borrower || borrower.deletedAt !== undefined){
            return res.status(404).json({ message: "Category not found" })
        }
        const response = { message: "Category updated successfully", borrower };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

borrowerController.deleteBorrower = async (req,res) => {
    const borrowerId = req.params.id
    const borrower = await Borrower.findById(borrowerId)
    if(!borrower || borrower.deletedAt !== undefined){
        return res.status(404).json({ message: "Borrower not found or deleted" })
    }
    borrower.deletedAt = new Date()
    await borrower.save()
    return res.status(200).json({ message: "Borrower deleted successfully" })
}


module.exports = borrowerController;