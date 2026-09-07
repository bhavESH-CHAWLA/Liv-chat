function MessagesLoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading messages" className="max-w-4xl mx-auto space-y-4 py-4">
      <span className="sr-only">Loading conversation history…</span>
      {[
        { isMe: false, width: "w-48", height: "h-12" },
        { isMe: true, width: "w-64", height: "h-16" },
        { isMe: false, width: "w-72", height: "h-20" },
        { isMe: true, width: "w-40", height: "h-12" },
        { isMe: false, width: "w-56", height: "h-14" },
      ].map((bubble, index) => (
        <div
          key={index}
          className={`flex items-end gap-2.5 ${bubble.isMe ? "justify-end" : "justify-start"}`}
        >
          {!bubble.isMe && (
            <div className="size-8 rounded-full bg-slate-800 animate-pulse flex-shrink-0" />
          )}
          <div
            className={`rounded-2xl p-4 animate-pulse ${
              bubble.isMe
                ? "bg-cyan-900/30 border border-cyan-500/20"
                : "bg-slate-900/60 border border-slate-800/80"
            } ${bubble.width} ${bubble.height}`}
          >
            <div className="h-2.5 bg-slate-700/60 rounded w-full mb-2"></div>
            <div className="h-2 bg-slate-700/40 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesLoadingSkeleton;