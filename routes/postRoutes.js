const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const multer = require('multer')
const {
  createPost,
  updatePost,
  deletePost,
  getPostsByUserId,
  getPostsByDestinationId,
  getPosts,
  getPostsByUser,
} = require('../controllers/postController')
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.use(auth)
router.post('/posts', upload.single('photo'), createPost)
router.put('/posts/:id', updatePost)
router.delete('/posts/:id', deletePost)
router.get('/posts/user/:id', getPostsByUserId)
router.get('/posts/user', getPostsByUser)
router.get('/posts/destination/:id', getPostsByDestinationId)
router.get('/posts', getPosts)

module.exports = router
