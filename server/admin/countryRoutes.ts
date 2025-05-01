import { Router, Request, Response } from 'express';
import { adminAuth } from '../middleware/auth';
import Country from '../models/Country';
import slugify from 'slugify';

const router = Router();

/**
 * @route   GET /api/admin/countries
 * @desc    Get all countries with pagination
 * @access  Private (Admin)
 */
router.get('/countries', adminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Country.countDocuments();
    const countries = await Country.find()
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      countries,
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
 * @route   GET /api/admin/countries/:id
 * @desc    Get country by ID
 * @access  Private (Admin)
 */
router.get('/countries/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json(country);
  } catch (err) {
    console.error(err);
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
    const {
      name,
      overview,
      description,
      highlights,
      universities,
      acceptanceRate,
      language,
      currency,
      averageTuition,
      averageLivingCost,
      visaRequirement,
      popularCities,
      topUniversities,
      educationSystem,
      image,
      flag
    } = req.body;

    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug already exists
    const existingCountry = await Country.findOne({ slug });
    if (existingCountry) {
      return res.status(400).json({ error: 'A country with this name already exists' });
    }

    const newCountry = new Country({
      name,
      slug,
      overview,
      description,
      highlights: highlights || [],
      universities: universities || 0,
      acceptanceRate: acceptanceRate || 'Varies by university',
      language,
      currency,
      averageTuition,
      averageLivingCost,
      visaRequirement,
      popularCities: popularCities || [],
      topUniversities: topUniversities || [],
      educationSystem,
      image,
      flag
    });

    const savedCountry = await newCountry.save();
    res.status(201).json(savedCountry);
  } catch (err) {
    console.error(err);
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
    const {
      name,
      overview,
      description,
      highlights,
      universities,
      acceptanceRate,
      language,
      currency,
      averageTuition,
      averageLivingCost,
      visaRequirement,
      popularCities,
      topUniversities,
      educationSystem,
      image,
      flag
    } = req.body;

    // Find country
    let country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // If name changed, update slug
    let slug = country.slug;
    if (name !== country.name) {
      slug = slugify(name, { lower: true, strict: true });
      
      // Check if new slug already exists
      const existingCountry = await Country.findOne({ 
        slug,
        _id: { $ne: req.params.id }
      });
      
      if (existingCountry) {
        return res.status(400).json({ error: 'A country with this name already exists' });
      }
    }

    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug,
        overview,
        description,
        highlights,
        universities,
        acceptanceRate,
        language,
        currency,
        averageTuition,
        averageLivingCost,
        visaRequirement,
        popularCities,
        topUniversities,
        educationSystem,
        image,
        flag
      },
      { new: true }
    );

    res.json(updatedCountry);
  } catch (err) {
    console.error(err);
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
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    await country.deleteOne();
    res.json({ message: 'Country removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;