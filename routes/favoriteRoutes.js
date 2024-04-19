const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const {
  createFavorite,
  deleteFavorite,
} = require('../controllers/favoriteController')
const router = express.Router()

router.use(auth)
router.post('/favorite', createFavorite)
router.delete('/favorite', deleteFavorite)

module.exports = router
