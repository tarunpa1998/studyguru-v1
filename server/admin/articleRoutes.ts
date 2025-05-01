import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { adminAuth } from '../middleware/auth';
import slugify from 'slugify';

const router = Router();

/**
 * @route   GET /api/admin/articles
 * @desc    Get all articles with pagination
 * @access  Private (Admin)
 */
router.get('/articles', adminAuth, async (req: Request, res: Response) => {
  try {
    const articles = await storage.getAllArticles();
    res.json(articles);
  } catch (error) {
    console.error('Error getting articles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/articles/:id
 * @desc    Get article by ID
 * @access  Private (Admin)
 */
router.get('/articles/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const article = await storage.getArticleBySlug(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Error getting article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/articles
 * @desc    Create a new article
 * @access  Private (Admin)
 */
router.post('/articles', adminAuth, async (req: Request, res: Response) => {
  try {
    const articleData = req.body;
    
    // Generate slug if not provided
    if (!articleData.slug) {
      articleData.slug = slugify(articleData.title, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!articleData.title || !articleData.content || !articleData.summary) {
      return res.status(400).json({ error: 'Title, content, and summary are required' });
    }
    
    const newArticle = await storage.createArticle(articleData);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/articles/:id
 * @desc    Update an article
 * @access  Private (Admin)
 */
router.put('/articles/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const articleData = req.body;
    
    // Generate slug if not provided
    if (!articleData.slug) {
      articleData.slug = slugify(articleData.title, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!articleData.title || !articleData.content || !articleData.summary) {
      return res.status(400).json({ error: 'Title, content, and summary are required' });
    }
    
    // Check if article exists
    const existingArticle = await storage.getArticleBySlug(req.params.id);
    
    if (!existingArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Update article (implement in storage.ts)
    // For now, just return the data
    res.json({ ...existingArticle, ...articleData });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/admin/articles/:id
 * @desc    Delete an article
 * @access  Private (Admin)
 */
router.delete('/articles/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    // Check if article exists
    const existingArticle = await storage.getArticleBySlug(req.params.id);
    
    if (!existingArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Delete article (implement in storage.ts)
    // For now, just return success
    res.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;