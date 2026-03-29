const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Candidate ID is required'],
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  experience: {
    years: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  education: {
    degree: String,
    institution: String,
    year: Number,
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  analysis: {
    matchedSkills: [String],
    missingSkills: [String],
    experienceMatch: {
      type: Boolean,
      default: false,
    },
    strengths: [String],
    weaknesses: [String],
    recommendation: String,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
    default: 'pending',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index for better query performance
resumeSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });
resumeSchema.index({ jobId: 1, score: -1 });

module.exports = mongoose.model('Resume', resumeSchema);