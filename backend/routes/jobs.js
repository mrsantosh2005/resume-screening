const express = require('express');
const { createJob, getJobs, getJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication

// Only HR can create jobs
router.route('/')
  .get(getJobs)
  .post(authorize('hr'), createJob); // ← This requires 'hr' role

router.route('/:id').get(getJob);

module.exports = router;