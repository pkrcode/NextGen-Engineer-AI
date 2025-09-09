import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Trophy, 
  MessageSquare, 
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Workspaces',
      href: '/workspaces',
      icon: Users,
      current: location.pathname.startsWith('/workspaces')
    },
    {
      name: 'Roadmaps',
      href: '/roadmaps',
      icon: Target,
      current: location.pathname.startsWith('/roadmaps')
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
      icon: Trophy,
      current: location.pathname === '/leaderboard'
    },
    {
      name: 'Time Capsule',
      href: '/time-capsule',
      icon: Calendar,
      current: location.pathname.startsWith('/time-capsule')
    },
    {
      name: 'Chat',
      href: '/chat',
      icon: MessageSquare,
      current: location.pathname.startsWith('/chat')
    }
  ];

  const quickActions = [
    {
      name: 'Create Workspace',
      href: '/workspaces/create',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      name: 'Start Roadmap',
      href: '/roadmaps/start',
      icon: Target,
      color: 'text-green-500'
    },
    {
      name: 'Send Message',
      href: '/time-capsule/create',
      icon: Calendar,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className={`bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-300 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="px-4 py-4 border-t border-gray-200 dark:border-dark-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.name}
                    to={action.href}
                    className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  >
                    <Icon className={`w-4 h-4 mr-3 ${action.color}`} />
                    <span>{action.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-dark-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.firstName || user?.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Level {user?.level || 1} • {user?.xp || 0} XP
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
