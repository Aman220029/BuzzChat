import { create } from "zustand";
import {toast} from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      // console.log(res.data);
      set({ users: res.data });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      console.log(res.data);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const {selectedUser} = get();
    if(!selectedUser) return;

    const {socket} = useAuthStore.getState();

    socket.on("newMessage", (newMessage) => {
      // console.log("newMessage", newMessage);
      const isMessageSentFromSelectorUser = newMessage.senderId === selectedUser._id;
      if(!isMessageSentFromSelectorUser) return;

      set({ messages: [...get().messages, newMessage],});
    });
  },

  unsubscribeToMessages: () => {
    const {socket} = useAuthStore.getState();
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({selectedUser: selectedUser})

}));
