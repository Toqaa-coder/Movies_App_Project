const express = require('express');
const router = express.Router();
const profileController = require('../controller/profileController');

// חיפוש פרופילים לפי פרמטרים (חייב להיות לפני /:id כדי שלא יתבלבל עם מזהה)
router.get('/search', profileController.searchProfiles);

// הצגת כל הפרופילים (או לפי userId אם נשלח כ־query)
router.get('/', profileController.getProfiles);

// הצגת פרופיל בודד לפי מזהה
router.get('/:id', profileController.getProfileById);

// יצירת פרופיל חדש
router.post('/', profileController.createProfile);

// עדכון פרופיל קיים
router.put('/:id', profileController.updateProfile);

// מחיקת פרופיל
router.delete('/:id', profileController.deleteProfile);

module.exports = router;
