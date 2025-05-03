import { Router, Request, Response } from 'express';
import { auth, UserPayload } from '../middleware/auth';
import ActiveUser from '../models/ActiveUser';
import Article from '../models/Article';
import Scholarship from '../models/Scholarship';
import mongoose from 'mongoose';
import connectToDatabase from '../lib/mongodb';
import { log } from '../vite';

const router = Router();

// Type definition for the authenticated request
interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', auth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }

    const { fullName, profileImage } = req.body;
    
    // Build update object
    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (profileImage) updateData.profileImage = profileImage;
    
    // Update user
    const user = await ActiveUser.findByIdAndUpdate(
      authReq.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    log(`Update profile error: ${err}`, 'user');
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

/**
 * @route   POST /api/user/save-article/:id
 * @desc    Save article to user profile
 * @access  Private
 */
router.post('/save-article/:id', auth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    const articleId = req.params.id;
    
    // Verify article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Check if article is already saved
    const user = await ActiveUser.findById(authReq.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.savedArticles.includes(mongoose.Types.ObjectId.createFromHexString(articleId))) {
      return res.status(400).json({ message: 'Article already saved' });
    }
    
    // Add article to savedArticles
    user.savedArticles.push(mongoose.Types.ObjectId.createFromHexString(articleId));
    await user.save();
    
    res.json({ message: 'Article saved successfully', savedArticles: user.savedArticles });
  } catch (err) {
    log(`Save article error: ${err}`, 'user');
    res.status(500).json({ message: 'Server error saving article' });
  }
});

/**
 * @route   DELETE /api/user/unsave-article/:id
 * @desc    Remove article from saved list
 * @access  Private
 */
router.delete('/unsave-article/:id', auth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    const articleId = req.params.id;
    
    // Remove article from savedArticles
    const user = await ActiveUser.findByIdAndUpdate(
      authReq.user.id,
      { $pull: { savedArticles: mongoose.Types.ObjectId.createFromHexString(articleId) } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Article removed from saved list', savedArticles: user.savedArticles });
  } catch (err) {
    log(`Unsave article error: ${err}`, 'user');
    res.status(500).json({ message: 'Server error removing article from saved list' });
  }
});

/**
 * @route   POST /api/user/save-scholarship/:id
 * @desc    Save scholarship to user profile
 * @access  Private
 */
router.post('/save-scholarship/:id', auth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    const scholarshipId = req.params.id;
    
    // Verify scholarship exists
    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    
    // Check if scholarship is already saved
    const user = await ActiveUser.findById(authReq.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.savedScholarships.includes(mongoose.Types.ObjectId.createFromHexString(scholarshipId))) {
      return res.status(400).json({ message: 'Scholarship already saved' });
    }
    
    // Add scholarship to savedScholarships
    user.savedScholarships.push(mongoose.Types.ObjectId.createFromHexString(scholarshipId));
    await user.save();
    
    res.json({ message: 'Scholarship saved successfully', savedScholarships: user.savedScholarships });
  } catch (err) {
    log(`Save scholarship error: ${err}`, 'user');
    res.status(500).json({ message: 'Server error saving scholarship' });
  }
});

/**
 * @route   DELETE /api/user/unsave-scholarship/:id
 * @desc    Remove scholarship from saved list
 * @access  Private
 */
router.delete('/unsave-scholarship/:id', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    const scholarshipId = req.params.id;
    
    // Remove scholarship from savedScholarships
    const user = await ActiveUser.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedScholarships: mongoose.Types.ObjectId.createFromHexString(scholarshipId) } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Scholarship removed from saved list', savedScholarships: user.savedScholarships });
  } catch (err) {
    log(`Unsave scholarship error: ${err}`, 'user');
    res.status(500).json({ message: 'Server error removing scholarship from saved list' });
  }
});

/**
 * @route   POST /api/user/comment/:articleId
 * @desc    Add a comment to an article
 * @access  Private
 */
router.post('/comment/:articleId', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    const { content } = req.body;
    const articleId = req.params.articleId;
    
    // Verify article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Add comment to user's comments
    const user = await ActiveUser.findByIdAndUpdate(
      req.user.id,
      { 
        $push: { 
          comments: { 
            content, 
            articleId: mongoose.Types.ObjectId.createFromHexString(articleId),
            createdAt: new Date() 
          } 
        } 
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return the newly added comment
    const newComment = user.comments[user.comments.length - 1];
    
    res.json({ 
      message: 'Comment added successfully', 
      comment: newComment
    });
  } catch (err) {
    log(`Add comment error: ${err}`, 'user');
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

/**
 * @route   DELETE /api/user/comment/:commentId
 * @desc    Delete a comment
 * @access  Private
 */
router.delete('/comment/:commentId', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    const commentId = req.params.commentId;
    
    // Remove comment from user's comments
    const user = await ActiveUser.findByIdAndUpdate(
      req.user.id,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    log(`Delete comment error: ${err}`, 'user');
    res.status(500).json({ message: 'Server error deleting comment' });
  }
});

/**
 * @route   GET /api/user/comments
 * @desc    Get all comments for the user
 * @access  Private
 */
router.get('/comments', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    // Get user with populated article info for comments
    const user = await ActiveUser.findById(req.user.id)
      .populate('comments.articleId', 'title slug');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.comments);
  } catch (err) {
    log(`Get comments error: ${err}`, 'user');
    res.status(500).json({ message: 'Server error fetching comments' });
  }
});

export default router;