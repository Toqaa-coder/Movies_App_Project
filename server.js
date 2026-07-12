const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.redirect('/login.html');
});
connectDB();

app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/feed', require('./routes/feedRoutes'));
app.use('/api/profiles', require('./routes/profileRouters'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/content', require('./routes/contentRouts'));
app.use('/api/users', require('./routes/userRouts'));
app.use('/api/watchhistory', require('./routes/watchHistoryRoutes'));
app.use('/api/omdb', require('./routes/omdbRoutes'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
