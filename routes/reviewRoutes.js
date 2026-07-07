const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviewController');

// חיפוש ביקורות לפי פרמטרים (חייב להיות לפני /:id)
router.get('/search', reviewController.searchReviews);

// הצגת כל הביקורות (או לפי contentId אם נשלח כ־query)
router.get('/', reviewController.getReviews);

// הצגת ביקורת בודדת לפי מזהה
router.get('/:id', reviewController.getReviewById);

// יצירת ביקורת חדשה
router.post('/', reviewController.createReview);

// עדכון ביקורת קיימת
router.put('/:id', reviewController.updateReview);

// מחיקת ביקורת
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
