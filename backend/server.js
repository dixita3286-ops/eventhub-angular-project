const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');


const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/EventHub')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Test route
app.get('/', (req, res) => {
  res.send('EventHub backend running');
});

app.use('/api/auth', authRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});




