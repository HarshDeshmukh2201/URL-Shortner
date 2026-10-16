'use client';

import { useState } from 'react';
import Header from './components/Header';
import URLForm from './components/URLForm';
import ShortenedURL from './components/ShortenedURL';
import Analytics from './components/Analytics';

export default function Home() {
  const [shortId, setShortId] = useState('');
  const [error, setError] = useState('');

  const handleShorten = async (url) => {
    setError('');
    setShortId('');

    try {
      const response = await fetch('/api/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortId(data.shortId);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Header />

        {/* URL Shortener Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <URLForm onShorten={handleShorten} />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {shortId && <ShortenedURL shortId={shortId} />}
        </div>

        {/* Analytics Card */}
        <Analytics />
      </div>
    </div>
  );
}
