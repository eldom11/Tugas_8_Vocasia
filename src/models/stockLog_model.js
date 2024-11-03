const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'books', required: true },
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'borrowers', required: true },
  change: { type: Number, required: true }, 
  description: String,
  date: { type: Date, default: Date.now },
});

module.exports = stockLogSchema;
