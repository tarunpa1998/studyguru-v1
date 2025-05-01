import { Express } from 'express';
import authRoutes from './authRoutes';
import articleRoutes from './articleRoutes';
import newsRoutes from './newsRoutes';
import scholarshipRoutes from './scholarshipRoutes';
import countryRoutes from './countryRoutes';
import universityRoutes from './universityRoutes';

/**
 * Register all admin routes
 * @param app Express application
 */
export function registerAdminRoutes(app: Express) {
  // Auth routes
  app.use('/api/admin/auth', authRoutes);
  
  // Content routes
  app.use('/api/admin', articleRoutes);
  app.use('/api/admin', newsRoutes);
  app.use('/api/admin', scholarshipRoutes);
  app.use('/api/admin', countryRoutes);
  app.use('/api/admin', universityRoutes);

  console.log('[admin] Admin routes registered');
}