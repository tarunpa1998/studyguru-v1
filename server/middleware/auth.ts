import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface UserPayload {
  id: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  auth(req, res, () => {
    // If we reached here, the user is authenticated
    // Additional admin role check can be added here
    next();
  });
};