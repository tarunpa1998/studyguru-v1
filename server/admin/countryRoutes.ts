import { Router, Request, Response } from 'express';
import { mongoStorage } from '../mongoStorage';
import { adminAuth } from '../middleware/auth';
import slugify from 'slugify';

const router = Router();

/**
 * @route   GET /api/admin/countries
 * @desc    Get all countries with pagination
 * @access  Private (Admin)
 */
router.get('/countries', adminAuth, async (req: Request, res: Response) => {
  try {
    const countries = await mongoStorage.getAllCountries();
    res.json(countries);
  } catch (error) {
    console.error('Error getting countries:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/countries/:id
 * @desc    Get country by ID
 * @access  Private (Admin)
 */
router.get('/countries/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    // Get country by ID instead of slug
    const country = await mongoStorage.getCountryById(req.params.id);
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json(country);
  } catch (error) {
    console.error('Error getting country:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/countries
 * @desc    Create a new country
 * @access  Private (Admin)
 */
router.post('/countries', adminAuth, async (req: Request, res: Response) => {
  try {
    const countryData = req.body;
    
    // Generate slug if not provided
    if (!countryData.slug) {
      countryData.slug = slugify(countryData.name, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!countryData.name || !countryData.description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }
    
    // Set default values for missing fields
    if (!countryData.image) {
      countryData.image = null;
    }
    
    if (typeof countryData.universities !== 'number') {
      countryData.universities = 0;
    }
    
    if (!countryData.acceptanceRate) {
      countryData.acceptanceRate = 'Varies';
    }
    
    const newCountry = await mongoStorage.createCountry(countryData);
    res.status(201).json(newCountry);
  } catch (error) {
    console.error('Error creating country:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/countries/:id
 * @desc    Update a country
 * @access  Private (Admin)
 */
router.put('/countries/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const countryData = req.body;
    
    // Generate slug if not provided
    if (!countryData.slug) {
      countryData.slug = slugify(countryData.name, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!countryData.name || !countryData.description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }
    
    // Check if country exists
    const existingCountry = await mongoStorage.getCountryById(req.params.id);
    
    if (!existingCountry) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    // Update the country in MongoDB
    const updatedCountry = await mongoStorage.updateCountry(req.params.id, countryData);
    
    if (!updatedCountry) {
      return res.status(500).json({ error: 'Failed to update country' });
    }
    
    res.json(updatedCountry);
  } catch (error) {
    console.error('Error updating country:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/admin/countries/:id
 * @desc    Delete a country
 * @access  Private (Admin)
 */
router.delete('/countries/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    // Check if country exists
    const existingCountry = await mongoStorage.getCountryById(req.params.id);
    
    if (!existingCountry) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    // Delete the country from MongoDB
    const success = await mongoStorage.deleteCountry(req.params.id);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to delete country' });
    }
    
    res.json({ success: true, message: 'Country deleted successfully' });
  } catch (error) {
    console.error('Error deleting country:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;