const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  parent_comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Comment', CommentSchema)
