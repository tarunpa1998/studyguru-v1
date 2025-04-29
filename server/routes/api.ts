import { Router, Request, Response, NextFunction } from 'express';

// Extend Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
import { storage } from '../storage';
import { mongoStorage } from '../mongoStorage';
import { log } from '../vite';
import { populateDatabase } from '../scripts/populateDb';
import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../lib/mongodb';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'studyguru-secret-key';

// Middleware to verify JWT tokens
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

/**
 * @swagger
 * /scholarships:
 *   get:
 *     summary: Get all scholarships
 *     tags: [Scholarships]
 *     responses:
 *       200:
 *         description: List of all scholarships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Scholarship'
 */
router.get('/scholarships', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const scholarships = await mongoStorage.getAllScholarships();
      return res.json(scholarships);
    } else {
      // Fallback to memory storage
      const scholarships = await storage.getAllScholarships();
      return res.json(scholarships);
    }
  } catch (error) {
    log(`Error fetching scholarships: ${error}`, 'api');
    // Fallback to memory storage on error
    const scholarships = await storage.getAllScholarships();
    return res.json(scholarships);
  }
});

/**
 * @swagger
 * /scholarships/{slug}:
 *   get:
 *     summary: Get scholarship by slug
 *     tags: [Scholarships]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Slug of the scholarship
 *     responses:
 *       200:
 *         description: Scholarship details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scholarship'
 *       404:
 *         description: Scholarship not found
 */
router.get('/scholarships/:slug', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const scholarship = await mongoStorage.getScholarshipBySlug(req.params.slug);
      if (!scholarship) {
        return res.status(404).json({ error: 'Scholarship not found' });
      }
      return res.json(scholarship);
    } else {
      // Fallback to memory storage
      const scholarship = await storage.getScholarshipBySlug(req.params.slug);
      if (!scholarship) {
        return res.status(404).json({ error: 'Scholarship not found' });
      }
      return res.json(scholarship);
    }
  } catch (error) {
    log(`Error fetching scholarship: ${error}`, 'api');
    // Fallback to memory storage on error
    const scholarship = await storage.getScholarshipBySlug(req.params.slug);
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    return res.json(scholarship);
  }
});

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: List of all articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
router.get('/articles', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const articles = await mongoStorage.getAllArticles();
      return res.json(articles);
    } else {
      // Fallback to memory storage
      const articles = await storage.getAllArticles();
      return res.json(articles);
    }
  } catch (error) {
    log(`Error fetching articles: ${error}`, 'api');
    // Fallback to memory storage on error
    const articles = await storage.getAllArticles();
    return res.json(articles);
  }
});

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
 *         description: Slug of the article
 *     responses:
 *       200:
 *         description: Article details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 */
router.get('/articles/:slug', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const article = await mongoStorage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      return res.json(article);
    } else {
      // Fallback to memory storage
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      return res.json(article);
    }
  } catch (error) {
    log(`Error fetching article: ${error}`, 'api');
    // Fallback to memory storage on error
    const article = await storage.getArticleBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    return res.json(article);
  }
});

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Get all countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: List of all countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 */
router.get('/countries', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const countries = await mongoStorage.getAllCountries();
      return res.json(countries);
    } else {
      // Fallback to memory storage
      const countries = await storage.getAllCountries();
      return res.json(countries);
    }
  } catch (error) {
    log(`Error fetching countries: ${error}`, 'api');
    // Fallback to memory storage on error
    const countries = await storage.getAllCountries();
    return res.json(countries);
  }
});

/**
 * @swagger
 * /countries/{slug}:
 *   get:
 *     summary: Get country by slug
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Slug of the country
 *     responses:
 *       200:
 *         description: Country details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       404:
 *         description: Country not found
 */
router.get('/countries/:slug', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const country = await mongoStorage.getCountryBySlug(req.params.slug);
      if (!country) {
        return res.status(404).json({ error: 'Country not found' });
      }
      return res.json(country);
    } else {
      // Fallback to memory storage
      const country = await storage.getCountryBySlug(req.params.slug);
      if (!country) {
        return res.status(404).json({ error: 'Country not found' });
      }
      return res.json(country);
    }
  } catch (error) {
    log(`Error fetching country: ${error}`, 'api');
    // Fallback to memory storage on error
    const country = await storage.getCountryBySlug(req.params.slug);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    return res.json(country);
  }
});

/**
 * @swagger
 * /universities:
 *   get:
 *     summary: Get all universities
 *     tags: [Universities]
 *     responses:
 *       200:
 *         description: List of all universities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/University'
 */
router.get('/universities', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const universities = await mongoStorage.getAllUniversities();
      return res.json(universities);
    } else {
      // Fallback to memory storage
      const universities = await storage.getAllUniversities();
      return res.json(universities);
    }
  } catch (error) {
    log(`Error fetching universities: ${error}`, 'api');
    // Fallback to memory storage on error
    const universities = await storage.getAllUniversities();
    return res.json(universities);
  }
});

/**
 * @swagger
 * /universities/{slug}:
 *   get:
 *     summary: Get university by slug
 *     tags: [Universities]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Slug of the university
 *     responses:
 *       200:
 *         description: University details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/University'
 *       404:
 *         description: University not found
 */
router.get('/universities/:slug', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const university = await mongoStorage.getUniversityBySlug(req.params.slug);
      if (!university) {
        return res.status(404).json({ error: 'University not found' });
      }
      return res.json(university);
    } else {
      // Fallback to memory storage
      const university = await storage.getUniversityBySlug(req.params.slug);
      if (!university) {
        return res.status(404).json({ error: 'University not found' });
      }
      return res.json(university);
    }
  } catch (error) {
    log(`Error fetching university: ${error}`, 'api');
    // Fallback to memory storage on error
    const university = await storage.getUniversityBySlug(req.params.slug);
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }
    return res.json(university);
  }
});

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get all news
 *     tags: [News]
 *     responses:
 *       200:
 *         description: List of all news
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 */
router.get('/news', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const news = await mongoStorage.getAllNews();
      return res.json(news);
    } else {
      // Fallback to memory storage
      const news = await storage.getAllNews();
      return res.json(news);
    }
  } catch (error) {
    log(`Error fetching news: ${error}`, 'api');
    // Fallback to memory storage on error
    const news = await storage.getAllNews();
    return res.json(news);
  }
});

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
 *         description: Slug of the news
 *     responses:
 *       200:
 *         description: News details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News not found
 */
router.get('/news/:slug', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const newsItem = await mongoStorage.getNewsBySlug(req.params.slug);
      if (!newsItem) {
        return res.status(404).json({ error: 'News not found' });
      }
      return res.json(newsItem);
    } else {
      // Fallback to memory storage
      const newsItem = await storage.getNewsBySlug(req.params.slug);
      if (!newsItem) {
        return res.status(404).json({ error: 'News not found' });
      }
      return res.json(newsItem);
    }
  } catch (error) {
    log(`Error fetching news: ${error}`, 'api');
    // Fallback to memory storage on error
    const newsItem = await storage.getNewsBySlug(req.params.slug);
    if (!newsItem) {
      return res.status(404).json({ error: 'News not found' });
    }
    return res.json(newsItem);
  }
});

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
 */
router.get('/news/featured', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const featuredNews = await mongoStorage.getFeaturedNews();
      return res.json(featuredNews);
    } else {
      // Fallback to memory storage
      const featuredNews = await storage.getFeaturedNews();
      return res.json(featuredNews);
    }
  } catch (error) {
    log(`Error fetching featured news: ${error}`, 'api');
    // Fallback to memory storage on error
    const featuredNews = await storage.getFeaturedNews();
    return res.json(featuredNews);
  }
});

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get navigation menu
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Navigation menu structure
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 */
router.get('/menu', async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const menu = await mongoStorage.getMenu();
      return res.json(menu);
    } else {
      // Fallback to memory storage
      const menu = await storage.getMenu();
      return res.json(menu);
    }
  } catch (error) {
    log(`Error fetching menu: ${error}`, 'api');
    // Fallback to memory storage on error
    const menu = await storage.getMenu();
    return res.json(menu);
  }
});

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
 *         description: Search query string
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scholarships:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Scholarship'
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 countries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Country'
 *                 universities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/University'
 *                 news:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/News'
 */
router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.query as string;
  
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  try {
    const db = await connectToDatabase();
    if (db) {
      const results = await mongoStorage.search(query);
      return res.json(results);
    } else {
      // Fallback to memory storage
      const results = await storage.search(query);
      return res.json(results);
    }
  } catch (error) {
    log(`Error performing search: ${error}`, 'api');
    // Fallback to memory storage on error
    const results = await storage.search(query);
    return res.json(results);
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const db = await connectToDatabase();
    let user: User | undefined;
    
    if (db) {
      user = await mongoStorage.getUserByUsername(username);
    } else {
      user = await storage.getUserByUsername(username);
    }
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    
    // Create and assign token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    log(`Login error: ${error}`, 'api');
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

/**
 * @swagger
 * /seed:
 *   post:
 *     summary: Seed database with initial data (protected)
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Database seeded successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Error seeding database
 */
router.post('/seed', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await populateDatabase();
    if (result.success) {
      res.json({ message: 'Database seeded successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    log(`Error seeding database: ${error}`, 'api');
    res.status(500).json({ error: 'Error seeding database' });
  }
});

/**
 * @swagger
 * /dev/seed:
 *   post:
 *     summary: Seed database with initial data (development only)
 *     tags: [Development]
 *     responses:
 *       200:
 *         description: Database seeded successfully
 *       500:
 *         description: Error seeding database
 */
router.post('/dev/seed', async (req: Request, res: Response) => {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'This endpoint is only available in development mode' });
  }
  
  try {
    const result = await populateDatabase();
    if (result.success) {
      res.json({ message: 'Database seeded successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    log(`Error seeding database: ${error}`, 'api');
    res.status(500).json({ error: 'Error seeding database' });
  }
});

export default router;