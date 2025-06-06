// src/store/socket.store.ts
import { defineStore } from 'pinia';
import { socketAPI } from 'src/api/socket.api';
import { useUserStore } from '../store/index';
import type { IChat, IMessage, INotification } from 'src/types/types';
import { generateId } from 'src/helpers/generate.helper';
import { scrollToBottom } from 'src/services/scroll.service';
import { nextTick } from 'vue';
import defaultChatAvatar from '../assets/1af82c8ed1916d70e58f662999ce7461.jpg'
import { instance } from 'src/api/axios.api';
  /* eslint-disable @typescript-eslint/no-explicit-any */

export const useSocketStore = defineStore('socket', {
  state: () => ({
    isConnected: false,
    notifications: [] as INotification[],
    hasNewNotification: false,
    chats: [] as IChat[],
    messages: {} as Record<number, IMessage[]>,
    chatting: {} as Record<number, boolean>,
    chatAvatars: {} as Record<number, string>,
    defaultChatAvatar,
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

        await this.loadChatAvatars();
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
    socketAPI.subscribe('newName', (chat: IChat) => {
      this.setNewChatName(chat)
    })
    socketAPI.subscribe('participantRemovedFromChat', (chat: IChat) => {
      this.participantRemoved(chat)
    })
    socketAPI.subscribe('newParticipant', (chat: IChat) => {
      this.participantAdded(chat)
    })
    socketAPI.subscribe('newChatAvatar', (chatId: number) => {
      void (async () => {
      const response = await instance.get(`chat/avatar/${chatId}`, {
        responseType: 'blob'
      })
      const blobUrl = URL.createObjectURL(response.data)

      this.updateChatAvatar(chatId, blobUrl)
    })()
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
      this.chats = this.chats.filter(c => c.id !== chat.id)
    },

    participantRemoved(chat: IChat) {
      const currentChat = this.chats.find(c => c.id === chat.id)
      if (!currentChat) return

      const user = useUserStore().getUser
      if (!user) return

      if (!chat.participants.find(p => p.id === user.id)) return this.removeChat(chat)

      const updatedChat = {
        ...currentChat,
        participants: chat.participants
      }

      const index = this.chats.indexOf(currentChat)
      if (index !== -1) {
        this.chats[index] = updatedChat
      }
    },

    participantAdded(chat: IChat) {
      const currentChat = this.chats.find(c => c.id === chat.id)
      if (!currentChat) return

      const updatedChat = {
        ...currentChat,
        participants: chat.participants
      }

      const index = this.chats.indexOf(currentChat)
      if (index !== -1) {
        this.chats[index] = updatedChat
      }

    },

    addMessage(message: IMessage) {
      if (!this.messages[message.chat.id]) {
        this.messages[message.chat.id] = []
      }

      this.messages[message.chat.id]?.push(message)

      this.chats = [...this.chats].sort((a, b) => {
        const aLastMsg = this.messages[a.id]?.slice(-1)[0]?.createdAt || a.updatedAt;
        const bLastMsg = this.messages[b.id]?.slice(-1)[0]?.createdAt || b.updatedAt;
        return new Date(bLastMsg).getTime() - new Date(aLastMsg).getTime();
      });

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
    },

    setNewChatName(chat: IChat) {
      const currentChat = this.chats.find(c => c.id === chat.id)
      if(currentChat && chat.name) {
        const updatedChat: IChat = {
          ...currentChat,
          name: chat.name
        }

        const index = this.chats.indexOf(currentChat)
        if(index !== -1) {
          this.chats[index] = updatedChat
        }
      }
    },

    async loadChatAvatars() {
      try {
        // Загружаем аватары для всех чатов
        await Promise.all(
          this.chats.map(async chat => {
            if (chat.isGroup) { // Загружаем только для групповых чатов
              const avatarBlob = await socketAPI.fetchChatAvatar(chat.id);
              if (avatarBlob && avatarBlob?.size > 0) {
                // Создаем Object URL из Blob
                this.chatAvatars[chat.id] = URL.createObjectURL(avatarBlob);
              } else {
                this.chatAvatars[chat.id] = this.defaultChatAvatar;
              }
            }
          })
        );
      } catch (error) {
        console.error('Ошибка загрузки аватаров чатов:', error);
      }
    },

    async fetchChatAvatar(chatId: number): Promise<void> {
      try {
        const avatarBlob = await socketAPI.fetchChatAvatar(chatId);
        if (avatarBlob) {
          // Освобождаем предыдущий URL, если он был
          if (this.chatAvatars[chatId]) {
            URL.revokeObjectURL(this.chatAvatars[chatId]);
          }
          this.chatAvatars[chatId] = URL.createObjectURL(avatarBlob);
        } else {
          this.chatAvatars[chatId] = this.defaultChatAvatar;
        }
      } catch (error) {
        console.error(`Ошибка загрузки аватара чата ${chatId}:`, error);
        this.chatAvatars[chatId] = this.defaultChatAvatar;
      }
    },

    getChatAvatar(chatId: number): string {
      // Если аватар уже загружен - возвращаем его
      if (this.chatAvatars[chatId]) {
        return this.chatAvatars[chatId];
      }
      
      // Если нет - инициируем загрузку и возвращаем дефолтный
      void this.fetchChatAvatar(chatId);
      return this.defaultChatAvatar;
    },
    
    updateChatAvatar(chatId: number, avatarUrl: string) {
      // Освобождаем старый URL, если он был
      if (this.chatAvatars[chatId] && this.chatAvatars[chatId] !== this.defaultChatAvatar) {
        URL.revokeObjectURL(this.chatAvatars[chatId]);
      }
      
      this.chatAvatars[chatId] = avatarUrl;
    },

    clearAvatars() {
      Object.values(this.chatAvatars).forEach(url => {
        if (url !== this.defaultChatAvatar) {
          URL.revokeObjectURL(url);
        }
      });
      this.chatAvatars = {};
    },
  }
});