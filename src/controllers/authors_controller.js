const { Author, Book, Borrower, Category, BorrowedBook, StockLog } = require('../models');
const { upload } = require('../middleware/uploadFotoAuthor');
const { errorMsg, errorName } = require("../utils/error");
const mongoose = require('mongoose')
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
        return res.status(404).json({ message: "Author telah dihapus" });
    } 
    res.status(200).json({
        author
    })
}

authorController.createAuthor = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { 
            name, 
            bio 
        } = req.body;

        if (!name) {
            return res.status(400).json({ message: "The name cannot be empty" });
        }

        const author = new Author({
            name,
            bio
        });

        await author.save({ session });
        await session.commitTransaction();
        res.status(201).json(author);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

authorController.updateAuthor = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const authorId = req.params.id;
        const { 
            name, 
            bio 
        } = req.body;

        const update = {
            name,
            bio,
            updatedAt: new Date()
        };

        const author = await Author.findByIdAndUpdate(authorId, update, { new: true, session });
        if (!author || author.deletedAt !== undefined) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Author not found" });
        }

        await session.commitTransaction();
        res.status(200).json({ message: "Author updated successfully", author });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

authorController.deleteAuthor = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const authorId = req.params.id;
        const author = await Author.findById(authorId).session(session);
        if (!author || author.deletedAt !== undefined) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Author not found" });
        }

        author.deletedAt = new Date();
        await author.save({ session });
        await session.commitTransaction();
        res.status(200).json({ message: "Author deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

authorController.uploadImage = async (req,res, next) => {
    try {
        const { authorId } = req.body;
        const imagePath = req.file ? req.file.path : null;
  
        if (!authorId || !imagePath) {
            return res.status(400).json({ message: "Author ID and image are required" });
        }
  
        const author = await Author.findById(authorId);
        if (!author || author.deletedAt !== undefined) {
            return res.status(404).json({ message: "Author not found" });
        }
  
        author.photo = imagePath;
        await author.save();
  
        res.status(200).json({ message: "Image uploaded successfully", coverImage: author.photo });
    } catch (error) {
        next(error);
    }
}

module.exports = authorController;