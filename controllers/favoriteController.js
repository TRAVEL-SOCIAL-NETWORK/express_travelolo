const Address = require('../models/Address')
const Favorite = require('../models/Favorite')

const createFavorite = async (req, res) => {
  try {
    const userId = req.user._id
    const { destination_id } = req.body
    const favorite = await Favorite.findOne({
      user_id: userId,
      destination_id: destination_id,
    })
    if (favorite) {
      return res.status(400).send('Favorite already exists')
    }
    await Favorite.create({
      user_id: userId,
      destination_id,
    })
    Address.findOneAndUpdate(
      { _id: destination_id },
      { $inc: { score: 10 } },
      { new: true }
    ).exec()
    res.send({
      status_code: 200,
      message: 'Favorite created successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteFavorite = async (req, res) => {
  try {
    const userId = req.user._id
    const { destination_id } = req.body
    const favorite = await Favorite.findOneAndDelete({
      user_id: userId,
      destination_id: destination_id,
    })
    if (!favorite) {
      return res.status(400).send('Favorite not found')
    }
    Address.findOneAndUpdate(
      { _id: destination_id },
      { $inc: { score: -10 } },
      { new: true }
    ).exec()
    res.send({
      status_code: 200,
      message: 'Favorite deleted successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createFavorite,
  deleteFavorite,
}
