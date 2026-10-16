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

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Analytics</h2>
      
      <form onSubmit={handleAnalytics} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter short ID to view analytics..."
            value={shortId}
            onChange={(e) => setShortId(e.target.value)}
            className="flex-1 px-4 py-3 text-base border-2 border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 disabled:bg-slate-400 transition-colors"
          >
            {loading ? 'Loading...' : 'Get Analytics'}
          </button>
        </div>
      </form>

      {analytics && !analytics.error && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">{analytics.totalClick}</p>
              <p className="text-sm text-slate-500">Total Clicks</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">{analytics.shortId}</p>
              <p className="text-sm text-slate-500">Short ID</p>
            </div>
          </div>

          {analytics.analytics && analytics.analytics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-3">Visit History</h3>
              <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
                {analytics.analytics.map((visit, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-4 py-3 border-b border-slate-100 last:border-b-0"
                  >
                    <span className="text-slate-600">Visit #{index + 1}</span>
                    <span className="text-slate-400 text-sm">
                      {new Date(visit.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {analytics?.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {analytics.error}
        </div>
      )}
    </div>
  );
}
