const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// הרשמה - פתוח לכולם (עוד אין למישהו טוקן בשלב הזה)
router.post('/register', userController.register);

// התחברות - פתוח לכולם
router.post('/login', userController.login);

// הצגת כל המשתמשים - רק למנהל (admin)
router.get('/all', verifyToken, isAdmin, userController.getAllUsers);

// --- חדש: שכחתי סיסמה / כניסה עם קוד ---

// שליחת קוד למייל (משמש גם לאיפוס סיסמה וגם לכניסה עם קוד) - פתוח לכולם
router.post('/send-code', userController.sendCode);

// התחברות עם קוד (במקום סיסמה) - פתוח לכולם
router.post('/login-with-code', userController.loginWithCode);

// איפוס סיסמה עם קוד - פתוח לכולם
router.post('/reset-password', userController.resetPassword);

module.exports = router;



