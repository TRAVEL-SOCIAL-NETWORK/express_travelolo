const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const searchController = require('../controllers/searchController')

const router = express.Router()

router.use(auth)
router.get('/destination', searchController.searchDestination)
router.get('/user', searchController.searchPeople)
router.get('/post', searchController.searchPost)

module.exports = router
