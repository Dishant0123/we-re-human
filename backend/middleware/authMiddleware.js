import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. Verify the JWT Token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (looks like "Bearer eyJhbGciOi...")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token payload and attach it to the request (exclude the password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Pass the baton to the next function
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 2. Role-Based Access Control (RBAC)
// Pass in an array of allowed roles, e.g., authorizeRoles('ngo_admin', 'platform_admin')
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user.role}) is not authorized to access this resource` 
      });
    }
    next();
  };
};