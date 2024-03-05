const express = require('express')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.auth = async (req, res, next) => {
  let token = req.header('Authorization')
  try {
    if (!token || token === 'null') return res.status(401).send('Access Denied')

    token = token.replace('Bearer ', '')

    const decodedToken = jwt.decode(token)
    if (!decodedToken || decodedToken.exp < Date.now() / 1000)
      return res.status(401).send('Token Expired')

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findOne({ _id: verified._id }).exec()
    if (!user) return res.status(401).send('User not found')
    if (user.status === 'inactive')
      return res.status(401).send('User is not active')
    if (user.status === 'banned') return res.status(401).send('User is banned')

      req.user = verified
      console.log(req.user)
    next()
  } catch (err) {
    console.error(err)
    res.status(400).send('Invalid Token')
  }
}
