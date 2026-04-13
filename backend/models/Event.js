import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Blood Donation Camp', 'Charity Fundraiser', 'Awareness Drive', 'Food Distribution', 'Clean-up Drive', 'Custom'],
    required: true 
  },
  hostNGO: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Pivoted to a simple string for easy implementation
  city: { 
    type: String, 
    required: true, 
    trim: true 
  },
  date: { type: Date, required: true },
  volunteerCapacity: { type: Number, required: true },
  registeredVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' }
}, { timestamps: true });

// Standard index to make searching for events by city faster
eventSchema.index({ city: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;