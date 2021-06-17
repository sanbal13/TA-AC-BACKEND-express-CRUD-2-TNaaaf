var express = require('express');
var router = express.Router();
var Article = require('../models/Article');
var Comment = require('../models/Comment');

// edit the comment
router.get('/:id/edit', (req, res) => {
    let id = req.params.id;
    Comment.findById(id, (err, comment) => {
        if(err) return next(err);
        res.render('editComment', { comment});
    });
});

router.post('/:id', (req, res) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
        if(err) return next(err);
        res.redirect('/articles/' + comment.articleId);
    });
})

// delete the comment
router.get('/:id/delete', (req, res) => {
    let id = req.params.id;
    Comment.findByIdAndRemove(id, (err, comment) => {
        if(err) next(err);
        Article.findByIdAndUpdate(comment.articleId, {$pull: {comments: comment.id}}, (err,article) => {
            if(err) return next(err);
            res.redirect('/articles/' + article.id)
        });
    });
});

// likes and dislikes
router.get('/:id/like', (req, res) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, comment) => {
        if(err) return next(err);
        res.redirect('/articles/' + comment.articleId);
    });
});
router.get('/:id/dislike', (req, res) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, {$inc: {likes: -1}}, (err, comment) => {
        if(err) return next(err);
        res.redirect('/articles/' + comment.articleId);
    });
});

module.exports = router;
