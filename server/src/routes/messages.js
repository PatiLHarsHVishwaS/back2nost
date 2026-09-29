import express from 'express';
import { Message } from '../models/Message.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/messages/:communityId/:channel
// @desc    Get channel messages
router.get('/:communityId/:channel', async (req, res) => {
  try {
    const { communityId, channel } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const messages = await Message.find({
      communityId,
      channel: channel.toLowerCase(),
    })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 })
      .limit(limit);

    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
  }
});

// @route   POST /api/messages
// @desc    Send a message via HTTP REST (also triggers via Socket.io)
router.post('/', protect, async (req, res) => {
  try {
    const { communityId, channel = 'general', text } = req.body;

    if (!communityId || !text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Community ID and message text are required' });
    }

    const message = await Message.create({
      communityId,
      channel: channel.toLowerCase(),
      sender: req.user._id,
      text: text.trim(),
    });

    const populatedMessage = await Message.findById(message._id).populate(
      'sender',
      'username avatar'
    );

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
});

export default router;
