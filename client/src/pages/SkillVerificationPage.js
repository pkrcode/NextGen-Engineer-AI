import React, { useEffect, useState } from 'react';
import { Award, BadgeCheck } from 'lucide-react';
import { gamificationAPI } from '../services/api';
import BackBar from '../components/BackBar';
import { toast } from 'react-hot-toast';

export default function SkillVerificationPage() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await gamificationAPI.getBadges();
        setBadges(res.data?.slice(0, 9) || []);
      } catch (e) {
        setBadges([
          { _id: 'b-react', name: 'React Pro', color: 'primary' },
          { _id: 'b-data', name: 'Data Wizard', color: 'secondary' },
          { _id: 'b-sec', name: 'Security Champ', color: 'warning' },
        ]);
        toast('Showing demo badges (API offline)', { icon: 'ℹ️' });
      }
    })();
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackBar title="Skill Verification" />
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Skill Verification</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Earn badges and certifications through quizzes, projects, and portfolio building.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.map((b, i) => (
            <div key={b._id || b.name} className="card hover-card animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`w-12 h-12 rounded-xl bg-${b.color || 'primary'}-100 dark:bg-${b.color || 'primary'}-900/30 flex items-center justify-center mb-3`}>
                <Award className={`w-6 h-6 text-${b.color || 'primary'}-600 dark:text-${b.color || 'primary'}-400`} />
              </div>
              <div className="font-bold mb-1">{b.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Complete assessments to unlock</div>
              <button className="btn-primary mt-4 inline-flex items-center gap-2"><BadgeCheck className="w-4 h-4" />Take Quiz</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
