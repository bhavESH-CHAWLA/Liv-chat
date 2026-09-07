function UsersLoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading contacts" className="space-y-2.5">
      <span className="sr-only">Loading contact list…</span>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="w-full rounded-2xl border border-slate-800/60 bg-slate-900/40 p-3 flex items-center gap-3 animate-pulse"
        >
          <div className="size-12 rounded-full bg-slate-800/80 flex-shrink-0"></div>
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-3.5 bg-slate-800/80 rounded-md w-3/5"></div>
            <div className="h-2.5 bg-slate-800/50 rounded-md w-2/5"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersLoadingSkeleton;