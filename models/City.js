const mongoose = require('mongoose')

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a city name'],
  },
  country: {
    type: String,
    required: [true, 'Please provide a country'],
  },
  avatar: {
    type: String,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
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

module.exports = mongoose.model('City', CitySchema)
