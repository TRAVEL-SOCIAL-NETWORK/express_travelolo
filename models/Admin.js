const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [false, 'Please provide a phone number'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  status: {
    type: String,
    required: true,
    default: 'inactive',
    values: ['active', 'inactive', 'banned'],
  },
  first_name: {
    type: String,
    required: [true, 'Please provide a first name'],
  },
  last_name: {
    type: String,
    required: [true, 'Please provide a last name'],
  },
  avatar: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    default: 'admin',
    values: ['admin', 'superadmin'],
  },
})

module.exports = mongoose.model('Admin', AdminSchema)
