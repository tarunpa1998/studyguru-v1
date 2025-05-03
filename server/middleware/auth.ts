import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the user payload structure
export interface UserPayload {
  id: string;
  email: string;
  fullName: string;
  isAdmin?: boolean;
}

// Extend the Request type specifically for our application
interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

// Authentication middleware for regular users
export function auth(req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    console.log('Auth middleware: No token provided');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
    console.log(`Auth middleware: Verifying token with secret length: ${JWT_SECRET.length}`);
    
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    console.log(`Auth middleware: Token verified for user ID: ${decoded.id}`);
    
    // Set user data in request
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error: any) {
    console.error('Auth middleware: Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid token. Please log in again.' });
  }
}

// Authentication middleware specific for admin users
export function adminAuth(req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as UserPayload;
    
    // Check if user is admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    // Set user data in request
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
}