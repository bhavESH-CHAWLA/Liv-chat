import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser, searchQuery, setSearchQuery, getAllContacts } = useChatStore();

  useEffect(() => {
    if (searchQuery.trim()) {
      getAllContacts(searchQuery);
    }
  }, [searchQuery, getAllContacts]);

  return (
    <div className="relative w-full max-w-7xl h-[92vh]">
      <BorderAnimatedContainer>
        <div className="grid grid-cols-[320px_1fr] h-full overflow-hidden">
          <aside className="flex flex-col bg-slate-950/90 border-r border-slate-700/60 backdrop-blur-xl">
            <ProfileHeader />
            <div className="px-4 py-4">
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full rounded-2xl border border-slate-700/70 bg-slate-900/90 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
              <ActiveTabSwitch />
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </aside>

          <main className="flex flex-col bg-slate-950/80 backdrop-blur-xl overflow-hidden">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </main>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;