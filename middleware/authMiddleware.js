const jwt = require('jsonwebtoken');

// verifyToken - "השומר בדלת" הראשי
// בודק שיש טוקן תקין לפני שממשיכים ל-Controller
// אם אין טוקן / הטוקן לא תקין -> חוסם עם 401 (Unauthorized)
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // מצפים לפורמט: "Bearer <token>"

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'גישה נדחתה - נדרש להתחבר' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded מכיל את מה ששמנו ב-jwt.sign בעת ה-login: { userId, role }

    req.user = decoded; // שומרים על הבקשה - כדי שה-Controller ידע מי המשתמש
    next(); // הכל תקין - ממשיכים הלאה ל-Controller
  } catch (error) {
    return res.status(401).json({ message: 'טוקן לא תקין או פג תוקף' });
  }
};

// isAdmin - "שומר" נוסף, רק לעמודי ניהול
// חייב לרוץ *אחרי* verifyToken (כי הוא מסתמך על req.user שverifyToken יצר)
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // המשתמש הוא admin - ממשיכים
  } else {
    return res.status(403).json({ message: 'אין לך הרשאה לבצע פעולה זו' });
  }
};

// ============================================
// checkOwnership - "שומר" שמוודא שהמשתמש נוגע רק במידע שלו
// מיועד למודלים כמו Profile / WatchHistory / Review,
// שבהם לכל מסמך יש שדה בעלים (למשל userId). admin עוקף תמיד.
//
// דוגמת שימוש עתידית:
//   const Profile = require('../models/Profile');
//   router.put('/:id', verifyToken,
//     checkOwnership(id => Profile.findById(id), 'userId'),
//     profileController.updateProfile);
// ============================================
exports.checkOwnership = (getModel, ownerField) => {
  return async (req, res, next) => {
    try {
      if (req.user && req.user.role === 'admin') {
        return next();
      }
      const doc = await getModel(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: 'הפריט לא נמצא' });
      }
      if (doc[ownerField].toString() !== req.user.userId) {
        return res.status(403).json({ message: 'אין לך הרשאה לגעת במידע של משתמש אחר' });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: 'שגיאה בבדיקת הרשאות' });
    }
  };
};



