const Post = require('../models/Post')
const cloudinary = require('../configs/cloudinaryConfig')
const fs = require('fs')
const Reaction = require('../models/Reaction')
const Comment = require('../models/Comment')

const createPost = async (req, res) => {
  try {
    const userId = req.user._id
    const { content, destination_id, privacy } = req.body
    let imageUrl = '' // Đường dẫn của ảnh trên Cloudinary

    // Kiểm tra xem liệu có ảnh được gửi kèm không
    if (req.file) {
      // Nếu có ảnh, tải ảnh lên Cloudinary và lưu đường dẫn vào imageUrl
      const imagePath = '../images'
      fs.writeFileSync(imagePath, req.file.buffer)

      try {
        const result = await cloudinary.uploader.upload(imagePath)
        fs.unlinkSync(imagePath)
        imageUrl = result.secure_url
      } catch (err) {
        return res
          .status(400)
          .send({ status_code: 400, message: 'Upload image failed' })
      }
    }
    // Tạo bài đăng và lưu vào cơ sở dữ liệu
    const post = await Post.create({
      user_id: userId,
      content,
      image: imageUrl, // Lưu đường dẫn của ảnh vào trường image
      travel_destination: destination_id,
      privacy,
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

const updatePrivacyPost = async (req, res) => {
  try {
    const userId = req.user._id
    const { privacy } = req.body
    const post = await Post.findOneAndUpdate(
      {
        user_id: userId,
        _id: req.params.post_id,
      },
      {
        privacy,
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

const updateContentPost = async (req, res) => {
  try {
    const userId = req.user._id
    const { content } = req.body
    const post = await Post.findOneAndUpdate(
      {
        user_id: userId,
        _id: req.params.post_id,
      },
      {
        content,
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
    res.status
  }
}

const reportPost = async (req, res) => {
  try {
    const userId = req.user._id
    const post = await Post.findOne({
      _id: req.params.post_id,
    })
    if (!post) {
      return res.status(400).send('Post not found')
    }
    if (post.user_id.toString() === userId.toString()) {
      return res.status(400).send('You cannot report your own post')
    }
    if (post.report === undefined) {
      post.report = 0
    }
    post.report += 1
    await post.save()
    res.send({
      status_code: 200,
      message: 'Post reported successfully',
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
      _id: req.params.post_id,
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
      privacy: 'public',
    })
      .populate('user_id')
      .populate('travel_destination')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
    const destination_posts = await Promise.all(
      posts.map(async (post) => {
        const likes_count = await Reaction.find({
          post_id: post._id,
          type: 'like',
        }).countDocuments()
        const is_liked = await Reaction.findOne({
          user_id: req.user._id,
          post_id: post._id,
          type: 'like',
        })
        const cmt_count = await Comment.find({
          post_id: post._id,
        }).countDocuments()
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
          likes_count: likes_count,
          comments_count: cmt_count,
          is_liked: is_liked ? true : false,
          privacy: post.privacy,
        }
      })
    )
    res.send({
      status_code: 200,
      data: destination_posts,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getPostsByUser = async (req, res) => {
  try {
    const userId = req.user._id
    const page = req.query.page ? parseInt(req.query.page) : 1
    const privacy =
      req.query.privacy === 'public'
        ? 'public'
        : req.query.privacy === 'private'
        ? 'private'
        : ''
    const oldest = req.query.oldest === 'true' ? 1 : -1
    const limit = 5
    const skip = (page - 1) * limit
    let posts
    if (privacy === '') {
      posts = await Post.find({
        user_id: userId,
      })
        .populate('user_id')
        .populate('travel_destination')
        .sort({ created_at: oldest })
        .skip(skip)
        .limit(limit)
        .exec()
    } else {
      posts = await Post.find({
        user_id: userId,
      })
        .populate('user_id')
        .populate('travel_destination')
        .sort({ created_at: oldest })
        .skip(skip)
        .limit(limit)
        .exec()
    }
    const destination_posts = await Promise.all(
      posts.map(async (post) => {
        const likes_count = await Reaction.find({
          post_id: post._id,
          type: 'like',
        }).countDocuments()
        const is_liked = await Reaction.findOne({
          user_id: req.user._id,
          post_id: post._id,
          type: 'like',
        })
        const cmt_count = await Comment.find({
          post_id: post._id,
        }).countDocuments()
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
          likes_count: likes_count,
          comments_count: cmt_count,
          is_liked: is_liked ? true : false,
          privacy: post.privacy,
        }
      })
    )
    res.send({
      status_code: 200,
      data: destination_posts,
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
      privacy: 'public',
    })
      .populate('user_id')
      .populate('travel_destination')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
    const destination_posts = await Promise.all(
      posts.map(async (post) => {
        const likes_count = await Reaction.find({
          post_id: post._id,
          type: 'like',
        }).countDocuments()
        const is_liked = await Reaction.findOne({
          user_id: req.user._id,
          post_id: post._id,
          type: 'like',
        })
        const cmt_count = await Comment.find({
          post_id: post._id,
        }).countDocuments()
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
          likes_count: likes_count,
          comments_count: cmt_count,
          is_liked: is_liked ? true : false,
          privacy: post.privacy,
        }
      })
    )
    res.send({
      status_code: 200,
      data: destination_posts,
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
    const posts = await Post.find({
      privacy: 'public',
    })
      .populate('user_id')
      .populate('travel_destination')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
    const destination_posts = await Promise.all(
      posts.map(async (post) => {
        const likes_count = await Reaction.find({
          post_id: post._id,
          type: 'like',
        }).countDocuments()

        const is_liked = await Reaction.findOne({
          user_id: req.user._id,
          post_id: post._id,
          type: 'like',
        })
        const cmt_count = await Comment.find({
          post_id: post._id,
        }).countDocuments()
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
          likes_count: likes_count,
          comments_count: cmt_count,
          is_liked: is_liked ? true : false,
          privacy: post.privacy,
        }
      })
    )
    res.send({
      status_code: 200,
      data: destination_posts,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.post_id,
    })
      .populate('user_id')
      .populate('travel_destination')
      .exec()
    if (!post) {
      return res.status(400).send('Post not found')
    }
    const likes_count = await Reaction.find({
      post_id: post._id,
      type: 'like',
    }).countDocuments()
    const is_liked = await Reaction.findOne({
      user_id: req.user._id,
      post_id: post._id,
      type: 'like',
    })
    const cmt_count = await Comment.find({
      post_id: post._id,
    }).countDocuments()
    res.send({
      status_code: 200,
      data: {
        _id: post._id,
        user_id: post.user_id._id,
        full_name: post.user_id.first_name + ' ' + post.user_id.last_name,
        avatar: post.user_id.avatar,
        content: post.content,
        image: post.image,
        created_at: post.created_at,
        destination_id: post.travel_destination._id,
        travel_destination: post.travel_destination.travel_destination,
        likes_count: likes_count,
        comments_count: cmt_count,
        is_liked: is_liked ? true : false,
        privacy: post.privacy,
      },
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createPost,
  updatePrivacyPost,
  updateContentPost,
  reportPost,
  deletePost,
  getPostsByUserId,
  getPostsByUser,
  getPostsByDestinationId,
  getPosts,
  getPost,
}
