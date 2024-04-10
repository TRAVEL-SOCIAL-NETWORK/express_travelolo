const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.post('/login', adminController.loginAdmin)
router.post('/register', adminController.registerAdmin)
// router.post('/forgot-password', authController.forgotPassword)
// router.post('/reset-password', authController.resetPassword)

module.exports = router
