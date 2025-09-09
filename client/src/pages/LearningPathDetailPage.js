import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Clock, Users, Target, Award, CheckCircle2 } from 'lucide-react';
import { learningPathsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import BackBar from '../components/BackBar';

export default function LearningPathDetailPage() {
  const { id } = useParams();
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await learningPathsAPI.getById(id);
        setPath(res.data);
      } catch (error) {
        // Fallback demo data
        const demo = [
          {
            _id: 'lp-fs',
            title: 'Full-Stack Web Developer',
            description: 'React, Node.js, MongoDB, deployments',
            domain: 'Web Development',
            difficulty: 'intermediate',
            pricing: { isFree: true },
            estimatedDuration: { weeks: 12, hoursPerWeek: 6 },
            aiAssistance: { adaptiveQuizzes: true, personalizedFeedback: true, realTimeHelp: true },
            modules: [
              { title: 'Frontend with React', outcome: 'Build SPA with routing and state' },
              { title: 'Backend with Node.js', outcome: 'Create REST APIs and auth' },
              { title: 'Database with MongoDB', outcome: 'Design schemas and queries' },
            ]
          },
          {
            _id: 'lp-da',
            title: 'Data Analyst',
            description: 'SQL, Python, BI Dashboards',
            domain: 'Data',
            difficulty: 'beginner',
            pricing: { isFree: true },
            estimatedDuration: { weeks: 10, hoursPerWeek: 5 },
            aiAssistance: { adaptiveQuizzes: true, personalizedFeedback: true, realTimeHelp: false },
            modules: [
              { title: 'SQL Foundations', outcome: 'Query and aggregate data' },
              { title: 'Python for Analysis', outcome: 'Pandas, NumPy basics' },
              { title: 'Dashboards', outcome: 'Build BI dashboards' },
            ]
          },
          {
            _id: 'lp-devops',
            title: 'DevOps Engineer',
            description: 'CI/CD, Docker, Kubernetes, Terraform',
            domain: 'DevOps',
            difficulty: 'advanced',
            pricing: { isFree: false, price: { amount: 49 } },
            estimatedDuration: { weeks: 14, hoursPerWeek: 6 },
            aiAssistance: { adaptiveQuizzes: true, personalizedFeedback: false, realTimeHelp: true },
            modules: [
              { title: 'Containers', outcome: 'Build and run Docker images' },
              { title: 'Kubernetes', outcome: 'Deploy workloads on k8s' },
              { title: 'IaC with Terraform', outcome: 'Provision infra declaratively' },
            ]
          }
        ];

        const found = demo.find(d => d._id === id);
        if (found) {
          setPath(found);
          toast('Showing demo learning path (API offline)', { icon: 'ℹ️' });
        } else {
          toast.error('Learning path not found');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const difficultyChip = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner size="lg" text="Loading learning path..." />
        </div>
      </div>
    );
  }

  if (!path) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackBar title="Learning Path" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{path.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{path.domain}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyChip(path.difficulty)}`}>
              {path.difficulty}
            </span>
            {path.estimatedDuration && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {path.estimatedDuration.weeks} weeks • {path.estimatedDuration.hoursPerWeek} hrs/week
              </span>
            )}
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 inline-flex items-center gap-1">
              <Users className="w-4 h-4" />
              {path.domain}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-200">{path.description}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary-600" />
              <div className="font-semibold text-gray-900 dark:text-white">Outcomes</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Goal-oriented modules with measurable outcomes</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div className="font-semibold text-gray-900 dark:text-white">Assessments</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Hands-on projects and adaptive quizzes</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <div className="font-semibold text-gray-900 dark:text-white">Recognition</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Badges and certificates as you progress</div>
          </div>
        </div>

        {/* Modules */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Modules</h3>
          <div className="space-y-3">
            {(path.modules || []).map((m, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                <div className="font-medium text-gray-900 dark:text-white">{m.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{m.outcome}</div>
              </div>
            ))}
            {(!path.modules || path.modules.length === 0) && (
              <div className="text-sm text-gray-600 dark:text-gray-300">Module list coming soon.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


