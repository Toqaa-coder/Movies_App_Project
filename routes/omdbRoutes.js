const express = require('express');
const router = express.Router();
const { getMovieInfo } = require('../controller/omdbController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getMovieInfo);

module.exports = router;