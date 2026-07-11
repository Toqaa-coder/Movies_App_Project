require('../models/contentModel');
const WatchHistory = require('../models/watchHistoryModel');
// Create - add a new watch history record
exports.createWatchHistory = async (req, res) => {
  try {
    const { user, content, progress, rating } = req.body;
    const newRecord = new WatchHistory({ user, content, progress, rating });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List - get all watch history records
exports.getAllWatchHistory = async (req, res) => {
  try {
    const records = await WatchHistory.find({ user: req.user.userId })
      .populate('user', 'name email')
      .populate('content');
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search - filter records by user or content
exports.searchWatchHistory = async (req, res) => {
  try {
    const { user, content } = req.query;
    const filter = {};
    if (user) filter.user = user;
    if (content) filter.content = content;

    const results = await WatchHistory.find(filter)
      .populate('user', 'username')
      .populate('content', 'title');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update - update an existing record
exports.updateWatchHistory = async (req, res) => {
  try {
    const updated = await WatchHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Record not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete - remove a record
exports.deleteWatchHistory = async (req, res) => {
  try {
    const deleted = await WatchHistory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Record not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};