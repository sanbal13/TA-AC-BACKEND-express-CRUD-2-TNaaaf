let express = require('express');
let router = express.Router();
let Comment = require('../models/comment');
let Article = require('../models/article');

// Edit comment
router.get('/:id/edit', (req, res) => {
   let id = req.params.id;
   console.log(id);
   Comment.findById(id, (err, comment) => {
       console.log(comment);
       if(err) return next(err);
       res.render('commentEdit', {comment});
   });
});

router.post('/:id', (req, res) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
        if(err) return next(err);
        res.redirect('/articles/' + updatedComment.articleId);
    });
});

// Delete Comment
router.get('/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndRemove(id, (err, comment) => {
        if(err) return next(err);
        Article.findByIdAndUpdate(comment.articleId, {$pull: {comments: comment.id}}, (err, article) => {
            if(err) return next(err);
            res.redirect('/articles/' + comment.articleId);
        });
    });

});

module.exports = router;