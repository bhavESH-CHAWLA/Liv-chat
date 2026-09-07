import { MessageSquarePlus } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-3">
      <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
        <MessageSquarePlus className="w-7 h-7" />
      </div>
      <div>
        <h4 className="text-slate-100 font-semibold text-sm mb-1">No conversation history yet</h4>
        <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
          Start a new chat by browsing your contacts or sharing your invite link.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setActiveTab("contacts")}
        className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-500 hover:bg-cyan-400 rounded-xl transition shadow-md shadow-cyan-500/20 focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        Browse Contacts
      </button>
    </div>
  );
}

export default NoChatsFound;