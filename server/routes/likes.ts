import { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth';
import Article from '../models/Article';
import mongoose from 'mongoose';
import connectToDatabase from '../lib/mongodb';
import { log } from '../vite';

const router = Router();

/**
 * @route   POST /api/likes/article/:id
 * @desc    Like an article
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
    
    const articleId = req.params.id;
    
    // Verify article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Check if user already liked this article
    if (article.likes.includes(mongoose.Types.ObjectId.createFromHexString(req.user.id))) {
      return res.status(400).json({ message: 'Article already liked by this user' });
    }
    
    // Add user ID to likes array
    article.likes.push(mongoose.Types.ObjectId.createFromHexString(req.user.id));
    await article.save();
    
    res.json({ message: 'Article liked successfully', likes: article.likes.length });
  } catch (err) {
    log(`Like article error: ${err}`, 'likes');
    res.status(500).json({ message: 'Server error liking article' });
  }
});

/**
 * @route   DELETE /api/likes/article/:id
 * @desc    Unlike an article
 * @access  Private
 */
router.delete('/article/:id', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
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
    
    // Check if user has liked this article
    if (!article.likes.includes(mongoose.Types.ObjectId.createFromHexString(req.user.id))) {
      return res.status(400).json({ message: 'Cannot unlike an article that is not liked' });
    }
    
    // Remove user ID from likes array
    article.likes = article.likes.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== req.user!.id.toString()
    );
    await article.save();
    
    res.json({ message: 'Article unliked successfully', likes: article.likes.length });
  } catch (err) {
    log(`Unlike article error: ${err}`, 'likes');
    res.status(500).json({ message: 'Server error unliking article' });
  }
});

/**
 * @route   GET /api/likes/article/:id/count
 * @desc    Get like count for an article
 * @access  Public
 */
router.get('/article/:id/count', async (req: Request, res: Response) => {
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
    
    res.json({ likes: article.likes.length });
  } catch (err) {
    log(`Get likes count error: ${err}`, 'likes');
    res.status(500).json({ message: 'Server error getting likes count' });
  }
});

/**
 * @route   GET /api/likes/article/:id/status
 * @desc    Check if user has liked an article
 * @access  Private
 */
router.get('/article/:id/status', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
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
    
    // Check if user has liked this article
    const hasLiked = article.likes.some(
      (id: mongoose.Types.ObjectId) => id.toString() === req.user!.id.toString()
    );
    
    res.json({ hasLiked });
  } catch (err) {
    log(`Get like status error: ${err}`, 'likes');
    res.status(500).json({ message: 'Server error checking like status' });
  }
});

export default router;