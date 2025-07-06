// components/TaskFilters.jsx
import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce'; // Custom hook for debouncing

const TaskFilters = ({ onFilterChange, initialFilters = {} }) => {
  // State for all filter values
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    sort: 'newest',
    ...initialFilters
  });

  // Debounce search input to avoid too many requests
  const debouncedSearch = useDebounce(filters.search, 500);

  // Available filter options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'deadline', label: 'By Deadline' },
    { value: 'priority', label: 'By Priority' }
  ];

  // Handle individual filter changes
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    
    // Immediate update for non-search filters
    if (filterName !== 'search') {
      onFilterChange(newFilters);
    }
  };

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      onFilterChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch]);

  // Render active filter chips
  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (filters.status !== 'all') {
      activeFilters.push(
        <span key="status" className="filter-chip">
          Status: {statusOptions.find(o => o.value === filters.status)?.label}
          <button 
            onClick={() => handleFilterChange('status', 'all')}
            aria-label="Remove status filter"
          >
            &times;
          </button>
        </span>
      );
    }

    if (filters.priority !== 'all') {
      activeFilters.push(
        <span key="priority" className="filter-chip">
          Priority: {priorityOptions.find(o => o.value === filters.priority)?.label}
          <button 
            onClick={() => handleFilterChange('priority', 'all')}
            aria-label="Remove priority filter"
          >
            &times;
          </button>
        </span>
      );
    }

    if (filters.search) {
      activeFilters.push(
        <span key="search" className="filter-chip">
          Search: "{filters.search}"
          <button 
            onClick={() => handleFilterChange('search', '')}
            aria-label="Clear search"
          >
            &times;
          </button>
        </span>
      );
    }

    return activeFilters.length > 0 ? (
      <div className="active-filters">
        {activeFilters}
        <button 
          className="clear-all"
          onClick={() => {
            setFilters({
              search: '',
              status: 'all',
              priority: 'all',
              sort: 'newest'
            });
            onFilterChange({
              search: '',
              status: 'all',
              priority: 'all',
              sort: 'newest'
            });
          }}
        >
          Clear all
        </button>
      </div>
    ) : null;
  };

  return (
    <div className="task-filters">
      {/* Search Input */}
      <div className="filter-group">
        <label htmlFor="search">Search</label>
        <input
          type="text"
          id="search"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      {/* Status Filter */}
      <div className="filter-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          aria-label="Filter by status"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Filter */}
      <div className="filter-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          aria-label="Filter by priority"
        >
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div className="filter-group">
        <label htmlFor="sort">Sort By</label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          aria-label="Sort tasks"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters */}
      {renderActiveFilters()}
    </div>
  );
};

export default TaskFilters;