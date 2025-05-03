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
  log(`Register request received with data: ${JSON.stringify({ ...req.body, password: '[REDACTED]' })}`, 'auth');
  const { fullName, email, password } = req.body;

  // Validate request data
  if (!fullName || !email || !password) {
    log('Missing required fields for registration', 'auth');
    return res.status(400).json({ message: 'Please provide all required fields: fullName, email, password' });
  }

  try {
    // Connect to MongoDB
    log('Connecting to database...', 'auth');
    const conn = await connectToDatabase();
    if (!conn) {
      log('Failed to connect to MongoDB', 'auth');
      return res.status(500).json({ message: 'Database connection failed' });
    }
    log('Connected to MongoDB', 'auth');

    // Check if user already exists
    log(`Checking if user exists with email: ${email}`, 'auth');
    const existingUser = await ActiveUser.findOne({ email });
    
    if (existingUser) {
      log(`User already exists with email: ${email}`, 'auth');
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    try {
      // Create new user
      log('Creating new user document', 'auth');
      const newUser = new ActiveUser({
        fullName,
        email,
        password, // Will be hashed in pre-save hook
        savedArticles: [],
        savedScholarships: [],
        comments: []
      });

      // Save user to database
      log('Saving user to database...', 'auth');
      await newUser.save();
      log(`User saved with ID: ${newUser._id}`, 'auth');

      // Create token payload
      const payload = {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName
      };

      // Sign JWT synchronously to avoid callback issues
      try {
        log('Generating JWT token...', 'auth');
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        
        // Return user data with token
        log('Registration successful, returning user data with token', 'auth');
        return res.status(201).json({ 
          token,
          user: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profileImage: newUser.profileImage || ''
          }
        });
      } catch (jwtError) {
        log(`JWT signing error: ${jwtError}`, 'auth');
        return res.status(500).json({ message: 'Error generating authentication token' });
      }
    } catch (saveError: any) {
      log(`Error saving user to database: ${saveError.message}`, 'auth');
      return res.status(500).json({ message: 'Error creating user account' });
    }
  } catch (err: any) {
    log(`Registration error: ${err.message}`, 'auth');
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req: Request, res: Response) => {
  log(`Login request received with data: ${JSON.stringify(req.body)}`, 'auth');
  const { email, password } = req.body;

  // Validate request data
  if (!email || !password) {
    log('Missing required fields for login', 'auth');
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Connect to MongoDB
    log('Connecting to database...', 'auth');
    const conn = await connectToDatabase();
    if (!conn) {
      log('Failed to connect to MongoDB', 'auth');
      return res.status(500).json({ message: 'Database connection failed' });
    }
    log('Connected to MongoDB', 'auth');

    // Check for existing user
    log(`Checking if user exists with email: ${email}`, 'auth');
    const user = await ActiveUser.findOne({ email });
    
    if (!user) {
      log(`No user found with email: ${email}`, 'auth');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    log(`User found with ID: ${user._id}`, 'auth');

    // Validate password
    log('Validating password...', 'auth');
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      log('Password validation failed', 'auth');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    log('Password validated successfully', 'auth');

    // Create token payload
    const payload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName
    };

    // Sign JWT synchronously to avoid callback issues
    try {
      log('Generating JWT token...', 'auth');
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      
      // Return user data with token
      log('Login successful, returning user data with token', 'auth');
      return res.json({ 
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profileImage: user.profileImage || ''
        }
      });
    } catch (jwtError) {
      log(`JWT signing error: ${jwtError}`, 'auth');
      return res.status(500).json({ message: 'Error generating authentication token' });
    }
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
    
    // Sign JWT synchronously to avoid callback issues
    try {
      log('Generating JWT token for Google login...', 'auth');
      const jwtToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '7d' });
      
      // Return user data with token
      log('Google login successful, returning user data with token', 'auth');
      return res.json({ 
        token: jwtToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profileImage: user.profileImage || picture || ''
        }
      });
    } catch (jwtError) {
      log(`JWT signing error during Google login: ${jwtError}`, 'auth');
      return res.status(500).json({ message: 'Error generating authentication token' });
    }
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
      log('No user data in request object', 'auth');
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    log(`Getting user data for ID: ${req.user.id}`, 'auth');
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      log('Failed to connect to MongoDB for user retrieval', 'auth');
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    log('Connected to MongoDB for user retrieval', 'auth');
    
    try {
      // Fetch user from MongoDB by ID
      const user = await ActiveUser.findById(req.user.id)
        .select('-password')
        .lean();
      
      if (!user) {
        log(`User not found with ID: ${req.user.id}`, 'auth');
        return res.status(404).json({ message: 'User not found' });
      }
      
      log(`User found: ${user.email}`, 'auth');
      
      // Transform to match expected client format
      const userData = {
        id: user._id ? user._id.toString() : req.user.id,
        fullName: user.fullName || '',
        email: user.email || '',
        profileImage: user.profileImage || '',
        savedArticles: Array.isArray(user.savedArticles) ? user.savedArticles : [],
        savedScholarships: Array.isArray(user.savedScholarships) ? user.savedScholarships : [],
        isAdmin: !!user.isAdmin
      };
      
      log('Returning user data', 'auth');
      return res.json(userData);
    } catch (findError) {
      log(`Error finding user: ${findError}`, 'auth');
      return res.status(500).json({ message: 'Error finding user' });
    }
  } catch (err) {
    log(`Get user error: ${err}`, 'auth');
    return res.status(500).json({ message: 'Server error fetching user data' });
  }
});

export default router;