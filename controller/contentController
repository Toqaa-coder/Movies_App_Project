const Content = require('../models/contentModel');

// CREATE - יצירת תוכן חדש
exports.createContent = async (req, res) => {
  try {
    const newContent = new Content(req.body);
    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (err) {
    res.status(400).json({ message: 'שגיאה ביצירת תוכן', error: err.message });
  }
};

// READ - הצגת כל התכנים (List)
exports.getAllContent = async (req, res) => {
  try {
    const contents = await Content.find();
    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפת תכנים', error: err.message });
  }
};

// READ - הצגת תוכן בודד לפי ID
exports.getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'תוכן לא נמצא' });
    }
    res.status(200).json(content);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפת תוכן', error: err.message });
  }
};

// UPDATE - עדכון תוכן קיים
exports.updateContent = async (req, res) => {
  try {
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedContent) {
      return res.status(404).json({ message: 'תוכן לא נמצא' });
    }
    res.status(200).json(updatedContent);
  } catch (err) {
    res.status(400).json({ message: 'שגיאה בעדכון תוכן', error: err.message });
  }
};

// DELETE - מחיקת תוכן
exports.deleteContent = async (req, res) => {
  try {
    const deletedContent = await Content.findByIdAndDelete(req.params.id);
    if (!deletedContent) {
      return res.status(404).json({ message: 'תוכן לא נמצא' });
    }
    res.status(200).json({ message: 'התוכן נמחק בהצלחה' });
  } catch (err) {
    res.status(500).json({ message: 'שגיאה במחיקת תוכן', error: err.message });
  }
};

// SEARCH - חיפוש מתקדם (לפי קטגוריה, שנה, דירוג מינימלי - לפחות 3 פרמטרים כנדרש בסעיף 10)
exports.searchContent = async (req, res) => {
  try {
    const { category, year, minRating, type, title } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (year) filter.year = Number(year);
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (type) filter.type = type;
    if (title) filter.title = { $regex: title, $options: 'i' };

    const results = await Content.find(filter);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בחיפוש', error: err.message });
  }
};

// GroupBy - התכנים הנצפים ביותר לפי קטגוריה (דוגמה לסעיף 10)
exports.getPopularByCategory = async (req, res) => {
  try {
    const result = await Content.aggregate([
      {
        $group: {
          _id: '$category',
          totalViews: { $sum: '$views' },
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalViews: -1 } }
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפת נתונים', error: err.message });
  }
};

