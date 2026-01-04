const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());

/* ================= STATIC FILES =================
   Images: http://localhost:5000/public/xxx.png
   Files : http://localhost:5000/uploads/files/xxx.pdf
================================================ */

/* ✅ STATIC IMAGES */
app.use(
  '/public',
  express.static(path.join(__dirname, '../EventHub/public'), {
    setHeaders: res => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  })
);

/* 🔥 ADD THIS — STATIC UPLOAD FILES */
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: res => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  })
);

/* ================= DATABASE ================= */
mongoose
  .connect('mongodb+srv://dixita_1704:dixita1704@cluster0.syxxncf.mongodb.net/EventHub')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

/* ================= ROUTES ================= */
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

/* ================= SERVER ================= */
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
