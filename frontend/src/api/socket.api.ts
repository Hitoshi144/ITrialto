// src/api/socket.api.ts
import { io, type Socket } from 'socket.io-client';
import type { IChat, IMessage, INotification } from 'src/types/types';
import { instance } from './axios.api';
import { useUserStore } from 'src/store';

class SocketAPI {
  private socket: Socket | null = null;
  private static instance: SocketAPI;
  private token: string | null = null;

  public static getInstance(): SocketAPI {
    if (!SocketAPI.instance) {
      SocketAPI.instance = new SocketAPI();
    }
    return SocketAPI.instance;
  }

  public setToken(token: string): void {
    this.token = token;
    if (this.socket?.connected) {
      this.disconnect();
      this.connect();
    }
  }

  public connect(): void {
    if (this.socket?.connected) return;
    if (!this.token) {
      console.error('No JWT token available');
      return;
    }
  
    this.socket = io('http://localhost:3001/ws', { // Убрали /ws из URL
      auth: { 
        token: this.token 
      },
      transports: ['websocket'],
      path: '/ws/socket.io', // Путь должен совпадать с сервером
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      extraHeaders: {
        Authorization: `Bearer ${this.token}` // Для совместимости
      }
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected, ID:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public subscribe<T>(event: string, callback: (data: T) => void): void {
    this.socket?.on(event, callback);
  }

  public unsubscribe(event: string): void {
    this.socket?.off(event);
  }

  public emit(event: string, data?: unknown): void {
    this.socket?.emit(event, data);
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public async fetchNotifications(): Promise<INotification[]> {
    const response = await instance.get('notifications')

    return response.data
  }

  public async fetchChats(): Promise<IChat[]> {
    const userId: number = useUserStore().getUser!.id
    if (!userId) {
      return []
    }
    const response = await instance.get('chat/my', {params: {userId}})
    return response.data
  }

  public async fetchMessages(chat: IChat): Promise<IMessage[]> {
    const response = await instance.get(`chat/${chat.id}/messages`)
    return response.data
  }
}

export const socketAPI = SocketAPI.getInstance();