const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const {
  createCityTravelDestination,
  createTravelDestination,
  updateTravelDestination,
  deleteTravelDestination,
} = require('../controllers/addressController')
const router = express.Router()

router.use(auth)
router.post('/city-destinations', createCityTravelDestination)
router.post('/destinations', createTravelDestination)
router.put('/destinations/:id', updateTravelDestination)
router.delete('/destinations/:id', deleteTravelDestination)

module.exports = router
