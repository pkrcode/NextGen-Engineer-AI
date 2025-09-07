import React from 'react';
import './App.css';

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="container py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            <span className="gradient-text">
              NextGen Engineer AI
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered career guidance, productivity, and collaboration platform for engineering students
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">🚀 Platform Features</h2>
            
            <div className="grid gap-6 text-left" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="feature-icon bg-blue-100">
                    <span className="text-blue-600 text-sm">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Smart Workspace Management</h3>
                    <p className="text-gray-600 text-sm">Organize your projects, tasks, and collaborate with teams</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="feature-icon bg-purple-100">
                    <span className="text-purple-600 text-sm">🗺️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Personalized Roadmaps</h3>
                    <p className="text-gray-600 text-sm">AI-generated learning paths for your career goals</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="feature-icon bg-green-100">
                    <span className="text-green-600 text-sm">💬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Team Chat</h3>
                    <p className="text-gray-600 text-sm">Real-time messaging and collaboration tools</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="feature-icon bg-yellow-100">
                    <span className="text-yellow-600 text-sm">🏆</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Gamification</h3>
                    <p className="text-gray-600 text-sm">Earn XP, badges, and compete on leaderboards</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="feature-icon bg-red-100">
                    <span className="text-red-600 text-sm">⏰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Time Capsule</h3>
                    <p className="text-gray-600 text-sm">Send messages to your future self</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="feature-icon bg-indigo-100">
                    <span className="text-indigo-600 text-sm">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">AI Mentor</h3>
                    <p className="text-gray-600 text-sm">Get personalized guidance and recommendations</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                🚧 <strong>Development Mode:</strong> The React frontend is now properly set up and ready for development!
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">React</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Tailwind CSS</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Node.js</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">MongoDB</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Socket.IO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
