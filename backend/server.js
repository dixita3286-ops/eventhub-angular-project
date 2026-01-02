const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  'mongodb+srv://dixita_1704:dixita1704@cluster0.syxxncf.mongodb.net/EventHub'
).then(() => console.log('MongoDB connected'));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
