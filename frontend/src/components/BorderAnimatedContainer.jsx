// How to make animated gradient border 👇
// https://cruip-tutorials.vercel.app/animated-gradient-border/
function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full rounded-2xl border border-transparent bg-[linear-gradient(45deg,#0b1220,rgba(255,255,255,0.02))_padding-box,conic-gradient(from_var(--border-angle),rgba(29,78,216,0.08)_0%,rgba(14,165,233,0.6)_60%,rgba(29,78,216,0.08)_100%)_border-box] animate-border shadow-2xl overflow-hidden flex">
      <div className="w-full h-full backdrop-blur-sm bg-gradient-to-b from-transparent to-black/20">{children}</div>
    </div>
  );
}

export default BorderAnimatedContainer;