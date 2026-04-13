import Event from '../models/Event.js';

// 1. Create a new event
// @route   POST /api/events
export const createEvent = async (req, res) => {
  try {
    const { title, description, category, city, date, volunteerCapacity } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      city, 
      hostNGO: req.user._id, 
      date,
      volunteerCapacity
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

// 2. Get all events (with optional city filter)
// @route   GET /api/events
export const getEvents = async (req, res) => {
  try {
    const filter = req.query.city ? { city: req.query.city } : {};
    const events = await Event.find(filter)
      .populate('hostNGO', 'name email') 
      .sort({ date: 1 }); 

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

// 3. Register a volunteer for an event
// @route   POST /api/events/:id/register
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.registeredVolunteers.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    if (event.registeredVolunteers.length >= event.volunteerCapacity) {
      return res.status(400).json({ message: 'Sorry, this event has reached maximum capacity' });
    }

    event.registeredVolunteers.push(req.user._id);
    await event.save();

    res.status(200).json({ 
      message: 'Successfully registered for the event!',
      registeredCount: event.registeredVolunteers.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// 4. Get events created by the logged-in NGO
// @route   GET /api/events/my-events
export const getNGOEvents = async (req, res) => {
  try {
    const events = await Event.find({ hostNGO: req.user._id })
      .populate('registeredVolunteers', 'name email phone skills') 
      .sort({ date: 1 });

    res.status(200).json({
      totalEventsHosted: events.length,
      events: events
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch NGO roster', error: error.message });
  }
};

// 5. Update an event's status
// @route   PATCH /api/events/:id/status
// @access  Private (NGO Admin only)
export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Security Check: Only the NGO who created the event can update it
    if (event.hostNGO.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Validate that the status is one of our allowed options
    const validStatuses = ['upcoming', 'ongoing', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status option' });
    }

    // Update and save
    event.status = status;
    await event.save();

    res.status(200).json({ 
      message: `Event status successfully updated to ${status}`, 
      event 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event status', error: error.message });
  }
};
// 5. @route   DELETE /api/events/:id
// @access  Private (NGO Admin Only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    if (req.user.role !== 'ngo_admin') {
      return res.status(401).json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully", eventId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};