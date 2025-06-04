// src/store/socket.store.ts
import { defineStore } from 'pinia';
import { socketAPI } from 'src/api/socket.api';
import { useUserStore } from '../store/index';
import type { IChat, IMessage, INotification } from 'src/types/types';
import { generateId } from 'src/helpers/generate.helper';
import { scrollToBottom } from 'src/services/scroll.service';
import { nextTick } from 'vue';
  /* eslint-disable @typescript-eslint/no-explicit-any */

export const useSocketStore = defineStore('socket', {
  state: () => ({
    isConnected: false,
    notifications: [] as INotification[],
    hasNewNotification: false,
    chats: [] as IChat[],
    messages: {} as Record<number, IMessage[]>,
    chatting: {} as Record<number, boolean>
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
        const storedChats = await socketAPI.fetchChats()
        this.chats = storedChats
        
        await Promise.all(
        this.chats.map(async chat => {
          const storedMessages = await socketAPI.fetchMessages(chat)
          this.messages[chat.id] = storedMessages.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        }))
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
    socketAPI.subscribe('newChat', (chat: IChat) => {
      if (chat.createdAt && !(typeof chat.createdAt === 'string')) {
        chat.createdAt = new Date(chat.createdAt)
      }

      if (chat.updatedAt && !(typeof chat.updatedAt === 'string')) {
        chat.updatedAt = new Date(chat.updatedAt)
      }

      this.addChat(chat)
    })
    socketAPI.subscribe('removedFromChat', (chat: IChat) => {
      this.removeChat(chat)
    })
    socketAPI.subscribe('newMessage', (message: IMessage) => {
      this.addMessage(message)
        // Используем nextTick чтобы дождаться обновления DOM
        void nextTick(() => {
          const container = document.querySelector('.messages-container');
          if (!container) return;
          
          // Проверяем, находится ли пользователь внизу
          const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
          
          if (isAtBottom) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
            });
          }
        });
    })
    socketAPI.subscribe('markAsRead', (message: IMessage) => {
      this.markMessageAsRead(message.chat.id, message.id)
    })
    socketAPI.subscribe('userChatting', (chatId: number) => {
      this.chatting[chatId] = true
    })
    socketAPI.subscribe('stopChatting', (chatId: number) => {
      this.chatting[chatId] = false
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
      this.triggerNotificationPulse()
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
      this.triggerNotificationPulse()
    },

    triggerNotificationPulse() {
      this.hasNewNotification = true;
      setTimeout(() => {
        this.hasNewNotification = false;
      }, 3000); // Через 3 секунды возвращаем обычный цвет
    },

    addChat(chat: IChat) {
      this.chats.unshift(chat)
    },

    removeChat(chat: IChat) {
      this.chats.filter(c => c.id !== chat.id)
    },

    addMessage(message: IMessage) {
      if (!this.messages[message.chat.id]) {
        this.messages[message.chat.id] = []
      }

      this.messages[message.chat.id]?.push(message)

      scrollToBottom()
    },

    markMessageAsRead(chatId: number, messageId: number) {
      const chatMessages = this.messages[chatId];
      if (!chatMessages) return;
      
      const message = chatMessages.find(m => m.id === messageId);
      if (message) {
        // Создаем новый объект с явным указанием всех обязательных полей
        const updatedMessage: IMessage = {
          ...message,
          isRead: true
        };
        
        // Находим индекс и заменяем сообщение
        const index = chatMessages.indexOf(message);
        if (index !== -1) {
          chatMessages[index] = updatedMessage;
        }
      }
    }
  }
});