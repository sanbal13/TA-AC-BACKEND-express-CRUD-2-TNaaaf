const { request } = require('express');
let express = require('express');
let router = express.Router();
let Article = require('../models/article');
let Comment = require('../models/comment');


// create
router.get('/new', (req, res, next) => {
    res.render('articleForm');
});

router.post('/', (req, res) => {
    req.body.tags = req.body.tags.trim().split(" ");
    Article.create(req.body, (err, article) => {
        if(err) return next(err);
        res.redirect('/articles');
    });
});

// read
router.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err) return next(err);
        res.render('articles', {articles});
    });
});

router.get("/:id", (req, res) => {
    let id = req.params.id;
    Article.findById(id).populate('comments').exec((err, article) => {
        if(err) return next(err);
        res.render('articleDetail', { article });
    });
});

// update
router.get('/:id/edit', (req, res) => {
    let id = req.params.id;
    Article.findById(id, (err, article) => {
        if(err) return next(err);
        res.render('articleEdit', { article });
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

// delete
router.get('/:id/delete', (req, res) => {
    let id = req.params.id;
    Article.findByIdAndDelete(id, (err, deletedArticle) => {
        if(err) return next(err);
        res.redirect('/articles');
    });
});

// likes and dislikes
router.get('/:id/likes', (req, res, next) => {
    let id = req.params.id;
    Article.findByIdAndUpdate(id, {$inc: {likes:1}}, (err, article) => {
        if(err) return next(err);
        res.redirect('/articles/' + id);
    });
});
router.get('/:id/dislikes', (req, res, next) => {
    let id = req.params.id;
    
    Article.findByIdAndUpdate(id, {$inc: {likes:-1}}, (err, article) => {
        if(err) return next(err);
        res.redirect('/articles/' + id);
    });
});

// comment
router.post('/:id/comment', (req, res, next) => {
    let id = req.params.id;
      req.body.articleId = id;
      console.log(req.body);
      Comment.create(req.body, (err, comment) => {
          console.log(comment);
        if(err) next(err);
        Article.findByIdAndUpdate(id, {$push: {comments: comment.id}}, (err, updatedArticle) => {
            if(err) next(err);
            res.redirect('/articles/' + id);   
        });
    });
});

// export
module.exports = router;