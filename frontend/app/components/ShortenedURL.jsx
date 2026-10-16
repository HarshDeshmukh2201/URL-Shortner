'use client';

import { useState } from 'react';

export default function ShortenedURL({ shortId }) {
  const [copied, setCopied] = useState(false);

  const shortUrl = `http://localhost:9000/${shortId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Track the copy event so it shows up in Analytics (fire-and-forget)
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
    <div className="animate-scale-in mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        {/* Success check */}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <p className="text-sm font-semibold text-emerald-800">
          Your short link is ready!
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-1 items-center gap-2 truncate rounded-xl border border-emerald-200 bg-white px-4 py-2.5 font-mono text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:text-emerald-900"
        >
          <svg
            className="h-4 w-4 shrink-0 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span className="truncate">{shortUrl}</span>
        </a>

        <button
          onClick={handleCopy}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
            copied
              ? 'bg-emerald-500 text-white'
              : 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50'
          }`}
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
