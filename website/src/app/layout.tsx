import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HackerOne Reports Database',
  description: 'Comprehensive database of HackerOne vulnerability reports',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="glass fixed top-0 w-full z-50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 sm:h-20">
              <div className="flex items-center">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold gradient-text">
                      <span className="hidden sm:inline">HackerOne Reports</span>
                      <span className="sm:hidden">H1 Reports</span>
                    </h1>
                    <p className="text-xs text-gray-400 hidden sm:block">Security Research Database</p>
                  </div>
                </div>
              </div>
              <nav className="hidden md:flex items-center space-x-1">
                <a href="/" className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                  Home
                </a>
                <a href="/reports" className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                  Reports
                </a>
                <a href="/categories" className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                  Categories
                </a>
                <a href="/rankings" className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                  Rankings
                </a>
              </nav>
              
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button className="glass p-2 rounded-lg border border-white/10">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Mobile navigation */}
            <div className="md:hidden pb-4">
              <nav className="flex flex-col space-y-1">
                <a href="/" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                  Home
                </a>
                <a href="/reports" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                  All Reports
                </a>
                <a href="/categories" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                  Categories
                </a>
                <a href="/rankings" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                  Rankings
                </a>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="pt-32 md:pt-20 min-h-screen">
          {children}
        </main>
        
        <footer className="glass border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Comprehensive database of security vulnerability reports from the HackerOne platform. 
                  Explore research, bounties, and security insights from ethical hackers worldwide.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <a href="/reports" className="group block text-gray-400 hover:text-green-400 text-sm transition-all duration-200 hover:translate-x-1">
                    <span className="flex items-center">
                      <span className="w-0 h-0.5 bg-green-400 rounded-full transition-all duration-200 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                      Browse Reports
                    </span>
                  </a>
                  <a href="/categories" className="group block text-gray-400 hover:text-green-400 text-sm transition-all duration-200 hover:translate-x-1">
                    <span className="flex items-center">
                      <span className="w-0 h-0.5 bg-green-400 rounded-full transition-all duration-200 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                      Bug Categories
                    </span>
                  </a>
                  <a href="/rankings" className="group block text-gray-400 hover:text-green-400 text-sm transition-all duration-200 hover:translate-x-1">
                    <span className="flex items-center">
                      <span className="w-0 h-0.5 bg-green-400 rounded-full transition-all duration-200 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                      Top Rankings
                    </span>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
                <p className="text-gray-400 text-sm">
                  Data sourced from HackerOne platform for educational and research purposes.
                </p>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 text-center">
              <p className="text-gray-400 text-sm">
                © 2025 HackerOne Reports Database. Built for security researchers and bug bounty hunters.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}