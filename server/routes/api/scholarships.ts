import { Router } from 'express';
import { Scholarship } from '../../models';
import { asyncHandler, apiLimiter } from './utils';
import connectToDatabase from '../../lib/mongodb';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Scholarship:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - amount
 *         - deadline
 *         - country
 *         - tags
 *         - slug
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the scholarship
 *         title:
 *           type: string
 *           description: The title of the scholarship
 *         description:
 *           type: string
 *           description: Description of the scholarship
 *         amount:
 *           type: string
 *           description: The amount or value of the scholarship
 *         deadline:
 *           type: string
 *           description: The application deadline
 *         country:
 *           type: string
 *           description: Country offering the scholarship
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Scholarship tags or categories
 *         slug:
 *           type: string
 *           description: The unique slug for the scholarship URL
 *         link:
 *           type: string
 *           description: URL to apply for the scholarship
 *       example:
 *         title: Fulbright Foreign Student Program
 *         description: Full scholarships for graduate students and young professionals
 *         amount: $40,000
 *         deadline: Jun 15, 2023
 *         country: United States
 *         tags: [Fully Funded, Merit-Based]
 *         slug: fulbright-foreign-student-program
 *         link: https://foreign.fulbrightonline.org/
 */

/**
 * @swagger
 * tags:
 *   name: Scholarships
 *   description: API for managing scholarships
 */

/**
 * @swagger
 * /scholarships:
 *   get:
 *     summary: Get all scholarships
 *     tags: [Scholarships]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter scholarships by country
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter scholarships by tag
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit the number of scholarships returned
 *     responses:
 *       200:
 *         description: List of scholarships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Scholarship'
 *       500:
 *         description: Server error
 */
router.get('/', apiLimiter, asyncHandler(async (req, res) => {
  await connectToDatabase();
  const { country, tag, limit } = req.query;
  let query = {};
  
  if (country) {
    query = { ...query, country: country as string };
  }
  
  if (tag) {
    query = { ...query, tags: { $in: [tag as string] } };
  }
  
  const scholarships = await Scholarship.find(query)
    .sort({ deadline: 1 })
    .limit(limit ? parseInt(limit as string) : 0);
  
  res.json(scholarships);
}));

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
 *         description: Scholarship slug
 *     responses:
 *       200:
 *         description: Scholarship data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scholarship'
 *       404:
 *         description: Scholarship not found
 *       500:
 *         description: Server error
 */
router.get('/:slug', apiLimiter, asyncHandler(async (req, res) => {
  await connectToDatabase();
  const { slug } = req.params;
  
  const scholarship = await Scholarship.findOne({ slug });
  
  if (!scholarship) {
    return res.status(404).json({ error: "Scholarship not found" });
  }
  
  res.json(scholarship);
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
 *             $ref: '#/components/schemas/Scholarship'
 *     responses:
 *       201:
 *         description: Scholarship created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const scholarship = new Scholarship(req.body);
  const savedScholarship = await scholarship.save();
  
  res.status(201).json(savedScholarship);
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
 *         description: Scholarship ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Scholarship'
 *     responses:
 *       200:
 *         description: Scholarship updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Scholarship not found
 *       500:
 *         description: Server error
 */
router.put('/:id', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const scholarship = await Scholarship.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!scholarship) {
    return res.status(404).json({ error: "Scholarship not found" });
  }
  
  res.json(scholarship);
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
 *         description: Scholarship ID
 *     responses:
 *       200:
 *         description: Scholarship deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Scholarship not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
  
  if (!scholarship) {
    return res.status(404).json({ error: "Scholarship not found" });
  }
  
  res.json({ message: "Scholarship deleted successfully" });
}));

export default router;