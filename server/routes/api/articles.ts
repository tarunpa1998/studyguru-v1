import { Router } from 'express';
import { Article } from '../../models';
import { asyncHandler, apiLimiter } from './utils';
import connectToDatabase from '../../lib/mongodb';

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
router.get('/', apiLimiter, asyncHandler(async (req, res) => {
  await connectToDatabase();
  const { category, limit } = req.query;
  let query = {};
  
  if (category) {
    query = { category: category as string };
  }
  
  const articles = await Article.find(query)
    .sort({ publishDate: -1 })
    .limit(limit ? parseInt(limit as string) : 0);
  
  res.json(articles);
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
router.get('/:slug', apiLimiter, asyncHandler(async (req, res) => {
  await connectToDatabase();
  const { slug } = req.params;
  
  const article = await Article.findOne({ slug });
  
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  
  res.json(article);
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
router.post('/', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const article = new Article(req.body);
  const savedArticle = await article.save();
  
  res.status(201).json(savedArticle);
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
router.put('/:id', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  
  res.json(article);
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
router.delete('/:id', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const article = await Article.findByIdAndDelete(req.params.id);
  
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  
  res.json({ message: "Article deleted successfully" });
}));

export default router;