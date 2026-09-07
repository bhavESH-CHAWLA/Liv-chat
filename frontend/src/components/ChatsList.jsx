import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Clock } from "lucide-react";

function ChatsList() {
  const { getMyChatPartners, chats, allContacts, isUsersLoading, selectedUser, setSelectedUser, searchQuery } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  const query = searchQuery.toLowerCase().trim();
  const filteredChats = chats.filter((chat) => {
    return (
      chat.fullName?.toLowerCase().includes(query) ||
      (chat.email && chat.email.toLowerCase().includes(query))
    );
  });

  const chatPartnerIds = new Set(chats.map((chat) => chat._id));
  const contactResults = allContacts
    .filter((contact) => !chatPartnerIds.has(contact._id))
    .filter((contact) => {
      return (
        contact.fullName?.toLowerCase().includes(query) ||
        (contact.email && contact.email.toLowerCase().includes(query))
      );
    });

  const results = query ? [...filteredChats, ...contactResults] : filteredChats;

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (results.length === 0) return <NoChatsFound />;

  return (
    <div
      id="panel-chats"
      role="tabpanel"
      aria-labelledby="tab-chats"
      className="space-y-2 focus:outline-none"
    >
      {results.map((chat) => {
        const isOnline = onlineUsers.includes(chat._id);
        const isSelected = selectedUser?._id === chat._id;

        return (
          <button
            key={chat._id}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => setSelectedUser(chat)}
            className={`chat-card group ${isSelected ? "active" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                <div className="size-12 rounded-full overflow-hidden bg-slate-800 border border-slate-700/60">
                  <img
                    src={chat.profilePic || "/avatar.png"}
                    alt={`${chat.fullName}'s avatar`}
                    className="size-full object-cover"
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3 className="chat-card-title group-hover:text-cyan-300 transition-colors">
                    {chat.fullName}
                  </h3>
                  {chat.lastMessageTime && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                <p className="chat-card-subtitle flex items-center gap-1">
                  {chat.lastMessage ? (
                    <span className="truncate">{chat.lastMessage}</span>
                  ) : (
                    <span className="text-cyan-400/80 italic flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 inline" />
                      Start conversation
                    </span>
                  )}
                </p>
              </div>

              <span className="sr-only">
                {isOnline ? "Status: Online" : "Status: Offline"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ChatsList;