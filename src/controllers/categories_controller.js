const { Author, Book, Borrower, Category, BorrowedBook, StockLog } = require('../models');
const { errorMsg, errorName } = require("../utils/error");

const categoryController = {};

categoryController.getAllCategories = async (req,res) => {
    const category = await Category.find( { deletedAt: null } )
    res.status(200).json({
        category
    })
}

categoryController.getCategoryById = async (req,res) => {
    const categoryId = req.params.id
    const category = await Category.findById(categoryId)
    if(!category){
        return res.status(404).json({ message: "Category not found" })
    }
    if(category.deletedAt !== undefined){
        return res.status(404).json({ message: "Category is Deleted" })
    }
    res.status(200).json({
        category
    })
}

categoryController.createCategory = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { 
            name, 
            description 
        } = req.body;
    
        if (!name) {
            throw { name: errorName.BAD_REQUEST, message: errorMsg.WRONG_INPUT };
        }
    
        const category = new Category({ 
            name, 
            description, 
        });
  
        await category.save({ session });
        await session.commitTransaction();
        res.status(201).json(category);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};
  

categoryController.updateCategory = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const categoryId = req.params.id;
        const { 
            name, 
            description 
        } = req.body;
    
        const update = { 
            name, 
            description, 
            updatedAt: new Date() 
        };
        const category = await Category.findByIdAndUpdate(categoryId, update, { new: true, session });
        
        if (!category || category.deletedAt !== undefined) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Category not found" });
        }
    
        await session.commitTransaction();
        res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

categoryController.deleteCategory = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId).session(session);
        
        if (!category || category.deletedAt !== undefined) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Category not found" });
        }
    
        category.deletedAt = new Date();
        await category.save({ session });
        await session.commitTransaction();
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
  };
  


module.exports = categoryController;