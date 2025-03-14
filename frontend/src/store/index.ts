import { defineStore } from 'pinia';
import type { IUser } from 'src/types/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as IUser | null, 
    isAuth: false, 
  }),
  actions: {
    login(user: IUser) {
      this.user = user;
      this.isAuth = true;
    },
    logout() {
      this.user = null;
      this.isAuth = false;
    },
  },
  getters: {
    getUser: (state) => state.user,
    getIsAuth: (state) => state.isAuth,
  },
});