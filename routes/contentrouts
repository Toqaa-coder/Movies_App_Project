const express = require('express');
const router = express.Router();
const contentController = require('../controller/contentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// חשוב: routes ספציפיים (כמו /search ו-/stats) חייבים לבוא
// LIFNEI ה-route עם /:id, אחרת express יתפוס אותם בטעות כ-id

// GET /api/content/search?category=...&year=...&minRating=...
router.get('/search', verifyToken, contentController.searchContent);

// GET /api/content/stats/popular-by-category
router.get('/stats/popular-by-category', verifyToken, contentController.getPopularByCategory);

// GET /api/content - הצגת כל התכנים
router.get('/', verifyToken, contentController.getAllContent);

// POST /api/content - יצירת תוכן חדש (רק admin)
router.post('/', verifyToken, isAdmin, contentController.createContent);

// GET /api/content/:id - תוכן בודד
router.get('/:id', verifyToken, contentController.getContentById);

// PUT /api/content/:id - עדכון תוכן (רק admin)
router.put('/:id', verifyToken, isAdmin, contentController.updateContent);

// DELETE /api/content/:id - מחיקת תוכן (רק admin)
router.delete('/:id', verifyToken, isAdmin, contentController.deleteContent);

module.exports = router;


