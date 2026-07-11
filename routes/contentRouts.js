const express = require('express');
const router = express.Router();
const contentController = require('../controller/contentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/search', verifyToken, contentController.searchContent);
router.get('/stats/popular-by-category', verifyToken, contentController.getPopularByCategory);
router.get('/', verifyToken, contentController.getAllContent);
router.post('/', verifyToken, isAdmin, contentController.createContent);
router.get('/:id', verifyToken, contentController.getContentById);
router.put('/:id', verifyToken, isAdmin, contentController.updateContent);
router.delete('/:id', verifyToken, isAdmin, contentController.deleteContent);

module.exports = router;



