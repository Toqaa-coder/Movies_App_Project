const express = require('express');
const router = express.Router();
const feedController = require('../controller/feedController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/continue-watching', verifyToken, feedController.getContinueWatching);
router.get('/recommendations', verifyToken, feedController.getRecommendations);
router.get('/popular', feedController.getPopular);
router.get('/category', feedController.getByCategory);

module.exports = router;
