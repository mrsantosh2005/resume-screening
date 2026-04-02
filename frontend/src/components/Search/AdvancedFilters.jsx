// frontend/src/components/Search/AdvancedFilters.jsx
import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';

const AdvancedFilters = ({ filters, onFilterChange, filterOptions, onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(tempFilters);
    onApply(tempFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = {
      skills: [],
      skillMatch: 'any',
      minExperience: '',
      maxExperience: '',
      minSalary: '',
      maxSalary: '',
      location: '',
      jobType: 'all',
      datePosted: '',
      companies: []
    };
    setTempFilters(cleared);
    onFilterChange(cleared);
    onApply(cleared);
    setIsOpen(false);
  };

  const handleCompanyToggle = (company) => {
    const current = tempFilters.companies || [];
    const updated = current.includes(company)
      ? current.filter(c => c !== company)
      : [...current, company];
    setTempFilters({ ...tempFilters, companies: updated });
  };

  return (
    <>
      {/* Advanced Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        <Settings className="h-4 w-4" />
        <span className="text-sm">Advanced Filters</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Advanced Filters</h2>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <div className="flex gap-3">
                  {['all', 'remote', 'onsite', 'hybrid'].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="jobType"
                        value={type}
                        checked={tempFilters.jobType === type}
                        onChange={(e) => setTempFilters({ ...tempFilters, jobType: e.target.value })}
                        className="text-indigo-600"
                      />
                      <span className="text-sm capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Companies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Companies</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                  {filterOptions.companies?.slice(0, 20).map((company) => (
                    <label key={company} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tempFilters.companies?.includes(company)}
                        onChange={() => handleCompanyToggle(company)}
                        className="rounded text-indigo-600"
                      />
                      <span className="text-sm">{company}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={tempFilters.sortBy || 'date_desc'}
                  onChange={(e) => setTempFilters({ ...tempFilters, sortBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="date_desc">Newest first</option>
                  <option value="date_asc">Oldest first</option>
                  <option value="salary_desc">Highest salary</option>
                  <option value="salary_asc">Lowest salary</option>
                  <option value="experience_desc">Most experience</option>
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdvancedFilters;