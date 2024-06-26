const Address = require('../models/Address')
const City = require('../models/City')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const Reaction = require('../models/Reaction')
const User = require('../models/User')

const searchDestination = async (req, res) => {
  try {
    const { keyword } = req.query
    const destinations = await Address.find({
      $or: [
        { travel_destination: { $regex: keyword.trim(), $options: 'i' } },
        {
          city: {
            $in: await City.find({
              name: { $regex: keyword.trim(), $options: 'i' },
            }).select('_id'),
          },
        },
      ],
    })
      .limit(5)
      .exec()

    const travelDestinations = await Promise.all(
      destinations.map(async (destination) => {
        const user = await User.findById(destination.created_by).exec()
        const city = await City.findById(destination.city).exec()
        return {
          id: destination._id,
          destination: destination.travel_destination,
          city: city.name,
          image: destination.image,
          description: destination.description,
          created_at: destination.created_at,
          author: {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar,
          },
        }
      })
    )
    res.send({
      status_code: 200,
      message: 'Destinations found',
      data: travelDestinations,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const searchPeople = async (req, res) => {
  try {
    const { keyword } = req.query
    // Tách chữ cuối cùng trong từ khoá để lấy last name
    const lastIndex = keyword.lastIndexOf(' ')
    let firstName = keyword.slice(0, lastIndex).trim()
    let lastName = keyword.slice(lastIndex + 1).trim()

    if (lastIndex === -1) {
      // Nếu không có khoảng trắng thì lấy toàn bộ làm first name
      firstName = keyword.trim()
      lastName = keyword.trim()
    }
    // Tìm kiếm theo first name và last name
    const users = await User.find({
      first_name: { $regex: firstName, $options: 'i' },
      last_name: { $regex: lastName, $options: 'i' },
    })
      .limit(5)
      .exec()
    const people = users.map((user) => {
      return {
        id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        avatar: user.avatar,
      }
    })
    res.send({
      status_code: 200,
      message: 'People found',
      data: people,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const searchPost = async (req, res) => {
  try {
    const { keyword } = req.query
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 5
    const skip = (page - 1) * limit
    const posts = await Post.find({
      $or: [
        { content: { $regex: keyword.trim(), $options: 'i' } },
        {
          travel_destination: {
            $in: await Address.find({
              $or: [
                {
                  travel_destination: { $regex: keyword.trim(), $options: 'i' },
                },
                {
                  city: {
                    $in: await City.find({
                      name: { $regex: keyword.trim(), $options: 'i' },
                    }).select('_id'),
                  },
                },
              ],
            }).select('_id'),
          },
        },
        {
          user_id: {
            $in: await User.find({
              $or: [
                { first_name: { $regex: keyword.trim(), $options: 'i' } },
                { last_name: { $regex: keyword.trim(), $options: 'i' } },
              ],
            }).select('_id'),
          },
        },
      ],

      privacy: 'public',
    })
      .populate('user_id')
      .populate('travel_destination')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .limit(5)
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
      message: 'Posts found',
      data: destination_posts,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  searchDestination,
  searchPeople,
  searchPost,
}
