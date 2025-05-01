import { Router } from 'express';
import authRoutes from './authRoutes';
import articleRoutes from './articleRoutes';
import scholarshipRoutes from './scholarshipRoutes';
import countryRoutes from './countryRoutes';
import universityRoutes from './universityRoutes';
import newsRoutes from './newsRoutes';

const router = Router();

// Mount all admin routes
router.use('/auth', authRoutes);
router.use('/', articleRoutes);
router.use('/', scholarshipRoutes);
router.use('/', countryRoutes);
router.use('/', universityRoutes);
router.use('/', newsRoutes);

export default router;