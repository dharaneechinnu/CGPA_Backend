require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;
const MONGODB_URL = process.env.MONGO_URL;

const app = express();

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('Database is connected');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/Auth', require('./Router/Router'));
app.use('/api', require('./Router/Target'));
//updated routes by aalan
app.use('/admin',require('./Router/adminRouter'))
app.use('/teacher',require('./Router/teacherRouter'))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
