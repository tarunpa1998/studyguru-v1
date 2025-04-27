import { Router } from 'express';
import { Article, Scholarship, University, Country, News } from '../../models';
import { asyncHandler, apiLimiter, escapeRegex } from './utils';
import connectToDatabase from '../../lib/mongodb';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SearchResult:
 *       type: object
 *       properties:
 *         articles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Article'
 *         scholarships:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Scholarship'
 *         universities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/University'
 *         countries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Country'
 *         news:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/News'
 */

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: API for searching across all content
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search across all content
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResult'
 *       400:
 *         description: Search query is required
 *       500:
 *         description: Server error
 */
router.get('/', apiLimiter, asyncHandler(async (req, res) => {
  await connectToDatabase();
  const { query } = req.query;
  
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  // Create regex pattern for search
  const regex = new RegExp(escapeRegex(query as string), 'i');
  
  // Search in all collections
  const [articles, scholarships, universities, countries, newsItems] = await Promise.all([
    Article.find({
      $or: [
        { title: regex },
        { content: regex },
        { summary: regex },
        { category: regex }
      ]
    }).limit(10),
    
    Scholarship.find({
      $or: [
        { title: regex },
        { description: regex },
        { country: regex },
        { tags: regex }
      ]
    }).limit(10),
    
    University.find({
      $or: [
        { name: regex },
        { description: regex },
        { country: regex },
        { features: regex }
      ]
    }).limit(10),
    
    Country.find({
      $or: [
        { name: regex },
        { description: regex }
      ]
    }).limit(10),
    
    News.find({
      $or: [
        { title: regex },
        { content: regex },
        { summary: regex },
        { category: regex }
      ]
    }).limit(10)
  ]);
  
  res.json({
    articles,
    scholarships,
    universities,
    countries,
    news: newsItems
  });
}));

export default router;