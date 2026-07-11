const Content = require('../models/contentModel');
const WatchHistory = require('../models/watchHistoryModel');

// Continue Watching - תוכן שהמשתמש התחיל לצפות בו ולא סיים (progress בין 1 ל-99)
exports.getContinueWatching = async (req, res) => {
    try {
        const userId = req.user.userId;

        const records = await WatchHistory.find({
            user: userId,
            progress: { $gt: 0, $lt: 100 }
        })
            .sort({ updatedAt: -1 })
            .limit(10)
            .populate('content');

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשליפת המשך צפייה', error: error.message });
    }
};

// Recommendations - המלצות לפי הקטגוריות שהמשתמש הכי צופה בהן
exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.userId;

        const history = await WatchHistory.find({ user: userId }).populate('content');
        const watchedContentIds = history.map(h => h.content?._id?.toString()).filter(Boolean);

        const categoryCount = {};
        history.forEach(h => {
            const cat = h.content?.category;
            if (cat) categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });

        const topCategory = Object.keys(categoryCount).sort(
            (a, b) => categoryCount[b] - categoryCount[a]
        )[0];

        let filter = { _id: { $nin: watchedContentIds } };
        if (topCategory) filter.category = topCategory;

        const recommendations = await Content.find(filter).limit(10);
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשליפת המלצות', error: error.message });
    }
};

// Top 10 Popular - עשרת התכנים הפופולריים ביותר (לפי מספר צפיות)
exports.getPopular = async (req, res) => {
    try {
        const popular = await Content.find().sort({ views: -1 }).limit(10);
        res.status(200).json(popular);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשליפת תכנים פופולריים', error: error.message });
    }
};

// By Category - תכנים מקובצים לפי קטגוריה
exports.getByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        if (!category) {
            return res.status(400).json({ message: 'חסרה קטגוריה' });
        }

        const items = await Content.find({ category });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשליפת תכנים לפי קטגוריה', error: error.message });
    }
};
