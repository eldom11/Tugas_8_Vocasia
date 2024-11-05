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

borrowerController.createBorrower = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { 
            name, 
            contact 
        } = req.body;
    
        if (!name || !contact) {
            throw { name: errorName.BAD_REQUEST, message: errorMsg.WRONG_INPUT };
        }
    
        const borrower = new Borrower({ 
            name, 
            contact, 
        });
        await borrower.save({ session });
    
        await session.commitTransaction();
        res.status(201).json(borrower);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
  };

  borrowerController.updateBorrower = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const borrowerId = req.params.id;
        const { 
            name, 
            contact 
        } = req.body;
    
        const update = { 
            name, 
            contact, 
            updatedAt: new Date() 
        };
        const borrower = await Borrower.findByIdAndUpdate(borrowerId, update, { new: true, session });
    
        if (!borrower || borrower.deletedAt !== undefined) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Borrower not found or deleted" });
        }
    
        await session.commitTransaction();
        res.status(200).json({ message: "Borrower updated successfully", borrower });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

borrowerController.deleteBorrower = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const borrowerId = req.params.id;
        const borrower = await Borrower.findById(borrowerId).session(session);
    
        if (!borrower || borrower.deletedAt !== undefined) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Borrower not found or deleted" });
        }
    
        borrower.deletedAt = new Date();
        await borrower.save({ session });
        await session.commitTransaction();
    
        res.status(200).json({ message: "Borrower deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
  };
  

module.exports = borrowerController;