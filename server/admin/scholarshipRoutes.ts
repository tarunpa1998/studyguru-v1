import { Router, Request, Response } from 'express';
import { mongoStorage } from '../mongoStorage';
import { adminAuth } from '../middleware/auth';
import slugify from 'slugify';

const router = Router();

/**
 * @route   GET /api/admin/scholarships
 * @desc    Get all scholarships with pagination
 * @access  Private (Admin)
 */
router.get('/scholarships', adminAuth, async (req: Request, res: Response) => {
  try {
    const scholarships = await mongoStorage.getAllScholarships();
    res.json(scholarships);
  } catch (error) {
    console.error('Error getting scholarships:', error);
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
    // Try to get by ID first, if that fails try slug as fallback
    let scholarship = await mongoStorage.getScholarshipById(req.params.id);
    
    // If not found by ID, try by slug as fallback
    if (!scholarship) {
      scholarship = await mongoStorage.getScholarshipBySlug(req.params.id);
    }
    
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    
    res.json(scholarship);
  } catch (error) {
    console.error('Error getting scholarship:', error);
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
    const scholarshipData = req.body;
    
    // Generate slug if not provided
    if (!scholarshipData.slug) {
      scholarshipData.slug = slugify(scholarshipData.title, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!scholarshipData.title || !scholarshipData.description || !scholarshipData.amount) {
      return res.status(400).json({ error: 'Title, description, and amount are required' });
    }
    
    const newScholarship = await mongoStorage.createScholarship(scholarshipData);
    res.status(201).json(newScholarship);
  } catch (error) {
    console.error('Error creating scholarship:', error);
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
    const scholarshipData = req.body;
    
    // Generate slug if not provided
    if (!scholarshipData.slug) {
      scholarshipData.slug = slugify(scholarshipData.title, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!scholarshipData.title || !scholarshipData.description || !scholarshipData.amount) {
      return res.status(400).json({ error: 'Title, description, and amount are required' });
    }
    
    // Try to get scholarship by ID first, if that fails try slug as fallback
    let existingScholarship = await mongoStorage.getScholarshipById(req.params.id);
    
    // If not found by ID, try by slug as fallback
    if (!existingScholarship) {
      existingScholarship = await mongoStorage.getScholarshipBySlug(req.params.id);
    }
    
    if (!existingScholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    
    // Update scholarship using ID from found scholarship
    const scholarshipId = existingScholarship.id || existingScholarship._id;
    const updatedScholarship = await mongoStorage.updateScholarship(scholarshipId, scholarshipData);
    
    if (!updatedScholarship) {
      return res.status(404).json({ error: 'Failed to update scholarship' });
    }
    
    res.json(updatedScholarship);
  } catch (error) {
    console.error('Error updating scholarship:', error);
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
    // Try to get scholarship by ID first, if that fails try slug as fallback
    let existingScholarship = await mongoStorage.getScholarshipById(req.params.id);
    
    // If not found by ID, try by slug as fallback
    if (!existingScholarship) {
      existingScholarship = await mongoStorage.getScholarshipBySlug(req.params.id);
    }
    
    if (!existingScholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    
    // Delete scholarship using ID from found scholarship
    const scholarshipId = existingScholarship.id || existingScholarship._id;
    const deleted = await mongoStorage.deleteScholarship(scholarshipId);
    
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete scholarship' });
    }
    
    res.json({ success: true, message: 'Scholarship deleted' });
  } catch (error) {
    console.error('Error deleting scholarship:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;