const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const router = express.Router()
const {
  createComment,
  updateComment,
  deleteComment,
  getComments,
  getReplies,
} = require('../controllers/commentController')

router.use(auth)
router.get('/comments/:post_id', getComments)
router.get('/replies/:comment_id', getReplies)
router.post('/comments', createComment)
router.put('/comments/:id', updateComment)
router.delete('/comments/:id', deleteComment)

module.exports = router
