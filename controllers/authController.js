const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const generateOTP = require('../utils/otp-generator')
const tokenHandler = require('../utils/token-handler')
const sendMail = require('../utils/email')

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password').exec()
    if (!user) {
      return res.send({
        status_code: 204,
        message: 'Invalid email or password',
      
      })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.send({
        status_code: 204,
        message: 'Invalid email or password',
      
      })
    }
    const access_token = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1h',
      }
    )
    const refresh_token = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    )
    res.send({
      status_code: 200,
      message: 'User logged in successfully',
      access_token,
      refresh_token,
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
      status: user.status,
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const register = async (req, res) => {
  try {
    const { phone, email, password, first_name, last_name } = req.body
    const userEmail = await User.findOne({ email }).exec()
    if (userEmail) {
      return res.status(400).send('Email already exists')
    }
    const userPhone = await User.findOne({
      phone,
    }).exec()
    if (userPhone) {
      return res.status(400).send('Phone number already exists')
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      phone,
      email,
      password: hashedPassword,
      first_name,
      last_name,
    })
    await newUser.save()
    res.send({
      status: 'success',
      status_code: 200,
      message: 'User registered successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email }).exec()
    if (!user) {
      return res.status(400).send('User not found')
    }
    const OTP = generateOTP(6)
    try {
      await User.findOneAndUpdate(
        { email },
        { otp: OTP, otp_expires: Date.now() + 120000 }
      ).exec()
      console.log('OTP: ', OTP)
      const message = `Your OTP is ${OTP}`
      const subject = 'Reset Password'
      await sendMail({ mailto: email, subject: subject, emailMessage: message })
    } catch (err) {
      console.log('Mail: ', err)
      return res.status(400).send('OTP not sent')
    }
    res.send({
      status: 'success',
      statusCode: 200,
      message: 'OTP sent successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body
    const user = await User.findOne({ email }).exec()
    if (!user) {
      return res.status(400).send('User not found')
    }
    if (user.otp !== otp) {
      return res.status(400).send('Invalid OTP')
    }
    if (user.otp_expires < Date.now()) {
      return res.status(400).send('OTP expired')
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, otp: null, otp_expires: null }
    ).exec()
    res.send({
      status: 'success',
      statusCode: 200,
      message: 'Password reset successfully',
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = { login, register, forgotPassword, resetPassword }
