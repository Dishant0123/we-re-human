import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Generate JWT for the user
 * @param {string} id - User MongoDB ID
 * @param {string} role - User role for RBAC
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d', // 7-day token rotation as per Week 3 specs
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create user (This triggers the pre-save hook in User.js)
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // 3. Send Success Response
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
        message: "User registered successfully"
      });
    }
  } catch (error) {
    // This catches the 'next(err)' or any database failures
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
};

// Add this below your registerUser function in authController.js

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists AND password matches (using the method we built in User.js)
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
        message: "Login successful"
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};