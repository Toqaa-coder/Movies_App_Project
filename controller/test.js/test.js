require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const WatchHistory = require('./models/watchHistoryModel');
    require('./models/contentModel');
    const r = await WatchHistory.findById('6a5256743b26be42def0b264').populate('content');
    console.log(JSON.stringify(r));
    process.exit();
});