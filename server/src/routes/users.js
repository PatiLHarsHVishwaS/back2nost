import express from 'express';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile/:username
// @desc    Get user profile with stats, created posts, saved posts, and comments
router.get('/profile/:username', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('joinedCommunities', 'name displayName image members')
      .populate({
        path: 'savedPosts',
        populate: { path: 'author', select: 'username avatar' },
      });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    // Get user's own posts
    const posts = await Post.find({ author: user._id })
      .populate('community', 'name displayName image')
      .sort({ createdAt: -1 });

    // Calculate total likes received across all posts
    const totalLikesReceived = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

    // Get user's recent comments
    const comments = await Comment.find({ author: user._id })
      .populate('post', 'title era category')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      profile: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        eraPreference: user.eraPreference,
        interests: user.interests,
        createdAt: user.createdAt,
        joinedCommunities: user.joinedCommunities,
        stats: {
          postsCount: posts.length,
          likesCount: totalLikesReceived,
          savedCount: user.savedPosts ? user.savedPosts.length : 0,
          communitiesCount: user.joinedCommunities ? user.joinedCommunities.length : 0,
        },
      },
      posts,
      savedPosts: user.savedPosts || [],
      comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving user profile', error: error.message });
  }
});

// @route   GET /api/users
// @desc    Search users
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.username = { $regex: search, $options: 'i' };
    }
    const users = await User.find(filter).select('username avatar bio eraPreference createdAt').limit(20);
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search users' });
  }
});

export default router;
