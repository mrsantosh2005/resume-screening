import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Search, Filter, Users, Star, Clock, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';

const SearchCandidates = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    skills: [],
    minExperience: '',
    maxExperience: '',
    minScore: '',
    maxScore: '',
    status: 'all'
  });
  const [skillInput, setSkillInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [allSkills, setAllSkills] = useState([]);

  useEffect(() => {
    loadSkills();
    searchCandidates();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await api.get('/api/search/filter-options');
      if (res.data.success) {
        setAllSkills(res.data.data.skills || []);
      }
    } catch (error) {
      console.error('Load skills error:', error);
    }
  };

  const searchCandidates = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.post('/api/search/candidates', { ...filters, page, limit: 12 });
      if (response.data.success) {
        setCandidates(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Search candidates error:', error);
      toast.error('Failed to search candidates');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
      setFilters({ ...filters, skills: [...filters.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFilters({ ...filters, skills: filters.skills.filter(s => s !== skill) });
  };

  const handleSearch = () => {
    searchCandidates(1);
  };

  const clearFilters = () => {
    setFilters({
      skills: [],
      minExperience: '',
      maxExperience: '',
      minScore: '',
      maxScore: '',
      status: 'all'
    });
    setTimeout(() => searchCandidates(1), 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'shortlisted':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Shortlisted</span>;
      case 'reviewed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Reviewed</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Search Candidates</h1>
        <p className="text-indigo-100">Find and filter candidates based on skills, experience, and scores</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[200px]">
            <div className="flex flex-wrap gap-2 mb-2">
              {filters.skills.map((skill) => (
                <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-600">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                placeholder="Add skills to filter (e.g., React, Node.js, Python)..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Experience (years)</label>
              <input
                type="number"
                value={filters.minExperience}
                onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Experience (years)</label>
              <input
                type="number"
                value={filters.maxExperience}
                onChange={(e) => setFilters({ ...filters, maxExperience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="20"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Score (%)</label>
              <input
                type="number"
                value={filters.minScore}
                onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Score (%)</label>
              <input
                type="number"
                value={filters.maxScore}
                onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="100"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {(filters.skills.length > 0 || filters.minExperience || filters.maxExperience || filters.minScore || filters.maxScore || filters.status !== 'all') && (
          <div className="mt-3 text-right">
            <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-700">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {pagination.total} {pagination.total === 1 ? 'Candidate' : 'Candidates'} Found
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <div key={candidate._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                      {getStatusBadge(candidate.status)}
                    </div>
                    <p className="text-gray-600 mb-2">{candidate.email}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Applied: {new Date(candidate.uploadedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        Score: <span className={`font-bold ${getScoreColor(candidate.score)}`}>{candidate.score}%</span>
                      </div>
                      <div>
                        Experience: {candidate.experience?.years || 0} years
                      </div>
                    </div>
                    
                    {/* Skills */}
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 8).map((skill) => (
                          <span key={skill} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 8 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{candidate.skills.length - 8} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* AI Recommendation */}
                    {candidate.analysis?.recommendation && (
                      <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                        <p className="text-sm text-indigo-800">{candidate.analysis.recommendation}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <Link
                      to={`/rankings/${candidate.jobId?._id}`}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg hover:bg-indigo-50"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
            <button
              onClick={() => searchCandidates(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => searchCandidates(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCandidates;