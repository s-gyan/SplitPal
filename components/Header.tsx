import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-slate-100">
              <span className="text-blue-500">Split</span>Pal
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
