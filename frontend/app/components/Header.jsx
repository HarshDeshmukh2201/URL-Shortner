export default function Header() {
  return (
    <header className="mb-10 text-center sm:mb-14">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/70 px-4 py-1.5 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Free forever · No signup required
      </div>

      {/* Title */}
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        URL{" "}
        <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          Shortener
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mx-auto max-w-md text-base text-slate-500 sm:text-lg">
        Paste a long link, get a clean short URL in milliseconds — with
        click-tracking analytics built right in.
      </p>
    </header>
  );
}
