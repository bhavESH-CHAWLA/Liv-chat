import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  searchQuery: "",
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  previewImage: null,
  isSoundEnabled: (() => {
    try {
      const val = localStorage.getItem("isSoundEnabled");
      return val === null ? true : JSON.parse(val);
    } catch {
      return true;
    }
  })(),

  setPreviewImage: (url) => set({ previewImage: url }),

  toggleSound: () => {
    const nextVal = !get().isSoundEnabled;
    try {
      localStorage.setItem("isSoundEnabled", JSON.stringify(nextVal));
    } catch (e) {
      console.error("Failed to save sound preference", e);
    }
    set({ isSoundEnabled: nextVal });
    toast(nextVal ? "Sound effects enabled 🔔" : "Sound effects muted 🔕", {
      icon: nextVal ? "🔔" : "🔕",
      duration: 1500,
    });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  getAllContacts: async (search = "") => {
    set({ isUsersLoading: true });
    try {
      const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
      const res = await axiosInstance.get(`/messages/contacts${query}`);
      set({ allContacts: res.data || [] });
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      toast.error(error.response?.data?.message || "Unable to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data || [] });
    } catch (error) {
      console.error("Failed to fetch chat partners:", error);
      toast.error(error.response?.data?.message || "Unable to load conversations");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data || [] });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error(error.response?.data?.message || "Unable to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getInviteProfile: async (userId) => {
    const res = await axiosInstance.get(`/messages/profile/${userId}`);
    return res.data;
  },

  sendContactRequest: async (userId) => {
    await axiosInstance.post(`/messages/request/${userId}`);
  },

  acceptContactRequest: async (userId) => {
    await axiosInstance.post(`/messages/request/${userId}/accept`);
    get().getMyChatPartners();
    get().getAllContacts();
  },

  declineContactRequest: async (userId) => {
    await axiosInstance.post(`/messages/request/${userId}/decline`);
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    if (!selectedUser || !authUser) return;

    set({ isSendingMessage: true });
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    const optimisticMessages = [...messages, optimisticMessage];
    set({ messages: optimisticMessages });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set((state) => ({
        messages: state.messages.map((msg) => (msg._id === tempId ? res.data : msg)),
      }));

      // Update chats list with latest message
      get().getMyChatPartners();
    } catch (error) {
      // Revert optimistic message
      set({ messages });
      toast.error(error.response?.data?.message || "Failed to deliver message. Please try again.");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Remove existing listener to avoid duplicates
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) {
        // Refresh chat list to show new message from another user
        get().getMyChatPartners();
        return;
      }

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

      if (isSoundEnabled) {
        try {
          const notificationSound = new Audio("/sounds/notification.mp3");
          notificationSound.currentTime = 0;
          notificationSound.play().catch((e) => console.log("Audio notification play suppressed:", e));
        } catch (e) {
          console.error("Audio error:", e);
        }
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },
}));