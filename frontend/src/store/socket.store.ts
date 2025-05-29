// src/store/socket.store.ts
import { defineStore } from 'pinia';
import { socketAPI } from 'src/api/socket.api';
import { useUserStore } from '../store/index';
import type { INotification } from 'src/types/types';
import { generateId } from 'src/helpers/generate.helper';
  /* eslint-disable @typescript-eslint/no-explicit-any */

export const useSocketStore = defineStore('socket', {
  state: () => ({
    isConnected: false,
    notifications: [] as INotification[],
  }),
  
  actions: {
    async initSocket() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token available');
        return;
      }

      try {
        const storedNotifications = await socketAPI.fetchNotifications()
        this.notifications = storedNotifications
      }
      catch (error: any) {
        console.error('Не удалось загрузить уведомления: ', error)
      }
      
      socketAPI.setToken(token)
      socketAPI.connect();
      
      // Используем стрелочные функции для сохранения контекста
      socketAPI.subscribe('connect', () => this.handleConnect());
      socketAPI.subscribe('disconnect', () => this.handleDisconnect());
      socketAPI.subscribe('notification', (data: INotification) => this.handleNotification(data));
      socketAPI.subscribe('exception', (error: Error) => this.handleException(error));
      socketAPI.subscribe('newTeamJoinRequest', (notification: INotification) => {

        if (!notification.id) {
          notification.id = generateId()
        }

        if (notification.timestamp && !(typeof notification.timestamp === 'string')) {
          notification.timestamp = new Date(notification.timestamp);
        }

        this.addNotification(notification)
      })
    },
    
    handleConnect() {
      this.isConnected = true;
      console.log('Socket connected');
    },
    
    handleDisconnect() {
      this.isConnected = false;
      console.log('Socket disconnected');
    },
    
    handleNotification(data: INotification) {
      this.notifications.unshift(data);
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
      socketAPI.unsubscribe('newTeamJoinRequest')
      socketAPI.disconnect();
      this.isConnected = false;
    },

    markNotificationAsRead(id: number) {
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.isRead = true;
      }
    },
    
    sendMessage(event: string, data: unknown) {
      if (this.isConnected) {
        socketAPI.emit(event, data);
      }
    },

    addNotification(notification: INotification) {
      this.notifications.unshift(notification)
    }
  }
});