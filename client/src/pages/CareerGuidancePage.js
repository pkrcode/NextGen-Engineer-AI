import React from 'react';
import { Target, Briefcase, DollarSign, Cpu, Shield, Cloud, Database } from 'lucide-react';
import BackBar from '../components/BackBar';

export default function CareerGuidancePage() {
  const domains = [
    { key: 'ai', label: 'AI/ML', icon: Cpu },
    { key: 'security', label: 'Cybersecurity', icon: Shield },
    { key: 'cloud', label: 'Cloud', icon: Cloud },
    { key: 'data', label: 'Data', icon: Database },
  ];

  const roles = [
    {
      title: 'Machine Learning Engineer',
      domain: 'AI/ML',
      salary: '₹18–40 LPA',
      skills: ['Python', 'TensorFlow', 'MLOps', 'SQL'],
      icon: Target,
    },
    {
      title: 'Cloud Solutions Architect',
      domain: 'Cloud',
      salary: '₹22–45 LPA',
      skills: ['AWS', 'Terraform', 'Kubernetes', 'Networking'],
      icon: Cloud,
    },
    {
      title: 'Security Analyst',
      domain: 'Cybersecurity',
      salary: '₹12–28 LPA',
      skills: ['SIEM', 'Threat Intel', 'Splunk', 'Python'],
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackBar title="Career Guidance" />
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Career Guidance</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover high-demand roles, required skills, and salary insights with AI-powered recommendations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {domains.map((d, i) => (
            <div key={d.key} className="card hover-card text-center animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <d.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="font-semibold">{d.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, i) => (
            <div key={role.title} className="card hover-card animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                    <role.icon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{role.title}</h3>
                </div>
                <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-300">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-semibold">{role.salary}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Domain: {role.domain}</div>
              <div className="flex flex-wrap gap-2">
                {role.skills.map((s) => (
                  <span key={s} className="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <button className="btn-primary">Explore Roles</button>
                <button className="btn-outline">Get AI Advice</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
