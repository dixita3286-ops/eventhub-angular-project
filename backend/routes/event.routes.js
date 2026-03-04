const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');

/* =====================================================
   MULTER SETUP (IMAGE + PDF UPLOAD)
===================================================== */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if (file.fieldname === 'eventImage') {
      cb(null, 'uploads/images');
    }

    else if (file.fieldname === 'eventPdf') {
      cb(null, 'uploads/files');
    }

  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }

});

const upload = multer({ storage: storage });

/* =====================================================
   CREATE EVENT (Organizer)
===================================================== */

router.post(
  '/',
  upload.fields([
    { name: 'eventImage', maxCount: 1 },
    { name: 'eventPdf', maxCount: 1 }
  ]),
  async (req, res) => {

    try {

      const event = new Event({

        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        date: req.body.date,
        venue: req.body.venue,
        registrationFee: req.body.registrationFee,
        createdBy: req.body.createdBy,

        eventImage:
          req.files && req.files.eventImage
            ? req.files.eventImage[0].filename
            : null,

        eventPdf:
          req.files && req.files.eventPdf
            ? req.files.eventPdf[0].filename
            : null

      });

      await event.save();

      res.status(201).json({
        message: "Event created successfully and sent for admin approval.",
        event: event
      });

    }

    catch (err) {

      console.error('Create event error:', err);

      res.status(500).json({
        message: 'Error creating event'
      });

    }

  }
);

/* =====================================================
   GET EVENTS FOR ORGANIZER
===================================================== */

router.get('/organizer/:organizerId', async (req, res) => {

  try {

    const events = await Event.find({
      createdBy: req.params.organizerId
    }).sort({ date: -1 });

    res.json(events);

  }

  catch (err) {

    console.error('Organizer events error:', err);

    res.status(500).json({
      message: 'Error fetching organizer events'
    });

  }

});

/* =====================================================
   GET ALL EVENTS (ADMIN - ALL)
===================================================== */

router.get('/admin', async (req, res) => {

  try {

    const events = await Event.find().sort({ date: -1 });

    res.json(events);

  }

  catch (err) {

    console.error('Admin events error:', err);

    res.status(500).json({
      message: 'Error fetching admin events'
    });

  }

});

/* =====================================================
   GET ONLY APPROVED EVENTS
===================================================== */

router.get('/admin/approved', async (req, res) => {

  try {

    const events = await Event.find({
      status: 'approved'
    }).sort({ date: -1 });

    res.json(events);

  }

  catch (err) {

    console.error('Approved events error:', err);

    res.status(500).json({
      message: 'Error fetching approved events'
    });

  }

});

/* =====================================================
   GET ONLY PENDING EVENTS
===================================================== */

router.get('/admin/pending', async (req, res) => {

  try {

    const events = await Event.find({
      status: 'pending'
    }).sort({ date: -1 });

    res.json(events);

  }

  catch (err) {

    console.error('Pending events error:', err);

    res.status(500).json({
      message: 'Error fetching pending events'
    });

  }

});

/* =====================================================
   STUDENT / PUBLIC EVENTS
===================================================== */

router.get('/', async (req, res) => {

  try {

    const events = await Event.find({
      status: 'approved'
    }).sort({ date: 1 });

    res.json(events);

  }

  catch (err) {

    console.error('Public events error:', err);

    res.status(500).json({
      message: 'Error fetching events'
    });

  }

});

/* =====================================================
   GET SINGLE EVENT  🔥 (VERY IMPORTANT FIX)
===================================================== */

router.get('/:id', async (req, res) => {

  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    res.json(event);

  }

  catch (err) {

    console.error('Get event error:', err);

    res.status(500).json({
      message: 'Error fetching event'
    });

  }

});

/* =====================================================
   UPDATE STATUS
===================================================== */

router.put('/:id/status', async (req, res) => {

  try {

    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    res.json({
      message: 'Status updated successfully'
    });

  }

  catch (err) {

    console.error('Update status error:', err);

    res.status(500).json({
      message: 'Error updating status'
    });

  }

});

/* =====================================================
   DELETE EVENT
===================================================== */

router.delete('/:id', async (req, res) => {

  try {

    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    res.json({
      message: 'Event deleted successfully'
    });

  }

  catch (err) {

    console.error('Delete event error:', err);

    res.status(500).json({
      message: 'Server error'
    });

  }

});

module.exports = router;