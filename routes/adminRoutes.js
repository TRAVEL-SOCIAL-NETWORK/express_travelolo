const express = require('express')
const adminController = require('../controllers/adminController')
const { authAdmin } = require('../middlewares/adminMiddleware')
const router = express.Router()

router.use(authAdmin)

router.post('/verify/city/:city_id', adminController.verifyCity)
router.post(
  '/verify/destination/:destination_id',
  adminController.verifyDestination
)
router.get('/verify/city', adminController.getCityVerification)
router.get('/city', adminController.getCity)
router.get('/destination', adminController.getDestination)
router.get('/verify/destination', adminController.getDestinationVerification)

module.exports = router
