import { Router, Request, Response, NextFunction } from 'express';
import articlesRoutes from './articles';
import scholarshipsRoutes from './scholarships';
import countriesRoutes from './countries';
import universitiesRoutes from './universities';
import newsRoutes from './news';
import userRoutes from './users';
import searchRoutes from './search';
import { apiLimiter } from './utils';
import authRoutes from '../../routes/auth';
import userProfileRoutes from '../../routes/user';
import likesRoutes from '../../routes/likes';
import commentsRoutes from '../../routes/comments';
import { log } from '../../vite';

const router = Router();

// Apply rate limiter to all API routes
router.use(apiLimiter);

// Middleware to ensure JSON responses for all API routes
router.use((req: Request, res: Response, next: NextFunction) => {
  // Set content type for all API responses to application/json
  res.setHeader('Content-Type', 'application/json');
  
  // Capture the original res.send and res.end to ensure they always send JSON
  const originalSend = res.send;
  const originalEnd = res.end;
  
  res.send = function(body: any): any {
    // If the body is not a string or is not already JSON formatted, convert it
    if (typeof body !== 'string' || !body.startsWith('{')) {
      try {
        if (typeof body === 'object') {
          body = JSON.stringify(body);
        } else {
          // If it's not an object and not a JSON string, wrap it
          body = JSON.stringify({ data: body });
        }
      } catch (e) {
        console.error('Error stringifying response:', e);
        body = JSON.stringify({ error: 'Internal server error' });
      }
    }
    
    // Ensure content type is application/json
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
    }
    
    return originalSend.call(this, body);
  };
  
  next();
});

// Register all routes
router.use('/articles', articlesRoutes);
router.use('/scholarships', scholarshipsRoutes);
router.use('/countries', countriesRoutes);
router.use('/universities', universitiesRoutes);
router.use('/news', newsRoutes);
router.use('/users', userRoutes);
router.use('/search', searchRoutes);

// Register new authentication routes
router.use('/auth', authRoutes);
router.use('/user', userProfileRoutes);
router.use('/likes', likesRoutes);
router.use('/comments', commentsRoutes);

// Catch errors and ensure JSON responses
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  log(`API error: ${err.message}`, 'api-error');
  
  // Ensure we always send a JSON response even when there's an error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

export default router;