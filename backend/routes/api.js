const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Get all books (exposing only `name`, `author`, and `isbn` fields to the client)
router.get('/books', (req, res, next) => {
    Book.find({}, 'name author isbn pages')
        .then(books => res.json(books))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Get a single book by ID
router.get('/book/:id', (req, res, next) => {
    Book.findById(req.params.id)
        .then(book => {
            if (book) {
                res.json(book);
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Create a new book
router.post('/book', (req, res, next) => {
    const { name, isbn, author, pages } = req.body;

    if (!name || !isbn || !author || !pages) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newBook = new Book({ name, isbn, author, pages });

    newBook.save()
        .then(book => res.status(201).json(book))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Update a book by ID
router.put('/book/:id', (req, res, next) => {
    const updates = req.body;

    Book.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
        .then(book => {
            if (book) {
                res.json(book);
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Delete a book by ID
router.delete('/book/:id', (req, res, next) => {
    Book.findByIdAndDelete(req.params.id)
        .then(book => {
            if (book) {
                res.json({ message: 'Book deleted successfully', book });
            } else {
                res.status(404).json({ error: 'Book not found' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
