import { Router, Request, Response } from 'express';
import { mongoStorage } from '../mongoStorage';
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
    const news = await mongoStorage.getAllNews();
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
    // Get news by ID instead of slug
    const newsItem = await mongoStorage.getNewsById(req.params.id);
    
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
    
    // Set default values for missing fields
    if (!newsData.image) {
      newsData.image = null;
    }
    
    if (!newsData.publishDate) {
      newsData.publishDate = new Date().toISOString().split('T')[0];
    }
    
    if (newsData.isFeatured === undefined) {
      newsData.isFeatured = false;
    }
    
    if (!newsData.seo) {
      newsData.seo = {
        metaTitle: newsData.title,
        metaDescription: newsData.summary.substring(0, 160),
        keywords: []
      };
    }
    
    const newNews = await mongoStorage.createNews(newsData);
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
    const existingNews = await mongoStorage.getNewsById(req.params.id);
    
    if (!existingNews) {
      return res.status(404).json({ error: 'News item not found' });
    }
    
    // Update the news in MongoDB
    const updatedNews = await mongoStorage.updateNews(req.params.id, newsData);
    
    if (!updatedNews) {
      return res.status(500).json({ error: 'Failed to update news item' });
    }
    
    res.json(updatedNews);
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
    const existingNews = await mongoStorage.getNewsById(req.params.id);
    
    if (!existingNews) {
      return res.status(404).json({ error: 'News item not found' });
    }
    
    // Delete the news from MongoDB
    const success = await mongoStorage.deleteNews(req.params.id);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to delete news item' });
    }
    
    res.json({ success: true, message: 'News item deleted successfully' });
  } catch (error) {
    console.error('Error deleting news item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;