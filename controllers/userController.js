const Post = require('../models/Post')
const User = require('../models/User')
const Friendship = require('../models/Friendship')
const Address = require('../models/Address')
const cloudinary = require('../configs/cloudinaryConfig')
const fs = require('fs')

const getInfo = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).send('User not found')
    }
    //count post of user
    const post = await Post.find({ user_id: userId }).countDocuments()
    const friends = await Friendship.find({
      $or: [
        {
          user_id: userId,
        },
        {
          friend_id: userId,
        },
      ],
      status: 'accepted',
    }).countDocuments()
    const destinations = await Address.findOne({
      created_by: userId,
    }).countDocuments()
    res.send({
      status_code: 200,
      message: 'User fetched successfully',
      data: {
        posts: post,
        friends: friends,
        destinations: destinations,
      },
    })
  } catch (err) {
    res.status(400).send(err)
  }
}
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).send('User not found')
    }
    const friends = await Friendship.find({
      $or: [
        {
          user_id: userId,
        },
        {
          friend_id: userId,
        },
      ],
      status: 'accepted',
    }).countDocuments()
    const friends_top6 = await Friendship.find({
      $or: [
        {
          user_id: userId,
        },
        {
          friend_id: userId,
        },
      ],
      status: 'accepted',
    })
      .sort({ created_at: -1 })
      .limit(6)
    const friends_new = await Promise.all(
      friends_top6.map(async (friend) => {
        const user = await User.findById(
          friend.user_id == userId ? friend.friend_id : friend.user_id
        ).exec()
        return {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar: user.avatar,
        }
      })
    )

    res.send({
      status_code: 200,
      message: 'User fetched successfully',
      data: {
        work: user.work,
        study: user.study,
        hobby: user.hobby,
        location: user.location,
        hometown: user.hometown,
        background: user.background,
        joined_at: user.created_at,
        friends_count: friends,
        friends_new: friends_new,
      },
    })
  } catch (err) {
    res.status(400).send(err)
  }
}
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).send('User not found')
    }
    const { work, study, hobby, location, hometown } = req.body
    // Xử lý ảnh avatar và background nếu tồn tại
    let avatarUrl = ''
    let backgroundUrl = ''

    // Kiểm tra nếu là avatar
    if (req.files && req.files['avatar'] && req.files['avatar'][0]) {
      // Lưu ảnh avatar vào Cloudinary
      const imagePath = '../images'
      fs.writeFileSync(imagePath, req.files['avatar'][0].buffer)
      try {
        const avatarResult = await cloudinary.uploader.upload(imagePath)
        fs.unlinkSync(imagePath)
        avatarUrl = avatarResult.secure_url
      } catch (error) {
        console.error('Error uploading avatar:', error)
        return res.status(400).json({ message: 'Upload avatar failed' })
      }
    }

    // Kiểm tra nếu là background
    if (req.files && req.files['background'] && req.files['background'][0]) {
      const imagePath = '../images'
      fs.writeFileSync(imagePath, req.files['background'][0].buffer)
      try {
        const backgroundResult = await cloudinary.uploader.upload(imagePath)
        fs.unlinkSync(imagePath)
        backgroundUrl = backgroundResult.secure_url
      } catch (error) {
        console.error('Error uploading background:', error)
        return res.status(400).json({ message: 'Upload background failed' })
      }
    }
    if (avatarUrl === '' && backgroundUrl === '') {
      const userUpdate = await User.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          work,
          study,
          hobby,
          location,
          hometown,
        },
        { new: true }
      )
      return res.send({
        status_code: 200,
        message: 'Profile updated successfully',
        data: userUpdate,
      })
    }
    const userUpdate = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        work,
        study,
        hobby,
        location,
        hometown,
        avatar: avatarUrl,
        background: backgroundUrl,
      },
      { new: true }
    )
    res.send({
      status_code: 200,
      message: 'Profile updated successfully',
      data: userUpdate,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  getInfo,
  getProfile,
  updateProfile,
}
