import { useState, useCallback } from 'react';
import api from '../services/api';
import { debounce } from 'lodash';

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [filterOptions, setFilterOptions] = useState({ skills: [], locations: [], companies: [] });
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [suggestions, setSuggestions] = useState({ jobs: [], skills: [] });

  // Search jobs with filters
  const searchJobs = async (filters, page = 1) => {
    setLoading(true);
    try {
      // Clean filters - remove empty values
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
          if (Array.isArray(filters[key]) && filters[key].length === 0) return;
          if (key === 'skills' && filters[key].length === 0) return;
          cleanFilters[key] = filters[key];
        }
      });
      
      console.log('Searching with filters:', cleanFilters);
      
      const response = await api.post('/api/search/jobs', { 
        ...cleanFilters, 
        page, 
        limit: 12 
      });
      
      if (response.data.success) {
        setResults(response.data.data || []);
        setPagination(response.data.pagination);
        return response.data;
      } else {
        console.error('Search failed:', response.data.error);
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error.response?.data || error.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Get filter options
  const loadFilterOptions = async () => {
    try {
      const response = await api.get('/api/search/filter-options');
      if (response.data.success) {
        setFilterOptions(response.data.data);
      }
    } catch (error) {
      console.error('Load filter options error:', error);
    }
  };

  // Get trending skills
  const loadTrendingSkills = async () => {
    try {
      const response = await api.get('/api/search/trending-skills');
      if (response.data.success) {
        setTrendingSkills(response.data.data || []);
      }
    } catch (error) {
      console.error('Load trending skills error:', error);
    }
  };

  // Debounced autocomplete
  const getAutocompleteSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSuggestions({ jobs: [], skills: [] });
        return;
      }
      
      try {
        const response = await api.get(`/api/search/autocomplete?q=${query}`);
        if (response.data.success) {
          setSuggestions(response.data.data);
        }
      } catch (error) {
        console.error('Autocomplete error:', error);
      }
    }, 300),
    []
  );

  return {
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
  };
};