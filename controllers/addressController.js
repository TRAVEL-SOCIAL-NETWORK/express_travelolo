const Address = require('../models/Address')
const City = require('../models/City')

const createTravelDestination = async (req, res) => {
  try {
    const userId = req.user._id
    const { city_id, destination, image, description } = req.body
    const travelDestination = await Address.create({
      city: city_id,
      travel_destination: destination,
      image,
      description,
      created_by: userId,
    })

    res.send({
      status_code: 200,
      message: 'Travel destination created successfully',
      data: travelDestination,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const createCityTravelDestination = async (req, res) => {
  try {
    const userId = req.user._id
    const { destination, image, description, name, country, avatar } = req.body
    const city = await City.create({
      name,
      country,
      avatar,
    })
    const travelDestination = await Address.create({
      city: city._id,
      travel_destination: destination,
      image,
      description,
      created_by: userId,
    })
    res.send({
      status_code: 200,
      message: 'Travel destination created successfully',
      data: travelDestination,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateTravelDestination = async (req, res) => {
  try {
    const userId = req.user._id
    const { destination, image, description } = req.body
    const travelDestination = await Address.findOneAndUpdate(
      {
        created_by: userId,
        _id: req.params.id,
      },
      {
        travel_destination: destination,
        image,
        description,
      },
      { new: true }
    ).exec()
    if (!travelDestination) {
      return res.status(400).send('Travel destination not found')
    }
    res.send({
      status_code: 200,
      message: 'Travel destination updated successfully',
      data: travelDestination,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteTravelDestination = async (req, res) => {
  try {
    const userId = req.user._id
    const travelDestination = await Address.findOneAndDelete({
      created_by: userId,
      _id: req.params.id,
    }).exec()
    if (!travelDestination) {
      return res.status(400).send('Travel destination not found')
    }
    res.send({
      status_code: 200,
      message: 'Travel destination deleted successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const reportTravelDestination = async (req, res) => {
  try {
    const travelDestination = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $inc: { report: 1 },
      },
      { new: true }
    ).exec()
    if (!travelDestination) {
      return res.status(400).send('Travel destination not found')
    }
    res.send({
      status_code: 200,
      message: 'Travel destination reported successfully',
      data: travelDestination,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createTravelDestination,
  createCityTravelDestination,
  updateTravelDestination,
  deleteTravelDestination,
  reportTravelDestination,
}