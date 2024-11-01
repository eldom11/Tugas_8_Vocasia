const categories = require('../models/categories_model')
const { errorMsg, errorName } = require("../utils/error");

const categoryController = {};

categoryController.getAllCategories = async (req,res) => {
    const category = await categories.find()
    res.status(200).json({
        category
    })
}

categoryController.getCategoryById = async (req,res) => {
    const categoryId = req.params.id
    const category = await categories.findById(categoryId)
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
          // bad request
          throw { name: errorName.BAD_REQUEST, message: errorMsg.WRONG_INPUT };
        }
    
        const category = new categories({
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

categoryController.updateCategory = async (req,res) => {
    const categoryId = req.params.id
    const category = await categories.findByIdAndUpdate(categoryId,req.body)
    res.status(201).json({
        category
    })
}

categoryController.deleteCategory = async (req,res) => {
    const categoryId = req.params.id
    const category = await categories.findByIdAndDelete(categoryId)
    res.status(204).json({})
}


module.exports = categoryController;