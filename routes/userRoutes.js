const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const multer = require('multer')

const {
  getInfo,
  getProfile,
  updateProfile,
  getProfileUser,
} = require('../controllers/userController')

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.use(auth)
router.get('/info', getInfo)
router.get('/profile', getProfile)
router.get('/profile/:user_id', getProfileUser)
router.post(
  '/update',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'background', maxCount: 1 },
  ]),
  updateProfile
)

module.exports = router
