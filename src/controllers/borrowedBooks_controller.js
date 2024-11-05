const { Author, Book, Borrower, Category, BorrowedBook, StockLog } = require('../models');
const { errorMsg, errorName } = require("../utils/error");
const calculateFine = require("../utils/calculateFine");
const mongoose = require('mongoose')

const borrowedBookController = {};

borrowedBookController.getAllActiveborrowedBooks = async (req, res) => {
  try {
    const activeBorrows = await BorrowedBook.find({ status: "active" }).populate('bookId', 'title').populate('borrowerId', 'name contact');
    res.json(activeBorrows);
  } catch (error) {
    res.status(500).json({ message: errorName.NOT_FOUND });
  }
};

borrowedBookController.createBorrowedBook = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
      const { bookId, borrowerId, borrowDurationDays } = req.body;

      const book = await Book.findById(bookId).session(session);
      const borrower = await Borrower.findById(borrowerId).session(session);

      if (!book || book.stock < 1 || book.deletedAt !== undefined) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Buku tidak tersedia untuk dipinjam." });
      } else if (!borrower || borrower.deletedAt !== undefined) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Data peminjam tidak tersedia" });
      }

      const borrowDate = new Date();
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + borrowDurationDays);

      const newBorrow = new BorrowedBook({
        bookId,
        borrowerId,
        borrowDate,
        dueDate,
        status: "active"
      });

      const stockLog = new StockLog({
        bookId: book._id,
        borrowerId: borrower._id,
        change: -1,
        description: "Borrowed book",
      });

      await newBorrow.save({ session });
      await stockLog.save({ session });

      book.stock -= 1;
      borrower.borrowCount += 1;
      await book.save({ session });
      await borrower.save({ session });

      await session.commitTransaction();
      res.status(201).json({
        message: "Peminjaman buku berhasil ditambahkan.",
        borrow: newBorrow,
      });
  } catch (error) {
      await session.abortTransaction();
      next(error);
  } finally {
      session.endSession();
  }
};

borrowedBookController.returnBook = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
      const { borrowId, borrowerId, bookId } = req.body;
      const borrow = await BorrowedBook.findById(borrowId).populate('bookId', 'title').populate('borrowerId', 'name contact').session(session);

      if (!borrow || borrow.status !== "active") {
        await session.abortTransaction();
        return res.status(400).json({ message: "Peminjaman tidak valid atau sudah dikembalikan." });
      }
      borrow.updatedAt= new Date();
      borrow.status = "returned";
      borrow.returnDate = new Date();

      const fine = calculateFine(borrow.returnDate, borrow.dueDate);

      const book = await Book.findById(borrow.bookId).session(session);
      if (book) {
        book.stock += 1;
        await book.save({ session });
      }

      const stockLog = new StockLog({
        bookId: book._id,
        borrowerId: borrow.borrowerId,
        change: +1,
        description: "Returned book",
      });

      await stockLog.save({ session });
      await borrow.save({ session });

      await session.commitTransaction();
      res.status(200).json({ message: "Buku berhasil dikembalikan", fine });
  } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ message: error.message });
  } finally {
      session.endSession();
  }
};


module.exports = borrowedBookController;
