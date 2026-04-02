// backend/services/searchService.js
const Job = require('../models/Job');
const Resume = require('../models/Resume');

class SearchService {
  
  // Advanced job search with multiple filters
  static async searchJobs(filters, page = 1, limit = 10) {
    try {
      const query = { status: 'open' };
      
      // 1. Text search (title, company, description)
      if (filters.searchText) {
        query.$or = [
          { title: { $regex: filters.searchText, $options: 'i' } },
          { company: { $regex: filters.searchText, $options: 'i' } },
          { description: { $regex: filters.searchText, $options: 'i' } }
        ];
      }
      
      // 2. Skills filter (match any or all)
      if (filters.skills && filters.skills.length > 0) {
        if (filters.skillMatch === 'all') {
          query.skills = { $all: filters.skills };
        } else {
          query.skills = { $in: filters.skills };
        }
      }
      
      // 3. Experience range
      if (filters.minExperience !== undefined || filters.maxExperience !== undefined) {
        query.experience = {};
        if (filters.minExperience) query.experience.$gte = parseInt(filters.minExperience);
        if (filters.maxExperience) query.experience.$lte = parseInt(filters.maxExperience);
      }
      
      // 4. Salary range
      if (filters.minSalary || filters.maxSalary) {
        query['salary.min'] = {};
        if (filters.minSalary) query['salary.min'].$gte = parseInt(filters.minSalary);
        if (filters.maxSalary) query['salary.min'].$lte = parseInt(filters.maxSalary);
      }
      
      // 5. Location filter
      if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
      }
      
      // 6. Job type (remote/onsite/hybrid)
      if (filters.jobType && filters.jobType !== 'all') {
        query.jobType = filters.jobType;
      }
      
      // 7. Date posted
      if (filters.datePosted) {
        const dateLimit = new Date();
        switch (filters.datePosted) {
          case 'today':
            dateLimit.setHours(0, 0, 0, 0);
            break;
          case 'week':
            dateLimit.setDate(dateLimit.getDate() - 7);
            break;
          case 'month':
            dateLimit.setMonth(dateLimit.getMonth() - 1);
            break;
          case 'year':
            dateLimit.setFullYear(dateLimit.getFullYear() - 1);
            break;
        }
        query.createdAt = { $gte: dateLimit };
      }
      
      // 8. Company filter
      if (filters.companies && filters.companies.length > 0) {
        query.company = { $in: filters.companies };
      }
      
      // Sorting
      let sortOption = {};
      switch (filters.sortBy) {
        case 'date_desc':
          sortOption = { createdAt: -1 };
          break;
        case 'date_asc':
          sortOption = { createdAt: 1 };
          break;
        case 'salary_desc':
          sortOption = { 'salary.min': -1 };
          break;
        case 'salary_asc':
          sortOption = { 'salary.min': 1 };
          break;
        case 'experience_desc':
          sortOption = { experience: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
      
      // Pagination
      const skip = (page - 1) * limit;
      
      // Execute search
      const jobs = await Job.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email');
      
      const total = await Job.countDocuments(query);
      
      return {
        success: true,
        data: jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        filters: query
      };
    } catch (error) {
      console.error('Search error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get unique filter options (for dropdowns)
  static async getFilterOptions() {
    try {
      const [skills, locations, companies, experienceRange] = await Promise.all([
        Job.distinct('skills'),
        Job.distinct('location'),
        Job.distinct('company'),
        Job.aggregate([
          { $group: { _id: null, min: { $min: '$experience' }, max: { $max: '$experience' } } }
        ])
      ]);
      
      return {
        success: true,
        data: {
          skills: skills.filter(s => s).sort(),
          locations: locations.filter(l => l).sort(),
          companies: companies.filter(c => c).sort(),
          experienceRange: {
            min: experienceRange[0]?.min || 0,
            max: experienceRange[0]?.max || 10
          }
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Search candidates (for HR)
  static async searchCandidates(filters, page = 1, limit = 10) {
    try {
      const query = {};
      
      // Skills search
      if (filters.skills && filters.skills.length > 0) {
        query.skills = { $in: filters.skills };
      }
      
      // Experience range
      if (filters.minExperience || filters.maxExperience) {
        query['experience.years'] = {};
        if (filters.minExperience) query['experience.years'].$gte = parseInt(filters.minExperience);
        if (filters.maxExperience) query['experience.years'].$lte = parseInt(filters.maxExperience);
      }
      
      // Score range
      if (filters.minScore || filters.maxScore) {
        query.score = {};
        if (filters.minScore) query.score.$gte = parseInt(filters.minScore);
        if (filters.maxScore) query.score.$lte = parseInt(filters.maxScore);
      }
      
      // Status filter
      if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
      }
      
      // Date range
      if (filters.startDate || filters.endDate) {
        query.uploadedAt = {};
        if (filters.startDate) query.uploadedAt.$gte = new Date(filters.startDate);
        if (filters.endDate) query.uploadedAt.$lte = new Date(filters.endDate);
      }
      
      const skip = (page - 1) * limit;
      
      const candidates = await Resume.find(query)
        .populate('candidateId', 'name email')
        .populate('jobId', 'title company')
        .sort('-score')
        .skip(skip)
        .limit(limit);
      
      const total = await Resume.countDocuments(query);
      
      return {
        success: true,
        data: candidates,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Fuzzy search (autocomplete)
  static async autocomplete(searchText) {
    try {
      const jobs = await Job.find({
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { company: { $regex: searchText, $options: 'i' } }
        ]
      }).limit(5);
      
      const skills = await Job.distinct('skills', {
        skills: { $regex: searchText, $options: 'i' }
      });
      
      return {
        success: true,
        data: {
          jobs: jobs.map(j => ({ id: j._id, title: j.title, company: j.company })),
          skills: skills.slice(0, 5)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Save search for later
  static async saveSearch(userId, searchName, filters) {
    try {
      const savedSearch = new SavedSearch({
        userId,
        name: searchName,
        filters,
        createdAt: new Date()
      });
      
      await savedSearch.save();
      return { success: true, data: savedSearch };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = SearchService;