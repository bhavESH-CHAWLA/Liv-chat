import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { Copy, Check, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Helper to format date groups
const formatDateDivider = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
};

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    setPreviewImage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleCopyText = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Message copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy message");
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <ChatHeader />

      {/* Message Stream */}
      <div
        role="log"
        aria-live="polite"
        aria-label={`Chat history with ${selectedUser.fullName}`}
        className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-4 space-y-4 scrollbar-thin"
      >
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-3">
            {messages.map((msg, index) => {
              const isMe = msg.senderId === authUser?._id;
              const prevMsg = messages[index - 1];

              // Show date divider if first message or different date from previous
              const showDateDivider =
                !prevMsg ||
                new Date(prevMsg.createdAt).toDateString() !==
                  new Date(msg.createdAt).toDateString();

              return (
                <div key={msg._id || index} className="space-y-3">
                  {showDateDivider && (
                    <div className="flex items-center justify-center my-4">
                      <span className="px-3.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/90 text-slate-300 border border-slate-800/80 shadow-sm select-none">
                        {formatDateDivider(msg.createdAt)}
                      </span>
                    </div>
                  )}

                  <div className={`flex items-end gap-2 group ${isMe ? "justify-end" : "justify-start"}`}>
                    {/* Other User Avatar */}
                    {!isMe && (
                      <div className="size-7 rounded-full overflow-hidden bg-slate-800 border border-slate-700/60 mb-1 flex-shrink-0">
                        <img
                          src={selectedUser.profilePic || "/avatar.png"}
                          alt={selectedUser.fullName}
                          className="size-full object-cover"
                        />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`relative rounded-3xl p-3.5 md:p-4 max-w-[85%] sm:max-w-[75%] transition-shadow duration-150 ${
                        isMe
                          ? "bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-br-sm shadow-[0_4px_20px_rgba(6,182,212,0.25)]"
                          : "bg-slate-900/90 border border-slate-800 text-slate-100 rounded-bl-sm shadow-md"
                      }`}
                    >
                      {/* Attached Image */}
                      {msg.image && (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(msg.image)}
                          className="block relative rounded-2xl overflow-hidden border border-white/10 group/img mb-2.5 focus-visible:ring-2 focus-visible:ring-cyan-300"
                          aria-label="View attached image in full screen"
                        >
                          <img
                            src={msg.image}
                            alt="Attached chat media"
                            className="rounded-2xl object-cover max-h-72 w-full transition-transform duration-200 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 text-white text-xs font-semibold backdrop-blur-md">
                              <Eye className="w-3.5 h-3.5" />
                              View Full Size
                            </span>
                          </div>
                        </button>
                      )}

                      {/* Text Content */}
                      {msg.text && (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {msg.text}
                        </p>
                      )}

                      {/* Message Meta / Status */}
                      <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-slate-300/80 select-none">
                        <span className="font-mono">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Copy Text Button */}
                          {msg.text && (
                            <button
                              type="button"
                              onClick={() => handleCopyText(msg.text, msg._id)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-white transition-opacity focus-visible:opacity-100"
                              aria-label="Copy message text"
                              title="Copy message"
                            >
                              {copiedId === msg._id ? (
                                <Check className="w-3 h-3 text-emerald-300" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}

                          {isMe && (
                            <span>
                              {msg.isOptimistic ? (
                                <span className="text-cyan-200/90 flex items-center gap-1">
                                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                  Sending
                                </span>
                              ) : (
                                <span className="text-cyan-200 font-medium">Delivered</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {/* Input Composer */}
      <MessageInput />
    </div>
  );
}

export default ChatContainer;