const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const multer = require('multer')
const {
  createPost,
  updateContentPost,
  deletePost,
  getPostsByUserId,
  getPostsByDestinationId,
  getPosts,
  getPostsByUser,
  updatePrivacyPost,
  reportPost,
} = require('../controllers/postController')
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.use(auth)
router.post('/posts', upload.single('photo'), createPost)
router.put('/posts/content/:post_id', updateContentPost)
router.put('/posts/privacy/:post_id', updatePrivacyPost)
router.put('/posts/report/:post_id', reportPost)
router.delete('/posts/:post_id', deletePost)
router.get('/posts/user/:id', getPostsByUserId)
router.get('/posts/user', getPostsByUser)
router.get('/posts/destination/:id', getPostsByDestinationId)
router.get('/posts', getPosts)

module.exports = router
