const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    background: {
        type: String,
        required: false,
    },
    work: {
        type: String,
        required: false,
    },
    study: {
        type: String,
        required: false,
    },
    hobby: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    birthday: {
        type: Date,
        required: false,
    },
    hometown: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    otp: {
        type: Number,
        required: false,
    },
    otp_expires: {
        type: Date,
        required: false,
    },

});

module.exports = mongoose.model('User', UserSchema);