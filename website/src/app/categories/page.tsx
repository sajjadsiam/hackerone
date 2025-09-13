'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  name: string;
  filename: string;
  preview: string;
}

interface CategoriesResponse {
  type: string;
  categories: Category[];
}

export default function CategoriesPage() {
  const router = useRouter();
  const [bugTypes, setBugTypes] = useState<Category[]>([]);
  const [programs, setPrograms] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bug_type' | 'program'>('bug_type');
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    bugType: '',
    program: ''
  });

  const fetchCategories = async (type: string) => {
    try {
      const response = await fetch(`/api/categories?type=${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const result: CategoriesResponse = await response.json();
      return result.categories;
    } catch (err) {
      console.error(`Error fetching ${type} categories:`, err);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Add delay for slow loading as requested
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const [bugTypeData, programData] = await Promise.all([
          fetchCategories('bug_type'),
          fetchCategories('program')
        ]);
        
        setBugTypes(bugTypeData);
        setPrograms(programData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleCategoryClick = (categoryName: string) => {
    const filterParam = activeTab === 'bug_type' ? 'vuln_type' : 'program';
    const encodedName = encodeURIComponent(categoryName.trim());
    router.push(`/reports?${filterParam}=${encodedName}`);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing items per page
  };

  const handleTabChange = (newTab: 'bug_type' | 'program') => {
    setActiveTab(newTab);
    setPage(1); // Reset to first page when changing tabs
    setSearch(''); // Clear search when switching tabs
    setFilters({ bugType: '', program: '' }); // Clear filters when switching tabs
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filtering
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
  };

  const clearAllFilters = () => {
    setSearch('');
    setFilters({ bugType: '', program: '' });
    setPage(1);
  };

  // Filter and search functionality
  const filterCategories = (categories: Category[]) => {
    return categories.filter(category => {
      const matchesSearch = !search || 
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.preview.toLowerCase().includes(search.toLowerCase());
      
      const matchesFilter = activeTab === 'bug_type' 
        ? (!filters.bugType || category.name.toLowerCase().includes(filters.bugType.toLowerCase()))
        : (!filters.program || category.name.toLowerCase().includes(filters.program.toLowerCase()));
      
      return matchesSearch && matchesFilter;
    });
  };

  // Get current categories and pagination data
  const currentCategories = activeTab === 'bug_type' ? bugTypes : programs;
  const filteredCategories = filterCategories(currentCategories);
  const totalCategories = filteredCategories.length;
  const totalPages = Math.ceil(totalCategories / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="relative mb-6 flex justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-green-400 border-r-blue-400"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-32 w-32 border-2 border-green-400/30"></div>
            </div>
          </div>
          <p className="text-gray-400 text-lg animate-pulse">Loading categories...</p>
          <div className="flex justify-center space-x-2 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-green-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400/20 rounded-full animate-pulse"
            style={{
              top: `${10 + (i * 7) % 80}%`,
              left: `${5 + (i * 13) % 90}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-8 animate-fade-in-up">
          Report Categories
        </h1>
        <p className="text-gray-400 text-lg mb-8 animate-fade-in-up delay-200 max-w-3xl">
          Explore comprehensive security research organized by vulnerability types and bug bounty programs. 
          Discover patterns, trends, and insights from the cybersecurity community.
        </p>

        {/* Advanced Search & Filter Section */}
        <div className="mb-8 animate-fade-in-up delay-300">
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 opacity-50"></div>
            
            <div className="relative z-10 p-8">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Search Categories
                  </h2>
                  <p className="text-gray-400 text-sm">Find specific bug types or programs quickly</p>
                </div>
              </div>

              {/* Main search bar */}
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400 group-hover:text-green-400 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="🔍 Search categories by name, description, or keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/80 text-white rounded-xl border border-gray-600/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:bg-gray-700/80 transition-all duration-300 placeholder-gray-500 text-lg"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-4 text-gray-400 hover:text-red-400 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Bug Type filter */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-green-400 transition-colors duration-300">
                    🐛 Bug Type Filter
                  </label>
                  <div className="relative">
                    <select
                      value={filters.bugType}
                      onChange={(e) => handleFilterChange('bugType', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/80 text-white rounded-lg border border-gray-600/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 appearance-none cursor-pointer hover:bg-gray-700/80"
                    >
                      <option value="">All Bug Types ({bugTypes.length})</option>
                      {bugTypes.map((bugType) => (
                        <option key={bugType.name} value={bugType.name}>
                          {formatName(bugType.name)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Program filter */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    🏢 Program Filter
                  </label>
                  <div className="relative">
                    <select
                      value={filters.program}
                      onChange={(e) => handleFilterChange('program', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/80 text-white rounded-lg border border-gray-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 appearance-none cursor-pointer hover:bg-gray-700/80"
                    >
                      <option value="">All Programs ({programs.length})</option>
                      {programs.map((program) => (
                        <option key={program.name} value={program.name}>
                          {formatName(program.name)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSearch}
                    className="group relative px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-medium rounded-lg shadow-lg shadow-green-600/25 hover:shadow-green-600/40 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Filter Categories</span>
                    </span>
                  </button>

                  {(search || filters.bugType || filters.program) && (
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2 text-gray-400 hover:text-red-400 border border-gray-600 hover:border-red-400 rounded-lg transition-colors duration-300"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* Animated Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex space-x-2 bg-gray-800/50 backdrop-blur-sm p-2 rounded-xl border border-gray-700/50 animate-fade-in-up delay-400">
            <button
              onClick={() => handleTabChange('bug_type')}
              className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 group ${
                activeTab === 'bug_type'
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg shadow-green-600/25 scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span className="text-2xl">🐛</span>
                <span>By Bug Type ({bugTypes.length})</span>
              </span>
              {activeTab === 'bug_type' && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg blur animate-pulse" />
              )}
            </button>
            <button
              onClick={() => handleTabChange('program')}
              className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 group ${
                activeTab === 'program'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span className="text-2xl">🏢</span>
                <span>By Program ({programs.length})</span>
              </span>
              {activeTab === 'program' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur animate-pulse" />
              )}
            </button>
          </div>
          
          {/* Items per page selector */}
          <div className="flex items-center gap-2 animate-fade-in-up delay-500">
            <span className="text-gray-400">Show:</span>
            {[12, 20, 50].map((count) => (
              <button
                key={count}
                onClick={() => handlePerPageChange(count)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  perPage === count
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {count}
              </button>
            ))}
            <span className="text-gray-400">per page</span>
          </div>
        </div>

        {/* Pagination info */}
        <div className="mb-6 animate-fade-in-up delay-600">
          <p className="text-gray-400">
            Showing {startIndex + 1} to{' '}
            {Math.min(endIndex, totalCategories)} of{' '}
            {totalCategories} categories
            {(search || filters.bugType || filters.program) && (
              <span className="text-green-400 ml-2">
                (filtered from {currentCategories.length} total)
              </span>
            )}
          </p>
        </div>

        {/* Animated Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCategories.map((category, index) => (
            <div 
              key={`${activeTab}-${index}`}
              onClick={() => handleCategoryClick(category.name)}
              className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-green-500/50 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
              style={{ 
                animationDelay: `${600 + index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Floating icon */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                <span className="text-white text-sm">→</span>
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                    {formatName(category.name)}
                  </h3>
                  <div className="w-3 h-3 bg-green-400/50 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <p className="text-gray-400 group-hover:text-gray-300 mb-4 text-sm leading-relaxed transition-colors duration-300">
                  {category.preview}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-mono bg-gray-900/50 px-2 py-1 rounded group-hover:bg-gray-700/50 transition-colors duration-300">
                    {category.filename}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.name);
                    }}
                    className="flex items-center space-x-2 text-green-400 hover:text-green-300 text-sm font-medium transition-all duration-300 group-hover:translate-x-1"
                  >
                    <span>View Reports</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 animate-fade-in-up delay-700">
            {/* Navigation Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Page</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={page}
                  onChange={(e) => {
                    const newPage = parseInt(e.target.value);
                    if (newPage >= 1 && newPage <= totalPages) {
                      setPage(newPage);
                    }
                  }}
                  className="w-16 px-2 py-1 text-center bg-gray-700 text-white rounded border border-gray-600 focus:border-green-400"
                />
                <span className="text-gray-400 text-sm">of {totalPages}</span>
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {totalCategories === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">🔍</div>
            {(search || filters.bugType || filters.program) ? (
              <div>
                <p className="text-gray-400 text-lg mb-4">
                  No categories match your search criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <p className="text-gray-400 text-lg">No categories found for {activeTab.replace('_', ' ')}.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}