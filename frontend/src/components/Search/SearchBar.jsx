// frontend/src/components/Search/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

const SearchBar = ({ onSearch, suggestions, trendingSkills, onSuggestionClick }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title || suggestion);
    onSearch(suggestion.title || suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search jobs by title, company, or skill..."
          className="w-full px-5 py-3 pl-12 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </form>

      {/* Autocomplete Suggestions */}
      {showSuggestions && (suggestions.jobs?.length > 0 || suggestions.skills?.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.jobs?.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-500 px-3 py-2">JOBS</p>
              {suggestions.jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => handleSuggestionClick(job)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg"
                >
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </button>
              ))}
            </div>
          )}
          
          {suggestions.skills?.length > 0 && (
            <div className="p-2 border-t">
              <p className="text-xs font-semibold text-gray-500 px-3 py-2">SKILLS</p>
              <div className="flex flex-wrap gap-2 px-3 pb-2">
                {suggestions.skills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSuggestionClick(skill)}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trending Skills */}
      {trendingSkills.length > 0 && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <TrendingUp className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500">Trending:</span>
          {trendingSkills.slice(0, 5).map((skill) => (
            <button
              key={skill.name}
              onClick={() => {
                setQuery(skill.name);
                onSearch(skill.name);
              }}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition"
            >
              {skill.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;