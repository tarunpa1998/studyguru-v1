import { Router, Request, Response } from 'express';
import connectToDatabase from '../lib/mongodb';
import Article from '../models/Article';
import Scholarship from '../models/Scholarship';
import Country from '../models/Country';
import University from '../models/University';
import News from '../models/News';
import User from '../models/User';
import Menu from '../models/Menu';
import { createSlug } from '../../client/src/lib/utils';
import jwt from 'jsonwebtoken';
import { populateDatabase } from '../scripts/populateDb';

const router = Router();

// Middleware to handle errors
const errorHandler = (fn: (req: Request, res: Response) => Promise<any>) => {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };
};

// Middleware to verify JWT token for protected routes
const authenticateToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
    req.userId = (verified as any).id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user and get a token
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
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/auth/login', errorHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // Connect to database
  await connectToDatabase();
  
  // Find user
  const user = await User.findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  
  // Compare password
  const validPassword = await user.comparePassword(password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  
  // Create token
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET || 'default_secret_key',
    { expiresIn: '24h' }
  );
  
  res.json({ token });
}));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new admin user (protected, for initial setup only)
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
 *               - setupKey
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               setupKey:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.post('/auth/register', errorHandler(async (req: Request, res: Response) => {
  const { username, password, setupKey } = req.body;
  
  // Check setup key (for initial admin creation only)
  const correctSetupKey = process.env.ADMIN_SETUP_KEY || 'admin_setup_secret';
  if (setupKey !== correctSetupKey) {
    return res.status(401).json({ error: 'Invalid setup key' });
  }
  
  // Connect to database
  await connectToDatabase();
  
  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  // Create user
  const user = new User({
    username,
    password
  });
  
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
}));

// SCHOLARSHIP ROUTES

/**
 * @swagger
 * /scholarships:
 *   get:
 *     summary: Get all scholarships
 *     tags: [Scholarships]
 *     responses:
 *       200:
 *         description: List of scholarships
 */
router.get('/scholarships', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json(scholarships);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /scholarships/{slug}:
 *   get:
 *     summary: Get a scholarship by slug
 *     tags: [Scholarships]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Scholarship details
 *       404:
 *         description: Scholarship not found
 */
router.get('/scholarships/:slug', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const scholarship = await Scholarship.findOne({ slug: req.params.slug });
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    res.json(scholarship);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /scholarships:
 *   post:
 *     summary: Create a new scholarship
 *     tags: [Scholarships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - amount
 *               - deadline
 *               - country
 *               - tags
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               amount:
 *                 type: string
 *               deadline:
 *                 type: string
 *               country:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Scholarship created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/scholarships', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const { title, description, amount, deadline, country, tags, link } = req.body;
    
    // Generate slug from title
    const slug = createSlug(title);
    
    // Create new scholarship
    const newScholarship = new Scholarship({
      title,
      description,
      amount,
      deadline,
      country,
      tags,
      slug,
      link
    });
    
    await newScholarship.save();
    res.status(201).json(newScholarship);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /scholarships/{id}:
 *   put:
 *     summary: Update a scholarship
 *     tags: [Scholarships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Scholarship updated successfully
 *       404:
 *         description: Scholarship not found
 */
router.put('/scholarships/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const updateData = req.body;
    
    // If title is changed, update slug
    if (updateData.title) {
      updateData.slug = createSlug(updateData.title);
    }
    
    const updatedScholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedScholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    
    res.json(updatedScholarship);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /scholarships/{id}:
 *   delete:
 *     summary: Delete a scholarship
 *     tags: [Scholarships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Scholarship deleted successfully
 *       404:
 *         description: Scholarship not found
 */
router.delete('/scholarships/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const deletedScholarship = await Scholarship.findByIdAndDelete(req.params.id);
    
    if (!deletedScholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    
    res.json({ message: 'Scholarship deleted successfully' });
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

// ARTICLE ROUTES

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: List of articles
 */
router.get('/articles', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /articles/{slug}:
 *   get:
 *     summary: Get an article by slug
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Article details
 *       404:
 *         description: Article not found
 */
router.get('/articles/:slug', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
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
 *             type: object
 *     responses:
 *       201:
 *         description: Article created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/articles', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const { title, content, summary, publishDate, author, authorTitle, authorImage, image, category } = req.body;
    
    // Generate slug from title
    const slug = createSlug(title);
    
    // Create new article
    const newArticle = new Article({
      title,
      content,
      summary,
      slug,
      publishDate,
      author,
      authorTitle,
      authorImage,
      image,
      category
    });
    
    await newArticle.save();
    res.status(201).json(newArticle);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       404:
 *         description: Article not found
 */
router.put('/articles/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const updateData = req.body;
    
    // If title is changed, update slug
    if (updateData.title) {
      updateData.slug = createSlug(updateData.title);
    }
    
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(updatedArticle);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
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
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       404:
 *         description: Article not found
 */
router.delete('/articles/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    
    if (!deletedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({ message: 'Article deleted successfully' });
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

// COUNTRY ROUTES

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Get all countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: List of countries
 */
router.get('/countries', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const countries = await Country.find().sort({ name: 1 });
    res.json(countries);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /countries/{slug}:
 *   get:
 *     summary: Get a country by slug
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Country details
 *       404:
 *         description: Country not found
 */
router.get('/countries/:slug', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const country = await Country.findOne({ slug: req.params.slug });
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json(country);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /countries:
 *   post:
 *     summary: Create a new country
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Country created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/countries', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const { name, description, universities, acceptanceRate, image } = req.body;
    
    // Generate slug from name
    const slug = createSlug(name);
    
    // Create new country
    const newCountry = new Country({
      name,
      description,
      universities,
      acceptanceRate,
      image,
      slug
    });
    
    await newCountry.save();
    res.status(201).json(newCountry);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /countries/{id}:
 *   put:
 *     summary: Update a country
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Country updated successfully
 *       404:
 *         description: Country not found
 */
router.put('/countries/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const updateData = req.body;
    
    // If name is changed, update slug
    if (updateData.name) {
      updateData.slug = createSlug(updateData.name);
    }
    
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedCountry) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json(updatedCountry);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /countries/{id}:
 *   delete:
 *     summary: Delete a country
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Country deleted successfully
 *       404:
 *         description: Country not found
 */
router.delete('/countries/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const deletedCountry = await Country.findByIdAndDelete(req.params.id);
    
    if (!deletedCountry) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json({ message: 'Country deleted successfully' });
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

// UNIVERSITY ROUTES

/**
 * @swagger
 * /universities:
 *   get:
 *     summary: Get all universities
 *     tags: [Universities]
 *     responses:
 *       200:
 *         description: List of universities
 */
router.get('/universities', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const universities = await University.find().sort({ ranking: 1 });
    res.json(universities);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /universities/{slug}:
 *   get:
 *     summary: Get a university by slug
 *     tags: [Universities]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: University details
 *       404:
 *         description: University not found
 */
router.get('/universities/:slug', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const university = await University.findOne({ slug: req.params.slug });
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }
    res.json(university);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /universities:
 *   post:
 *     summary: Create a new university
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: University created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/universities', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const { name, description, country, ranking, image, features } = req.body;
    
    // Generate slug from name
    const slug = createSlug(name);
    
    // Create new university
    const newUniversity = new University({
      name,
      description,
      country,
      ranking,
      image,
      slug,
      features
    });
    
    await newUniversity.save();
    res.status(201).json(newUniversity);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /universities/{id}:
 *   put:
 *     summary: Update a university
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: University updated successfully
 *       404:
 *         description: University not found
 */
router.put('/universities/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const updateData = req.body;
    
    // If name is changed, update slug
    if (updateData.name) {
      updateData.slug = createSlug(updateData.name);
    }
    
    const updatedUniversity = await University.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUniversity) {
      return res.status(404).json({ error: 'University not found' });
    }
    
    res.json(updatedUniversity);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /universities/{id}:
 *   delete:
 *     summary: Delete a university
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: University deleted successfully
 *       404:
 *         description: University not found
 */
router.delete('/universities/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const deletedUniversity = await University.findByIdAndDelete(req.params.id);
    
    if (!deletedUniversity) {
      return res.status(404).json({ error: 'University not found' });
    }
    
    res.json({ message: 'University deleted successfully' });
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

// NEWS ROUTES

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get all news
 *     tags: [News]
 *     responses:
 *       200:
 *         description: List of news
 */
router.get('/news', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const news = await News.find().sort({ publishDate: -1 });
    res.json(news);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
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
 */
router.get('/news/featured', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const featuredNews = await News.find({ isFeatured: true }).sort({ publishDate: -1 });
    res.json(featuredNews);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /news/{slug}:
 *   get:
 *     summary: Get a news item by slug
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: News details
 *       404:
 *         description: News not found
 */
router.get('/news/:slug', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const newsItem = await News.findOne({ slug: req.params.slug });
    if (!newsItem) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json(newsItem);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a new news item
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: News created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/news', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const { title, content, summary, publishDate, image, category, isFeatured } = req.body;
    
    // Generate slug from title
    const slug = createSlug(title);
    
    // Create new news item
    const newNews = new News({
      title,
      content,
      summary,
      publishDate,
      image,
      category,
      isFeatured: isFeatured || false,
      slug
    });
    
    await newNews.save();
    res.status(201).json(newNews);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Update a news item
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: News updated successfully
 *       404:
 *         description: News not found
 */
router.put('/news/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const updateData = req.body;
    
    // If title is changed, update slug
    if (updateData.title) {
      updateData.slug = createSlug(updateData.title);
    }
    
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedNews) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    res.json(updatedNews);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Delete a news item
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: News deleted successfully
 *       404:
 *         description: News not found
 */
router.delete('/news/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    
    if (!deletedNews) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    res.json({ message: 'News deleted successfully' });
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

// MENU ROUTES

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: List of menu items
 */
router.get('/menu', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const menu = await Menu.find().sort({ id: 1 });
    res.json(menu);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/menu', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const { title, url, children } = req.body;
    
    // Create new menu item
    const newMenuItem = new Menu({
      title,
      url,
      children: children || []
    });
    
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       404:
 *         description: Menu item not found
 */
router.put('/menu/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const updateData = req.body;
    
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedMenuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(updatedMenuItem);
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       404:
 *         description: Menu item not found
 */
router.delete('/menu/:id', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const deletedMenuItem = await Menu.findByIdAndDelete(req.params.id);
    
    if (!deletedMenuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json({ message: 'Menu item deleted successfully' });
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

// SEARCH FUNCTIONALITY

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search across all content
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', errorHandler(async (req: Request, res: Response) => {
  const mongoConn = await connectToDatabase();
  if (mongoConn) {
    const query = req.query.q as string;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Perform text search across all collections
    const [scholarships, articles, countries, universities, news] = await Promise.all([
      Scholarship.find({ $text: { $search: query } }).limit(10),
      Article.find({ $text: { $search: query } }).limit(10),
      Country.find({ $text: { $search: query } }).limit(10),
      University.find({ $text: { $search: query } }).limit(10),
      News.find({ $text: { $search: query } }).limit(10)
    ]);
    
    res.json({
      scholarships,
      articles,
      countries,
      universities,
      news
    });
  } else {
    // Fallback to memory storage if MongoDB is not available
    res.status(503).json({ error: 'Database connection failed' });
  }
}));

// SEEDING DATA

/**
 * @swagger
 * /seed:
 *   post:
 *     summary: Populate the database with sample data (protected)
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Database populated successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Error populating database
 */
router.post('/seed', authenticateToken, errorHandler(async (req: Request, res: Response) => {
  try {
    const result = await populateDatabase();
    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ error: `Error executing database population: ${error.message}` });
  }
}));

/**
 * @swagger
 * /dev/seed:
 *   get:
 *     summary: Populate the database with sample data (development only)
 *     tags: [Development]
 *     responses:
 *       200:
 *         description: Database populated successfully
 *       500:
 *         description: Error populating database
 */
router.get('/dev/seed', errorHandler(async (req: Request, res: Response) => {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'This endpoint is only available in development mode' });
  }
  
  try {
    const result = await populateDatabase();
    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ error: `Error executing database population: ${error.message}` });
  }
}));

export default router;