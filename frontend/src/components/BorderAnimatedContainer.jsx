function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full md:h-[92vh] max-w-7xl mx-auto rounded-none md:rounded-3xl border border-slate-800/80 bg-[linear-gradient(45deg,#030712,#0b1120)_padding-box,conic-gradient(from_var(--border-angle),rgba(14,165,233,0.1)_0%,rgba(6,182,212,0.5)_50%,rgba(14,165,233,0.1)_100%)_border-box] animate-border shadow-[0_0_50px_-12px_rgba(6,182,212,0.18)] overflow-hidden flex flex-col">
      <div className="w-full h-full flex-1 flex flex-col min-h-0 bg-slate-950/40 backdrop-blur-2xl">
        {children}
      </div>
    </div>
  );
}

export default BorderAnimatedContainer;