const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const {
  createReaction,
  cancelReaction,
} = require('../controllers/reactionController')
const router = express.Router()

router.use(auth)
router.post('/like', createReaction)
router.delete('/like', cancelReaction)

module.exports = router
