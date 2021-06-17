let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema({
    text: {type: String, required: true},
    articleId: {type: Schema.Types.ObjectId, ref: "Article", required: true},
    author: String,
    likes: {type: Number, default:0}
}, {timestamps: true});

let Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;