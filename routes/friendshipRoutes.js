const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendshipController');
const { auth } = require('../middlewares/authMiddleware');

router.use(auth);
router.post('/request-friendship', friendshipController.requestFriendship);
router.post('/accept-friendship', friendshipController.acceptFriendship);
router.post('/reject-friendship', friendshipController.rejectFriendship);
router.post('/cancel-friendship', friendshipController.cancelFriendship);
router.get('/suggest-friends', friendshipController.getSuggestedFriends);
router.get('/request-friendship', friendshipController.getRequestFriendship);
router.get('/', friendshipController.getFriendship);

module.exports = router;