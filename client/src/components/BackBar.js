import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function BackBar({ title }) {
  const navigate = useNavigate();
  return (
    <div className="mb-4 flex items-center justify-between">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{title}</div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <Home className="w-4 h-4" />
        Home
      </Link>
    </div>
  );
}


