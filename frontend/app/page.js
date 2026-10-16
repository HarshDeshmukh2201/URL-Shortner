'use client';

import { useState } from 'react';
import Header from './components/Header';
import URLForm from './components/URLForm';
import ShortenedURL from './components/ShortenedURL';
import Analytics from './components/Analytics';
import History from './components/History';

export default function Home() {
  const [shortId, setShortId] = useState('');
  const [error, setError] = useState('');
  const [historyVersion, setHistoryVersion] = useState(0);

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
        setHistoryVersion((v) => v + 1);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Animated gradient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="animate-float absolute -left-40 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-400 to-sky-400 opacity-30 blur-3xl" />
        <div
          className="animate-float absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-400 opacity-25 blur-3xl"
          style={{ animationDelay: '-3s' }}
        />
        <div
          className="animate-float absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-sky-300 to-indigo-300 opacity-25 blur-3xl"
          style={{ animationDelay: '-5s' }}
        />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <Header />

        {/* Shortener card */}
        <div className="animate-fade-in-up mx-auto w-full max-w-3xl rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-sm sm:p-8">
          <URLForm onShorten={handleShorten} />

          {error && (
            <div className="animate-fade-in mt-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700">
              <svg
                className="h-5 w-5 shrink-0 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {shortId && <ShortenedURL shortId={shortId} />}
        </div>

        {/* Analytics + History — side by side on large screens */}
        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <div
            className="animate-fade-in-up h-full"
            style={{ animationDelay: '120ms' }}
          >
            <Analytics />
          </div>
          <div
            className="animate-fade-in-up h-full"
            style={{ animationDelay: '240ms' }}
          >
            <History refreshKey={historyVersion} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-14 text-center text-xs text-slate-400">
          Built with Next.js, Express &amp; MongoDB · Open source URL shortener
        </footer>
      </main>
    </div>
  );
}
