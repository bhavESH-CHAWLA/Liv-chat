import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import useDebounce from "../hooks/useDebounce";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import InviteQrCard from "../components/InviteQrCard";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ImageLightbox from "../components/ImageLightbox";
import SkipLink from "../components/a11y/SkipLink";
import { Search, X } from "lucide-react";

function ChatPage() {
  const {
    activeTab,
    selectedUser,
    searchQuery,
    setSearchQuery,
    getAllContacts,
    previewImage,
    setPreviewImage,
  } = useChatStore();

  const [showInviteQr, setShowInviteQr] = useState(() => {
    try {
      const saved = localStorage.getItem("showInviteQr");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const handleToggleInvite = () => {
    setShowInviteQr((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("showInviteQr", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save QR preference", e);
      }
      return next;
    });
  };

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 250);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  useEffect(() => {
    getAllContacts(debouncedSearch);
  }, [debouncedSearch, getAllContacts]);

  return (
    <div className="relative w-full h-[100dvh] md:h-[92vh] flex flex-col justify-center">
      <SkipLink targetId="main-chat-area" label="Skip to chat conversation" />
      <SkipLink targetId="search-conversations-input" label="Skip to search" />

      <BorderAnimatedContainer>
        <div className="flex w-full h-full min-h-0 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside
            aria-label="Chats and contacts sidebar"
            className={`flex flex-col h-full min-h-0 overflow-hidden bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-2xl transition-all duration-200 ${
              selectedUser ? "hidden md:flex md:w-[340px] lg:w-[380px]" : "w-full md:w-[340px] lg:w-[380px]"
            } flex-shrink-0`}
          >
            {/* User Profile Bar */}
            <ProfileHeader
              onToggleInvite={handleToggleInvite}
              isInviteActive={showInviteQr}
            />

            {/* Contained Commercial QR Code Card (Scan to Connect) */}
            {showInviteQr && (
              <div className="p-3 border-b border-slate-800/80 bg-slate-900/40 flex-shrink-0 animate-fadeIn max-h-[340px] overflow-y-auto scrollbar-thin">
                <InviteQrCard onClose={handleToggleInvite} />
              </div>
            )}

            {/* Search and Navigation Bar */}
            <div className="p-3.5 md:p-4 border-b border-slate-800/80 space-y-3 bg-slate-900/30 flex-shrink-0">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="search-conversations-input"
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  aria-label="Search conversations and contacts"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-9 py-2.5 text-xs md:text-sm text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => setLocalSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-200 rounded-md transition"
                    aria-label="Clear search input"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Switcher Tabs */}
              <ActiveTabSwitch />
            </div>

            {/* Scrollable Conversation List */}
            <div
              className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 scrollbar-thin"
              tabIndex={0}
              aria-label="Conversations list"
            >
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </aside>

          {/* Main Active Chat Area */}
          <main
            id="main-chat-area"
            role="main"
            aria-label="Active conversation"
            className={`flex-1 flex flex-col h-full min-h-0 bg-slate-950/70 backdrop-blur-xl overflow-hidden ${
              !selectedUser ? "hidden md:flex" : "flex w-full"
            }`}
          >
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </main>
        </div>
      </BorderAnimatedContainer>

      {/* Global Image Lightbox Modal */}
      {previewImage && (
        <ImageLightbox
          src={previewImage}
          alt="Attached chat media"
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}

export default ChatPage;