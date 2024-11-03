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

categoryController.createCategory = async (req,res, next) => {
    try {
        const { 
            name,
            description,
        } = req.body;

        if (!name) {
          throw { name: errorName.BAD_REQUEST, message: errorMsg.WRONG_INPUT };
        }
    
        const category = new Category({
            name,
            description,
            updatedAt: new Date(),
            createdAt: new Date()
        });
    
        await category.save();
        res.status(201).json(category);
      } catch (error) {
        next(error);
      }
}

categoryController.updateCategory = async (req,res, next) => {

    try {
        const categoryId = req.params.id
        const {name, description} = req.body
        
        const update = {
            name,
            description,
            updatedAt: new Date()
        }

        const category = await Category.findByIdAndUpdate(categoryId,update, {new: true})
        if(!category || category.deletedAt !== undefined){
            return res.status(404).json({ message: "Category not found" })
        }
        const response = { message: "Category updated successfully", category };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

categoryController.deleteCategory = async (req,res) => {
    const categoryId = req.params.id
    const category = await Category.findById(categoryId)
    if(!category || category.deletedAt !== undefined){
        return res.status(404).json({ message: "Category not found" })
    }
    category.deletedAt = new Date()
    await category.save()
    res.status(200).json({ message: "Category deleted successfully" });
}


module.exports = categoryController;