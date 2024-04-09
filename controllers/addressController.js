const Address = require('../models/Address')
const City = require('../models/City')
const User = require('../models/User')
const cloudinary = require('../configs/cloudinaryConfig')
const fs = require('fs')

const createTravelDestination = async (req, res) => {
  try {
    const userId = req.user._id
    const { city_id, destination, description } = req.body
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
    const travelDestination = await Address.create({
      city: city_id,
      travel_destination: destination,
      image: imageUrl,
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
    const { destination, description, name, country } = req.body
    let imageDestinationUrl = '' // Đường dẫn của ảnh trên Cloudinary
    let imageCityUrl = '' // Đường dẫn của ảnh trên Cloudinary

    // Kiểm tra xem liệu có ảnh được gửi kèm không
    if (
      req.files &&
      req.files['image_destination'] &&
      req.files['image_destination'][0]
    ) {
      // Nếu có ảnh, tải ảnh lên Cloudinary và lưu đường dẫn vào imageUrl
      const imagePath = '../images'
      fs.writeFileSync(imagePath, req.files['image_destination'][0].buffer)
      try {
        const avatarResult = await cloudinary.uploader.upload(imagePath)
        fs.unlinkSync(imagePath)
        imageDestinationUrl = avatarResult.secure_url
      } catch (error) {
        console.error('Error uploading destination image:', error)
        return res
          .status(400)
          .json({ message: 'Upload destination image failed' })
      }
    }

    if (req.files && req.files['image_city'] && req.files['image_city'][0]) {
      // Nếu có ảnh, tải ảnh lên Cloudinary và lưu đường dẫn vào imageUrl
      const imagePath = '../images'
      fs.writeFileSync(imagePath, req.files['image_city'][0].buffer)
      try {
        const avatarResult = await cloudinary.uploader.upload(imagePath)
        fs.unlinkSync(imagePath)
        imageCityUrl = avatarResult.secure_url
      } catch (error) {
        console.error('Error uploading city image:', error)
        return res.status(400).json({ message: 'Upload city image failed' })
      }
    }

    const city = await City.create({
      name,
      country,
      avatar: imageCityUrl,
    })
    const travelDestination = await Address.create({
      city: city._id,
      travel_destination: destination,
      image: imageDestinationUrl,
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

const getDestinationCity = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 5
    const skip = (page - 1) * limit
    const listDestinations = await Address.find({
      city: req.params.city_id,
      verify: true,
    })
      .skip(skip)
      .limit(limit)
      .exec()
    const travelDestinations = await Promise.all(
      listDestinations.map(async (destination) => {
        const user = await User.findById(destination.created_by).exec()
        const city = await City.findById(destination.city).exec()
        return {
          id: destination._id,
          destination: destination.travel_destination,
          city: city.name,
          city_id: city._id,
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
      data: travelDestinations,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}
const getDestination = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 5
    const skip = (page - 1) * limit
    const listDestinations = await Address.find({ verify: true })
      .populate('city created_by')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
    const travelDestinations = await Promise.all(
      listDestinations.map(async (destination) => {
        const user = await User.findById(destination.created_by).exec()
        const city = await City.findById(destination.city).exec()
        return {
          id: destination._id,
          destination: destination.travel_destination,
          city: city.name,
          city_id: city._id,
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
      data: travelDestinations,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getListDestination = async (req, res) => {
  try {
    const listDestinations = await Address.find({ city: req.params.city_id })
      .select('id travel_destination')
      .exec()
    res.send({
      status_code: 200,
      destinations: listDestinations,
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
  getDestination,
  getDestinationCity,
  getListDestination,
}
