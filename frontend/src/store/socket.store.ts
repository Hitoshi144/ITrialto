// src/store/socket.store.ts
import { defineStore } from 'pinia';
import { socketAPI } from 'src/api/socket.api';
import { useUserStore } from '../store/index';

export const useSocketStore = defineStore('socket', {
  state: () => ({
    isConnected: false,
    notifications: [] as Notification[],
  }),
  
  actions: {
    initSocket() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token available');
        return;
      }
      
      socketAPI.setToken(token)
      socketAPI.connect();
      
      // Используем стрелочные функции для сохранения контекста
      socketAPI.subscribe('connect', () => this.handleConnect());
      socketAPI.subscribe('disconnect', () => this.handleDisconnect());
      socketAPI.subscribe('notification', (data: Notification) => this.handleNotification(data));
      socketAPI.subscribe('exception', (error: Error) => this.handleException(error));
    },
    
    handleConnect() {
      this.isConnected = true;
      console.log('Socket connected');
    },
    
    handleDisconnect() {
      this.isConnected = false;
      console.log('Socket disconnected');
    },
    
    handleNotification(data: Notification) {
      this.notifications.push(data);
      console.log('New notification:', data);
    },
    
    handleException(error: Error) {
      console.error('Socket error:', error.message);
      if (error.message.includes('Unauthorized')) {
        const userStore = useUserStore();
        userStore.logout();
      }
    },
    
    disconnectSocket() {
      socketAPI.unsubscribe('connect');
      socketAPI.unsubscribe('disconnect');
      socketAPI.unsubscribe('notification');
      socketAPI.unsubscribe('exception');
      socketAPI.disconnect();
      this.isConnected = false;
    },
    
    sendMessage(event: string, data: unknown) {
      if (this.isConnected) {
        socketAPI.emit(event, data);
      }
    }
  }
});