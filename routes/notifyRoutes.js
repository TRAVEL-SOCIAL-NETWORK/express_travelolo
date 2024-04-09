const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const { getNotifyUser, seenNotify } = require('../controllers/notifyController')
const router = express.Router()

router.use(auth)

router.get('/notify', getNotifyUser)
router.put('/notify/:notify_id', seenNotify)

module.exports = router
