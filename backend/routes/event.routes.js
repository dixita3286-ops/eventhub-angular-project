const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

/* =====================================================
   CREATE EVENT (Organizer)
   POST /api/events
===================================================== */
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating event' });
  }
});

/* =====================================================
   GET EVENTS FOR ORGANIZER (My Events)
   GET /api/events/organizer/:organizerId
===================================================== */
router.get('/organizer/:organizerId', async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: req.params.organizerId
    }).sort({ date: -1 });

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching organizer events' });
  }
});

/* =====================================================
   GET ALL EVENTS (ADMIN)
   GET /api/events/admin
===================================================== */
router.get('/admin', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching admin events' });
  }
});


/* =====================================================
   GET EVENTS WITH FILTERS (Student / Public)
   GET /api/events
===================================================== */
router.get('/', async (req, res) => {
  try {
    const filter = { status: 'approved' };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { venue: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const sort =
      req.query.sort === 'date_desc'
        ? { date: -1 }
        : { date: 1 };

    const events = await Event.find(filter).sort(sort);
    res.json(events);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

/* =====================================================
   GET SINGLE EVENT DETAILS
   GET /api/events/:id
===================================================== */
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching event details' });
  }
});

/* =====================================================
   UPDATE EVENT (ADMIN / ORGANIZER)
   PUT /api/events/:id
===================================================== */
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(updatedEvent);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating event' });
  }
});

/* =====================================================
   DELETE EVENT (ADMIN)
   DELETE /api/events/:id
===================================================== */
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });

  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
