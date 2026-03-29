const Resume = require('../models/Resume');
const Job = require('../models/Job');
const AIService = require('../services/aiService');
const { extractTextFromFile } = require('../services/fileService');
const fs = require('fs');

// @desc    Upload and analyze resume
// @route   POST /api/resumes/upload
// @access  Private (Candidate only)
exports.uploadResume = async (req, res) => {
  try {
    const { jobId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file',
      });
    }
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }
    
    // Check if candidate already applied
    const existingResume = await Resume.findOne({
      candidateId: req.user.id,
      jobId: jobId,
    });
    
    if (existingResume) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied for this job',
      });
    }
    
    // Extract text from file
    const filePath = req.file.path;
    const text = await extractTextFromFile(filePath, req.file.mimetype);
    
    // Parse resume using AI
    const parsedData = await AIService.parseResumeText(text);
    
    // Calculate match score
    const matchData = AIService.calculateMatchScore(parsedData, job);
    
    // Generate analysis
    const analysis = await AIService.generateAnalysis(parsedData, job, matchData);
    
    // Create resume entry
    const resume = await Resume.create({
      candidateId: req.user.id,
      jobId: jobId,
      name: parsedData?.name || req.user.name,
      email: parsedData?.email,
      phone: parsedData?.phone,
      skills: parsedData?.skills || [],
      experience: parsedData?.experience || { years: 0, description: '' },
      education: parsedData?.education || {},
      score: matchData.totalScore,
      analysis: {
        matchedSkills: matchData.matchedSkills,
        missingSkills: matchData.missingSkills,
        experienceMatch: matchData.experienceMatch,
        strengths: [],
        weaknesses: [],
        recommendation: analysis,
      },
      fileUrl: filePath,
      fileName: req.file.originalname,
    });
    
    // Clean up file after processing (optional)
    // fs.unlinkSync(filePath);
    
    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get ranked candidates for a job
// @route   GET /api/resumes/rankings/:jobId
// @access  Private (HR only)
exports.getRankings = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }
    
    // Check if HR owns this job
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }
    
    const resumes = await Resume.find({ jobId: req.params.jobId })
      .populate('candidateId', 'name email')
      .sort('-score');
    
    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get candidate's resumes
// @route   GET /api/resumes/my-resumes
// @access  Private (Candidate)
exports.getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ candidateId: req.user.id })
      .populate('jobId', 'title company')
      .sort('-uploadedAt');
    
    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Update resume status
// @route   PUT /api/resumes/:id/status
// @access  Private (HR only)
exports.updateResumeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }
    
    // Check if HR owns the job
    const job = await Job.findById(resume.jobId);
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }
    
    resume.status = status;
    await resume.save();
    
    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};