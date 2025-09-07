import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <h1 className="text-xl font-bold text-gray-800">NextGen Engineer AI</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Workspaces</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Roadmaps</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Chat</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;