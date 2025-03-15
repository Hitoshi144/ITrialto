/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { instance } from 'src/api/axios.api';
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
      localStorage.removeItem('token')
    },

    async checkAuth() {
      const token = localStorage.getItem('token')

      if (token) {
        try {
          const response = await instance.get('/auth/profile')
          this.login(response.data)
        }
        catch (error: any) {
          if (error.response?.status === 401) { 
            this.logout() 
          }
        }
      }
    }
  },
  getters: {
    getUser: (state) => state.user,
    getIsAuth: (state) => state.isAuth,
  },
});