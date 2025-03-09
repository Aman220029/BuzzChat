import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import {toast} from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

const userSocketMap = {};

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
            
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({authUser: null});
        } finally {
            set({isCheckAuth: null});
        }
    },

    signup: async(data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            console.log(res.data);
            set({authUser: res.data});
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp: true});
        }
    },

    login: async(data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("auth/login", data);
            set({authUser: res.data});
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLogginIn: false});
        }
    },

    logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");

          get().disconnectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },

      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/updateProfile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      connectSocket: () => {
        const { authUser } = get();
        if(!authUser || get().socket?.connected) return;
        // console.log("authUser", authUser);
        const socket = io(BASE_URL, {
          query: {userId: authUser._id}
        });

        socket.connect();

        set({socket: socket});

        socket.on("getOnlineUsers", (userIds) => {
          // console.log("getOnlineUsers", userIds);
          set({onlineUsers: userIds});
        });
      },

      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },

      setSelectedUser: (selectedUser) => set({selectedUser})
}))