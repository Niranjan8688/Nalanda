const asyncHandler = require('express-async-handler');
const Borrow = require('../models/Borrow');
const User = require('../models/User');
const Book = require('../models/Books');

const getMostBorrowedBooks = asyncHandler(async (req, res) => {
try{
  const borrows = await Borrow.aggregate([
    { $unwind: '$borrowedBooks' },
    { $group: { _id : '$borrowedBooks.isbn', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'books', localField: '_id', foreignField: 'isbn', as: 'book' } },
    { $unwind: '$book' },
    { $project: { _id: 0, title: '$book.title',isbn:'$book.isbn', count: 1 } }
  ]);

  res.json(borrows);
}
catch(err){
    res.status(500).send({
        "Error":err
    })
}
});

const getActiveMembers = asyncHandler(async (req, res) => {
try{
  const members = await Borrow.aggregate([
    { $group: { _id: '$user', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, name: '$user.name'  , email : '$user.email'} }
  ]);

  res.json(members);
}
catch(err){
    res.status(500).send({
        "Error":err   
    })
}
});

const getBookAvailability = asyncHandler(async (req, res) => {
try{
  const totalBooks = await Book.aggregate(
   [ { $group: { _id: null, totalCnt: { $sum: '$copies' } } } ]
  );
  let borrowedBooks = await Borrow.aggregate([
    { $unwind: '$borrowedBooks' },
    {
      $match: {
        'borrowedBooks.returnedAt': { $exists: false }
      }
    },
    {
      $count: 'count'
    }
  ]);
  borrowedBooks = borrowedBooks[0]?.count || 0
  const availableBooks = totalBooks[0].totalCnt - borrowedBooks;
  let totalBooksCnt = totalBooks[0].totalCnt
  res.json({ totalBooksCnt, borrowedBooks ,availableBooks });
}catch(err){
    res.status(500).send({
        "Error":err
    })
}
});

module.exports = { getMostBorrowedBooks, getActiveMembers, getBookAvailability };

