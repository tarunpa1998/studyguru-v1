import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import connectToDatabase from '../lib/mongodb';
import { MongoClient } from 'mongodb';

const router = Router();

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin user & get token
 * @access  Public
 */
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let user;
    let userId;
    let isAdmin = false;
    let userPassword = '';

    // Try to find user in PostgreSQL first
    try {
      const pgUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username)
      });

      if (pgUser) {
        user = pgUser;
        userId = pgUser.id;
        isAdmin = pgUser.isAdmin || false;
        userPassword = pgUser.password;
      }
    } catch (pgError) {
      console.error('PostgreSQL query error:', pgError);
      // Continue to try MongoDB if PG fails
    }

    // If user not found in PostgreSQL, try MongoDB
    if (!user) {
      try {
        const conn = await connectToDatabase();
        if (conn) {
          const db = conn.db();
          const userCollection = db.collection('users');
          
          const mongoUser = await userCollection.findOne({ username });
          
          if (mongoUser) {
            user = mongoUser;
            userId = mongoUser._id;
            isAdmin = mongoUser.isAdmin || false;
            userPassword = mongoUser.password;
          }
        }
      } catch (mongoError) {
        console.error('MongoDB query error:', mongoError);
      }
    }

    // If user not found in either database, try memory storage
    if (!user) {
      try {
        const memUser = await storage.getUserByUsername(username);
        if (memUser) {
          user = memUser;
          userId = memUser.id;
          isAdmin = memUser.isAdmin || false;
          userPassword = memUser.password;
        }
      } catch (memError) {
        console.error('Memory storage error:', memError);
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is admin
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, userPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT
    const payload = {
      id: userId,
      username: username,
      isAdmin: isAdmin
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
    
    let user;
    
    // Try to find user in PostgreSQL first
    try {
      const pgUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, req.user.id)
      });

      if (pgUser) {
        user = pgUser;
      }
    } catch (pgError) {
      console.error('PostgreSQL query error:', pgError);
    }

    // If user not found in PostgreSQL, try MongoDB
    if (!user) {
      try {
        const conn = await connectToDatabase();
        if (conn) {
          const db = conn.db();
          const userCollection = db.collection('users');
          
          const mongoUser = await userCollection.findOne({ username: req.user.username });
          
          if (mongoUser) {
            user = mongoUser;
          }
        }
      } catch (mongoError) {
        console.error('MongoDB query error:', mongoError);
      }
    }

    // If user not found in either database, try memory storage
    if (!user) {
      try {
        const memUser = await storage.getUser(req.user.id);
        if (memUser) {
          user = memUser;
        }
      } catch (memError) {
        console.error('Memory storage error:', memError);
      }
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user data without password
    const userData = { ...user };
    delete userData.password;
    
    res.json(userData);
  } catch (err) {
    console.error('Error getting auth user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/setup
 * @desc    Create an admin user
 * @access  Public (but requires setup key)
 */
router.post('/setup', async (req: Request, res: Response) => {
  try {
    const { username, password, setupKey } = req.body;
    
    // Verify setup key if one is set in environment
    const correctSetupKey = process.env.ADMIN_SETUP_KEY || 'admin_setup_secret';
    if (setupKey !== correctSetupKey) {
      return res.status(401).json({ message: 'Invalid setup key' });
    }
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Import and run the admin user creation script
    const createAdminUser = require('../scripts/createAdminUser').default;
    const result = await createAdminUser();
    
    if (result.success) {
      res.status(201).json({ message: 'Admin user created successfully' });
    } else {
      res.status(500).json({ message: 'Failed to create admin user', error: result.error });
    }
  } catch (err) {
    console.error('Error in admin setup:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;