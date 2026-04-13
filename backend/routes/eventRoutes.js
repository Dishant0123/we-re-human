import express from 'express';
import { createEvent, getEvents, registerForEvent, getNGOEvents, updateEventStatus, deleteEvent} from '../controllers/eventController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/events - Publicly view all events
router.get('/', getEvents);

// POST /api/events - NGO Admins only
router.post('/', protect, authorizeRoles('ngo_admin'), createEvent);

// GET /api/events/my-events - NGO Admins only (MUST BE ABOVE /:id routes)
router.get('/my-events', protect, authorizeRoles('ngo_admin'), getNGOEvents);

router.patch('/:id/status', protect, authorizeRoles('ngo_admin'), updateEventStatus);

// POST /api/events/:id/register - Volunteers only
router.post('/:id/register', protect, authorizeRoles('volunteer'), registerForEvent);

router.delete('/:id', protect, deleteEvent);

export default router;