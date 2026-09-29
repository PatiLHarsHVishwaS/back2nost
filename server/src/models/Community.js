import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  topic: { type: String, default: 'Welcome to this nostalgia channel' },
});

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    },
    category: {
      type: String,
      default: 'General',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    channels: [channelSchema],
  },
  {
    timestamps: true,
  }
);

export const Community = mongoose.model('Community', communitySchema);
