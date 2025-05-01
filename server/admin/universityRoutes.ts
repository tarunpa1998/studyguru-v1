import { Router, Request, Response } from 'express';
import { adminAuth } from '../middleware/auth';
import University from '../models/University';
import slugify from 'slugify';

const router = Router();

/**
 * @route   GET /api/admin/universities
 * @desc    Get all universities with pagination
 * @access  Private (Admin)
 */
router.get('/universities', adminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await University.countDocuments();
    const universities = await University.find()
      .sort({ ranking: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      universities,
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
 * @route   GET /api/admin/universities/:id
 * @desc    Get university by ID
 * @access  Private (Admin)
 */
router.get('/universities/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }
    res.json(university);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/universities
 * @desc    Create a new university
 * @access  Private (Admin)
 */
router.post('/universities', adminAuth, async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      overview,
      country,
      location,
      foundedYear,
      ranking,
      acceptanceRate,
      studentPopulation,
      internationalStudents,
      academicCalendar,
      programsOffered,
      tuitionFees,
      admissionRequirements,
      applicationDeadlines,
      scholarshipsAvailable,
      campusLife,
      notableAlumni,
      facilities,
      image,
      logo,
      website,
      features
    } = req.body;

    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug already exists
    const existingUniversity = await University.findOne({ slug });
    if (existingUniversity) {
      return res.status(400).json({ error: 'A university with this name already exists' });
    }

    const newUniversity = new University({
      name,
      description,
      overview: overview || description,
      country,
      location,
      foundedYear: foundedYear || 0,
      ranking,
      acceptanceRate,
      studentPopulation: studentPopulation || 0,
      internationalStudents,
      academicCalendar,
      programsOffered: programsOffered || [],
      tuitionFees,
      admissionRequirements: admissionRequirements || [],
      applicationDeadlines,
      scholarshipsAvailable: scholarshipsAvailable || false,
      campusLife,
      notableAlumni: notableAlumni || [],
      facilities: facilities || [],
      image,
      logo,
      website,
      slug,
      features: features || []
    });

    const savedUniversity = await newUniversity.save();
    res.status(201).json(savedUniversity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/universities/:id
 * @desc    Update a university
 * @access  Private (Admin)
 */
router.put('/universities/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      overview,
      country,
      location,
      foundedYear,
      ranking,
      acceptanceRate,
      studentPopulation,
      internationalStudents,
      academicCalendar,
      programsOffered,
      tuitionFees,
      admissionRequirements,
      applicationDeadlines,
      scholarshipsAvailable,
      campusLife,
      notableAlumni,
      facilities,
      image,
      logo,
      website,
      features
    } = req.body;

    // Find university
    let university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    // If name changed, update slug
    let slug = university.slug;
    if (name !== university.name) {
      slug = slugify(name, { lower: true, strict: true });
      
      // Check if new slug already exists
      const existingUniversity = await University.findOne({ 
        slug,
        _id: { $ne: req.params.id }
      });
      
      if (existingUniversity) {
        return res.status(400).json({ error: 'A university with this name already exists' });
      }
    }

    const updatedUniversity = await University.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        overview,
        country,
        location,
        foundedYear,
        ranking,
        acceptanceRate,
        studentPopulation,
        internationalStudents,
        academicCalendar,
        programsOffered,
        tuitionFees,
        admissionRequirements,
        applicationDeadlines,
        scholarshipsAvailable,
        campusLife,
        notableAlumni,
        facilities,
        image,
        logo,
        website,
        slug,
        features
      },
      { new: true }
    );

    res.json(updatedUniversity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/admin/universities/:id
 * @desc    Delete a university
 * @access  Private (Admin)
 */
router.delete('/universities/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    await university.deleteOne();
    res.json({ message: 'University removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;