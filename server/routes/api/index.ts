import { Router } from 'express';
import articlesRoutes from './articles';
import scholarshipsRoutes from './scholarships';
import countriesRoutes from './countries';
import universitiesRoutes from './universities';
import newsRoutes from './news';
import userRoutes from './users';
import searchRoutes from './search';
import { apiLimiter } from './utils';

const router = Router();

// Apply rate limiter to all API routes
router.use(apiLimiter);

// Register all routes
router.use('/articles', articlesRoutes);
router.use('/scholarships', scholarshipsRoutes);
router.use('/countries', countriesRoutes);
router.use('/universities', universitiesRoutes);
router.use('/news', newsRoutes);
router.use('/users', userRoutes);
router.use('/search', searchRoutes);

export default router;