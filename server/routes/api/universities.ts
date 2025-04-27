import { Router } from 'express';
import { University } from '../../models';
import { asyncHandler, apiLimiter } from './utils';
import connectToDatabase from '../../lib/mongodb';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     University:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - country
 *         - slug
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the university
 *         name:
 *           type: string
 *           description: The name of the university
 *         description:
 *           type: string
 *           description: Description of the university
 *         country:
 *           type: string
 *           description: Country where the university is located
 *         ranking:
 *           type: number
 *           description: Global ranking of the university
 *         image:
 *           type: string
 *           description: URL to university image
 *         slug:
 *           type: string
 *           description: The unique slug for the university URL
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Key features of the university
 *       example:
 *         name: Harvard University
 *         description: Harvard University is a private Ivy League research university in Cambridge, Massachusetts.
 *         country: United States
 *         ranking: 1
 *         slug: harvard-university
 *         features: [World-class faculty, Extensive research opportunities, Global alumni network]
 */

/**
 * @swagger
 * tags:
 *   name: Universities
 *   description: API for managing universities
 */

/**
 * @swagger
 * /universities:
 *   get:
 *     summary: Get all universities
 *     tags: [Universities]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter universities by country
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit the number of universities returned
 *     responses:
 *       200:
 *         description: List of universities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/University'
 *       500:
 *         description: Server error
 */
router.get('/', apiLimiter, asyncHandler(async (req, res) => {
  await connectToDatabase();
  const { country, limit } = req.query;
  let query = {};
  
  if (country) {
    query = { country: country as string };
  }
  
  const universities = await University.find(query)
    .sort({ ranking: 1 })
    .limit(limit ? parseInt(limit as string) : 0);
  
  res.json(universities);
}));

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
 *         description: University slug
 *     responses:
 *       200:
 *         description: University data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/University'
 *       404:
 *         description: University not found
 *       500:
 *         description: Server error
 */
router.get('/:slug', apiLimiter, asyncHandler(async (req, res) => {
  await connectToDatabase();
  const { slug } = req.params;
  
  const university = await University.findOne({ slug });
  
  if (!university) {
    return res.status(404).json({ error: "University not found" });
  }
  
  res.json(university);
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
 *             $ref: '#/components/schemas/University'
 *     responses:
 *       201:
 *         description: University created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const university = new University(req.body);
  const savedUniversity = await university.save();
  
  res.status(201).json(savedUniversity);
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
 *         description: University ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/University'
 *     responses:
 *       200:
 *         description: University updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       404:
 *         description: University not found
 *       500:
 *         description: Server error
 */
router.put('/:id', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const university = await University.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!university) {
    return res.status(404).json({ error: "University not found" });
  }
  
  res.json(university);
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
 *         description: University ID
 *     responses:
 *       200:
 *         description: University deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: University not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  await connectToDatabase();
  
  const university = await University.findByIdAndDelete(req.params.id);
  
  if (!university) {
    return res.status(404).json({ error: "University not found" });
  }
  
  res.json({ message: "University deleted successfully" });
}));

export default router;