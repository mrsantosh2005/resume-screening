const express = require('express');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication

router
  .route('/')
  .get(getJobs)
  .post(authorize('hr'), createJob);

router
  .route('/:id')
  .get(getJob)
  .put(authorize('hr'), updateJob)
  .delete(authorize('hr'), deleteJob);

module.exports = router;