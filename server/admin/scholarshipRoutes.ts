import { Router, Request, Response } from 'express';
import { adminAuth } from '../middleware/auth';
import Scholarship from '../models/Scholarship';
import slugify from 'slugify';

const router = Router();

/**
 * @route   GET /api/admin/scholarships
 * @desc    Get all scholarships with pagination
 * @access  Private (Admin)
 */
router.get('/scholarships', adminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Scholarship.countDocuments();
    const scholarships = await Scholarship.find()
      .sort({ deadline: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      scholarships,
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
 * @route   GET /api/admin/scholarships/:id
 * @desc    Get scholarship by ID
 * @access  Private (Admin)
 */
router.get('/scholarships/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    res.json(scholarship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/scholarships
 * @desc    Create a new scholarship
 * @access  Private (Admin)
 */
router.post('/scholarships', adminAuth, async (req: Request, res: Response) => {
  try {
    const {
      title,
      overview,
      description,
      highlights,
      amount,
      deadline,
      duration,
      level,
      fieldsCovered,
      eligibility,
      isRenewable,
      benefits,
      applicationProcedure,
      country,
      tags,
      link
    } = req.body;

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug already exists
    const existingScholarship = await Scholarship.findOne({ slug });
    if (existingScholarship) {
      return res.status(400).json({ error: 'A scholarship with this title already exists' });
    }

    const newScholarship = new Scholarship({
      title,
      slug,
      overview,
      description,
      highlights: highlights || [],
      amount,
      deadline,
      duration,
      level,
      fieldsCovered: fieldsCovered || [],
      eligibility,
      isRenewable: isRenewable || false,
      benefits: benefits || [],
      applicationProcedure,
      country,
      tags: tags || [],
      link
    });

    const savedScholarship = await newScholarship.save();
    res.status(201).json(savedScholarship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/scholarships/:id
 * @desc    Update a scholarship
 * @access  Private (Admin)
 */
router.put('/scholarships/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const {
      title,
      overview,
      description,
      highlights,
      amount,
      deadline,
      duration,
      level,
      fieldsCovered,
      eligibility,
      isRenewable,
      benefits,
      applicationProcedure,
      country,
      tags,
      link
    } = req.body;

    // Find scholarship
    let scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }

    // If title changed, update slug
    let slug = scholarship.slug;
    if (title !== scholarship.title) {
      slug = slugify(title, { lower: true, strict: true });
      
      // Check if new slug already exists
      const existingScholarship = await Scholarship.findOne({ 
        slug,
        _id: { $ne: req.params.id }
      });
      
      if (existingScholarship) {
        return res.status(400).json({ error: 'A scholarship with this title already exists' });
      }
    }

    const updatedScholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug,
        overview,
        description,
        highlights,
        amount,
        deadline,
        duration,
        level,
        fieldsCovered,
        eligibility,
        isRenewable,
        benefits,
        applicationProcedure,
        country,
        tags,
        link
      },
      { new: true }
    );

    res.json(updatedScholarship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/admin/scholarships/:id
 * @desc    Delete a scholarship
 * @access  Private (Admin)
 */
router.delete('/scholarships/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }

    await scholarship.deleteOne();
    res.json({ message: 'Scholarship removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;