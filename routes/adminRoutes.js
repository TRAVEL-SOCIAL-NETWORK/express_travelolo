const express = require('express')
const adminController = require('../controllers/adminController')
const postController = require('../controllers/postController')
const { authAdmin } = require('../middlewares/adminMiddleware')
const router = express.Router()

router.use(authAdmin)

router.post('/verify/city/:city_id', adminController.verifyCity)
router.post(
  '/verify/destination/:destination_id',
  adminController.verifyDestination
)
router.post('/verify/post/:post_id', postController.verifyPost)
router.post('/report/post/:post_id', postController.reportPost)
router.get('/verify/city', adminController.getCityVerification)
router.get('/city', adminController.getCity)
router.get('/destination', adminController.getDestination)
router.get('/verify/destination', adminController.getDestinationVerification)
router.get('/posts', postController.getPostsByAdmin)

module.exports = router
