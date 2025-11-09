
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-slate-900">
              <span className="text-blue-600">Split</span>Pal
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
