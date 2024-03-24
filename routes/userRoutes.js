const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const {
  getInfo,
  getProfile,
  updateProfile,
} = require('../controllers/userController')

const router = express.Router()

router.use(auth)
router.get('/info', getInfo)
router.get('/profile', getProfile)
router.post('/update', updateProfile)

module.exports = router
