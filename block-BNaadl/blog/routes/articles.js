var express = require('express');
var router = express.Router();
var Article = require('../models/article');

// create
router.get('/new', (req, res) => {
  res.render('articleForm');
});

router.post('/', (req, res, next) => {
  Article.create(req.body, (err, article) => {
    if(err) return next(err);
    res.redirect('/articles/' + article.id);
  });
});

// read
router.get('/', (req, res, next) => {
  Article.find({}, (err, articles) => {
    if(err) return next(err);
    res.render('articles', { articles});
  }); 
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if(err) return next(err);
    res.render('articleDetail', { article});
  });
});

// update
router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if(err) return next(err);
    res.render('editArticle', { article});
  });
});
router.post('/:id', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, {new: true}, (err, article) => {
    if(err) return next(err);
    res.render('articleDetail', {article});
  });
});

// delete
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err, deletedUser) => {
    if(err) return next(err);
    res.redirect('/articles');
  });
});

module.exports = router;
