const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
      validate: {
        validator: (v) => /^\d+(\.\d{1,2})?$/.test(String(v)), 
        message: 'Amount can have at most 2 decimal places',
      }
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: [true,'Date is required'],
      validate:{
        validator: (v) => v.getTime() <= Date.now() + 14 * 60 * 60 * 1000,
        message: "Date cannot be in the future",
      }
    },
    description: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
