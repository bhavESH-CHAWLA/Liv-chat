import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const resolveBaseUrl = () => {
  const base = axiosInstance?.defaults?.baseURL || (import.meta.env.MODE === "development" ? "http://localhost:3001/api" : "/api");
  return base.replace(/\/api\/?$/i, "");
};

const BASE_URL = resolveBaseUrl();

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Not authenticated or session expired:", error?.response?.status);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully! Welcome to Liv-chat.");
      get().connectSocket();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Unable to create account";
      if (message === "Network Error") {
        toast.error("Network Error: Backend unreachable. Please verify the server is running.");
      } else {
        toast.error(message);
      }
      console.error("Signup error:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Welcome back! Signed in successfully.");
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Invalid email or password");
      console.error("Login error:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Signed out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error signing out");
      console.error("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.response?.data?.message || error?.message || "Unable to update profile image");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.connect();
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
    }
    set({ socket: null, onlineUsers: [] });
  },
}));