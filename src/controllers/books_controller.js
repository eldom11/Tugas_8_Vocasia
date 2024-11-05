const {
  Author,
  Book,
  Borrower,
  Category,
  BorrowedBook,
  StockLog,
} = require("../models");
const { upload } = require("../middleware/uploadCoverBooks");
const { errorMsg, errorName } = require("../utils/error");
const mongoose = require("mongoose");

const booksController = {};

booksController.getAllBooks = async (req, res, next) => {
  try {
    const book = await Book.find({ deletedAt: null })
      .populate("authorId", "name bio")
      .populate("categoryIds", "name description");
    res.status(200).json({ book });
  } catch (error) {
    next(error);
  }
};

booksController.getBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId)
      .populate("authorId", "name")
      .populate("categoryIds", "name");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.deletedAt !== undefined) {
      return res.status(400).json({ message: "Buku telah dihapus" });
    }
    res.status(200).json({
      book,
    });
  } catch (error) {
    next(error);
  }
};

booksController.createBook = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, authorId, description, categoryIds, stock } = req.body;

    const authorExists = await Author.findById(authorId).session(session);

    if (!title || !authorId) {
      return res
        .status(400)
        .json({ message: "The title and authorId cannot be empty" });
    }
    if (!authorExists) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid Author ID" });
    }

    const validCategories = [];
    const invalidCategories = [];

    for (const catId of categoryIds) {
      const category = await Category.findById(catId).session(session);
      if (!category || category.deletedAt !== undefined) {
        invalidCategories.push(catId);
      } else {
        validCategories.push(catId);
      }
    }

    const book = new Book({
      title,
      authorId,
      description,
      categoryIds: validCategories,
      stock,
    });

    await book.save({ session });

    const response = {
      message: "Book created successfully.",
      book: book,
    };

    if (invalidCategories.length > 0) {
      response.warning = `category id berikut belum dimasukkan dalam database categories atau telah dihapus: ${invalidCategories.join(
        ", "
      )}`;
    }

    await session.commitTransaction();
    res
      .status(201)
      .json(response)
      .populate("authorId", "name")
      .populate("categoryIds", "name");
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

booksController.updateBook = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const bookId = req.params.id;
    const { title, authorId, description, categoryIds, stock } = req.body;

    const author = await Author.findById(authorId).session(session);
    if (authorId !== undefined && !author) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid Author ID" });
    }

    const validCategories = [];
    const invalidCategories = [];
    if (categoryIds !== undefined) {
      for (const catId of categoryIds) {
        const category = await Category.findById(catId).session(session);
        if (!category || category.deletedAt !== undefined) {
          invalidCategories.push(catId);
        } else {
          validCategories.push(catId);
        }
      }
    }

    const updateData = {
      title,
      authorId,
      description,
      categoryIds: categoryIds ? validCategories : undefined,
      stock,
      updatedAt: new Date(),
    };

    const book = await Book.findByIdAndUpdate(bookId, updateData, {
      new: true,
      session,
    })
      .populate("authorId", "name")
      .populate("categoryIds", "name");
    if (!book) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Book not found" });
    }

    const response = { message: "Book updated successfully", book };
    if (invalidCategories.length > 0) {
      response.warning = `category id berikut belum ada di database categories atau telah dihapus: ${invalidCategories.join(
        ", "
      )}`;
    }

    await session.commitTransaction();
    res.status(200).json(response);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

booksController.deleteBook = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId).session(session);
    if (!book || book.deletedAt !== undefined) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Book not found" });
    }
    book.deletedAt = new Date();
    await book.save({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

booksController.uploadImage = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const imagePath = req.file ? req.file.path : null;

    if (!bookId || !imagePath) {
      return res
        .status(400)
        .json({ message: "Book ID and image are required" });
    }

    const book = await Book.findById(bookId);
    if (!book || book.deletedAt !== undefined) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.coverImage = imagePath;
    await book.save();

    res
      .status(200)
      .json({
        message: "Image uploaded successfully",
        coverImage: book.coverImage,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = booksController;
