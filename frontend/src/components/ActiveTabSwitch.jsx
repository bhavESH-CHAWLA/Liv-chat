import { useChatStore } from "../store/useChatStore";
import { MessageSquare, Users } from "lucide-react";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab, chats, allContacts } = useChatStore();

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveTab(activeTab === "chats" ? "contacts" : "chats");
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Conversation views"
      onKeyDown={handleKeyDown}
      className="flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/80 p-1 backdrop-blur-md"
    >
      <button
        id="tab-chats"
        type="button"
        role="tab"
        aria-selected={activeTab === "chats"}
        aria-controls="panel-chats"
        tabIndex={activeTab === "chats" ? 0 : -1}
        onClick={() => setActiveTab("chats")}
        className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
          activeTab === "chats"
            ? "bg-gradient-to-r from-cyan-500/20 to-sky-500/20 text-cyan-300 border border-cyan-500/30 shadow-inner"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
        }`}
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Recent Chats</span>
        {chats.length > 0 && (
          <span className="ml-1 px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded-full text-[10px] font-semibold">
            {chats.length}
          </span>
        )}
      </button>

      <button
        id="tab-contacts"
        type="button"
        role="tab"
        aria-selected={activeTab === "contacts"}
        aria-controls="panel-contacts"
        tabIndex={activeTab === "contacts" ? 0 : -1}
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
          activeTab === "contacts"
            ? "bg-gradient-to-r from-cyan-500/20 to-sky-500/20 text-cyan-300 border border-cyan-500/30 shadow-inner"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
        }`}
      >
        <Users className="w-3.5 h-3.5" />
        <span>All Contacts</span>
        {allContacts.length > 0 && (
          <span className="ml-1 px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded-full text-[10px] font-semibold">
            {allContacts.length}
          </span>
        )}
      </button>
    </div>
  );
}

export default ActiveTabSwitch;