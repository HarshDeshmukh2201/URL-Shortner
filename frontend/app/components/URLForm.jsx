'use client';

import { useState } from 'react';

export default function URLForm({ onShorten }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    await onShorten(url);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-3 mb-4">
        <input
          type="url"
          placeholder="Enter your long URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-3 text-base border-2 border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
        >
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </div>
    </form>
  );
}
