import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: 200,
    },
    story: {
      type: String,
      default: '',
      maxlength: 3000,
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Cartoons',
        'Games',
        'Snacks',
        'Toys',
        'Movies',
        'Music',
        'Clothes',
        'School',
        'Gadgets',
        'Cars',
        'Comics',
        'All',
      ],
      default: 'Cartoons',
    },
    era: {
      type: String,
      required: [true, 'Era is required'],
      enum: ['90s', '2000s', '2010s', '2020s'],
      default: '2000s',
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      required: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for like count
postSchema.virtual('likesCount').get(function () {
  return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
postSchema.virtual('commentsCount').get(function () {
  return this.comments ? this.comments.length : 0;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

export const Post = mongoose.model('Post', postSchema);
