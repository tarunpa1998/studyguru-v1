import { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth';
import ActiveUser from '../models/ActiveUser';
import Article from '../models/Article';
import mongoose from 'mongoose';
import connectToDatabase from '../lib/mongodb';
import { log } from '../vite';

const router = Router();

/**
 * @route   GET /api/comments/article/:id
 * @desc    Get all comments for an article
 * @access  Public
 */
router.get('/article/:id', async (req: Request, res: Response) => {
  try {
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
    
    // Find all users who have commented on this article
    const comments = await ActiveUser.aggregate([
      // Unwind the comments array to work with individual comments
      { $unwind: '$comments' },
      // Match only comments for this article
      { $match: { 'comments.articleId': mongoose.Types.ObjectId.createFromHexString(articleId) } },
      // Project only the necessary fields
      { $project: {
        _id: 0,
        commentId: '$comments._id',
        content: '$comments.content',
        createdAt: '$comments.createdAt',
        userId: '$_id',
        userFullName: '$fullName',
        userProfileImage: '$profileImage'
      }},
      // Sort by creation date descending (newest first)
      { $sort: { createdAt: -1 } }
    ]);
    
    res.json(comments);
  } catch (err) {
    log(`Get comments error: ${err}`, 'comments');
    res.status(500).json({ message: 'Server error getting comments' });
  }
});

/**
 * @route   POST /api/comments/article/:id
 * @desc    Add a comment to an article
 * @access  Private
 */
router.post('/article/:id', auth, async (req: Request, res: Response) => {
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
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    const articleId = req.params.id;
    
    // Verify article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Add comment to user's comments
    const commentId = new mongoose.Types.ObjectId();
    const now = new Date();
    
    const user = await ActiveUser.findByIdAndUpdate(
      req.user.id,
      { 
        $push: { 
          comments: { 
            _id: commentId,
            content, 
            articleId: mongoose.Types.ObjectId.createFromHexString(articleId),
            createdAt: now
          } 
        } 
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return the newly added comment with user info
    res.status(201).json({ 
      commentId,
      content,
      createdAt: now,
      userId: user._id,
      userFullName: user.fullName,
      userProfileImage: user.profileImage
    });
  } catch (err) {
    log(`Add comment error: ${err}`, 'comments');
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

/**
 * @route   PUT /api/comments/:id
 * @desc    Update a comment
 * @access  Private
 */
router.put('/:id', auth, async (req: Request, res: Response) => {
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
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    const commentId = req.params.id;
    
    // Find the user and the specific comment to update
    const user = await ActiveUser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the comment in the user's comments array
    const commentIndex = user.comments.findIndex(
      (comment: { _id: mongoose.Types.ObjectId, content: string, articleId: mongoose.Types.ObjectId, createdAt: Date }) => 
        comment._id.toString() === commentId
    );
    
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found or not owned by this user' });
    }
    
    // Update the comment
    user.comments[commentIndex].content = content;
    await user.save();
    
    // Return the updated comment
    res.json({ 
      commentId,
      content,
      createdAt: user.comments[commentIndex].createdAt,
      userId: user._id,
      userFullName: user.fullName,
      userProfileImage: user.profileImage
    });
  } catch (err) {
    log(`Update comment error: ${err}`, 'comments');
    res.status(500).json({ message: 'Server error updating comment' });
  }
});

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private
 */
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No authenticated user' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    const commentId = req.params.id;
    
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
    log(`Delete comment error: ${err}`, 'comments');
    res.status(500).json({ message: 'Server error deleting comment' });
  }
});

export default router;