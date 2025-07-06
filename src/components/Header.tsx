
import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-tech-gray-200/50 shadow-electric">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-tech rounded-xl flex items-center justify-center shadow-neon">
              <span className="text-white font-bold text-sm">IB</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-dark bg-clip-text text-transparent">
              Is it Better?
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <span className="bg-gradient-to-r from-tech-electric/10 to-tech-neon/10 text-tech-electric px-4 py-2 rounded-full font-semibold border border-tech-electric/20">
              ✨ 100% Free
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
