const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Get all books (exposing only `name`, `author`, and `isbn` fields to the client)
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find({}, 'name author isbn');
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single book by ID
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new book
router.post('/books', async (req, res) => {
    const { name, isbn, author, pages } = req.body;

    if (!name || !isbn || !author || !pages) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newBook = new Book({ name, isbn, author, pages });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);  // 201 Created
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a book by ID
router.put('/books/:id', async (req, res) => {
    const updates = req.body;

    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a book by ID
router.delete('/books/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully', deletedBook });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
