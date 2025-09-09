import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Flame } from 'lucide-react';
import { gamificationAPI } from '../services/api';
import BackBar from '../components/BackBar';
import { toast } from 'react-hot-toast';

export default function GamificationPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await gamificationAPI.getProfile();
        setProfile(res.data);
      } catch (e) {
        // fallback demo
        setProfile({ level: 5, xp: 3250, badges: new Array(8).fill(0), streak: { count: 3 } });
        toast('Showing demo gamification (API offline)', { icon: 'ℹ️' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!profile && loading) return null;

  const stats = [
    { label: 'Current Level', value: String(profile?.level ?? 0), icon: Trophy },
    { label: 'Total XP', value: String(profile?.xp ?? 0), icon: Flame },
    { label: 'Badges', value: String(profile?.badges?.length ?? 0), icon: Medal },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackBar title="Gamification" />
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Gamification</h1>
          <p className="text-gray-600 dark:text-gray-300">Stay motivated with XP, levels, leaderboards, and achievements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={s.label} className="card hover-card animate-slide-up text-center" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-2">
                <s.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
