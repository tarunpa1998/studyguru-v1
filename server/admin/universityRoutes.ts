import { Router, Request, Response } from 'express';
import { mongoStorage } from '../mongoStorage';
import { adminAuth } from '../middleware/auth';
import slugify from 'slugify';

const router = Router();

/**
 * @route   GET /api/admin/universities
 * @desc    Get all universities with pagination
 * @access  Private (Admin)
 */
router.get('/universities', adminAuth, async (req: Request, res: Response) => {
  try {
    const universities = await mongoStorage.getAllUniversities();
    res.json(universities);
  } catch (error) {
    console.error('Error getting universities:', error);
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
    // Try to get by ID first, if that fails try slug as fallback
    let university = await mongoStorage.getUniversityById(req.params.id);
    
    // If not found by ID, try by slug as fallback
    if (!university) {
      university = await mongoStorage.getUniversityBySlug(req.params.id);
    }
    
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }
    
    res.json(university);
  } catch (error) {
    console.error('Error getting university:', error);
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
    const universityData = req.body;
    
    // Generate slug if not provided
    if (!universityData.slug) {
      universityData.slug = slugify(universityData.name, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!universityData.name || !universityData.description || !universityData.country) {
      return res.status(400).json({ error: 'Name, description, and country are required' });
    }
    
    const newUniversity = await mongoStorage.createUniversity(universityData);
    res.status(201).json(newUniversity);
  } catch (error) {
    console.error('Error creating university:', error);
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
    const universityData = req.body;
    
    // Generate slug if not provided
    if (!universityData.slug) {
      universityData.slug = slugify(universityData.name, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!universityData.name || !universityData.description || !universityData.country) {
      return res.status(400).json({ error: 'Name, description, and country are required' });
    }
    
    // Try to get university by ID first, if that fails try slug as fallback
    let existingUniversity = await mongoStorage.getUniversityById(req.params.id);
    
    // If not found by ID, try by slug as fallback
    if (!existingUniversity) {
      existingUniversity = await mongoStorage.getUniversityBySlug(req.params.id);
    }
    
    if (!existingUniversity) {
      return res.status(404).json({ error: 'University not found' });
    }
    
    // Update university using ID from found university
    const universityId = existingUniversity.id || existingUniversity._id;
    const updatedUniversity = await mongoStorage.updateUniversity(universityId, universityData);
    
    if (!updatedUniversity) {
      return res.status(404).json({ error: 'Failed to update university' });
    }
    
    res.json(updatedUniversity);
  } catch (error) {
    console.error('Error updating university:', error);
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
    // Try to get university by ID first, if that fails try slug as fallback
    let existingUniversity = await mongoStorage.getUniversityById(req.params.id);
    
    // If not found by ID, try by slug as fallback
    if (!existingUniversity) {
      existingUniversity = await mongoStorage.getUniversityBySlug(req.params.id);
    }
    
    if (!existingUniversity) {
      return res.status(404).json({ error: 'University not found' });
    }
    
    // Delete university using ID from found university
    const universityId = existingUniversity.id || existingUniversity._id;
    const deleted = await mongoStorage.deleteUniversity(universityId);
    
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete university' });
    }
    
    res.json({ success: true, message: 'University deleted' });
  } catch (error) {
    console.error('Error deleting university:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;