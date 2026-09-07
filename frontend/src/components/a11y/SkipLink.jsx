/**
 * Accessible SkipLink component for keyboard power-users to bypass repetitive navigation.
 */
function SkipLink({ targetId = "main-content", label = "Skip to main content" }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-cyan-500 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all duration-150"
    >
      {label}
    </a>
  );
}

export default SkipLink;
