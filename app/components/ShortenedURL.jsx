'use client';

import { useState } from 'react';

export default function ShortenedURL({ shortId }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullUrl = `http://localhost:9000/${shortId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
      <p className="text-sm text-slate-600 mb-2">Your shortened URL:</p>
      <div className="flex items-center gap-3">
        <a
          href={`/${shortId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-green-600 hover:underline break-all"
        >
          http://localhost:9000/{shortId}
        </a>
        <button
          onClick={handleCopy}
          className="px-3 py-1 bg-white border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
