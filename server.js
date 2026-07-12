// 1. Fix crypto issue in certain environments (e.g., WSL) by defining it globally
global.crypto = require('crypto'); 

const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// 2. Initialize database connection
connectDB();

// 3. Define routes
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/watchhistory', require('./routes/watchHistoryRoutes'));

// 4. Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});