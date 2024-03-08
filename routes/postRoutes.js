const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const {
  createPost,
  updatePost,
  deletePost,
  getPostsByUserId,
  getPostsByDestinationId,
  getPosts,
} = require('../controllers/postController')
const router = express.Router()

router.use(auth)
router.post('/posts', createPost)
router.put('/posts/:id', updatePost)
router.delete('/posts/:id', deletePost)
router.get('/posts/user/:id', getPostsByUserId)
router.get('/posts/destination/:id', getPostsByDestinationId)
router.get('/posts', getPosts)

module.exports = router
