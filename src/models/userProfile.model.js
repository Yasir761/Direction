import mongoose, { Schema } from 'mongoose';

const userProfileSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    required: true,
    trim: true
  },
  // Consider separate schemas for complex data
  education: [{
    institution: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  }],
  workExperience: [{
    company: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    description: {
      type: String
    }
  }],
  // Other optional fields (e.g., skills, interests, language proficiency)
  socialMedia: [{
    platform: {
      type: String,
      required: true,
      enum: ['facebook', 'x', 'instagram', 'linkedin', 'github']
    },
    link: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: String, // Cloudinary URL for avatar image (optional)
  },
  coverImage: {
    type: String, // Cloudinary URL for cover image (optional)
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
}, { timestamps: true });

export const UserProfile = mongoose.model('UserProfile', userProfileSchema);
