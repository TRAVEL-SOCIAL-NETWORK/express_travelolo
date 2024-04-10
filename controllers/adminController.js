const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const Address = require('../models/Address')
const Admin = require('../models/Admin')
const City = require('../models/City')

const loginAdmin = async (req, res) => {
  const { email, password } = req.body

  try {
    const admin = await Admin.findOne({
      email,
    })
      .select('+password')
      .exec()
    if (!admin) {
      return res.send({
        status_code: 204,
        message: 'Invalid email or password',
      })
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.send({
        status_code: 204,
        message: 'Invalid email or password',
      })
    }
    const access_token = jwt.sign(
      { _id: admin._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '5h',
      }
    )
    const refresh_token = jwt.sign(
      { _id: admin._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      }
    )
    res.send({
      status_code: 200,
      message: 'Admin logged in successfully',
      access_token,
      refresh_token,
      id: admin._id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      avatar: admin.avatar,
      status: admin.status,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const registerAdmin = async (req, res) => {
  const { phone, email, password, first_name, last_name } = req.body
  const adminEmail = await Admin.findOne({ email }).exec()
  if (adminEmail) {
    return res.status(400).send('Email already exists')
  }
  const adminPhone = await Admin.findOne({ phone }).exec()
  if (adminPhone) {
    return res.status(400).send('Phone number already exists')
  }
  const hashedPassword = await bcrypt.hash(password, 12)
  const newAdmin = new Admin({
    phone,
    email,
    password: hashedPassword,
    first_name,
    last_name,
  })
  try {
    const admin = await newAdmin.save()
    res.send({
      status_code: 200,
      message: 'Admin registered successfully',
      data: admin,
    })
  } catch (err) {
    res.status(400).send({
      status_code: 400,
      message: 'Admin registration failed',
      error: err,
    })
  }
}

const verifyCity = async (req, res) => {
  const { city_id } = req.params

  try {
    const verify = await City.findOneAndUpdate(
      {
        _id: city_id,
        verify: false,
      },
      {
        verify: true,
      },
      { new: true }
    ).exec()
    if (!verify) {
      return res.status(400).send('City not found')
    }
    res.send({
      status_code: 200,
      message: 'City verified successfully',
      data: verify,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCityVerification = async (req, res) => {
  try {
    const cities = await City.find({ verify: false }).exec()
    res.send({
      status_code: 200,
      data: cities,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCity = async (req, res) => {
  try {
    const cities = await City.find().sort({ created_at: -1 }).exec()
    res.send({
      status_code: 200,
      data: cities,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const verifyDestination = async (req, res) => {
  const { destination_id } = req.params

  try {
    const verify = await Address.findOneAndUpdate(
      {
        _id: destination_id,
        verify: false,
      },
      {
        verify: true,
      },
      { new: true }
    ).exec()
    if (!verify) {
      return res.status(400).send('Destination not found')
    }
    res.send({
      status_code: 200,
      message: 'Destination verified successfully',
      data: verify,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getDestinationVerification = async (req, res) => {
  try {
    const destinations = await Address.find({ verify: false })
      .populate('city', 'name')
      .sort({ created_at: -1 })
      .exec()
    res.send({
      status_code: 200,
      data: destinations,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getDestination = async (req, res) => {
  try {
    const destinations = await Address.find()
      .sort({ created_at: -1 })
      .populate('city', 'name')
      .sort({ created_at: -1 })
      .exec()
    res.send({
      status_code: 200,
      data: destinations,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  loginAdmin,
  registerAdmin,
  verifyCity,
  getCityVerification,
  getCity,
  verifyDestination,
  getDestinationVerification,
  getDestination,
}
