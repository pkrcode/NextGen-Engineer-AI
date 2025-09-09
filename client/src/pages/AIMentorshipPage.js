import React, { useState } from 'react';
import { Bot, MessageCircle } from 'lucide-react';
import { aiAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import BackBar from '../components/BackBar';

export default function AIMentorshipPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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
