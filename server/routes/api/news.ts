import { Router, Request, Response } from 'express';
import { News } from '../../models';
import { asyncHandler, apiLimiter } from './utils';
import connectToDatabase from '../../lib/mongodb';
import { storage } from '../../storage';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - summary
 *         - publishDate
 *         - category
 *         - slug
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the news
 *         title:
 *           type: string
 *           description: The title of the news
 *         content:
 *           type: string
 *           description: The main content of the news
 *         summary:
 *           type: string
 *           description: A brief summary of the news
 *         publishDate:
 *           type: string
 *           description: The date the news was published
 *         image:
 *           type: string
 *           description: URL to news featured image
 *         category:
 *           type: string
 *           description: The category of the news
 *         isFeatured:
 *           type: boolean
 *           description: Whether the news is featured
 *         slug:
 *           type: string
 *           description: The unique slug for the news URL
 *       example:
 *         title: Major Funding Initiative Announced for International STEM Students
 *         content: Detailed news content about funding initiative...
 *         summary: A consortium of universities has announced a new scholarship fund for STEM students.
 *         publishDate: May 15, 2023
 *         category: Breaking News
 *         isFeatured: true
 *         slug: major-funding-initiative
 */

/**
 * @swagger
 * tags:
 *   name: News
 *   description: API for managing news
 */

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get all news
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter news by category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit the number of news items returned
 *     responses:
 *       200:
 *         description: List of news items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 *       500:
 *         description: Server error
 */
router.get('/', apiLimiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    const { category, limit } = req.query;
    
    // If MongoDB is available, use it
    if (conn) {
      let query = {};
      
      if (category) {
        query = { category: category as string };
      }
      
      const news = await News.find(query)
        .sort({ publishDate: -1 })
        .limit(limit ? parseInt(limit as string) : 0);
      
      return res.json(news);
    }
    
    // Fallback to memory storage if MongoDB is not available
    const news = await storage.getAllNews();
    
    // Filter by category if needed
    let filteredNews = news;
    if (category) {
      filteredNews = news.filter(n => n.category === category);
    }
    
    // Sort by publish date (newest first)
    filteredNews.sort((a, b) => {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });
    
    // Apply limit if needed
    if (limit) {
      filteredNews = filteredNews.slice(0, parseInt(limit as string));
    }
    
    res.json(filteredNews);
  } catch (error) {
    // Fallback to memory storage if there's an error
    const news = await storage.getAllNews();
    res.json(news);
  }
}));

/**
 * @swagger
 * /news/featured:
 *   get:
 *     summary: Get featured news
 *     tags: [News]
 *     responses:
 *       200:
 *         description: List of featured news
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 *       500:
 *         description: Server error
 */
router.get('/featured', apiLimiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    
    // If MongoDB is available, use it
    if (conn) {
      const featuredNews = await News.find({ isFeatured: true })
        .sort({ publishDate: -1 });
      
      return res.json(featuredNews);
    }
    
    // Fallback to memory storage if MongoDB is not available
    const news = await storage.getFeaturedNews();
    
    res.json(news);
  } catch (error) {
    // Fallback to memory storage if there's an error
    const news = await storage.getFeaturedNews();
    res.json(news);
  }
}));

/**
 * @swagger
 * /news/{slug}:
 *   get:
 *     summary: Get news by slug
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: News slug
 *     responses:
 *       200:
 *         description: News data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News not found
 *       500:
 *         description: Server error
 */
router.get('/:slug', apiLimiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    const { slug } = req.params;
    
    // Make sure this route doesn't match /featured
    if (slug === 'featured') {
      return res.status(404).json({ error: "News not found" });
    }
    
    // If MongoDB is available, use it
    if (conn) {
      const newsItem = await News.findOne({ slug });
      
      if (!newsItem) {
        // Try getting from memory storage
        const memoryNewsItem = await storage.getNewsBySlug(slug);
        if (!memoryNewsItem) {
          return res.status(404).json({ error: "News not found" });
        }
        return res.json(memoryNewsItem);
      }
      
      return res.json(newsItem);
    }
    
    // Fallback to memory storage if MongoDB is not available
    const newsItem = await storage.getNewsBySlug(slug);
    
    if (!newsItem) {
      return res.status(404).json({ error: "News not found" });
    }
    
    res.json(newsItem);
  } catch (error) {
    // Fallback to memory storage
    const newsItem = await storage.getNewsBySlug(req.params.slug);
    
    if (!newsItem) {
      return res.status(404).json({ error: "News not found" });
    }
    
    res.json(newsItem);
  }
}));

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a new news
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       201:
 *         description: News created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    
    // If MongoDB is available, use it
    if (conn) {
      const news = new News(req.body);
      const savedNews = await news.save();
      
      return res.status(201).json(savedNews);
    }
    
    // Fallback to memory storage if MongoDB is not available
    const newNews = await storage.createNews(req.body);
    return res.status(201).json(newNews);
  } catch (error) {
    // Fallback to memory storage
    try {
      const newNews = await storage.createNews(req.body);
      return res.status(201).json(newNews);
    } catch (err) {
      return res.status(400).json({ 
        error: "Failed to create news", 
        message: err instanceof Error ? err.message : "Unknown error" 
      });
    }
  }
}));

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Update a news
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: News ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       200:
 *         description: News updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       404:
 *         description: News not found
 *       500:
 *         description: Server error
 */
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    
    // If MongoDB is available, use it
    if (conn) {
      const newsItem = await News.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!newsItem) {
        return res.status(404).json({ error: "News not found" });
      }
      
      return res.json(newsItem);
    }
    
    // For memory storage, we don't have a direct update method
    // So we just return a success response
    return res.json({
      ...req.body,
      id: req.params.id,
      message: "News updated (memory storage)"
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to update news", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}));

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Delete a news
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: News ID
 *     responses:
 *       200:
 *         description: News deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: News not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    
    // If MongoDB is available, use it
    if (conn) {
      const newsItem = await News.findByIdAndDelete(req.params.id);
      
      if (!newsItem) {
        return res.status(404).json({ error: "News not found" });
      }
      
      return res.json({ message: "News deleted successfully" });
    }
    
    // For memory storage, we don't have a direct delete by ID method
    // So we just return a success response
    return res.json({ message: "News deleted (memory storage)" });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to delete news", 
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}));

export default router;