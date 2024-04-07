const Reaction = require('../models/Reaction')

const createReaction = async (req, res) => {
  try {
    const userId = req.user._id
    const { post_id } = req.body
    const reaction = await Reaction.findOne({
      user_id: userId,
      post_id: post_id,
      type: 'like',
    })
    if (reaction) {
      return res.status(400).send('Reaction already exists')
    }
    await Reaction.create({
      user_id: userId,
      post_id,
      type: 'like',
    })
    res.send({
      status_code: 200,
      message: 'Reaction created successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const cancelReaction = async (req, res) => {
  try {
    const userId = req.user._id
    const { post_id } = req.body
    const reaction = await Reaction.findOneAndDelete({
      user_id: userId,
      post_id: post_id,
      type: 'like',
    })
    if (!reaction) {
      return res.status(400).send('Reaction not found')
    }
    res.send({
      status_code: 200,
      message: 'Reaction canceled successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createReaction,
  cancelReaction,
}
