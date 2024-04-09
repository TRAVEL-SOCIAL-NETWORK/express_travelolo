const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const multer = require('multer')
const {
  createCityTravelDestination,
  createTravelDestination,
  updateTravelDestination,
  deleteTravelDestination,
  getDestination,
  getListDestination,
  getDestinationCity,
} = require('../controllers/addressController')
const { getCity } = require('../controllers/cityController')
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.use(auth)
router.post(
  '/city-destinations',
  upload.fields([
    { name: 'image_destination', maxCount: 1 },
    { name: 'image_city', maxCount: 1 },
  ]),
  createCityTravelDestination
)
router.post(
  '/destinations',
  upload.single('image_destination'),
  createTravelDestination
)
router.put('/destinations/:id', updateTravelDestination)
router.delete('/destinations/:id', deleteTravelDestination)
router.get('/destinations', getDestination)
router.get('/destinations/:city_id', getDestinationCity)
router.get('/destinations/city/:city_id', getListDestination)
router.get('/city', getCity)

module.exports = router
