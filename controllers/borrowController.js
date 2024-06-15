const asyncHandler = require('express-async-handler');
const Borrow = require('../models/Borrow');
const Book = require('../models/Books');

// @desc    Borrow a book
// @route   POST /api/borrows
// @access  Private/Member
const borrowBook = asyncHandler(async (req, res) => {
  const { isbn } = req.body;

  const book = await Book.findOne({isbn:isbn});
  const borrow = await Borrow.findOne({email : req.user.email})
  if (!borrow?.email && book && book.copies > 0) {
    const borrow = new Borrow({
      user: req.user._id,
      email : req.user.email,
      borrowedBooks : [{
        isbn : book.isbn,
      }]
    });

    book.copies -= 1;
    await book.save();
    const createdBorrow = await borrow.save();
    res.status(201).json(createdBorrow);
  }
  else if(borrow?.email && book && book.copies > 0){
    let borrowBookArray = borrow.borrowedBooks
    borrowBookArray.push({
        isbn : book.isbn,
        borrowedAt : Date.now()

    })
    borrow.borrowedBooks = borrowBookArray
    book.copies -= 1
    let createdBorrow = await borrow.save()
    await book.save();
    res.status(201).json(createdBorrow);
    
  }
  else {
    res.status(400).send({
        "Msg":"Book is unavaible"
    });
  }
});

const returnBook = asyncHandler(async (req, res) => {
  const borrow = await Borrow.findOne({email : req.user.email})
  const book = await Book.findOne({isbn:req.body.isbn})
  let flag = false
  let returnEligible = false
  if (borrow) {
    if (!borrow.returnedAt) {
        const ModifiedArray = borrow.borrowedBooks.map((borrowedBook) => {
            if (!flag && borrowedBook.isbn === req.body.isbn && !borrowedBook.returnedAt) {
              flag = true;
              returnEligible = true
              return {
                isbn: borrowedBook.isbn,
                returnedAt: Date.now()
              };
            }
            return borrowedBook;
          });
      if(!returnEligible){
        res.send({
            "Msg":"Borrow record not found"
        })
      }
      borrow.borrowedBooks = ModifiedArray
      await borrow.save();
      book.copies += 1;
      await book.save();

      res.json({ message: 'Book returned' });
    } else {
      res.status(400);
      throw new Error('Book already returned');
    }
  } else {
    res.status(404);
    throw new Error('Borrow record not found');
  }
});

// @desc    Get borrowing history
// @route   GET /api/borrows/history
// @access  Private/Member
const getBorrowHistory = asyncHandler(async (req, res) => {
  const borrows = await Borrow.find({ user: req.user._id }).populate('book');
  res.json(borrows);
});

module.exports = { borrowBook, returnBook, getBorrowHistory };
