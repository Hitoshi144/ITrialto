// src/api/socket.api.ts
import { io, type Socket } from 'socket.io-client';

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
  }

  public connect(): void {
    if (this.socket?.connected) return;
    if (!this.token) {
      console.error('No JWT token available');
      return;
    }

    this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3001', {
      auth: {
        token: `Bearer ${this.token}`,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('connect_error', (err: Error) => {
      console.error('WebSocket connection error:', err.message);
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
}

export const socketAPI = SocketAPI.getInstance();