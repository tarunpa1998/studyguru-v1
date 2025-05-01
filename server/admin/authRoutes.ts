import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth';
import User from '../models/User';

const router = Router();

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin user & get token
 * @access  Public
 */
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Check for existing user in MongoDB
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Validate password using User model method
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT
    const payload = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    };

    jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'default_secret', 
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/auth
 * @desc    Get authenticated user
 * @access  Private
 */
router.get('/auth', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    // Fetch user from MongoDB by ID
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error getting auth user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;