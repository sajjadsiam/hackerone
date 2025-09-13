'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Stats {
  total_reports: number;
  total_bounty: number;
  total_upvotes: number;
  unique_programs: number;
  unique_vuln_types: number;
}

interface Report {
  program: string;
  title: string;
  link: string;
  upvotes: number;
  bounty: number;
  vuln_type: string;
}

interface HomePageData {
  metadata: {
    stats: Stats;
  };
  rankings: {
    top_by_bounty: Report[];
    top_by_upvotes: Report[];
  };
}

export default function HomePage() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stats', {
          headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=60'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading HackerOne reports..." showProgressBar={true} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-xl">No data available</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-pink-500/5 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400/30 rounded-full animate-ping delay-100"></div>
        <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-blue-400/40 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-pink-400/40 rounded-full animate-ping delay-1000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="mb-6 sm:mb-8">
            <span className="inline-block px-3 sm:px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              🔒 Security Research Platform
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight px-2">
            HackerOne Reports
            <span className="gradient-text block mt-1 sm:mt-2"> Database</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-10 lg:mb-12 px-2">
            Explore comprehensive vulnerability reports from the world's largest bug bounty platform. 
            Discover cutting-edge security research, analyze trending vulnerabilities, and learn from the best ethical hackers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <a href="/reports" className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 hover-lift glow-green text-sm sm:text-base">
              Explore Reports
            </a>
            <a href="/rankings" className="px-6 sm:px-8 py-3 sm:py-4 glass rounded-xl text-white font-semibold hover:bg-white/10 transition-all duration-300 hover-lift border border-white/20 text-sm sm:text-base">
              View Rankings
            </a>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-16 sm:mb-20 px-2">
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover-lift border border-white/10 group">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">
              {data.metadata.stats.total_reports.toLocaleString()}
            </div>
            <div className="text-gray-400 font-medium text-xs sm:text-sm lg:text-base">Total Reports</div>
            <div className="mt-2 sm:mt-4 h-1 bg-gradient-to-r from-green-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover-lift border border-white/10 group">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">
              ${data.metadata.stats.total_bounty.toLocaleString()}
            </div>
            <div className="text-gray-400 font-medium text-xs sm:text-sm lg:text-base">Total Bounties</div>
            <div className="mt-2 sm:mt-4 h-1 bg-gradient-to-r from-yellow-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover-lift border border-white/10 group">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">
              {data.metadata.stats.total_upvotes.toLocaleString()}
            </div>
            <div className="text-gray-400 font-medium text-xs sm:text-sm lg:text-base">Total Upvotes</div>
            <div className="mt-2 sm:mt-4 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover-lift border border-white/10 group">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">
              {data.metadata.stats.unique_programs}
            </div>
            <div className="text-gray-400 font-medium text-xs sm:text-sm lg:text-base">Programs</div>
            <div className="mt-2 sm:mt-4 h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover-lift border border-white/10 group">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">
              {data.metadata.stats.unique_vuln_types}
            </div>
            <div className="text-gray-400 font-medium text-xs sm:text-sm lg:text-base">Bug Types</div>
            <div className="mt-2 sm:mt-4 h-1 bg-gradient-to-r from-red-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Top Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20 px-2">
          {/* Top by Bounty */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Top Bounties</h2>
                <p className="text-gray-400 text-xs sm:text-sm">Highest paid bug reports</p>
              </div>
            </div>
            <div className="space-y-4">
              {data.rankings.top_by_bounty.slice(0, 5).map((report, index) => (
                <div key={index} className="glass rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5 hover-lift group">
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium">
                        #{index + 1}
                      </span>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text">${report.bounty.toLocaleString()}</div>
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {report.upvotes}
                    </div>
                  </div>
                  <h3 className="text-white font-medium mb-2 sm:mb-3 line-clamp-2 group-hover:text-green-400 transition-colors text-sm sm:text-base">
                    {report.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                    <span className="text-blue-400 font-medium truncate">{report.program}</span>
                    <span className="text-gray-500 bg-gray-800/50 px-2 py-1 rounded-lg text-xs self-start sm:self-auto">{report.vuln_type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top by Upvotes */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Most Upvoted</h2>
                <p className="text-gray-400 text-xs sm:text-sm">Community favorites</p>
              </div>
            </div>
            <div className="space-y-4">
              {data.rankings.top_by_upvotes.slice(0, 5).map((report, index) => (
                <div key={index} className="glass rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/5 hover-lift group">
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-medium">
                        #{index + 1}
                      </span>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text">{report.upvotes} ♥</div>
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">${report.bounty.toLocaleString()}</div>
                  </div>
                  <h3 className="text-white font-medium mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors text-sm sm:text-base">
                    {report.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                    <span className="text-green-400 font-medium truncate">{report.program}</span>
                    <span className="text-gray-500 bg-gray-800/50 px-2 py-1 rounded-lg text-xs self-start sm:self-auto">{report.vuln_type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-2">
          <a href="/reports" className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center hover-lift border border-white/10 group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:gradient-text transition-all">Browse All Reports</h3>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">Search and filter through comprehensive vulnerability reports from security researchers worldwide</p>
          </a>
          <a href="/categories" className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center hover-lift border border-white/10 group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:gradient-text transition-all">Bug Categories</h3>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">Explore reports organized by vulnerability types and discover trending attack vectors</p>
          </a>
          <a href="/rankings" className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center hover-lift border border-white/10 group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:gradient-text transition-all">Top Rankings</h3>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">View highest bounties, most impactful discoveries, and trending security researchers</p>
          </a>
        </div>
      </div>
    </div>
  );
}