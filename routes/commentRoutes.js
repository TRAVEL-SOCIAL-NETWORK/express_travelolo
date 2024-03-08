const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const router = express.Router()
const {
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController')

router.use(auth)
router.post('/comments', createComment)
router.put('/comments/:id', updateComment)
router.delete('/comments/:id', deleteComment)

module.exports = router
