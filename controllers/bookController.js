const asyncHandler = require('express-async-handler');
const Book = require('../models/Books');

const addBook = asyncHandler(async (req, res) => {
    try {
        const { title, author, isbn, publicationDate, genre, copies } = req.body;
        const book = new Book({
            title,
            author,
            isbn,
            publicationDate,
            genre,
            copies
        });

        const createdBook = await book.save();
        res.status(201).json(createdBook);
    }
    catch (err) {
        if (err?.code == 11000) {
            res.status(400).send({
                "error": "Duplication entry of id " + req.body.isbn
            })
        }
        else {
            res.status(500).send({
                "error": err
            })
        }
    }
});

const updateBook = asyncHandler(async (req, res) => {
    const { title, author, isbn, publicationDate, genre, copies } = req.body;
    if (!isbn) {
        res.send({
            "Error": "Id(isbn) is required"
        })
    }
    const book = await Book.findOne({ isbn: req.body.isbn });

    if (book) {
        book.title = title || book.title;
        book.author = author || book.author;
        book.isbn = isbn || book.isbn;
        book.publicationDate = publicationDate || book.publicationDate;
        book.genre = genre || book.genre;
        book.copies = copies || book.copies;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } else {
        res.status(404).send(
            {
                "Error" : "Book Not Found"
            }
        );
    }
});

const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findOne({ isbn: req.body.isbn });

    if (book) {
        await Book.deleteOne({ _id: book._id });
        res.json({ message: 'Book removed' });
    } else {
        res.status(404).send({
            "Msg": "Book not found"
        });
    }
});

const getBooks = asyncHandler(async (req, res) => {
    try{
    const searchString = req.body?.searchString
        ? {
            $or: [
                { title: { $regex: req.body.searchString, $options: 'i' } },
                { author: { $regex: req.body.searchString, $options: 'i' } },
                { isbn: { $regex: req.body.searchString, $options: 'i' } }
            ]
        }
        : {};

    const books = await Book.find({ ...searchString });
    res.json(books);
    }catch(err){
        res.status(500).send({
            "Error":err
        })
    }
});

module.exports = { addBook, updateBook, deleteBook, getBooks };
