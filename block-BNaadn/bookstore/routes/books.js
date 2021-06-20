var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Author = require('../models/author');
const { render } = require('ejs');


// Create a new book
router.get('/new', (req, res) => {
  res.render('createBook');
});

router.post('/', (req, res, next) => {
  req.body.category = req.body.category.split(" ");
  Author.create(req.body, (err, author) => {
    if(err) return next(err);
    req.body.authorId = author.id;
    Book.create(req.body, (err, book) => {
      if(err) return next(err);
      Author.findByIdAndUpdate(author.id, {$push: {bookId: book.id}}, (err, updatedAuthor) => {
        if(err) return next(err);
        res.redirect('/books');
      });
    });
  });
});
// Filter Books
router.post('/filter', (req, res, next) => {
  let choice = req.body.choice;
  let choiceValue = req.body.choiceValue;
  if(choice === 'book-name') {
    Book.find({title: {$regex: choiceValue, $options: 'i'}}, (err, books) => {
      if(err) return next(err);
      res.render('books', { books });
    });

  } else   if(choice === 'author') {   
    Author.findOne({name: {$regex: choiceValue, $options: 'i'}}, (err, author) => {
      if(err) return next(err);
        Book.find({_id: {$in: author.bookId}}, (err, books) => {
          if(err) return next(err);          
            res.render('books', { books });          
        });         
    });    
  } else  if(choice === 'category') {
    Book.find({category: {$in: choiceValue}}, (err, books) => {
      if(err) return next(err);
      res.render('books', { books })
    });
  }  
  });

// List all the books
router.get('/', (req, res, next) => {
  Book.find({}, (err, books) => {
    if(err) return next(err);
    res.render('books', { books });
  })
});

// Get details of a book 
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Book.findById(id).populate('authorId').exec((err, book) => {
    if(err) return next(err);
    res.render('bookDetails', {book});
  });
});

// Edit the book details
router.get('/:id/edit', (req, res) => {
  let id = req.params.id;

  Book.findById(id).populate('authorId').exec((err, book) => {
    if(err) return next(err);    
    res.render('editBook', {book});
  });
});

router.post('/:id', (req, res) => {
  let id = req.params.id;
  req.body.category = req.body.category.trim().split(" "); 
  Book.findByIdAndUpdate(id, req.body, (err, book) => {
    if(err) return next(err);
    authorId = book.authorId;
    Author.findByIdAndUpdate(authorId, req.body, (err, author) => {
      if(err) return next(err);
      res.redirect('/books/' + id);
    });
  });
});

// Delete a Book
router.get('/:id/delete', (req, res) => {
  let id = req.params.id;
  Book.findByIdAndDelete(id, (err, deletedBook) => {
    if(err) return next(err);
    Author.findByIdAndDelete(deletedBook.authorId, (err, deletedAuthor) => {
      if(err) return next(err);
      res.redirect('/books');
    });
  });
});



module.exports = router;
