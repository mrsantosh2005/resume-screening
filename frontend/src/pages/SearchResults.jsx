import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../hooks/useSearch';
import SearchBar from '../components/Search/SearchBar';
import FilterPanel from '../components/Search/FilterPanel';
import AdvancedFilters from '../components/Search/AdvancedFilters';
import { Briefcase, MapPin, DollarSign, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    loading, 
    results, 
    pagination, 
    filterOptions,
    trendingSkills,
    suggestions,
    searchJobs,
    loadFilterOptions,
    loadTrendingSkills,
    getAutocompleteSuggestions
  } = useSearch();

  const [filters, setFilters] = useState({
    searchText: '',
    skills: [],
    skillMatch: 'any',
    minExperience: '',
    maxExperience: '',
    minSalary: '',
    maxSalary: '',
    location: '',
    jobType: 'all',
    datePosted: '',
    companies: [],
    sortBy: 'date_desc'
  });

  useEffect(() => {
    loadFilterOptions();
    loadTrendingSkills();
    
    // Get search query from URL
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setFilters(prev => ({ ...prev, searchText: q }));
      searchJobs({ ...filters, searchText: q });
    } else {
      // Default search - show all jobs
      searchJobs(filters);
    }
  }, []);

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, searchText: query }));
    searchJobs({ ...filters, searchText: query });
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    searchJobs(newFilters);
  };

  const handlePageChange = (newPage) => {
    searchJobs(filters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    if (salary >= 10000000) return `₹${(salary / 10000000).toFixed(1)}Cr`;
    if (salary >= 100000) return `₹${(salary / 100000).toFixed(1)}L`;
    return `₹${salary.toLocaleString()}`;
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Recently';
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  // Only candidates can search jobs
  if (user?.role !== 'candidate') {
    return (
      <div className="text-center py-20">
        <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2">Only candidates can search for jobs</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          suggestions={suggestions}
          trendingSkills={trendingSkills}
          onSuggestionClick={(item) => handleSearch(item.title || item)}
          getAutocompleteSuggestions={getAutocompleteSuggestions}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-80 space-y-4">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            onClearFilters={() => handleFilterChange({
              skills: [],
              skillMatch: 'any',
              minExperience: '',
              maxExperience: '',
              minSalary: '',
              maxSalary: '',
              location: '',
              jobType: 'all',
              datePosted: '',
              companies: [],
              sortBy: 'date_desc'
            })}
          />
          <AdvancedFilters
            filters={filters}
            onFilterChange={setFilters}
            filterOptions={filterOptions}
            onApply={(newFilters) => searchJobs(newFilters)}
          />
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {pagination.total} {pagination.total === 1 ? 'job' : 'jobs'} found
            </p>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="date_desc">Newest first</option>
              <option value="date_asc">Oldest first</option>
              <option value="salary_desc">Highest salary</option>
              <option value="salary_asc">Lowest salary</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {/* No Results */}
          {!loading && results.length === 0 && (
            <div className="text-center py-20">
              <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}

          {/* Results Grid */}
          <div className="space-y-4">
            {results.map((job) => (
              <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link to={`/jobs/${job._id}`} className="text-xl font-semibold text-gray-900 hover:text-indigo-600">
                      {job.title}
                    </Link>
                    <p className="text-gray-600 mt-1">{job.company}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                      )}
                      {job.salary?.min && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(job.salary.min)} - {formatSalary(job.salary.max)}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getTimeAgo(job.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.skills?.slice(0, 5).map((skill) => (
                        <span key={skill} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 5 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{job.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {user?.role === 'candidate' && (
                      <Link
                        to={`/upload-resume?jobId=${job._id}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                      >
                        Apply Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 border rounded-lg ${
                      pagination.page === pageNum
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;