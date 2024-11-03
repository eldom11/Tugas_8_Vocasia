const borrowedBooks = require("../models/borrowedBooks_model");
const StockLog = require("../models/stockLog_model");
const books = require("../models/books_model");
const borrowers = require("../models/borrowers_model");
const { errorMsg, errorName } = require("../utils/error");
const calculateFine = require("../utils/calculateFine");
const borrowedBookController = {};

borrowedBookController.getAllActiveborrowedBooks = async (req, res) => {
  try {
    const activeBorrows = await borrowedBooks.find({ status: "active" })
    // .populate(
    //   "bookId borrowerId"
    // );
    res.json(activeBorrows);
  } catch (error) {
    res.status(500).json({ message: errorName.NOT_FOUND });
  }
};

borrowedBookController.createBorrowedBook = async (req, res, next) => {
  try {
    const { bookId, borrowerId, borrowDurationDays } = req.body;

    const book = await books.findById(bookId);
    const borrower = await borrowers.findById(borrowerId);
    if (!book || book.stock < 1 || book.deletedAt !== undefined) {
      return res.status(400).json({ message: "Buku tidak tersedia untuk dipinjam." });
    } else if (!borrower || borrower.deletedAt!== undefined) {
      return res.status(400).json({ message: "Data peminjam tidak tersedia" });
    }

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + borrowDurationDays);

    const newBorrow = new borrowedBooks({
      bookId,
      borrowerId,
      borrowDate,
      dueDate,
      status: "active",
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    const stockLog = new StockLog({
      bookId: book._id,
      borrowerId: borrower._id,
      change: -1,
      description: "Borrowed book",
    });

    await newBorrow.save();
    await stockLog.save();

    book.stock -= 1;
    borrower.borrowCount += 1;
    await book.save();
    await borrower.save();

    res.status(201).json({
      message: "Peminjaman buku berhasil ditambahkan.",
      borrow: newBorrow,
    });
  } catch (error) {
    next(error);
  }
};


borrowedBookController.returnBook = async (req, res) => {
  try {
    const { borrowId, borrowerId, bookId } = req.body;
    const borrow = await borrowedBooks.findById(borrowId);
    if (!borrow || borrow.status !== "active") {
      return res.status(400).json({ message: "Peminjaman tidak valid atau sudah dikembalikan." });
    }

    borrow.status = "returned";
    borrow.returnDate = new Date();

    const fine = calculateFine(borrow.returnDate, borrow.dueDate);

    const book = await books.findById(borrow.bookId);
    if (book) {
      book.stock += 1;
      await book.save();
    }

    const stockLog = new StockLog({
      bookId: book._id,
      borrowerId: borrow.borrowerId,
      change: +1,
      description: "Returned book",
    });

    await stockLog.save();
    await borrow.save();

    res.status(200).json({ message: "Buku berhasil dikembalikan", fine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = borrowedBookController;
