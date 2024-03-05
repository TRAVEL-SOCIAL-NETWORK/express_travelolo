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

module.exports = {
  requestFriendship,
  acceptFriendship,
  rejectFriendship,
  cancelFriendship,
}
