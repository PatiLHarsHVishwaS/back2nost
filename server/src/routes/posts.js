import express from 'express';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { User } from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts with filters (era, category, sort, community, search)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { era, category, sort, community, search, author, limit = 50, page = 1 } = req.query;

    const filter = {};

    if (era && era.toLowerCase() !== 'all') {
      filter.era = era;
    }

    if (category && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (community) {
      filter.community = community;
    }

    if (author) {
      filter.author = author;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { story: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Post.find(filter)
      .populate('author', 'username avatar bio')
      .populate('community', 'name displayName image slug')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username avatar' },
      });

    // Sorting
    if (sort === 'trending') {
      // Sort by number of likes + comments
      query = query.sort({ likes: -1, comments: -1, createdAt: -1 });
    } else if (sort === 'loved') {
      query = query.sort({ likes: -1, createdAt: -1 });
    } else {
      // default: latest
      query = query.sort({ createdAt: -1 });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const posts = await query.skip(skip).limit(Number(limit));
    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      count: posts.length,
      total,
      posts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Server error fetching posts', error: error.message });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('community', 'name displayName image slug')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username avatar' },
        options: { sort: { createdAt: -1 } },
      });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Nostalgia post not found' });
    }

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch post', error: error.message });
  }
});

// @route   POST /api/posts
// @desc    Create a new nostalgia post
router.post('/', protect, async (req, res) => {
  try {
    const { title, story, image, category, era, community } = req.body;

    if (!title || !category || !era) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and era are required fields',
      });
    }

    const post = await Post.create({
      author: req.user._id,
      title: title.trim(),
      story: story ? story.trim() : '',
      image: image || '',
      category,
      era,
      community: community || null,
      likes: [],
      comments: [],
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username avatar bio')
      .populate('community', 'name displayName image slug');

    res.status(201).json({
      success: true,
      post: populatedPost,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Failed to create post', error: error.message });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Toggle like on a post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userIdStr = req.user._id.toString();
    const index = post.likes.findIndex((id) => id.toString() === userIdStr);

    let isLiked = false;
    if (index === -1) {
      post.likes.push(req.user._id);
      isLiked = true;
    } else {
      post.likes.splice(index, 1);
      isLiked = false;
    }

    await post.save();

    res.json({
      success: true,
      isLiked,
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to like/unlike post' });
  }
});

// @route   POST /api/posts/:id/save
// @desc    Toggle save post in user's Time Capsule
router.post('/:id/save', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const user = await User.findById(req.user._id);
    const postIdStr = post._id.toString();
    const index = user.savedPosts.findIndex((id) => id.toString() === postIdStr);

    let isSaved = false;
    if (index === -1) {
      user.savedPosts.push(post._id);
      isSaved = true;
    } else {
      user.savedPosts.splice(index, 1);
      isSaved = false;
    }

    await user.save();

    res.json({
      success: true,
      isSaved,
      savedPostsCount: user.savedPosts.length,
      savedPosts: user.savedPosts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save/unsave post' });
  }
});

// @route   POST /api/posts/:id/comments
// @desc    Add comment to a post
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      text: text.trim(),
    });

    post.comments.push(comment._id);
    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'username avatar'
    );

    res.status(201).json({
      success: true,
      comment: populatedComment,
      commentsCount: post.comments.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add comment', error: error.message });
  }
});

export default router;
