import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    access: null,
    refresh: null,
    userID: null,
    is_superuser: null,
  }),

  actions: {
    setAuth({ user, access, refresh }) {
      this.isAuthenticated = true;
      this.user = user;
      this.access = access;

    },
    setUserDetails({userID, is_superuser}){
      this.userID = userID;
      this.is_superuser = is_superuser
    },

    clearAuth() {
      this.isAuthenticated = false;
      this.user = null;
      this.access = null;
      this.refresh = null;      
      this.userID = null;
      this.is_superuser = null;
    },
  },
  persist: {
    storage: localStorage,
    pick: ["isAuthenticated", "user", "access", "refresh", "userID", "is_superuser"],
  },
});
