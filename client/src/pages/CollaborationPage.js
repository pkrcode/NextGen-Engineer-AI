import React from 'react';
import { Users, MessageSquare, Share2 } from 'lucide-react';
import BackBar from '../components/BackBar';

export default function CollaborationPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackBar title="Collaboration" />
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Collaboration</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Work with peers on projects, share knowledge, and build your professional network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{icon: Users, title:'Team Workspaces', desc:'Create shared spaces for projects and study groups.'},
            {icon: MessageSquare, title:'Real-time Chat', desc:'Stay in sync with instant messaging and threads.'},
            {icon: Share2, title:'File Sharing', desc:'Upload and share documents, videos and resources.'}].map((f,i)=>(
            <div key={f.title} className="card hover-card animate-slide-up" style={{ animationDelay: `${i*0.08}s` }}>
              <div className="w-10 h-10 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mb-2">
                <f.icon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div className="font-bold mb-1">{f.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
