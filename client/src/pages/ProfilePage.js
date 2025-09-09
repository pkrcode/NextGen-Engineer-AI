import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Edit, 
  Save, 
  X,
  Trophy,
  Star,
  TrendingUp
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    branch: user?.branch || '',
    year: user?.year || 1,
    careerGoal: user?.careerGoal || '',
    skills: user?.skills || []
  });

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Biotechnology'
  ];

  const skillOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'SQL',
    'Machine Learning', 'Data Science', 'DevOps', 'AWS', 'Docker',
    'Kubernetes', 'TypeScript', 'Vue.js', 'Angular', 'Flutter',
    'React Native', 'GraphQL', 'REST APIs', 'Git'
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      branch: user?.branch || '',
      year: user?.year || 1,
      careerGoal: user?.careerGoal || '',
      skills: user?.skills || []
    });
    setIsEditing(false);
  };

  const toggleSkill = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s !== skill)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  if (!user) {
    return <LoadingSpinner size="lg" text="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Profile
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your profile and preferences
              </p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center space-x-2"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{user.level || 1}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-primary-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">XP</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{user.xp || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Streak</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{user.streak || 0} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h3>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.firstName || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.lastName || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Branch
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.branch}
                        onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                          <option key={branch} value={branch}>{branch}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.branch || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Year
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        className="input-field"
                      >
                        {[1, 2, 3, 4].map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.year || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Career Goal
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.careerGoal}
                      onChange={(e) => setFormData(prev => ({ ...prev, careerGoal: e.target.value }))}
                      className="input-field"
                      placeholder="e.g., Full-Stack Developer, Data Scientist"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user.careerGoal || 'Not set'}</p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills
                  </label>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            formData.skills.includes(skill)
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.map(skill => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No skills added yet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
