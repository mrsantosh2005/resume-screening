const Resume = require('../models/Resume');
const Job = require('../models/Job');
const AIService = require('../services/aiService');
const { extractTextFromFile } = require('../services/fileService');

exports.uploadResume = async (req, res) => {
  try {
    const { jobId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    
    const existingResume = await Resume.findOne({ candidateId: req.user.id, jobId });
    if (existingResume) {
      return res.status(400).json({ success: false, error: 'Already applied' });
    }
    
    const text = await extractTextFromFile(req.file.path);
    const parsedData = await AIService.parseResumeText(text);
    const matchData = AIService.calculateMatchScore(parsedData, job);
    const analysisData = AIService.generateAnalysis(parsedData, job, matchData);
    
    const resume = await Resume.create({
      candidateId: req.user.id,
      jobId,
      name: parsedData.name || req.user.name,
      email: parsedData.email,
      skills: parsedData.skills || [],
      experience: { years: parsedData.experience?.years || 0 },
      score: matchData.totalScore,
      analysis: {
        matchedSkills: matchData.matchedSkills,
        missingSkills: matchData.missingSkills,
        experienceMatch: matchData.experienceMatch,
        strengths: analysisData.strengths,
        weaknesses: analysisData.weaknesses,
        recommendation: analysisData.recommendation,
      },
      fileUrl: req.file.path,
      fileName: req.file.originalname,
    });
    
    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRankings = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    const resumes = await Resume.find({ jobId: req.params.jobId })
      .populate('candidateId', 'name email')
      .sort('-score');
    
    res.status(200).json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ candidateId: req.user.id })
      .populate('jobId', 'title company')
      .sort('-uploadedAt');
    
    res.status(200).json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateResumeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }
    
    const job = await Job.findById(resume.jobId);
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    resume.status = status;
    await resume.save();
    
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};