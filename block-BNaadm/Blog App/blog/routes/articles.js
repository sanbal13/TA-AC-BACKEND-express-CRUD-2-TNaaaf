const { request } = require('express');
var express = require('express');
var router = express.Router();
var Article = require('../models/Article');
var Comment = require('../models/Comment');


// Creating a new article
router.get('/new', (req, res) => {
  res.render('articleForm');
});

router.post('/', (req, res) => {
  req.body.tags = req.body.tags.trim().split(" ");
  Article.create(req.body, (err, article) => {
     if(err) return next(err);
     res.redirect('articles');
  });
});

// List all the articles
router.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if(err) return next(err);
    res.render('articles', { articles });
  })
});

// Get detail about an article
router.get('/:id', (req, res) => {
  let id = req.params.id;
  Article.findById(id).populate('comments').exec((err, article) => {
      if(err) return next(err);
      res.render('articleDetail', {article});
  });
});

// Edit the article
router.get('/:id/edit', (req, res) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if(err) return next(err);
    article.tags = article.tags.join(" ");
    res.render('editArticle', { article });
  });
});

router.post('/:id', (req, res) => {
  let id = req.params.id;
  req.body.tags = req.body.tags.trim().split(" ");
  Article.findByIdAndUpdate(id, req.body, (err, article) => {
    if(err) return next(err);
    res.redirect('/articles/' + id);
  });
});

// delete the article
router.get('/:id/delete', (req, res) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err, article) => {
    if(err) return next(err);
    Comment.deleteMany({articleId: id},(err, deletedComments) => {
      if(err) next(err);
      console.log(deletedComments);
      res.redirect('/articles');
    }); 
  });
});

// like and dislike 
router.get('/:id/like', (req, res) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, {$inc: {likes: 1}},(err, article) => {
    if(err) return next(err);
    res.redirect('/articles/' + id);
  });
});
router.get('/:id/dislike', (req, res) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, {$inc: {likes: -1}},(err, article) => {
    if(err) return next(err);
    res.redirect('/articles/' + id);
  });                  
});

// handle comments
router.post('/:id/comment', (req, res, next) => {
  let id = req.params.id;
  req.body.articleId = id;
  Comment.create(req.body, (err, comment) => {
    if(err) return next(err);  
    Article.findByIdAndUpdate(id, {$push: {comments: comment.id}}, (err, article) => {
    if(err) return next(err);
    res.redirect('/articles/' + id);
    });
  });
});

module.exports = router;
