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
      console.log('User вышел')
      this.user = null;
      this.isAuth = false;
      localStorage.removeItem('token')
    },

    updateUser(updatedData: Partial<IUser>) {
      if (this.user) {
        this.user = { ...this.user, ...updatedData };
      }
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