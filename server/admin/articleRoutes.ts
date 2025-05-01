import { Router, Request, Response } from 'express';
import { adminAuth } from '../middleware/auth';
import Article from '../models/Article';
import slugify from 'slugify';

const router = Router();

/**
 * @route   GET /api/admin/articles
 * @desc    Get all articles with pagination
 * @access  Private (Admin)
 */
router.get('/articles', adminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Article.countDocuments();
    const articles = await Article.find()
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      articles,
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
 * @route   GET /api/admin/articles/:id
 * @desc    Get article by ID
 * @access  Private (Admin)
 */
router.get('/articles/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    console.error(err);
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
    const {
      title,
      content,
      summary,
      publishDate,
      author,
      authorTitle,
      authorImage,
      image,
      category,
      isFeatured,
      relatedArticles,
      seo,
      views,
      readingTime,
      helpful,
      tableOfContents,
      faqs
    } = req.body;

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug already exists
    const existingArticle = await Article.findOne({ slug });
    if (existingArticle) {
      return res.status(400).json({ error: 'An article with this title already exists' });
    }

    const newArticle = new Article({
      title,
      content,
      summary,
      slug,
      publishDate: publishDate || new Date().toISOString(),
      author,
      authorTitle,
      authorImage,
      image,
      category,
      isFeatured: isFeatured || false,
      relatedArticles: relatedArticles || [],
      seo: seo || {
        metaTitle: title,
        metaDescription: summary,
        keywords: []
      },
      views: views || 0,
      readingTime: readingTime || '5 min read',
      helpful: helpful || {
        yes: 0,
        no: 0
      },
      tableOfContents: tableOfContents || [],
      faqs: faqs || []
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    console.error(err);
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
    const {
      title,
      content,
      summary,
      publishDate,
      author,
      authorTitle,
      authorImage,
      image,
      category,
      isFeatured,
      relatedArticles,
      seo,
      readingTime,
      tableOfContents,
      faqs
    } = req.body;

    // Find article
    let article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // If title changed, update slug
    let slug = article.slug;
    if (title !== article.title) {
      slug = slugify(title, { lower: true, strict: true });
      
      // Check if new slug already exists
      const existingArticle = await Article.findOne({ 
        slug,
        _id: { $ne: req.params.id }
      });
      
      if (existingArticle) {
        return res.status(400).json({ error: 'An article with this title already exists' });
      }
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        summary,
        slug,
        publishDate,
        author,
        authorTitle,
        authorImage,
        image,
        category,
        isFeatured,
        relatedArticles,
        seo,
        readingTime,
        tableOfContents,
        faqs
      },
      { new: true }
    );

    res.json(updatedArticle);
  } catch (err) {
    console.error(err);
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
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    await article.deleteOne();
    res.json({ message: 'Article removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;