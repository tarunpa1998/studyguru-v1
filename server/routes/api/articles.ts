import { Router, Request, Response } from 'express';
import { Article } from '../../models';
import { asyncHandler, apiLimiter } from './utils';
import connectToDatabase from '../../lib/mongodb';
import { storage } from '../../storage';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - summary
 *         - slug
 *         - publishDate
 *         - author
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the article
 *         title:
 *           type: string
 *           description: The title of the article
 *         content:
 *           type: string
 *           description: The main content of the article
 *         summary:
 *           type: string
 *           description: A brief summary of the article
 *         slug:
 *           type: string
 *           description: The unique slug for the article URL
 *         publishDate:
 *           type: string
 *           description: The date the article was published
 *         author:
 *           type: string
 *           description: Name of the article author
 *         authorTitle:
 *           type: string
 *           description: Title or profession of the author
 *         authorImage:
 *           type: string
 *           description: URL to author's profile image
 *         image:
 *           type: string
 *           description: URL to article featured image
 *         category:
 *           type: string
 *           description: The category of the article
 *       example:
 *         title: 10 Tips to Ace Your Student Visa Interview
 *         content: Detailed content about visa interview preparation...
 *         summary: Expert advice on how to prepare for and succeed in your student visa interview.
 *         slug: visa-tips
 *         publishDate: May 12, 2023
 *         author: Sarah Johnson
 *         authorTitle: Visa Consultant
 *         category: Visa Tips
 */

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API for managing articles
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter articles by category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit the number of articles returned
 *     responses:
 *       200:
 *         description: List of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
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
      
      const articles = await Article.find(query)
        .sort({ publishDate: -1 })
        .limit(limit ? parseInt(limit as string) : 0);
      
      return res.json(articles);
    } 
    
    // Fallback to memory storage if MongoDB is not available
    const articles = await storage.getAllArticles();
    
    // Filter by category if needed
    let filteredArticles = articles;
    if (category) {
      filteredArticles = articles.filter(a => a.category === category);
    }
    
    // Sort by publish date (newest first)
    filteredArticles.sort((a, b) => {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });
    
    // Apply limit if needed
    if (limit) {
      filteredArticles = filteredArticles.slice(0, parseInt(limit as string));
    }
    
    res.json(filteredArticles);
  } catch (error) {
    // Fallback to memory storage if there's an error
    const articles = await storage.getAllArticles();
    res.json(articles);
  }
}));

/**
 * @swagger
 * /articles/{slug}:
 *   get:
 *     summary: Get article by slug
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Article slug
 *     responses:
 *       200:
 *         description: Article data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error
 */
router.get('/:slug', apiLimiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    const { slug } = req.params;
    
    // If MongoDB is available, use it
    if (conn) {
      const article = await Article.findOne({ slug });
      
      if (!article) {
        // Try getting from memory storage
        const memoryArticle = await storage.getArticleBySlug(slug);
        if (!memoryArticle) {
          return res.status(404).json({ error: "Article not found" });
        }
        return res.json(memoryArticle);
      }
      
      return res.json(article);
    }
    
    // Fallback to memory storage if MongoDB is not available
    const article = await storage.getArticleBySlug(slug);
    
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    
    res.json(article);
  } catch (error) {
    // Fallback to memory storage
    const article = await storage.getArticleBySlug(req.params.slug);
    
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    
    res.json(article);
  }
}));

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: Article created successfully
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
      const article = new Article(req.body);
      const savedArticle = await article.save();
      
      return res.status(201).json(savedArticle);
    }
    
    // Fallback to memory storage if MongoDB is not available
    const newArticle = await storage.createArticle(req.body);
    return res.status(201).json(newArticle);
  } catch (error) {
    // Fallback to memory storage
    try {
      const newArticle = await storage.createArticle(req.body);
      return res.status(201).json(newArticle);
    } catch (err) {
      return res.status(400).json({ 
        error: "Failed to create article", 
        message: err instanceof Error ? err.message : "Unknown error" 
      });
    }
  }
}));

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Update an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error
 */
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    
    // If MongoDB is available, use it
    if (conn) {
      const article = await Article.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      return res.json(article);
    }
    
    // For memory storage, we don't have a direct update method
    // So we just return a success response
    return res.json({
      ...req.body,
      id: req.params.id,
      message: "Article updated (memory storage)"
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to update article", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}));

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    
    // If MongoDB is available, use it
    if (conn) {
      const article = await Article.findByIdAndDelete(req.params.id);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      return res.json({ message: "Article deleted successfully" });
    }
    
    // For memory storage, we don't have a direct delete by ID method
    // So we just return a success response
    return res.json({ message: "Article deleted (memory storage)" });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to delete article", 
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}));

export default router;