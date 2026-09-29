import express from 'express';
import { upload, uploadToCloudinaryOrLocal } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload an image (Cloudinary or local static fallback)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const imageUrl = await uploadToCloudinaryOrLocal(req.file);

    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
});

export default router;
