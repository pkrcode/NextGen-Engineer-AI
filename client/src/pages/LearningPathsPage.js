import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Users, 
  Target, 
  Search, 
  Filter,
  Play,
  Award,
  TrendingUp,
  Brain,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { learningPathsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import BackBar from '../components/BackBar';
import { toast } from 'react-hot-toast';

const LearningPathsPage = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    fetchLearningPaths();
    fetchDomains();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      setLoading(true);
      const response = await learningPathsAPI.getAll();
      setPaths(response.data);
    } catch (error) {
      // Fallback demo data
      const demo = [
        { _id: 'lp-fs', title: 'Full-Stack Web Developer', description: 'React, Node.js, MongoDB, deployments', domain: 'Web Development', difficulty: 'intermediate', pricing: { isFree: true }, estimatedDuration: { weeks: 12, hoursPerWeek: 6 }, aiAssistance: { adaptiveQuizzes: true, personalizedFeedback: true, realTimeHelp: true }, integrations: { theOdinProject: { enabled: true }}},
        { _id: 'lp-da', title: 'Data Analyst', description: 'SQL, Python, BI Dashboards', domain: 'Data', difficulty: 'beginner', pricing: { isFree: true }, estimatedDuration: { weeks: 10, hoursPerWeek: 5 }, aiAssistance: { adaptiveQuizzes: true, personalizedFeedback: true, realTimeHelp: false }},
        { _id: 'lp-devops', title: 'DevOps Engineer', description: 'CI/CD, Docker, Kubernetes, Terraform', domain: 'DevOps', difficulty: 'advanced', pricing: { isFree: false, price: { amount: 49 } }, estimatedDuration: { weeks: 14, hoursPerWeek: 6 }, aiAssistance: { adaptiveQuizzes: true, personalizedFeedback: false, realTimeHelp: true }},
      ];
      setPaths(demo);
      toast('Showing demo learning paths (API offline)', { icon: 'ℹ️' });
    } finally {
      setLoading(false);
    }
  };

  const fetchDomains = async () => {
    try {
      const response = await learningPathsAPI.getDomains();
      setDomains(response.data);
    } catch (error) {
      setDomains(['Web Development', 'Data', 'AI/ML', 'DevOps']);
    }
  };

  const filteredPaths = paths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = !selectedDomain || path.domain === selectedDomain;
    const matchesDifficulty = !selectedDifficulty || path.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return <Play className="w-4 h-4" />;
      case 'intermediate': return <Target className="w-4 h-4" />;
      case 'advanced': return <Award className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return 'Flexible';
    return `${duration.weeks} weeks • ${duration.hoursPerWeek} hrs/week`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner size="lg" text="Loading learning paths..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackBar title="Learning Paths" />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Learning Paths
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Master new skills with AI-powered adaptive learning
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search learning paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Domain Filter */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Domains</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDomain('');
                setSelectedDifficulty('');
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Paths</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{paths.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Beginner</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {paths.filter(p => p.difficulty === 'beginner').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Intermediate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {paths.filter(p => p.difficulty === 'intermediate').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Advanced</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {paths.filter(p => p.difficulty === 'advanced').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <div
              key={path._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getDifficultyIcon(path.difficulty)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {path.pricing.isFree ? (
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">Free</span>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400 text-sm">${path.pricing.price.amount}</span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {path.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {path.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(path.estimatedDuration)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{path.domain}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.aiAssistance.adaptiveQuizzes && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        Adaptive Quizzes
                      </span>
                    )}
                    {path.aiAssistance.personalizedFeedback && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                        AI Feedback
                      </span>
                    )}
                    {path.aiAssistance.realTimeHelp && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                        Real-time Help
                      </span>
                    )}
                    {path.integrations?.theOdinProject?.enabled && (
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                        Odin Project
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Link
                    to={`/learning-paths/${path._id}`}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-center"
                  >
                    View Details
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No learning paths found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || selectedDomain || selectedDifficulty 
                ? 'Try adjusting your search or filters'
                : 'Learning paths will be available soon'
              }
            </p>
            {searchTerm || selectedDomain || selectedDifficulty ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDomain('');
                  setSelectedDifficulty('');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPathsPage;
