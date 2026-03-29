const express = require('express');
const {
  uploadResume,
  getRankings,
  getMyResumes,
  updateResumeStatus,
} = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../services/fileService');

const router = express.Router();

router.use(protect);

// Candidate routes
router.post('/upload', authorize('candidate'), upload.single('resume'), uploadResume);
router.get('/my-resumes', authorize('candidate'), getMyResumes);

// HR routes
router.get('/rankings/:jobId', authorize('hr'), getRankings);
router.put('/:id/status', authorize('hr'), updateResumeStatus);

module.exports = router;