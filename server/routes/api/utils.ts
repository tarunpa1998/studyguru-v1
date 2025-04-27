import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import { storage } from '../../storage';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Error handler middleware for async route handlers
export const asyncHandler = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error("API Error:", error);
      
      // Handle specific Mongoose errors
      if (error instanceof mongoose.Error.MongooseServerSelectionError) {
        // Connection error - most likely MongoDB is not available
        return next(new Error("Database connection error. Fallback to memory storage."));
      }
      
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };
};

// Rate limiting middleware
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later."
  }
});

// Generate JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Authenticate middleware with JWT
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded: any = jwt.verify(token, JWT_SECRET);

      // Add user ID to request
      req.userId = decoded.id;

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

// Search utilities
export const escapeRegex = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};