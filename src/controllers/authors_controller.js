const authors = require('../models/authors_model')
const { errorMsg, errorName } = require("../utils/error");

const authorController = {};

authorController.getAllAuthors = async (req,res) => {
    const author = await authors.find()
    res.status(200).json({
        author
    })
}

authorController.getAuthorById = async (req,res) => {
    const authorId = req.params.id
    const author = await authors.findById(authorId)
    res.status(200).json({
        author
    })
}

authorController.createAuthor = async (req,res, next) => {
    try {
        const { 
            name,
            bio,
        } = req.body;

        if (!name) {
          // bad request
          throw { name: errorName.BAD_REQUEST, message: errorMsg.WRONG_INPUT };
        }
    
        const author = new authors({
            name,
            bio,
            updatedAt: new Date(),
            createdAt: new Date()
        });
    
        await author.save();
        res.status(201).json(author);
      } catch (error) {
        next(error);
      }
}

authorController.updateAuthor = async (req,res) => {
    const authorId = req.params.id
    const author = await authors.findByIdAndUpdate(authorId,req.body)
    res.status(201).json({
        author
    })
}

authorController.deleteAuthor = async (req,res) => {
    const authorId = req.params.id
    const author = await authors.findByIdAndDelete(authorId)
    res.status(204).json({})
}

authorController.uploadImage = async (req,res) => {
    res.status(200).json({
        image : req.file.path
    })
}

module.exports = authorController;