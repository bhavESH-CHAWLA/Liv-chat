import { ArrowLeft, X, ShieldCheck } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser?._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  if (!selectedUser) return null;

  return (
    <div className="flex justify-between items-center gap-3 bg-slate-950/90 border-b border-slate-800/80 px-4 md:px-6 py-3.5 backdrop-blur-xl flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          type="button"
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-2 -ml-1 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Back to chat list"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-slate-700/60">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={`${selectedUser.fullName}'s avatar`}
              className="size-full object-cover"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-slate-100 font-bold text-sm md:text-base truncate">
              {selectedUser.fullName}
            </h2>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" title="Verified Member" />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span className={`inline-flex items-center gap-1 font-medium ${isOnline ? "text-emerald-400" : "text-slate-400"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              {isOnline ? "Online" : "Offline"}
            </span>
            <span className="hidden sm:inline text-slate-600" aria-hidden="true">•</span>
            <span className="hidden sm:inline truncate text-slate-400 font-mono text-[11px]">
              {selectedUser.email || "Encrypted Chat"}
            </span>
          </div>

          <span className="sr-only">
            {isOnline ? "User is currently online" : "User is currently offline"}
          </span>
        </div>
      </div>

      {/* Close/Deselect Button */}
      <button
        type="button"
        onClick={() => setSelectedUser(null)}
        className="hidden md:inline-flex p-2 rounded-xl border border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:border-slate-700 hover:bg-slate-800 transition duration-150 focus-visible:ring-2 focus-visible:ring-cyan-400"
        aria-label="Close conversation (Esc)"
        title="Close conversation (Esc)"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default ChatHeader;