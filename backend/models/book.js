const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for book
const BookSchema = new Schema({
	name: {
		type: String,
		required: [true, 'The book text field is required']
	},
    isbn: {
        type: String,
        required: [true, 'The book ISBN field is required'],
        index: { unique: true }
    },
    author: {
        type: String,
        required: [true, 'The book author field is required']
    },
    pages: {
        type: Number,
        required: [true, 'The book pages field is required']
    },
});

//create model for book
const Book = mongoose.model('Book', BookSchema);

module.exports = Book;