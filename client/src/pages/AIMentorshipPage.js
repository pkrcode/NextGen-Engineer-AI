import React, { useState, useEffect } from 'react';
import { Bot, MessageCircle, Lightbulb, TrendingUp, Target, BookOpen } from 'lucide-react';
import { aiAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import BackBar from '../components/BackBar';

export default function AIMentorshipPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  // Quick suggestions based on recent activity
  const quickSuggestions = [
    { icon: TrendingUp, text: "What are the trending skills in AI/ML?", category: "career" },
    { icon: Target, text: "How to transition from web dev to data science?", category: "transition" },
    { icon: BookOpen, text: "Best learning path for cloud architecture?", category: "learning" },
    { icon: Lightbulb, text: "Interview tips for senior developer roles", category: "interview" }
  ];

  useEffect(() => {
    // Simulate recent activity from localStorage or API
    const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    setRecentActivity(activity.slice(0, 3)); // Show last 3 activities
  }, []);

  const handleQuickSuggestion = (suggestion) => {
    setText(suggestion.text);
    ask();
  };

  const ask = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await aiAPI.enhanceMessage({ message: text, context: 'career guidance', tone: 'helpful', length: 'medium' });
      setResult(res.data?.data || null);
    } catch (e) {
      toast.error('AI request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackBar title="AI Mentorship" />
        <div className="card animate-slide-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Mentorship</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Ask career and learning questions and get instant guidance.</p>
          
          {/* Quick Suggestions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Suggestions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="flex items-center gap-2 p-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <suggestion.icon className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <input className="input-field" placeholder="Ask your mentor..." value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && ask()} />
            <button onClick={ask} disabled={loading} className="btn-primary inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> {loading ? 'Thinking...' : 'Ask'}
            </button>
          </div>
          {result && (
            <div className="mt-4 border-t pt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Enhanced Advice</div>
              <div className="prose dark:prose-invert">
                <p>{result.enhanced}</p>
              </div>
              {Array.isArray(result.suggestions) && result.suggestions.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-semibold mb-2">Suggestions</div>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    {result.suggestions.map((s, i) => (<li key={i}>{s}</li>))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
