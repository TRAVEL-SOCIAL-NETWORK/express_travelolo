const Post = require('../models/Post')

const createPost = async (req, res) => {
  try {
    const userId = req.user._id
    const { content, image, destination_id } = req.body
    const post = await Post.create({
      user_id: userId,
      content,
      image,
      travel_destination: destination_id,
    })
    res.send({
      status_code: 200,
      message: 'Post created successfully',
      data: post,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const updatePost = async (req, res) => {
  try {
    const userId = req.user._id
    const { content, image, destination } = req.body
    const post = await Post.findOneAndUpdate(
      {
        user_id: userId,
        _id: req.params.id,
      },
      {
        content,
        image,
        travel_destination: destination,
      },
      { new: true }
    )
    if (!post) {
      return res.status(400).send('Post not found')
    }
    res.send({
      status_code: 200,
      message: 'Post updated successfully',
      data: post,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deletePost = async (req, res) => {
  try {
    const userId = req.user._id
    const post = await Post.findOneAndDelete({
      user_id: userId,
      _id: req.params.id,
    })
    if (!post) {
      return res.status(400).send('Post not found')
    }
    res.send({
      status_code: 200,
      message: 'Post deleted successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.id
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 5
    const skip = (page - 1) * limit
    const posts = await Post.find({
      user_id: userId,
    })
      .populate('travel_destination')
      .skip(skip)
      .limit(limit)
      .exec()
    res.send({
      status_code: 200,
      data: posts,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getPostsByDestinationId = async (req, res) => {
  try {
    const destinationId = req.params.id
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 5
    const skip = (page - 1) * limit
    const posts = await Post.find({
      travel_destination: destinationId,
    })
      .populate('user_id')
      .skip(skip)
      .limit(limit)
      .exec()
    res.send({
      status_code: 200,
      data: posts,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getPosts = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 5
    const skip = (page - 1) * limit
    const posts = await Post.find({})
      .populate('user_id')
      .populate('travel_destination')
      .skip(skip)
      .limit(limit)
      .exec()
    const destination_posts = posts.map((post) => {
      return {
        _id: post._id,
        user_id: post.user_id._id,
        full_name: post.user_id.first_name + ' ' + post.user_id.last_name,
        avatar: post.user_id.avatar,
        content: post.content,
        image: post.image,
        created_at: post.created_at,
        destination_id: post.travel_destination._id,
        travel_destination: post.travel_destination.travel_destination,
      }
    })
    res.send({
      status_code: 200,
      data: destination_posts,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPostsByUserId,
  getPostsByDestinationId,
  getPosts,
}
