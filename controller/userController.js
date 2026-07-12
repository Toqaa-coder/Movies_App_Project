
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendCodeEmail } = require('../config/mailer');

// הרשמה
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'נא למלא את כל השדות' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'משתמש עם מייל זה כבר קיים' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'נרשמת בהצלחה' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'שגיאת שרת בהרשמה' });
    }
};

// התחברות
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'נא למלא מייל וסיסמה' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'מייל או סיסמה שגויים' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'מייל או סיסמה שגויים' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'התחברת בהצלחה',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'שגיאת שרת בהתחברות' });
    }
};

// הצגת כל המשתמשים (רק למנהל)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'שגיאה בשליפת משתמשים' });
    }
};

// ============================================
// חדש: פונקציית עזר - יוצרת קוד בן 6 ספרות
// ============================================
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // תמיד 6 ספרות
}

// ============================================
// חדש: שליחת קוד למייל (משמש גם ל"שכחתי סיסמה" וגם ל"כניסה עם קוד")
// ============================================
exports.sendCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'נא למלא מייל' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // לא חושפים אם המייל קיים או לא - הודעה זהה בשני המקרים
            return res.status(200).json({ message: 'אם המייל קיים במערכת, נשלח אליו קוד' });
        }

        const code = generateCode();
        user.resetCode = code;
        user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // תוקף 10 דקות
        await user.save();

        await sendCodeEmail(email, code);

        res.status(200).json({ message: 'אם המייל קיים במערכת, נשלח אליו קוד' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'שגיאה בשליחת קוד' });
    }
};

// ============================================
// חדש: התחברות עם קוד (במקום סיסמה)
// ============================================
exports.loginWithCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: 'נא למלא מייל וקוד' });
        }

        const user = await User.findOne({ email });
        if (!user || !user.resetCode) {
            return res.status(400).json({ message: 'קוד שגוי או פג תוקף' });
        }

        if (user.resetCode !== code || user.resetCodeExpires < Date.now()) {
            return res.status(400).json({ message: 'קוד שגוי או פג תוקף' });
        }

        // הקוד תקין - מנקים אותו כדי שלא ישמש שוב, ומתחברים
        user.resetCode = null;
        user.resetCodeExpires = null;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'התחברת בהצלחה',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'שגיאת שרת בהתחברות עם קוד' });
    }
};

// ============================================
// חדש: איפוס סיסמה עם קוד
// ============================================
exports.resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'נא למלא את כל השדות' });
        }

        const user = await User.findOne({ email });
        if (!user || !user.resetCode) {
            return res.status(400).json({ message: 'קוד שגוי או פג תוקף' });
        }

        if (user.resetCode !== code || user.resetCodeExpires < Date.now()) {
            return res.status(400).json({ message: 'קוד שגוי או פג תוקף' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetCode = null;
        user.resetCodeExpires = null;
        await user.save();

        res.status(200).json({ message: 'הסיסמה עודכנה בהצלחה' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'שגיאה באיפוס סיסמה' });
    }
};
