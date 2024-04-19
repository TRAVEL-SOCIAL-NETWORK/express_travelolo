const { verify } = require('jsonwebtoken')
const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  travel_destination: {
    type: String,
    required: [true, 'Please provide a travel destination'],
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  report: {
    type: Number,
    required: false,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    required: false,
    default: 0,
  },
})

module.exports = mongoose.model('Address', AddressSchema)
