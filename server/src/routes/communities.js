import express from 'express';
import { Community } from '../models/Community.js';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/communities
// @desc    Get all communities with member counts
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category.toLowerCase() !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const communities = await Community.find(filter)
      .populate('members', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: communities.length,
      communities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch communities', error: error.message });
  }
});

// @route   GET /api/communities/:id
// @desc    Get community by ID or slug
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    let community;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      community = await Community.findById(id).populate('members', 'username avatar bio');
    } else {
      community = await Community.findOne({
        $or: [{ slug: id.toLowerCase() }, { name: id }],
      }).populate('members', 'username avatar bio');
    }

    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    res.json({ success: true, community });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch community', error: error.message });
  }
});

// @route   POST /api/communities/:id/join
// @desc    Toggle join/leave community
router.post('/:id/join', protect, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    const user = await User.findById(req.user._id);
    const userIdStr = req.user._id.toString();
    const commIdStr = community._id.toString();

    const memberIndex = community.members.findIndex((m) => m.toString() === userIdStr);
    const userIndex = user.joinedCommunities.findIndex((c) => c.toString() === commIdStr);

    let isJoined = false;
    if (memberIndex === -1) {
      community.members.push(req.user._id);
      if (userIndex === -1) user.joinedCommunities.push(community._id);
      isJoined = true;
    } else {
      community.members.splice(memberIndex, 1);
      if (userIndex !== -1) user.joinedCommunities.splice(userIndex, 1);
      isJoined = false;
    }

    await community.save();
    await user.save();

    res.json({
      success: true,
      isJoined,
      membersCount: community.members.length,
      members: community.members,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle community membership' });
  }
});

// @route   GET /api/communities/:id/posts
// @desc    Get posts in a specific community
router.get('/:id/posts', optionalAuth, async (req, res) => {
  try {
    const posts = await Post.find({ community: req.params.id })
      .populate('author', 'username avatar')
      .populate('community', 'name displayName image')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch community posts' });
  }
});

export default router;
