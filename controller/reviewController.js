const Review = require('../models/review');

// Create - יצירת ביקורת/דירוג חדש
exports.createReview = async (req, res) => {
    try {
        const { userId, contentId, rating, text } = req.body;

        const newReview = new Review({
            userId,
            contentId,
            rating,
            text
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(400).json({ message: 'שגיאה ביצירת הביקורת', error: error.message });
    }
};

// List - הצגת כל הביקורות (או לפי תוכן מסוים אם נשלח contentId)
exports.getReviews = async (req, res) => {
    try {
        const { contentId } = req.query;
        const filter = contentId ? { contentId } : {};

        const reviews = await Review.find(filter)
            .populate('userId', 'name')
            .populate('contentId', 'title');

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשליפת הביקורות', error: error.message });
    }
};

// הצגת ביקורת בודדת לפי מזהה
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'הביקורת לא נמצאה' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשליפת הביקורת', error: error.message });
    }
};

// Update - עדכון ביקורת קיימת
exports.updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: 'הביקורת לא נמצאה' });
        }

        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: 'שגיאה בעדכון הביקורת', error: error.message });
    }
};

// Delete - מחיקת ביקורת
exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);

        if (!deletedReview) {
            return res.status(404).json({ message: 'הביקורת לא נמצאה' });
        }

        res.status(200).json({ message: 'הביקורת נמחקה בהצלחה' });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה במחיקת הביקורת', error: error.message });
    }
};

// Search - חיפוש ביקורות לפי פרמטרים (משתמש, תוכן, טווח דירוג)
exports.searchReviews = async (req, res) => {
    try {
        const { userId, contentId, minRating, maxRating } = req.query;
        const filter = {};

        if (userId) filter.userId = userId;
        if (contentId) filter.contentId = contentId;
        if (minRating || maxRating) {
            filter.rating = {};
            if (minRating) filter.rating.$gte = Number(minRating);
            if (maxRating) filter.rating.$lte = Number(maxRating);
        }

        const results = await Review.find(filter);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בחיפוש', error: error.message });
    }
};
