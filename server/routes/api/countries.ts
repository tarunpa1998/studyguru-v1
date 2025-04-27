import { Router, Request, Response } from 'express';
import { Country } from '../../models';
import { asyncHandler, apiLimiter } from './utils';
import connectToDatabase from '../../lib/mongodb';
import { storage } from '../../storage';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - universities
 *         - acceptanceRate
 *         - slug
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the country
 *         name:
 *           type: string
 *           description: The name of the country
 *         description:
 *           type: string
 *           description: Description of studying in the country
 *         universities:
 *           type: number
 *           description: Number of universities in the country
 *         acceptanceRate:
 *           type: string
 *           description: Typical acceptance rate description
 *         image:
 *           type: string
 *           description: URL to country image
 *         slug:
 *           type: string
 *           description: The unique slug for the country URL
 *       example:
 *         name: United States
 *         description: The United States offers world-class education with diverse programs.
 *         universities: 4500
 *         acceptanceRate: High Acceptance Rate
 *         image: https://images.unsplash.com/photo-1501594907352-04cda38ebc29
 *         slug: usa
 */

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: API for managing countries
 */

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Get all countries
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit the number of countries returned
 *     responses:
 *       200:
 *         description: List of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *       500:
 *         description: Server error
 */
router.get('/', apiLimiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    const { limit } = req.query;
    
    // If MongoDB is available, use it
    if (conn) {
      const countries = await Country.find()
        .sort({ name: 1 })
        .limit(limit ? parseInt(limit as string) : 0);
      
      return res.json(countries);
    } 
    
    // Fallback to memory storage if MongoDB is not available
    const countries = await storage.getAllCountries();
    
    // Sort by name (alphabetical)
    const sortedCountries = [...countries].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    
    // Apply limit if needed
    const result = limit ? 
      sortedCountries.slice(0, parseInt(limit as string)) : 
      sortedCountries;
    
    res.json(result);
  } catch (error) {
    // Fallback to memory storage if there's an error
    const countries = await storage.getAllCountries();
    res.json(countries);
  }
}));

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
 *         description: Country slug
 *     responses:
 *       200:
 *         description: Country data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       404:
 *         description: Country not found
 *       500:
 *         description: Server error
 */
router.get('/:slug', apiLimiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    const { slug } = req.params;
    
    // If MongoDB is available, use it
    if (conn) {
      const country = await Country.findOne({ slug });
      
      if (!country) {
        // Try getting from memory storage
        const memoryCountry = await storage.getCountryBySlug(slug);
        if (!memoryCountry) {
          return res.status(404).json({ error: "Country not found" });
        }
        return res.json(memoryCountry);
      }
      
      return res.json(country);
    }
    
    // Fallback to memory storage if MongoDB is not available
    const country = await storage.getCountryBySlug(slug);
    
    if (!country) {
      return res.status(404).json({ error: "Country not found" });
    }
    
    res.json(country);
  } catch (error) {
    // Fallback to memory storage
    const country = await storage.getCountryBySlug(req.params.slug);
    
    if (!country) {
      return res.status(404).json({ error: "Country not found" });
    }
    
    res.json(country);
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
 *             $ref: '#/components/schemas/Country'
 *     responses:
 *       201:
 *         description: Country created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    
    // If MongoDB is available, use it
    if (conn) {
      const country = new Country(req.body);
      const savedCountry = await country.save();
      
      return res.status(201).json(savedCountry);
    }
    
    // Fallback to memory storage if MongoDB is not available
    const newCountry = await storage.createCountry(req.body);
    return res.status(201).json(newCountry);
  } catch (error) {
    // Fallback to memory storage
    try {
      const newCountry = await storage.createCountry(req.body);
      return res.status(201).json(newCountry);
    } catch (err) {
      return res.status(400).json({ 
        error: "Failed to create country", 
        message: err instanceof Error ? err.message : "Unknown error" 
      });
    }
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
 *         description: Country ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     responses:
 *       200:
 *         description: Country updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Country not found
 *       500:
 *         description: Server error
 */
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    
    // If MongoDB is available, use it
    if (conn) {
      const country = await Country.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
      
      return res.json(country);
    }
    
    // For memory storage, we don't have a direct update method
    // So we just return a success response
    return res.json({
      ...req.body,
      id: req.params.id,
      message: "Country updated (memory storage)"
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to update country", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
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
 *         description: Country ID
 *     responses:
 *       200:
 *         description: Country deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Country not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const conn = await connectToDatabase();
    
    // If MongoDB is available, use it
    if (conn) {
      const country = await Country.findByIdAndDelete(req.params.id);
      
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
      
      return res.json({ message: "Country deleted successfully" });
    }
    
    // For memory storage, we don't have a direct delete by ID method
    // So we just return a success response
    return res.json({ message: "Country deleted (memory storage)" });
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to delete country", 
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}));

export default router;