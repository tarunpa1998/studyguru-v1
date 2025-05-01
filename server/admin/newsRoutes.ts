import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { adminAuth } from '../middleware/auth';
import slugify from 'slugify';

const router = Router();

/**
 * @route   GET /api/admin/news
 * @desc    Get all news with pagination
 * @access  Private (Admin)
 */
router.get('/news', adminAuth, async (req: Request, res: Response) => {
  try {
    const news = await storage.getAllNews();
    res.json(news);
  } catch (error) {
    console.error('Error getting news:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/news/:id
 * @desc    Get news by ID
 * @access  Private (Admin)
 */
router.get('/news/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const newsItem = await storage.getNewsBySlug(req.params.id);
    
    if (!newsItem) {
      return res.status(404).json({ error: 'News item not found' });
    }
    
    res.json(newsItem);
  } catch (error) {
    console.error('Error getting news item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/news
 * @desc    Create a new news item
 * @access  Private (Admin)
 */
router.post('/news', adminAuth, async (req: Request, res: Response) => {
  try {
    const newsData = req.body;
    
    // Generate slug if not provided
    if (!newsData.slug) {
      newsData.slug = slugify(newsData.title, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!newsData.title || !newsData.content || !newsData.summary) {
      return res.status(400).json({ error: 'Title, content, and summary are required' });
    }
    
    const newNews = await storage.createNews(newsData);
    res.status(201).json(newNews);
  } catch (error) {
    console.error('Error creating news item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/news/:id
 * @desc    Update a news item
 * @access  Private (Admin)
 */
router.put('/news/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const newsData = req.body;
    
    // Generate slug if not provided
    if (!newsData.slug) {
      newsData.slug = slugify(newsData.title, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!newsData.title || !newsData.content || !newsData.summary) {
      return res.status(400).json({ error: 'Title, content, and summary are required' });
    }
    
    // Check if news item exists
    const existingNews = await storage.getNewsBySlug(req.params.id);
    
    if (!existingNews) {
      return res.status(404).json({ error: 'News item not found' });
    }
    
    // Update news item (implement in storage.ts)
    // For now, just return the data
    res.json({ ...existingNews, ...newsData });
  } catch (error) {
    console.error('Error updating news item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/admin/news/:id
 * @desc    Delete a news item
 * @access  Private (Admin)
 */
router.delete('/news/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    // Check if news item exists
    const existingNews = await storage.getNewsBySlug(req.params.id);
    
    if (!existingNews) {
      return res.status(404).json({ error: 'News item not found' });
    }
    
    // Delete news item (implement in storage.ts)
    // For now, just return success
    res.json({ success: true, message: 'News item deleted' });
  } catch (error) {
    console.error('Error deleting news item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;