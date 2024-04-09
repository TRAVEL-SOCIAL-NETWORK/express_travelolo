const Comment = require('../models/Comment')
const io = require('../configs/socket')
const Post = require('../models/Post')
const Notify = require('../models/Notify')

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
      // Gửi thông báo socket đến chủ bài viết
      const author_post = await Post.findOne({ _id: post_id }).select('user_id')
      if (author_post.user_id.toString() !== userId.toString()) {
        const notify = new Notify({
          user_id: author_post.user_id,
          post_id,
          user_send: userId,
          type: 'comment',
        })
        await notify.save()

        io.getIO(author_post.user_id).emit('newComment', {
          postId: post_id,
          authorPost: author_post.user_id,
        })
      }

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
      // Gửi thông báo socket đến chủ bài viết
      const author_post = await Post.findOne({ _id: post_id }).select('user_id')
      if (author_post.user_id.toString() !== userId.toString()) {
        const notify = new Notify({
          user_id: author_post.user_id,
          post_id,
          user_send: userId,
          type: 'comment',
        })
        await notify.save()

        io.getIO(author_post.user_id).emit('newComment', {
          postId: post_id,
          authorPost: author_post.user_id,
        })
      }

      res.send({
        status_code: 200,
        message: 'Comment created successfully',
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
      .populate('user_id', '_id first_name last_name avatar')
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip)
      .exec()
    const totalComments = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.findOne({
          parent_comment: comment._id,
        })
          .select('user_id')
          .populate('user_id', '_id first_name last_name avatar')
          .sort({ created_at: -1 })
          .exec()
        const repliesCount = await Comment.countDocuments({
          parent_comment: comment._id,
        }).exec()
        return {
          _id: comment._id,
          user_id: comment.user_id._id,
          full_name:
            comment.user_id.first_name + ' ' + comment.user_id.last_name,
          avatar: comment.user_id.avatar,
          content: comment.content,
          created_at: comment.created_at,
          replies_name: replies
            ? replies.user_id.first_name + ' ' + replies.user_id.last_name
            : null,
          replies_avatar: replies ? replies.user_id.avatar : null,
          replies_count: repliesCount,
        }
      })
    )
    res.send({
      status_code: 200,
      data: totalComments,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getReplies = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1 || 1
    const limit = 5
    const skip = (page - 1) * limit
    const replies = await Comment.find({
      parent_comment: req.params.comment_id,
    })
      .select('user_id content created_at')
      .populate('user_id', '_id first_name last_name avatar')
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip)
      .exec()
    res.send({
      status_code: 200,
      data: replies,
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
  getReplies,
}
