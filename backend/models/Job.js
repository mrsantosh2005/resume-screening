const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
  },
  skills: [{
    type: String,
    required: true,
  }],
  experience: {
    type: Number,
    required: [true, 'Please add required experience in years'],
    min: 0,
  },
  location: String,
  salary: {
    min: Number,
    max: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
});

module.exports = mongoose.model('Job', jobSchema);