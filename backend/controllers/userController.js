import User from '../models/User.js';
import Event from '../models/Event.js';

// @desc    Get user profile and registered events history
// @route   GET /api/users/profile
// @access  Private (Logged-in users only)
export const getUserProfile = async (req, res) => {
  try {
    // 1. Fetch the user's profile (password is already hidden by our auth middleware, but we ensure it here too)
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Fetch all events where this user's ID exists inside the 'registeredVolunteers' array
    const myEvents = await Event.find({ registeredVolunteers: req.user._id })
      .populate('hostNGO', 'name email') // Pull the NGO's name so the volunteer sees who they are helping
      .sort({ date: 1 }); // Sort so the most recent/upcoming events are at the top

    // 3. Package it all into a clean, user-centered response
    res.status(200).json({
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedOn: user.createdAt
      },
      stats: {
        totalEventsJoined: myEvents.length
      },
      history: myEvents
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update the name if provided, otherwise keep the old one
      user.name = req.body.name || user.name;
      
      const updatedUser = await user.save();

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};