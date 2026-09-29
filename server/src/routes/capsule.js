import express from 'express';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/capsule
// @desc    Get user's personal time capsule of saved nostalgia memories
router.get('/', protect, async (req, res) => {
  try {
    const { era, category } = req.query;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const filter = {
      _id: { $in: user.savedPosts || [] },
    };

    if (era && era.toLowerCase() !== 'all') {
      filter.era = era;
    }

    if (category && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    const savedPosts = await Post.find(filter)
      .populate('author', 'username avatar')
      .populate('community', 'name displayName image')
      .sort({ createdAt: -1 });

    // Grouping by era and categories for scrapbook view
    const eraBreakdown = {
      '90s': 0,
      '2000s': 0,
      '2010s': 0,
      '2020s': 0,
    };

    savedPosts.forEach((post) => {
      if (eraBreakdown[post.era] !== undefined) {
        eraBreakdown[post.era] += 1;
      }
    });

    res.json({
      success: true,
      count: savedPosts.length,
      savedPosts,
      eraBreakdown,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch Time Capsule', error: error.message });
  }
});

export default router;
