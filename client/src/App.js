import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import CareerExplorerPage from './pages/CareerExplorerPage';
import CareerRolePage from './pages/CareerRolePage';
import CareerGuidancePage from './pages/CareerGuidancePage';
import LearningPathsFeaturePage from './pages/LearningPathsFeaturePage';
import CollaborationPage from './pages/CollaborationPage';
import SkillVerificationPage from './pages/SkillVerificationPage';
import AIMentorshipPage from './pages/AIMentorshipPage';
import GamificationPage from './pages/GamificationPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import WorkspacePage from './pages/WorkspacePage';
import RoadmapsPage from './pages/RoadmapsPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import TimeCapsulePage from './pages/TimeCapsulePage';
import LearningPathsPage from './pages/LearningPathsPage';
import ExplorePage from './pages/ExplorePage';
import LearningPathDetailPage from './pages/LearningPathDetailPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Main App Layout
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// App Routes
const AppRoutes = () => {

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/careers" element={<CareerExplorerPage />} />
      <Route path="/careers/roles/:id" element={<CareerRolePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Feature Pages */}
      <Route path="/career-guidance" element={<CareerGuidancePage />} />
      <Route path="/learning-paths-feature" element={<LearningPathsFeaturePage />} />
      <Route path="/collaboration" element={<CollaborationPage />} />
      <Route path="/skill-verification" element={<SkillVerificationPage />} />
      <Route path="/ai-mentorship" element={<AIMentorshipPage />} />
      <Route path="/gamification" element={<GamificationPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/workspaces" element={
        <ProtectedRoute>
          <AppLayout>
            <WorkspacePage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/workspaces/:id" element={
        <ProtectedRoute>
          <AppLayout>
            <WorkspacePage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/roadmaps" element={
        <ProtectedRoute>
          <AppLayout>
            <RoadmapsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/roadmaps/:id" element={
        <ProtectedRoute>
          <AppLayout>
            <RoadmapsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <AppLayout>
            <LeaderboardPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/timecapsule" element={
        <ProtectedRoute>
          <AppLayout>
            <TimeCapsulePage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/learning-paths" element={
        <ProtectedRoute>
          <AppLayout>
            <LearningPathsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/learning-paths/:id" element={
        <ProtectedRoute>
          <AppLayout>
            <LearningPathDetailPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  border: '1px solid var(--toast-border)',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
