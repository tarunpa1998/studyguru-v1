import { Router, Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth';

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const router = Router();

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin user & get token
 * @access  Public
 */
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      username: user.username
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/auth
 * @desc    Get authenticated user
 * @access  Private
 */
router.get('/auth', auth, async (req: Request, res: Response) => {
  try {
    // Get user without password
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;