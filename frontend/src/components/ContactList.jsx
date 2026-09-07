import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { UserCheck, MessageSquarePlus } from "lucide-react";

function ContactList() {
  const { getAllContacts, allContacts, selectedUser, setSelectedUser, isUsersLoading, searchQuery } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  const query = searchQuery.toLowerCase().trim();
  const filteredContacts = allContacts.filter((contact) => {
    return (
      contact.fullName?.toLowerCase().includes(query) ||
      (contact.email && contact.email.toLowerCase().includes(query))
    );
  });

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  if (filteredContacts.length === 0) {
    return (
      <div className="text-center py-10 px-4 space-y-2">
        <UserCheck className="w-8 h-8 text-slate-500 mx-auto" />
        <p className="text-slate-300 font-medium text-sm">No contacts found</p>
        <p className="text-slate-400 text-xs">Try searching with a different name or email.</p>
      </div>
    );
  }

  return (
    <div
      id="panel-contacts"
      role="tabpanel"
      aria-labelledby="tab-contacts"
      className="space-y-2 focus:outline-none"
    >
      {filteredContacts.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);
        const isSelected = selectedUser?._id === contact._id;

        return (
          <button
            key={contact._id}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => setSelectedUser(contact)}
            className={`chat-card group ${isSelected ? "active" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                <div className="size-12 rounded-full overflow-hidden bg-slate-800 border border-slate-700/60">
                  <img
                    src={contact.profilePic || "/avatar.png"}
                    alt={`${contact.fullName}'s avatar`}
                    className="size-full object-cover"
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3 className="chat-card-title group-hover:text-cyan-300 transition-colors">
                    {contact.fullName}
                  </h3>
                  <MessageSquarePlus className="w-3.5 h-3.5 text-cyan-400/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="chat-card-subtitle">{contact.email || "Registered contact"}</p>
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

export default ContactList;