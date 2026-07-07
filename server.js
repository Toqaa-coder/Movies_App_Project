const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

connectDB();

app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/profiles', require('./routes/profileroutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

