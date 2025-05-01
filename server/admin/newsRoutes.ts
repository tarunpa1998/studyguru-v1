import { Router, Request, Response } from 'express';
import { adminAuth } from '../middleware/auth';
import News from '../models/News';
import slugify from 'slugify';

const router = Router();

/**
 * @route   GET /api/admin/news
 * @desc    Get all news with pagination
 * @access  Private (Admin)
 */
router.get('/news', adminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await News.countDocuments();
    const newsItems = await News.find()
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      news: newsItems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err);
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
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json(newsItem);
  } catch (err) {
    console.error(err);
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
    const {
      title,
      content,
      summary,
      publishDate,
      image,
      category,
      isFeatured,
      relatedArticles,
      seo,
      readingTime,
      helpful,
      tableOfContents,
      faqs
    } = req.body;

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug already exists
    const existingNews = await News.findOne({ slug });
    if (existingNews) {
      return res.status(400).json({ error: 'A news item with this title already exists' });
    }

    const newNewsItem = new News({
      title,
      content,
      summary,
      publishDate: publishDate || new Date().toISOString(),
      image,
      category,
      isFeatured: isFeatured || false,
      slug,
      relatedArticles: relatedArticles || [],
      seo: seo || {
        metaTitle: title,
        metaDescription: summary,
        keywords: []
      },
      views: 0,
      readingTime: readingTime || '5 min read',
      helpful: helpful || {
        yes: 0,
        no: 0
      },
      tableOfContents: tableOfContents || [],
      faqs: faqs || []
    });

    const savedNewsItem = await newNewsItem.save();
    res.status(201).json(savedNewsItem);
  } catch (err) {
    console.error(err);
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
    const {
      title,
      content,
      summary,
      publishDate,
      image,
      category,
      isFeatured,
      relatedArticles,
      seo,
      readingTime,
      tableOfContents,
      faqs
    } = req.body;

    // Find news
    let newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ error: 'News not found' });
    }

    // If title changed, update slug
    let slug = newsItem.slug;
    if (title !== newsItem.title) {
      slug = slugify(title, { lower: true, strict: true });
      
      // Check if new slug already exists
      const existingNews = await News.findOne({ 
        slug,
        _id: { $ne: req.params.id }
      });
      
      if (existingNews) {
        return res.status(400).json({ error: 'A news item with this title already exists' });
      }
    }

    const updatedNewsItem = await News.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        summary,
        publishDate,
        image,
        category,
        isFeatured,
        slug,
        relatedArticles,
        seo,
        readingTime,
        tableOfContents,
        faqs
      },
      { new: true }
    );

    res.json(updatedNewsItem);
  } catch (err) {
    console.error(err);
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
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ error: 'News not found' });
    }

    await newsItem.deleteOne();
    res.json({ message: 'News item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;