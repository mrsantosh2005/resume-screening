const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: String,
  phone: String,
  skills: [String],
  experience: {
    years: Number,
    description: String,
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
    experienceMatch: Boolean,
    strengths: [String],
    weaknesses: [String],
    recommendation: String,
  },
  fileUrl: String,
  fileName: String,
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

module.exports = mongoose.model('Resume', resumeSchema);