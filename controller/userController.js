const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        const users = await User.find().select('-password'); // בלי הסיסמה!
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'שגיאה בשליפת משתמשים' });
    }
};