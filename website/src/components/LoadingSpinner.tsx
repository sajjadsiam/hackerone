'use client';

import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  text?: string;
  showProgressBar?: boolean;
  duration?: number; // Duration in milliseconds for 0-100%
}

export default function LoadingSpinner({ 
  text = "Loading...", 
  showProgressBar = true,
  duration = 3000 
}: LoadingSpinnerProps) {
  const [progress, setProgress] = useState(1);
  const [loadingText, setLoadingText] = useState(text);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const loadingPhases = [
    { text: "Initializing Security Dashboard...", min: 1, max: 15 },
    { text: "Connecting to HackerOne Database...", min: 15, max: 30 },
    { text: "Loading Vulnerability Reports...", min: 30, max: 50 },
    { text: "Processing Bug Bounty Data...", min: 50, max: 70 },
    { text: "Organizing Report Categories...", min: 70, max: 85 },
    { text: "Finalizing Dashboard Layout...", min: 85, max: 95 },
    { text: "Ready to Launch!", min: 95, max: 100 }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      
      // Smooth progress with slight randomness for realistic feel
      setProgress(prev => {
        const target = progressPercent;
        const diff = target - prev;
        const increment = Math.max(0.5, diff * 0.1 + Math.random() * 0.3);
        return Math.min(prev + increment, 100);
      });

      // Update phase based on progress
      const newPhase = loadingPhases.findIndex(phase => 
        progressPercent >= phase.min && progressPercent < phase.max
      );
      
      if (newPhase !== -1 && newPhase !== currentPhase) {
        setCurrentPhase(newPhase);
        setLoadingText(loadingPhases[newPhase].text);
      }
      
      if (progressPercent >= 100) {
        clearInterval(interval);
        setProgress(100);
        setLoadingText("Complete!");
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, currentPhase, isClient]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating code elements - only render on client */}
        {isClient && [...Array(15)].map((_, i) => {
          // Use deterministic positioning based on index
          const positions = [
            { top: 10, left: 15 }, { top: 25, left: 80 }, { top: 40, left: 20 },
            { top: 55, left: 90 }, { top: 70, left: 10 }, { top: 85, left: 75 },
            { top: 15, left: 60 }, { top: 35, left: 40 }, { top: 50, left: 85 },
            { top: 65, left: 25 }, { top: 80, left: 55 }, { top: 20, left: 35 },
            { top: 45, left: 70 }, { top: 75, left: 45 }, { top: 90, left: 65 }
          ];
          const codeElements = ['</>', '{}', '[]', 'SQL', 'XSS', 'CVE', '0x'];
          
          return (
            <div
              key={i}
              className="absolute text-green-400/20 text-xs font-mono animate-pulse"
              style={{
                top: `${positions[i].top}%`,
                left: `${positions[i].left}%`,
                animationDelay: `${(i * 0.2) % 3}s`,
                animationDuration: `${3 + (i % 3)}s`
              }}
            >
              {codeElements[i % codeElements.length]}
            </div>
          );
        })}
      </div>
      
      <div className="relative text-center z-10">
        {/* Unique circular progress indicator */}
        <div className="relative mb-8">
          <div className="w-48 h-48 mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-700/50"></div>
            
            {/* Progress ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-300 ease-out drop-shadow-lg"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Percentage display */}
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                {Math.floor(progress)}%
              </div>
              
              {/* Security icon that changes based on progress */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 ${
                progress < 50 ? 'bg-gray-700/50' : progress < 90 ? 'bg-blue-500/20' : 'bg-green-500/20'
              }`}>
                <svg className={`w-8 h-8 transition-colors duration-500 ${
                  progress < 50 ? 'text-gray-400' : progress < 90 ? 'text-blue-400' : 'text-green-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={progress < 30 ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" :
                       progress < 70 ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" :
                       "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"} 
                  />
                </svg>
              </div>
            </div>
            
            {/* Rotating outer elements */}
            <div className="absolute inset-0 animate-spin-slow">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400/50 rounded-full"
                  style={{
                    top: '10px',
                    left: '50%',
                    transformOrigin: '0 86px',
                    transform: `rotate(${i * 45}deg) translateX(-1px)`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6 max-w-lg mx-auto">
          {/* Phase indicator */}
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            {loadingText}
          </h3>
          
          {/* Progress phases */}
          <div className="flex justify-between items-center text-xs text-gray-500 px-4">
            {loadingPhases.map((phase, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center transition-all duration-500 ${
                  index <= currentPhase ? 'text-green-400 scale-110' : 'text-gray-600'
                }`}
              >
                <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                  index < currentPhase ? 'bg-green-400 border-green-400' :
                  index === currentPhase ? 'border-green-400 animate-pulse' :
                  'border-gray-600'
                }`} />
                <span className="mt-1 text-center max-w-16 leading-tight">
                  {index === 0 ? 'Init' :
                   index === 1 ? 'Connect' :
                   index === 2 ? 'Load' :
                   index === 3 ? 'Process' :
                   index === 4 ? 'Organize' :
                   index === 5 ? 'Finalize' : 'Ready'}
                </span>
              </div>
            ))}
          </div>
          
          {/* Loading details */}
          <div className="text-gray-400 text-sm leading-relaxed">
            Accessing HackerOne's comprehensive database of {progress < 20 ? '...' : progress < 40 ? '13,000+' : progress < 60 ? '13,157' : '13,157'} vulnerability reports
            {progress >= 70 && ' across 400+ programs'}
            {progress >= 90 && ' with real-time security insights'}
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                progress >= 30 ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
              }`} />
              <span className={progress >= 30 ? 'text-green-400' : 'text-gray-500'}>Database</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                progress >= 60 ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'
              }`} />
              <span className={progress >= 60 ? 'text-blue-400' : 'text-gray-500'}>Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                progress >= 90 ? 'bg-purple-400 animate-pulse' : 'bg-gray-600'
              }`} />
              <span className={progress >= 90 ? 'text-purple-400' : 'text-gray-500'}>UI Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}