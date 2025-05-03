import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import ActiveUser from '../models/ActiveUser';
import { auth } from '../middleware/auth';
import connectToDatabase from '../lib/mongodb';
import { log } from '../vite';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

// Setup Google OAuth client
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  try {
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }

    // Check if user already exists
    const existingUser = await ActiveUser.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const newUser = new ActiveUser({
      fullName,
      email,
      password, // Will be hashed in pre-save hook
    });

    // Save user to database
    await newUser.save();

    // Create token
    const payload = {
      id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName
    };

    // Sign and return JWT
    jwt.sign(
      payload, 
      JWT_SECRET, 
      { expiresIn: '7d' },
      (err: Error | null, token: string) => {
        if (err) throw err;
        res.status(201).json({ 
          token,
          user: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profileImage: newUser.profileImage
          }
        });
      }
    );
  } catch (err) {
    log(`Registration error: ${err}`, 'auth');
    res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }

    // Check for existing user
    const user = await ActiveUser.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token payload
    const payload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName
    };

    // Sign and return JWT
    jwt.sign(
      payload, 
      JWT_SECRET, 
      { expiresIn: '7d' },
      (err: Error | null, token: string) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage
          }
        });
      }
    );
  } catch (err) {
    log(`Login error: ${err}`, 'auth');
    res.status(500).json({ message: 'Server error during login' });
  }
});

/**
 * @route   POST /api/auth/google
 * @desc    Login or register with Google
 * @access  Public
 */
router.post('/google', async (req: Request, res: Response) => {
  const { token } = req.body;
  
  try {
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }
    
    const { email, name, picture, sub } = payload;
    
    // Check if user exists
    let user = await ActiveUser.findOne({ email });
    
    if (!user) {
      // Create new user with Google info
      user = new ActiveUser({
        fullName: name,
        email,
        profileImage: picture,
        googleId: sub
      });
      
      await user.save();
    } else if (!user.googleId) {
      // Update existing user with Google ID if they didn't have one
      user.googleId = sub;
      await user.save();
    }
    
    // Create token payload
    const jwtPayload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName
    };
    
    // Sign and return JWT
    jwt.sign(
      jwtPayload,
      JWT_SECRET,
      { expiresIn: '7d' },
      (err: Error | null, jwtToken: string) => {
        if (err) throw err;
        res.json({ 
          token: jwtToken,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage || picture
          }
        });
      }
    );
  } catch (err) {
    log(`Google auth error: ${err}`, 'auth');
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
});

/**
 * @route   GET /api/auth/user
 * @desc    Get authenticated user data
 * @access  Private
 */
router.get('/user', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    // Fetch user from MongoDB by ID
    const user = await ActiveUser.findById(req.user.id)
      .select('-password')
      .populate('savedArticles', 'title slug image')
      .populate('savedScholarships', 'title slug');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    log(`Get user error: ${err}`, 'auth');
    res.status(500).json({ message: 'Server error fetching user data' });
  }
});

export default router;