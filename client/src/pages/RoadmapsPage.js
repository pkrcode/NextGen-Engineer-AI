import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const domains = [
  { id: 'all', name: 'All Domains', color: 'bg-gray-500' },
  { id: 'ai-ml', name: 'AI/ML', color: 'bg-purple-500' },
  { id: 'web-dev', name: 'Web Development', color: 'bg-blue-500' },
  { id: 'mobile-dev', name: 'Mobile Development', color: 'bg-green-500' },
  { id: 'data-science', name: 'Data Science', color: 'bg-orange-500' },
  { id: 'cybersecurity', name: 'Cybersecurity', color: 'bg-red-500' }
];

const RoadmapsPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  const sampleRoadmaps = [
    {
      id: 1,
      title: 'Full-Stack Web Development',
      description: 'Master modern web development with React, Node.js, and MongoDB',
      domain: 'web-dev',
      level: 'Beginner',
      duration: '6 months',
      xpReward: 500,
      enrolledUsers: 1247,
      rating: 4.8,
      isFeatured: true,
      milestones: 12,
      completedMilestones: 0
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      description: 'Learn the basics of ML with Python, TensorFlow, and real-world projects',
      domain: 'ai-ml',
      level: 'Intermediate',
      duration: '8 months',
      xpReward: 750,
      enrolledUsers: 892,
      rating: 4.9,
      isFeatured: true,
      milestones: 15,
      completedMilestones: 0
    },
    {
      id: 3,
      title: 'Mobile App Development',
      description: 'Build iOS and Android apps with React Native and Flutter',
      domain: 'mobile-dev',
      level: 'Beginner',
      duration: '5 months',
      xpReward: 600,
      enrolledUsers: 567,
      rating: 4.7,
      isFeatured: false,
      milestones: 10,
      completedMilestones: 0
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRoadmaps(sampleRoadmaps);
      setLoading(false);
    }, 1000);
  }, [sampleRoadmaps]);

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roadmap.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'all' || roadmap.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner size="lg" text="Loading roadmaps..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Learning Roadmaps
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Choose your path to becoming a next-gen engineer
              </p>
            </div>
            <Link
              to="/roadmaps/create"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Roadmap</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search roadmaps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDomain === domain.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 border border-gray-300 dark:border-dark-600'
                }`}
              >
                {domain.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Roadmaps */}
        {filteredRoadmaps.filter(r => r.isFeatured).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Featured Roadmaps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoadmaps
                .filter(roadmap => roadmap.isFeatured)
                .map((roadmap) => (
                  <RoadmapCard key={roadmap.id} roadmap={roadmap} featured />
                ))}
            </div>
          </div>
        )}

        {/* All Roadmaps */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            All Roadmaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RoadmapCard = ({ roadmap, featured = false }) => {
  const domain = domains.find(d => d.id === roadmap.domain);

  return (
    <div className={`bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden transition-transform hover:scale-105 ${
      featured ? 'ring-2 ring-primary-500' : ''
    }`}>
      {featured && (
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-2">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Featured</span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {roadmap.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {roadmap.description}
            </p>
          </div>
          <div className={`w-3 h-3 rounded-full ${domain?.color} ml-2`} />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Level</span>
            <span className="font-medium text-gray-900 dark:text-white">{roadmap.level}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Duration</span>
            <span className="font-medium text-gray-900 dark:text-white">{roadmap.duration}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">XP Reward</span>
            <span className="font-medium text-primary-600 dark:text-primary-400">{roadmap.xpReward} XP</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{roadmap.enrolledUsers}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{roadmap.rating}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {roadmap.milestones} milestones
          </div>
        </div>

        <Link
          to={`/roadmaps/${roadmap.id}`}
          className="btn-primary w-full text-center"
        >
          Start Roadmap
        </Link>
      </div>
    </div>
  );
};

export default RoadmapsPage;
