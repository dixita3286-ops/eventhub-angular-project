const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');


const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://dixita_1704:dixita1704@cluster0.syxxncf.mongodb.net/EventHub')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Test route
app.get('/', (req, res) => {
  res.send('EventHub backend running');
});

app.use('/api/auth', authRoutes);

const eventRoutes = require('./routes/event.routes');
app.use('/api/events', eventRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});




