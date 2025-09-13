'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Report {
  program: string;
  title: string;
  link: string;
  upvotes: number;
  bounty: number;
  vuln_type: string;
}

interface ReportsResponse {
  reports: Report[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_reports: number;
    per_page: number;
  };
}

import { Suspense } from 'react';

function ReportsPageContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    program: '',
    vuln_type: '',
    min_bounty: ''
  });
  const [allPrograms, setAllPrograms] = useState<string[]>([]);
  const [allVulnTypes, setAllVulnTypes] = useState<string[]>([]);

  const fetchReports = async (currentPage: number, searchTerm: string = '', currentFilters: any = {}) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: perPage.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (currentFilters.program) params.append('program', currentFilters.program);
      if (currentFilters.vuln_type) params.append('vuln_type', currentFilters.vuln_type);
      if (currentFilters.min_bounty) params.append('min_bounty', currentFilters.min_bounty);

      const response = await fetch(`/api/reports?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dropdown options on component mount
  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  // Initialize and handle all data fetching
  useEffect(() => {
    const urlProgram = decodeURIComponent(searchParams.get('program') || '');
    const urlVulnType = decodeURIComponent(searchParams.get('vuln_type') || '');
    const urlMinBounty = searchParams.get('min_bounty') || '';
    
    const newFilters = {
      program: urlProgram,
      vuln_type: urlVulnType,
      min_bounty: urlMinBounty
    };
    
    // Update filters if they changed
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
      setPage(1); // Reset to first page when filters change from URL
      fetchReports(1, search, newFilters);
    } else {
      // Regular pagination/perPage change
      fetchReports(page, search, filters);
    }
  }, [searchParams, page, perPage]);

  const handleSearch = () => {
    setPage(1);
    fetchReports(1, search, filters);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);
    fetchReports(1, search, newFilters);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
    fetchReports(1, search, filters);
  };

  const fetchDropdownOptions = async () => {
    try {
      // Fetch programs
      const programsResponse = await fetch('/api/categories?type=program');
      if (programsResponse.ok) {
        const programsData = await programsResponse.json();
        setAllPrograms(programsData.categories.map((cat: any) => cat.name).sort());
      }

      // Fetch vulnerability types
      const vulnTypesResponse = await fetch('/api/categories?type=bug_type');
      if (vulnTypesResponse.ok) {
        const vulnTypesData = await vulnTypesResponse.json();
        setAllVulnTypes(vulnTypesData.categories.map((cat: any) => cat.name).sort());
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-green-400 border-r-blue-400 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full border-2 border-green-400/30"></div>
          </div>
          <p className="text-gray-400 text-lg animate-pulse">Loading reports...</p>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">All Reports</h1>

      {/* Animated Search and Filters */}
      <div className="relative mb-8">
        {/* Background with animated effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl opacity-50 animate-pulse"></div>
        
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
                Advanced Search & Filters
              </h2>
              <p className="text-gray-400 text-sm">Find exactly what you're looking for</p>
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
                placeholder="🔍 Search vulnerability reports, exploit techniques, researcher insights..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Program filter */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-green-400 transition-colors duration-300">
                🏢 Bug Bounty Program
              </label>
              <div className="relative">
                <select
                  value={filters.program}
                  onChange={(e) => handleFilterChange('program', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/80 text-white rounded-lg border border-gray-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 appearance-none cursor-pointer hover:bg-gray-700/80"
                >
                  <option value="">All Programs ({allPrograms.length})</option>
                  {allPrograms.map((program) => (
                    <option key={program} value={program}>
                      {program}
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

            {/* Vulnerability type filter */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-300">
                🐛 Vulnerability Type
              </label>
              <div className="relative">
                <select
                  value={filters.vuln_type}
                  onChange={(e) => handleFilterChange('vuln_type', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/80 text-white rounded-lg border border-gray-600/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 appearance-none cursor-pointer hover:bg-gray-700/80"
                >
                  <option value="">All Types ({allVulnTypes.length})</option>
                  {allVulnTypes.map((vulnType) => (
                    <option key={vulnType} value={vulnType}>
                      {vulnType}
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

            {/* Bounty filter */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                💰 Minimum Bounty
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="e.g., 1000"
                  value={filters.min_bounty}
                  onChange={(e) => handleFilterChange('min_bounty', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/80 text-white rounded-lg border border-gray-600/50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 placeholder-gray-500 hover:bg-gray-700/80"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  $
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons and controls */}
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
                  <span>Search Reports</span>
                </span>
              </button>

              {(search || filters.program || filters.vuln_type || filters.min_bounty) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setFilters({ program: '', vuln_type: '', min_bounty: '' });
                    setPage(1);
                    fetchReports(1, '', { program: '', vuln_type: '', min_bounty: '' });
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-red-400 border border-gray-600 hover:border-red-400 rounded-lg transition-colors duration-300"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Enhanced items per page selector */}
            <div className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-2">
              <span className="text-gray-400 text-sm font-medium">Show:</span>
              {[20, 50, 100].map((count) => (
                <button
                  key={count}
                  onClick={() => handlePerPageChange(count)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    perPage === count
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600 hover:scale-105'
                  }`}
                >
                  {count}
                </button>
              ))}
              <span className="text-gray-400 text-sm">per page</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator for search/filter operations */}
      {loading && (
        <div className="text-center mb-8 relative">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-green-400 border-r-blue-400 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full border-2 border-green-400/20"></div>
          </div>
          <p className="text-gray-400 mt-4 animate-pulse">Loading reports...</p>
          <div className="flex justify-center space-x-1 mt-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {data && (
        <>
          <div className="mb-6">
            <p className="text-gray-400">
              Showing {((data.pagination.current_page - 1) * data.pagination.per_page) + 1} to{' '}
              {Math.min(data.pagination.current_page * data.pagination.per_page, data.pagination.total_reports)} of{' '}
              {data.pagination.total_reports} reports
            </p>
          </div>

          {/* Animated Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {data.reports.map((report, index) => (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-green-500/50 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Security badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                  <span className="text-white text-xs">🔒</span>
                </div>

                <div className="relative z-10">
                  {/* Header with bounty and upvotes */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex space-x-4">
                      <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-full border border-green-500/30">
                        <span className="text-green-400 font-bold text-sm">${report.bounty.toLocaleString()}</span>
                      </div>
                      <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full border border-blue-500/30">
                        <span className="text-blue-400 font-bold text-sm">{report.upvotes} ↑</span>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-gray-900/50 rounded text-gray-400 text-xs font-mono group-hover:bg-gray-700/50 transition-colors duration-300">
                      {report.program}
                    </div>
                  </div>
                  
                  {/* Title with enhanced styling */}
                  <h3 className="text-white font-medium mb-4 line-clamp-2 group-hover:text-green-400 transition-colors duration-300 leading-relaxed">
                    <a 
                      href={report.link.startsWith('http') ? report.link : `https://${report.link}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {report.title}
                    </a>
                  </h3>
                  
                  {/* Footer with vulnerability type and action */}
                  <div className="flex justify-between items-end">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400/50 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {report.vuln_type || 'Unknown Type'}
                      </span>
                    </div>
                    <a
                      href={report.link.startsWith('http') ? report.link : `https://${report.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-green-400 hover:text-green-300 text-sm font-medium transition-all duration-300 group-hover:translate-x-1"
                    >
                      <span>View Report</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Animated border effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {data.pagination.total_pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
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
                    max={data.pagination.total_pages}
                    value={page}
                    onChange={(e) => {
                      const newPage = parseInt(e.target.value);
                      if (newPage >= 1 && newPage <= data.pagination.total_pages) {
                        setPage(newPage);
                      }
                    }}
                    className="w-16 px-2 py-1 text-center bg-gray-700 text-white rounded border border-gray-600 focus:border-green-400"
                  />
                  <span className="text-gray-400 text-sm">of {data.pagination.total_pages}</span>
                </div>

                <button
                  onClick={() => setPage(Math.min(data.pagination.total_pages, page + 1))}
                  disabled={page === data.pagination.total_pages}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense>
      <ReportsPageContent />
    </Suspense>
  );
}
