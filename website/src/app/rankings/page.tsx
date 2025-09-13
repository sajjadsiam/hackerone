'use client';

import { useEffect, useState } from 'react';

interface Report {
  program: string;
  title: string;
  link: string;
  upvotes: number;
  bounty: number;
  vuln_type: string;
}

interface RankingsData {
  rankings: {
    top_by_bounty: Report[];
    top_by_upvotes: Report[];
  };
}

export default function RankingsPage() {
  const [data, setData] = useState<RankingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bounty' | 'upvotes'>('bounty');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add extra delay for slow loading
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch rankings');
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading rankings... (Fetching latest data)</p>
          <div className="mt-4">
            <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto">
              <div className="bg-green-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-xl">No ranking data available</div>
      </div>
    );
  }

  const currentRankings = activeTab === 'bounty' ? data.rankings.top_by_bounty : data.rankings.top_by_upvotes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Top Rankings</h1>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('bounty')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'bounty'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          💰 Top Bounties
        </button>
        <button
          onClick={() => setActiveTab('upvotes')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'upvotes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          👍 Most Upvoted
        </button>
      </div>

      {/* Rankings List */}
      <div className="space-y-4">
        {currentRankings.map((report, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between">
              {/* Rank and Main Info */}
              <div className="flex items-start space-x-6 flex-1">
                <div className="text-center min-w-[60px]">
                  <div className={`text-2xl font-bold ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    index === 2 ? 'text-yellow-600' : 'text-gray-400'
                  }`}>
                    #{index + 1}
                  </div>
                  {index < 3 && (
                    <div className="text-lg">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-2 hover:text-green-400">
                    <a href={`https://${report.link}`} target="_blank" rel="noopener noreferrer">
                      {report.title}
                    </a>
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-2">
                    <span className="flex items-center">
                      🏢 {report.program}
                    </span>
                    <span className="flex items-center">
                      🔍 {report.vuln_type || 'Unknown Type'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right min-w-[150px]">
                <div className={`text-xl font-bold mb-1 ${
                  activeTab === 'bounty' ? 'text-green-400' : 'text-blue-400'
                }`}>
                  {activeTab === 'bounty' ? 
                    `$${report.bounty.toLocaleString()}` : 
                    `${report.upvotes} upvotes`
                  }
                </div>
                <div className="text-sm text-gray-400">
                  {activeTab === 'bounty' ? 
                    `${report.upvotes} upvotes` : 
                    `$${report.bounty.toLocaleString()} bounty`
                  }
                </div>
                <a
                  href={`https://${report.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-green-400 hover:text-green-300 text-sm"
                >
                  View Report →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentRankings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No ranking data available.</p>
        </div>
      )}
    </div>
  );
}