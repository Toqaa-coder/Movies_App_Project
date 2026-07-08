const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

connectDB();

app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/profiles', require('./routes/profilerouter'));
app.use('/api/content', require('./routes/contentRouts'));
app.use('/api/users', require('./routes/userRouts'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


