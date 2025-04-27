import { Router } from 'express';
import { News } from '../../models';
import { asyncHandler, apiLimiter } from './utils';
import connectToDatabase from '../../lib/mongodb';

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
router.get('/', apiLimiter, asyncHandler(async (req, res) => {
  await connectToDatabase();
  const { category, limit } = req.query;
  let query = {};
  
  if (category) {
    query = { category: category as string };
  }
  
  const news = await News.find(query)
    .sort({ publishDate: -1 })
    .limit(limit ? parseInt(limit as string) : 0);
  
  res.json(news);
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
router.get('/featured', apiLimiter, asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const featuredNews = await News.find({ isFeatured: true })
    .sort({ publishDate: -1 });
  
  res.json(featuredNews);
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
router.get('/:slug', apiLimiter, asyncHandler(async (req, res) => {
  await connectToDatabase();
  const { slug } = req.params;
  
  // Make sure this route doesn't match /featured
  if (slug === 'featured') {
    return res.status(404).json({ error: "News not found" });
  }
  
  const news = await News.findOne({ slug });
  
  if (!news) {
    return res.status(404).json({ error: "News not found" });
  }
  
  res.json(news);
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
router.post('/', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const news = new News(req.body);
  const savedNews = await news.save();
  
  res.status(201).json(savedNews);
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
router.put('/:id', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const news = await News.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!news) {
    return res.status(404).json({ error: "News not found" });
  }
  
  res.json(news);
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
router.delete('/:id', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const news = await News.findByIdAndDelete(req.params.id);
  
  if (!news) {
    return res.status(404).json({ error: "News not found" });
  }
  
  res.json({ message: "News deleted successfully" });
}));

export default router;