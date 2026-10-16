'use client';

import { useState } from 'react';

export default function Analytics() {
  const [shortId, setShortId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalytics = async (e) => {
    e.preventDefault();
    if (!shortId) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/url/analytics?shortId=${shortId}`);
      const data = await response.json();

      if (response.ok) {
        setAnalytics(data);
      } else {
        setAnalytics({ error: data.error });
      }
    } catch (err) {
      setAnalytics({ error: 'Failed to connect to server' });
    } finally {
      setLoading(false);
    }
  };

  // Click timeline only (copies are summarized in the stat card above), newest first
  const events = analytics?.analytics
    ? [...analytics.analytics]
        .map((v) => ({ type: "click", timestamp: v.timestamp }))
        .sort((a, b) => b.timestamp - a.timestamp)
    : [];

  return (
    <section className="h-full rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-sm sm:p-8">
      {/* Section header */}
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analytics</h2>
          <p className="text-sm text-slate-500">
            Look up clicks and visit history for any short link
          </p>
        </div>
      </div>

      {/* Lookup form */}
      <form onSubmit={handleAnalytics} className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Enter short ID (e.g. V1StGXR8)"
            value={shortId}
            onChange={(e) => setShortId(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Loading…
              </>
            ) : (
              'Get Analytics'
            )}
          </button>
        </div>
      </form>


      {/* Success results */}
      {analytics && !analytics.error && (
        <div className="animate-fade-in-up space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 text-center">
              <p className="text-4xl font-extrabold tracking-tight text-indigo-600">
                {analytics.totalClick}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Total Clicks
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-center">
              <p className="text-4xl font-extrabold tracking-tight text-amber-600">
                {analytics.totalCopies ?? 0}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Total Copies
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
              <p className="truncate font-mono text-2xl font-bold text-slate-800 sm:text-3xl">
                {analytics.shortId}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Short ID
              </p>
            </div>
          </div>

          {/* Click history */}
          {events.length > 0 ? (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Click History
              </h3>
              <div className="scroll-slim max-h-64 overflow-y-auto rounded-2xl border border-slate-100">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-slate-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                          />
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        Link clicked
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(event.timestamp).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
              <p className="text-sm font-medium text-slate-500">
                No activity yet — share your short link to start tracking! 🚀
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {analytics?.error && (
        <div className="animate-fade-in flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700">
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
          {analytics.error}
        </div>
      )}
    </section>
  );
}
