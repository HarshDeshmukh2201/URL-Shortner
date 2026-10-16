'use client';

import { useCallback, useEffect, useState } from 'react';

const formatTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
};

export default function History({ refreshKey = 0 }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/url/history');
      const data = await response.json();
      if (response.ok) {
        setUrls(data.urls || []);
      } else {
        setError(data.error || 'Failed to load history');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory, refreshKey]);

  const handleCopy = async (shortId) => {
    try {
      await navigator.clipboard.writeText(`http://localhost:9000/${shortId}`);
      setCopiedId(shortId);
      setTimeout(() => setCopiedId(''), 2000);

      // Optimistically bump the visible copy count
      setUrls((prev) =>
        prev.map((u) =>
          u.shortId === shortId ? { ...u, totalCopies: u.totalCopies + 1 } : u
        )
      );

      // Track the copy event (fire-and-forget)
      fetch('/api/url/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortId }),
      }).catch(() => {});
    } catch {
      // Clipboard access denied — ignore silently
    }
  };

  return (
    <section className="h-full rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-sm sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-200">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Links</h2>
            <p className="text-sm text-slate-500">
              Short links created recently, newest first
            </p>
          </div>
        </div>

        {/* Refresh */}
        <button
          onClick={fetchHistory}
          disabled={loading}
          title="Refresh history"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-700 active:scale-[0.95] disabled:opacity-60"
        >
          <svg
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>


      {/* Loading skeleton */}
      {loading && urls.length === 0 ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700">
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
      ) : urls.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            No links yet — shorten your first URL above! ✨
          </p>
        </div>
      ) : (
        <div className="scroll-slim max-h-96 divide-y divide-slate-100 overflow-y-auto rounded-2xl border border-slate-100">
          {urls.map((item, index) => (
            <div
              key={item.shortId}
              className="flex flex-col gap-2.5 px-4 py-3.5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fuchsia-50 text-[10px] font-bold text-fuchsia-600">
                    {index + 1}
                  </span>
                  <a
                    href={`http://localhost:9000/${item.shortId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate font-mono text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    /{item.shortId}
                  </a>
                  <span
                    className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
                    title={`${item.totalClick} clicks · ${item.totalCopies} copies`}
                  >
                    🖱️ {item.totalClick} · 📋 {item.totalCopies}
                  </span>
                </div>
                <p
                  className="mt-1 truncate pl-8 text-xs text-slate-400"
                  title={item.redirectURL}
                >
                  → {item.redirectURL}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2.5 pl-8 sm:pl-0">
                <span className="text-[11px] text-slate-400">
                  {formatTime(item.createdAt)}
                </span>
                <button
                  onClick={() => handleCopy(item.shortId)}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-[0.97] ${
                    copiedId === item.shortId
                      ? 'bg-emerald-500 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50'
                  }`}
                >
                  {copiedId === item.shortId ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
