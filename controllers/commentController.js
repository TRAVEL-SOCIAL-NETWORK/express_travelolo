const Comment = require('../models/Comment')

const createComment = async (req, res) => {
  try {
    const userId = req.user._id
    const { post_id, content, parent_comment } = req.body
    if (parent_comment) {
      const parentComment = await Comment.findOne({
        _id: parent_comment,
      }).exec()
      if (!parentComment) {
        return res.status(400).send('Parent comment not found')
      }
      const comment = new Comment({
        user_id: userId,
        post_id,
        content,
        parent_comment,
      })
      await comment.save()
      res.send({
        status_code: 200,
        message: 'Comment created successfully',
        data: comment,
      })
    } else {
      const comment = new Comment({
        user_id: userId,
        post_id,
        content,
      })
      await comment.save()
      res.send({
        status_code: 200,
        message: 'Comment created successfully',
        data: comment,
      })
    }
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateComment = async (req, res) => {
  try {
    const userId = req.user._id
    const { content } = req.body
    const comment = await Comment.findOneAndUpdate(
      {
        user_id: userId,
        _id: req.params.id,
      },
      {
        content,
      },
      { new: true }
    ).exec()
    if (!comment) {
      return res.status(400).send('Comment not found')
    }
    res.send({
      status_code: 200,
      message: 'Comment updated successfully',
      data: comment,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id
    const comment = await Comment.findOneAndDelete({
      user_id: userId,
      _id: req.params.id,
    }).exec()
    if (!comment) {
      return res.status(400).send('Comment not found')
    }
    res.send({
      status_code: 200,
      message: 'Comment deleted successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getComments = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1 || 1
    const limit = 10
    const skip = (page - 1) * limit
    const comments = await Comment.find({
      post_id: req.params.post_id,
      parent_comment: null,
    })
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip)
      .exec()
    res.send({
      status_code: 200,
      data: comments,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getComments,
}
