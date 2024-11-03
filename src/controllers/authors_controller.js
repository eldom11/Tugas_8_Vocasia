const { Author, Book, Borrower, Category, BorrowedBook, StockLog } = require('../models');
const { upload } = require('../middleware/uploadFotoAuthor');
const { errorMsg, errorName } = require("../utils/error");

const authorController = {};

authorController.getAllAuthors = async (req,res) => {
    const author = await Author.find( { deletedAt: null } )
    res.status(200).json({
        author
    })
}

authorController.getAuthorById = async (req,res) => {
    const authorId = req.params.id
    const author = await Author.findById(authorId)
    if (!author) {
        return res.status(404).json({ message: "Author not found" });
    }
    if (author.deletedAt !== undefined){
        return res.status(400).json({ message: "Author telah dihapus" });
    } 
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
          throw { name: errorName.BAD_REQUEST, message: errorMsg.WRONG_INPUT };
        }
    
        const author = new Author({
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

authorController.updateAuthor = async (req, res, next) => {
    try {
        const authorId = req.params.id
        const {name, bio} = req.body
        
        const update = {
            name,
            bio,
            updatedAt: new Date()
        }

        const author = await Author.findByIdAndUpdate(authorId,update, {new: true})
        if(!author || author.deletedAt !== undefined){
            return res.status(404).json({ message: "Author not found" })
        }
        const response = { message: "Author updated successfully", author };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

authorController.deleteAuthor = async (req,res) => {
    const authorId = req.params.id
    const author = await Author.findById(authorId)
    if (!author || author.deletedAt !== undefined) {
        return res.status(404).json({ message: "Author not found" });
    }
    author.deletedAt = new Date()
    await author.save() 
    res.status(200).json({ message: "Author deleted successfully" });
}

authorController.uploadImage = async (req,res) => {
    try {
        const image = req.file ? req.file.filename : null;
        res.status(200).json({
            image: req.file.path
        });
    } catch (error) {
        res.status(500).json({
            message: 'File upload failed',
            error: error.message
        });
    }
}

module.exports = authorController;