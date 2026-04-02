// frontend/src/components/Search/FilterPanel.jsx
import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';

const FilterPanel = ({ filters, onFilterChange, filterOptions, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    skills: true,
    experience: true,
    salary: true,
    location: true,
    date: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSkillToggle = (skill) => {
    const currentSkills = filters.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    onFilterChange({ ...filters, skills: newSkills });
  };

  const handleSkillMatchChange = (match) => {
    onFilterChange({ ...filters, skillMatch: match });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.skills?.length) count++;
    if (filters.minExperience) count++;
    if (filters.maxExperience) count++;
    if (filters.minSalary) count++;
    if (filters.maxSalary) count++;
    if (filters.location) count++;
    if (filters.jobType && filters.jobType !== 'all') count++;
    if (filters.datePosted) count++;
    if (filters.companies?.length) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-indigo-600" />
          <span className="font-semibold text-gray-900">Filters</span>
          {activeFiltersCount() > 0 && (
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
              {activeFiltersCount()}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>

      {/* Filter Content */}
      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-200 space-y-5">
          {/* Clear Filters Button */}
          {activeFiltersCount() > 0 && (
            <button
              onClick={onClearFilters}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear all filters
            </button>
          )}

          {/* Skills Filter */}
          <div>
            <button
              onClick={() => toggleSection('skills')}
              className="w-full flex justify-between items-center py-2"
            >
              <span className="font-medium text-gray-900">Skills</span>
              {expandedSections.skills ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.skills && (
              <div className="mt-2 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSkillMatchChange('any')}
                    className={`text-xs px-3 py-1 rounded-full ${filters.skillMatch === 'any' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Match any
                  </button>
                  <button
                    onClick={() => handleSkillMatchChange('all')}
                    className={`text-xs px-3 py-1 rounded-full ${filters.skillMatch === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Match all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {filterOptions.skills?.slice(0, 30).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        filters.skills?.includes(skill)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experience Filter */}
          <div>
            <button
              onClick={() => toggleSection('experience')}
              className="w-full flex justify-between items-center py-2"
            >
              <span className="font-medium text-gray-900">Experience (years)</span>
              {expandedSections.experience ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.experience && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Min</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={filters.minExperience || ''}
                    onChange={(e) => onFilterChange({ ...filters, minExperience: e.target.value })}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Max</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={filters.maxExperience || ''}
                    onChange={(e) => onFilterChange({ ...filters, maxExperience: e.target.value })}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="20"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Salary Filter */}
          <div>
            <button
              onClick={() => toggleSection('salary')}
              className="w-full flex justify-between items-center py-2"
            >
              <span className="font-medium text-gray-900">Salary (per annum)</span>
              {expandedSections.salary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.salary && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Min (₹)</label>
                  <input
                    type="number"
                    value={filters.minSalary || ''}
                    onChange={(e) => onFilterChange({ ...filters, minSalary: e.target.value })}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Max (₹)</label>
                  <input
                    type="number"
                    value={filters.maxSalary || ''}
                    onChange={(e) => onFilterChange({ ...filters, maxSalary: e.target.value })}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="50,00,000"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div>
            <button
              onClick={() => toggleSection('location')}
              className="w-full flex justify-between items-center py-2"
            >
              <span className="font-medium text-gray-900">Location</span>
              {expandedSections.location ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.location && (
              <div className="mt-2">
                <select
                  value={filters.location || ''}
                  onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All locations</option>
                  {filterOptions.locations?.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Date Posted Filter */}
          <div>
            <button
              onClick={() => toggleSection('date')}
              className="w-full flex justify-between items-center py-2"
            >
              <span className="font-medium text-gray-900">Date Posted</span>
              {expandedSections.date ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.date && (
              <div className="mt-2">
                <select
                  value={filters.datePosted || ''}
                  onChange={(e) => onFilterChange({ ...filters, datePosted: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Any time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="year">Last year</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;