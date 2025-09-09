import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  Users, 
  Search,
  Award,
  Star,
  Target
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'overall', name: 'Overall', icon: Trophy },
    { id: 'weekly', name: 'This Week', icon: TrendingUp },
    { id: 'monthly', name: 'This Month', icon: Award },
    { id: 'branch', name: 'By Branch', icon: Users }
  ];

  const sampleLeaderboard = [
    {
      id: 1,
      rank: 1,
      username: 'alex_engineer',
      firstName: 'Alex',
      lastName: 'Johnson',
      branch: 'Computer Science',
      xp: 2847,
      level: 15,
      streak: 23,
      badges: 12,
      avatar: 'A',
      isCurrentUser: false
    },
    {
      id: 2,
      rank: 2,
      username: 'sarah_coder',
      firstName: 'Sarah',
      lastName: 'Chen',
      branch: 'Information Technology',
      xp: 2654,
      level: 14,
      streak: 18,
      badges: 10,
      avatar: 'S',
      isCurrentUser: true
    },
    {
      id: 3,
      rank: 3,
      username: 'mike_dev',
      firstName: 'Mike',
      lastName: 'Rodriguez',
      branch: 'Computer Science',
      xp: 2432,
      level: 13,
      streak: 15,
      badges: 8,
      avatar: 'M',
      isCurrentUser: false
    },
    {
      id: 4,
      rank: 4,
      username: 'emma_tech',
      firstName: 'Emma',
      lastName: 'Wilson',
      branch: 'Electronics & Communication',
      xp: 2218,
      level: 12,
      streak: 12,
      badges: 9,
      avatar: 'E',
      isCurrentUser: false
    },
    {
      id: 5,
      rank: 5,
      username: 'david_ai',
      firstName: 'David',
      lastName: 'Kim',
      branch: 'Computer Science',
      xp: 1987,
      level: 11,
      streak: 9,
      badges: 7,
      avatar: 'D',
      isCurrentUser: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLeaderboard(sampleLeaderboard);
      setLoading(false);
    }, 1000);
  }, [sampleLeaderboard]);

  const filteredLeaderboard = leaderboard.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Medal className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return null;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-500 text-white';
      case 2: return 'bg-gray-400 text-white';
      case 3: return 'bg-amber-600 text-white';
      default: return 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner size="lg" text="Loading leaderboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Leaderboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Compete with fellow engineers and climb the ranks
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 border border-gray-300 dark:border-dark-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="col-span-1">Rank</div>
              <div className="col-span-3">User</div>
              <div className="col-span-2">Branch</div>
              <div className="col-span-1">Level</div>
              <div className="col-span-1">XP</div>
              <div className="col-span-1">Streak</div>
              <div className="col-span-1">Badges</div>
              <div className="col-span-2">Progress</div>
            </div>
          </div>

          {/* Leaderboard Items */}
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {filteredLeaderboard.map((user) => (
              <div
                key={user.id}
                className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  user.isCurrentUser ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                }`}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Rank */}
                  <div className="col-span-1">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(user.rank)}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRankBadge(user.rank)}`}>
                        #{user.rank}
                      </span>
                    </div>
                  </div>

                  {/* User */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{user.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                      </div>
                    </div>
                  </div>

                  {/* Branch */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{user.branch}</span>
                  </div>

                  {/* Level */}
                  <div className="col-span-1">
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4 text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{user.level}</span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="col-span-1">
                    <span className="font-medium text-gray-900 dark:text-white">{user.xp.toLocaleString()}</span>
                  </div>

                  {/* Streak */}
                  <div className="col-span-1">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{user.streak}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="col-span-1">
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{user.badges}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="col-span-2">
                    <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                        style={{ width: `${(user.xp % 1000) / 10}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {user.xp % 1000}/1000 XP to next level
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">892</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg XP</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">5,678</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
