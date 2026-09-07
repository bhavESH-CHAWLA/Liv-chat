import { MessageSquare, Sparkles, Send } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const NoChatHistoryPlaceholder = ({ name }) => {
  const { sendMessage, isSendingMessage } = useChatStore();

  const handleQuickPrompt = (promptText) => {
    if (isSendingMessage) return;
    sendMessage({ text: promptText });
  };

  const starterPrompts = [
    "👋 Hey there! How are you doing?",
    "🤝 Nice to connect with you!",
    "📅 Are you free to catch up soon?",
    "🚀 Excited to collaborate with you!",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 max-w-lg mx-auto select-none">
      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-sky-500/10 border border-cyan-500/30 rounded-3xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/10">
        <MessageSquare className="size-8 text-cyan-400" />
      </div>

      <h3 className="text-lg md:text-xl font-bold text-slate-100 mb-1.5">
        Start a conversation with {name}
      </h3>

      <p className="text-slate-400 text-xs md:text-sm max-w-sm mb-6 leading-relaxed">
        This is the beginning of your direct chat history. Send a message or pick a quick starter below!
      </p>

      <div className="w-full space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-cyan-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Starters (Click to send)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {starterPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isSendingMessage}
              onClick={() => handleQuickPrompt(prompt)}
              className="flex items-center justify-between gap-2 p-3 text-left text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-2xl transition duration-150 group active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span className="truncate">{prompt}</span>
              <Send className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;