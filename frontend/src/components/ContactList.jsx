import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading, searchQuery } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="space-y-3">
      {allContacts.map((contact) => (
        <button
          key={contact._id}
          type="button"
          onClick={() => setSelectedUser(contact)}
          className="w-full text-left rounded-3xl border border-slate-700/60 bg-slate-900/90 p-4 hover:border-cyan-400/40 hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
              <div className="size-14 rounded-full overflow-hidden">
                <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-slate-100 font-semibold truncate">{contact.fullName}</h4>
              <p className="text-slate-400 text-sm truncate">{contact.email || "No email available"}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
export default ContactList;