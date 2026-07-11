const Profile = require('../models/profileModel');

// Create - יצירת פרופיל חדש
exports.createProfile = async (req, res) => {
    try {
        const { userId, profileName, age, preferences, avatar } = req.body;

        const newProfile = new Profile({
            userId,
            profileName,
            age,
            preferences,
            avatar
        });

        const savedProfile = await newProfile.save();
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(400).json({ message: 'שגיאה ביצירת הפרופיל', error: error.message });
    }
};

// List - הצגת כל הפרופילים (או פרופילים של משתמש מסוים)
exports.getProfiles = async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = userId ? { userId } : {};

        const profiles = await Profile.find(filter);
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשליפת הפרופילים', error: error.message });
    }
};

// הצגת פרופיל בודד לפי מזהה
exports.getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'הפרופיל לא נמצא' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשליפת הפרופיל', error: error.message });
    }
};

// Update - עדכון פרופיל קיים
exports.updateProfile = async (req, res) => {
    try {
        const updatedProfile = await Profile.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'הפרופיל לא נמצא' });
        }

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: 'שגיאה בעדכון הפרופיל', error: error.message });
    }
};

// Delete - מחיקת פרופיל
exports.deleteProfile = async (req, res) => {
    try {
        const deletedProfile = await Profile.findByIdAndDelete(req.params.id);

        if (!deletedProfile) {
            return res.status(404).json({ message: 'הפרופיל לא נמצא' });
        }

        res.status(200).json({ message: 'הפרופיל נמחק בהצלחה' });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה במחיקת הפרופיל', error: error.message });
    }
};

// Search - חיפוש פרופילים לפי פרמטרים
exports.searchProfiles = async (req, res) => {
    try {
        const { name, minAge, maxAge } = req.query;
        const filter = {};

        if (name) {
            filter.profileName = { $regex: name, $options: 'i' }; // חיפוש חלקי ללא רגישות לאותיות גדולות/קטנות
        }
        if (minAge || maxAge) {
            filter.age = {};
            if (minAge) filter.age.$gte = Number(minAge);
            if (maxAge) filter.age.$lte = Number(maxAge);
        }

        const profiles = await Profile.find(filter);
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בחיפוש', error: error.message });
    }
};
