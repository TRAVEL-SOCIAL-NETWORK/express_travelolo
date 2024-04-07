const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const {
  createCityTravelDestination,
  createTravelDestination,
  updateTravelDestination,
  deleteTravelDestination,
  getDestination,
  getListDestination,
} = require('../controllers/addressController')
const { getCity } = require('../controllers/cityController')
const router = express.Router()

router.use(auth)
router.post('/city-destinations', createCityTravelDestination)
router.post('/destinations', createTravelDestination)
router.put('/destinations/:id', updateTravelDestination)
router.delete('/destinations/:id', deleteTravelDestination)
router.get('/destinations/:city_id', getDestination)
router.get('/destinations/city/:city_id', getListDestination)
router.get('/city', getCity)

module.exports = router
