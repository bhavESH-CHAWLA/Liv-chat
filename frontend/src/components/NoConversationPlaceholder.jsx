import { MessageSquare, Users, Sparkles } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const NoConversationPlaceholder = () => {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-10 select-none">
      <div className="empty-state-card mx-auto max-w-md w-full border border-slate-800 bg-slate-900/60 backdrop-blur-2xl">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/20 to-sky-500/10 border border-cyan-500/30 mx-auto mb-6 shadow-xl shadow-cyan-500/10">
          <MessageSquare className="size-10 text-cyan-400" />
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-2">
          Select a Conversation
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Pick an existing conversation from the sidebar or find a contact to begin real-time messaging.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("chats")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            Recent Chats
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contacts")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition shadow-md shadow-cyan-500/20 focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <Users className="w-4 h-4" />
            Browse Contacts
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-time instant delivery • Fast & private</span>
        </div>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;