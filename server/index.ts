import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { migrateDataToMongoDB } from "./migrate";
import dotenv from 'dotenv';
import connectToDatabase from "./lib/mongodb";

// Load environment variables from .env file
dotenv.config();

const app = express();
// Enable trust proxy for rate limiter to work correctly
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // CRITICAL: Set up API routes before Vite middleware to ensure they work correctly
  const server = await registerRoutes(app);

  // General error handling middleware for API routes
  app.use('/api', (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Ensure we always return JSON for API routes
    res.status(status).json({ message, error: true });
  });

  // Set up dedicated auth endpoints that bypass Vite completely
  // Register endpoint
  app.post('/direct-api/auth/register', async (req: Request, res: Response) => {
    try {
      // Forward the request to the real endpoint but bypass Vite
      const { fullName, email, password } = req.body;
      
      if (!fullName || !email || !password) {
        return res.status(400).json({ 
          error: true,
          message: 'Please provide all required fields: fullName, email, password' 
        });
      }
      
      // Import modules using dynamic import instead of require
      const { default: ActiveUser } = await import('./models/ActiveUser');
      const { default: jwt } = await import('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'studyguru-secret-key';
      
      // Connect to MongoDB
      const conn = await connectToDatabase();
      if (!conn) {
        return res.status(500).json({ 
          error: true,
          message: 'Database connection failed' 
        });
      }
      
      // Check if user exists
      const existingUser = await ActiveUser.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          error: true,
          message: 'User already exists with this email' 
        });
      }
      
      // Create new user
      const newUser = new ActiveUser({
        fullName,
        email,
        password, // Will be hashed in pre-save hook
        savedArticles: [],
        savedScholarships: [],
        comments: []
      });
      
      // Save user
      await newUser.save();
      
      // Create token
      const payload = {
        id: newUser._id.toString(),
        email: newUser.email,
        fullName: newUser.fullName
      };
      
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      
      // Return success response
      return res.status(201).json({
        token,
        user: {
          id: newUser._id.toString(),
          fullName: newUser.fullName,
          email: newUser.email,
          profileImage: newUser.profileImage || '',
          savedArticles: [],
          savedScholarships: []
        }
      });
    } catch (error: any) {
      console.error('Direct registration error:', error);
      return res.status(500).json({ 
        error: true,
        message: error.message || 'Server error during registration' 
      });
    }
  });
  
  // Login endpoint
  app.post('/direct-api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          error: true,
          message: 'Please provide email and password' 
        });
      }
      
      // Import modules using dynamic import instead of require
      const { default: ActiveUser } = await import('./models/ActiveUser');
      const { default: jwt } = await import('jsonwebtoken');
      const { default: bcrypt } = await import('bcryptjs');
      const JWT_SECRET = process.env.JWT_SECRET || 'studyguru-secret-key';
      
      // Connect to MongoDB
      const conn = await connectToDatabase();
      if (!conn) {
        return res.status(500).json({ 
          error: true,
          message: 'Database connection failed' 
        });
      }
      
      // Find user
      const user = await ActiveUser.findOne({ email });
      if (!user) {
        return res.status(401).json({ 
          error: true,
          message: 'Invalid credentials' 
        });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          error: true,
          message: 'Invalid credentials' 
        });
      }
      
      // Create token
      const payload = {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName
      };
      
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      
      // Return success response
      return res.status(200).json({
        token,
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          profileImage: user.profileImage || '',
          savedArticles: user.savedArticles || [],
          savedScholarships: user.savedScholarships || []
        }
      });
    } catch (error: any) {
      console.error('Direct login error:', error);
      return res.status(500).json({ 
        error: true,
        message: error.message || 'Server error during login' 
      });
    }
  });
  
  // Get current user endpoint
  app.get('/direct-api/auth/user', async (req: Request, res: Response) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: true,
          message: 'Authorization token is required' 
        });
      }
      
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ 
          error: true,
          message: 'No token provided' 
        });
      }
      
      // Import modules
      const { default: jwt } = await import('jsonwebtoken');
      const { default: ActiveUser } = await import('./models/ActiveUser');
      const JWT_SECRET = process.env.JWT_SECRET || 'studyguru-secret-key';
      
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      if (!decoded || !decoded.id) {
        return res.status(401).json({ 
          error: true,
          message: 'Invalid token' 
        });
      }
      
      // Find user
      const user = await ActiveUser.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ 
          error: true,
          message: 'User not found' 
        });
      }
      
      // Return user data
      return res.status(200).json({
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage || '',
        savedArticles: user.savedArticles || [],
        savedScholarships: user.savedScholarships || [],
        isAdmin: user.isAdmin || false
      });
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: true,
          message: 'Invalid or expired token' 
        });
      }
      
      console.error('User data error:', error);
      return res.status(500).json({ 
        error: true,
        message: error.message || 'Server error while fetching user data' 
      });
    }
  });

  // Set up the Vite middleware after API routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);
    
    // Test MongoDB connection
    const conn = await connectToDatabase();
    if (conn) {
      log('Connected to MongoDB successfully', 'mongodb');
      
      // Migration is now disabled on startup to prevent duplicate data
      // Only run migration when explicitly requested via API
    } else {
      log('Failed to connect to MongoDB, falling back to in-memory storage', 'mongodb');
    }
  });
})();
