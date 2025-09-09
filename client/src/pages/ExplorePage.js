import React from 'react';
import { Link } from 'react-router-dom';
import { Target, BookOpen, Users, Award, Zap, Star } from 'lucide-react';
import BackBar from '../components/BackBar';

export default function ExplorePage() {
  const items = [
    { icon: Target, title: 'Career Guidance', desc: 'AI-curated roles, skills and salaries', link: '/career-guidance', color: 'primary' },
    { icon: BookOpen, title: 'Learning Paths', desc: 'Outcome-driven roadmaps and milestones', link: '/learning-paths-feature', color: 'secondary' },
    { icon: Users, title: 'Collaboration', desc: 'Workspaces, real-time chat and sharing', link: '/collaboration', color: 'success' },
    { icon: Award, title: 'Skill Verification', desc: 'Quizzes, projects and badges', link: '/skill-verification', color: 'warning' },
    { icon: Zap, title: 'AI Mentorship', desc: 'Instant AI help and mentor connection', link: '/ai-mentorship', color: 'error' },
    { icon: Star, title: 'Gamification', desc: 'XP, levels, achievements and ranks', link: '/gamification', color: 'primary' },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackBar title="Explore" />
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Explore</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover everything the platform offers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((it, i) => (
            <Link key={it.title} to={it.link} className="card hover-card animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`w-12 h-12 rounded-xl bg-${it.color}-100 dark:bg-${it.color}-900/30 flex items-center justify-center mb-4`}>
                <it.icon className={`w-6 h-6 text-${it.color}-600 dark:text-${it.color}-400`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{it.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{it.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
