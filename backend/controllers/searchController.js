// backend/controllers/searchController.js
const SearchService = require('../services/searchService');
const Job = require('../models/Job');

// @desc    Search jobs with filters
// @route   POST /api/search/jobs
// @access  Public
exports.searchJobs = async (req, res) => {
  try {
    const {
      searchText,
      skills,
      skillMatch = 'any',
      minExperience,
      maxExperience,
      minSalary,
      maxSalary,
      location,
      jobType,
      datePosted,
      companies,
      sortBy = 'date_desc',
      page = 1,
      limit = 10
    } = req.body;
    
    const filters = {
      searchText,
      skills,
      skillMatch,
      minExperience,
      maxExperience,
      minSalary,
      maxSalary,
      location,
      jobType,
      datePosted,
      companies,
      sortBy
    };
    
    const result = await SearchService.searchJobs(filters, parseInt(page), parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get filter options (skills, locations, etc.)
// @route   GET /api/search/filter-options
// @access  Public
exports.getFilterOptions = async (req, res) => {
  try {
    const result = await SearchService.getFilterOptions();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Autocomplete search
// @route   GET /api/search/autocomplete?q=text
// @access  Public
exports.autocomplete = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(200).json({ success: true, data: { jobs: [], skills: [] } });
    }
    
    const result = await SearchService.autocomplete(q);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Search candidates (HR only)
// @route   POST /api/search/candidates
// @access  Private (HR)
exports.searchCandidates = async (req, res) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    
    const {
      skills,
      minExperience,
      maxExperience,
      minScore,
      maxScore,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.body;
    
    const filters = {
      skills,
      minExperience,
      maxExperience,
      minScore,
      maxScore,
      status,
      startDate,
      endDate
    };
    
    const result = await SearchService.searchCandidates(filters, parseInt(page), parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Search candidates error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get trending skills
// @route   GET /api/search/trending-skills
// @access  Public
exports.getTrendingSkills = async (req, res) => {
  try {
    const skills = await Job.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      data: skills.map(s => ({ name: s._id, count: s.count }))
    });
  } catch (error) {
    console.error('Get trending skills error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};