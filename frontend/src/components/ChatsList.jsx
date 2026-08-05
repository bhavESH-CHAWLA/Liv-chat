import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, allContacts, isUsersLoading, setSelectedUser, searchQuery } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  const query = searchQuery.toLowerCase().trim();
  const filteredChats = chats.filter((chat) => {
    return (
      chat.fullName.toLowerCase().includes(query) ||
      (chat.email && chat.email.toLowerCase().includes(query))
    );
  });

  const chatPartnerIds = new Set(chats.map((chat) => chat._id));
  const contactResults = allContacts.filter((contact) => !chatPartnerIds.has(contact._id));
  const results = query ? [...filteredChats, ...contactResults] : filteredChats;

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (results.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-3">
      {results.map((chat) => (
        <button
          key={chat._id}
          type="button"
          onClick={() => setSelectedUser(chat)}
          className="w-full text-left rounded-3xl border border-slate-700/60 bg-slate-900/90 p-4 hover:border-cyan-400/40 hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
              <div className="size-14 rounded-full overflow-hidden">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-slate-100 font-semibold truncate">{chat.fullName}</h4>
              <p className="text-slate-400 text-sm truncate">{chat.lastMessage || chat.email || "Start a new chat"}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
export default ChatsList;