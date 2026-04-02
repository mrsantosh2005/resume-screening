// backend/routes/search.js
const express = require('express');
const {
  searchJobs,
  getFilterOptions,
  autocomplete,
  searchCandidates,
  getTrendingSkills
} = require('../controllers/searchController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/jobs', searchJobs);
router.get('/filter-options', getFilterOptions);
router.get('/autocomplete', autocomplete);
router.get('/trending-skills', getTrendingSkills);

// Protected routes (HR only)
router.post('/candidates', protect, authorize('hr'), searchCandidates);

module.exports = router;