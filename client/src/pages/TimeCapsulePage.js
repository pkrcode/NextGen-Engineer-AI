import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MessageSquare, 
  Video, 
  Mic, 
  FileText,
  Search,
  Edit,
  Trash2,
  Eye,
  Send
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const TimeCapsulePage = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'All Messages', icon: MessageSquare },
    { id: 'pending', name: 'Pending', icon: Clock },
    { id: 'sent', name: 'Sent', icon: Send },
    { id: 'text', name: 'Text', icon: FileText },
    { id: 'video', name: 'Video', icon: Video },
    { id: 'audio', name: 'Audio', icon: Mic }
  ];

  const sampleCapsules = [
    {
      id: 1,
      title: 'Future Career Goals',
      content: 'I want to become a senior software engineer at a top tech company...',
      type: 'text',
      deliveryDate: '2024-12-31',
      status: 'pending',
      category: 'career',
      isPrivate: true,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Graduation Message',
      content: 'Congratulations on graduating! Remember all the hard work...',
      type: 'video',
      deliveryDate: '2024-05-15',
      status: 'pending',
      category: 'personal',
      isPrivate: false,
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      title: 'Study Motivation',
      content: 'Keep pushing through the difficult times...',
      type: 'audio',
      deliveryDate: '2024-03-01',
      status: 'sent',
      category: 'academic',
      isPrivate: true,
      createdAt: '2024-01-05'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCapsules(sampleCapsules);
      setLoading(false);
    }, 1000);
  }, [sampleCapsules]);

  const filteredCapsules = capsules.filter(capsule => {
    const matchesSearch = capsule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capsule.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || capsule.type === selectedFilter || capsule.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'text': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Mic className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'sent': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDelivery = (deliveryDate) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner size="lg" text="Loading time capsules..." />
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
                Time Capsule
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Send messages to your future self
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Message</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    selectedFilter === filter.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 border border-gray-300 dark:border-dark-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Capsules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map((capsule) => (
            <div
              key={capsule.id}
              className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-dark-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(capsule.type)}
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {capsule.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    {capsule.isPrivate && (
                      <div className="w-2 h-2 bg-gray-400 rounded-full" title="Private" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(capsule.status)}`}>
                      {capsule.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {capsule.content}
                </p>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Delivery Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(capsule.deliveryDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Category</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {capsule.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Created</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(capsule.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Countdown */}
                {capsule.status === 'pending' && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700 dark:text-blue-300">Days until delivery</span>
                      <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {getDaysUntilDelivery(capsule.deliveryDate)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    {capsule.status === 'pending' && (
                      <>
                        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {capsule.type.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCapsules.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No time capsules found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first message to your future self'
              }
            </p>
            {!searchTerm && selectedFilter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create First Message
              </button>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{capsules.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {capsules.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {capsules.filter(c => c.status === 'sent').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Media Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {capsules.filter(c => c.type !== 'text').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeCapsulePage;
