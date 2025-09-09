import React from 'react';
import { CheckCircle2, Layers, Target, Calendar, Award } from 'lucide-react';
import BackBar from '../components/BackBar';

export default function LearningPathsFeaturePage() {
  const paths = [
    { title: 'Full-Stack Web Developer', level: 'Intermediate', duration: '12 Weeks', modules: 8 },
    { title: 'Data Analyst', level: 'Beginner', duration: '10 Weeks', modules: 6 },
    { title: 'DevOps Engineer', level: 'Advanced', duration: '14 Weeks', modules: 10 },
  ];

  const features = [
    { icon: Target, text: 'Goal-oriented modules with outcomes' },
    { icon: Layers, text: 'Hands-on projects and assessments' },
    { icon: Calendar, text: 'Milestone-based scheduling' },
    { icon: Award, text: 'Badges and certificates' },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackBar title="Learning Paths" />
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Learning Paths</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Personalized, outcome-driven roadmaps tailored to your goals with progress tracking and guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {paths.map((p, i) => (
            <div key={p.title} className="card hover-card animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{p.title}</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">{p.level} • {p.duration} • {p.modules} Modules</div>
              <div className="flex items-center gap-2 text-success-600 dark:text-success-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Recommended by AI</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="btn-primary">Start Path</button>
                <button className="btn-outline">View Syllabus</button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={f.text} className="card hover-card animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-2">
                <f.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-sm font-semibold">{f.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
