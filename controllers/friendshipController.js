const Friendship = require('../models/Friendship')
const User = require('../models/User')

const requestFriendship = async (req, res) => {
  try {
    const { to } = req.body
    const userId = req.user._id
    const user = await User.findOne({ _id: userId }).exec()
    if (!user) {
      return res.status(400).send('User not found')
    }
    const friend = await User.findOne({
      _id: to,
    }).exec()
    if (!friend) {
      return res.status(400).send('Friend not found')
    }
    const friendship = await Friendship.findOne({
      $or: [
        {
          user_id: userId,
          friend_id: to,
        },
        {
          user_id: to,
          friend_id: userId,
        },
      ],
    }).exec()
    if (friendship) {
      return res.status(400).send('Friendship already exists')
    }
    const newFriendship = new Friendship({
      user_id: userId,
      friend_id: to,
      status: 'pending',
    })
    await newFriendship.save()
    res.send({
      status_code: 200,
      message: 'Friendship requested successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}
const acceptFriendship = async (req, res) => {
  try {
    const userId = req.user._id
    const { from } = req.body
    const friendship = await Friendship.findOneAndUpdate(
      {
        user_id: from,
        friend_id: userId,
        status: 'pending',
      },
      {
        status: 'accepted',
      },
      { new: true }
    ).exec()
    if (!friendship) {
      return res.status(400).send('Friendship not found')
    }
    res.send({
      status_code: 200,
      message: 'Friendship accepted successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const rejectFriendship = async (req, res) => {
  try {
    const userId = req.user._id
    const { from } = req.body
    const friendship = await Friendship.findOneAndDelete({
      user_id: from,
      friend_id: userId,
    }).exec()
    if (!friendship) {
      return res.status(400).send('Friendship not found')
    }
    res.send({
      status_code: 200,
      message: 'Friendship rejected successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const cancelFriendship = async (req, res) => {
  try {
    const userId = req.user._id
    const { to } = req.body
    const friendship = await Friendship.findOneAndDelete({
      user_id: userId,
      friend_id: to,
    }).exec()
    if (!friendship) {
      return res.status(400).send('Friendship not found')
    }
    res.send({
      status_code: 200,
      message: 'Friendship cancelled successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}
const getSuggestedFriends = async (req, res) => {
  try {
    const userId = req.user._id

    // Lấy danh sách bạn bè của người dùng
    const userFriendships = await Friendship.find({
      $or: [{ user_id: userId }, { friend_id: userId }],
    }).exec()

    // Tạo mảng chứa ID của các bạn bè
    const friendIds = userFriendships.map((friendship) => {
      return friendship.user_id.toString() === userId.toString()
        ? friendship.friend_id
        : friendship.user_id
    })

    // Lấy danh sách các mối quan hệ bạn bè mà người dùng đã có
    const existingFriendships = await Friendship.find({
      $and: [
        { $or: [{ user_id: userId }, { friend_id: userId }] },
        { status: { $in: ['pending', 'accepted', 'rejected'] } },
      ],
    }).exec()

    // Tạo mảng chứa ID của các mối quan hệ bạn bè đã có
    const existingFriendIds = existingFriendships.map((friendship) => {
      return friendship.user_id.toString() === userId.toString()
        ? friendship.friend_id
        : friendship.user_id
    })

    // Lấy danh sách người dùng đề xuất ngoại trừ những người đã có mối quan hệ bạn bè
    const suggestedFriends = await User.find({
      _id: {
        $nin: [...friendIds, ...existingFriendIds], // Lọc bỏ các ID đã có mối quan hệ bạn bè
        $ne: userId, // Lọc bỏ chính người dùng hiện tại
      },
    })
      .exec()
      .then((users) => {
        return users.map((user) => {
          return {
            _id: user._id,
            name: `${user.first_name} ${user.last_name}`,
            avatar: user.avatar,
          }
        })
      })

    res.send({
      status_code: 200,
      suggestedFriends,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getRequestFriendship = async (req, res) => {
  try {
    const userId = req.user._id
    const friendships = await Friendship.find({
      friend_id: userId,
      status: 'pending',
    }).exec()
    const friendIds = friendships.map((friendship) => {
      return friendship.user_id
    })
    const users = await User.find({
      _id: {
        $in: friendIds,
      },
    }).exec()
    const requests = users.map((user) => {
      return {
        _id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        avatar: user.avatar,
        time: friendships.find((friendship) => {
          return friendship.user_id.toString() === user._id.toString()
        }).created_at,
      }
    })
    res.send({
      status_code: 200,
      requests,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getFriendship = async (req, res) => {
  try {
    const userId = req.user._id
    const friendships = await Friendship.find({
      $or: [
        {
          user_id: userId,
        },
        {
          friend_id: userId,
        },
      ],
      status: 'accepted',
    }).exec()
    const friendIds = friendships.map((friendship) => {
      return friendship.user_id.toString() === userId.toString()
        ? friendship.friend_id
        : friendship.user_id
    })
    const users = await User.find({
      _id: {
        $in: friendIds,
      },
    }).exec()
    const friends = users.map((user) => {
      return {
        id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        avatar: user.avatar,
      }
    })
    res.send({
      status_code: 200,
      friends,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  requestFriendship,
  acceptFriendship,
  rejectFriendship,
  cancelFriendship,
  getSuggestedFriends,
  getRequestFriendship,
  getFriendship,
}
