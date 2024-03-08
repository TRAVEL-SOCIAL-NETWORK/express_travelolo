const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide a content'],
  },
  image: {
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
  travel_destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: false,
  },
})

module.exports = mongoose.model('Post', PostSchema)
