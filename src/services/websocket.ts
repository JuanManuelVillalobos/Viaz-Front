import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NotificationResponseDTO } from '@/types/notification';

export class WebSocketService {
  private client: Client | null = null;
  private connected: boolean = false;
  private onNotificationCallback: ((notification: NotificationResponseDTO) => void) | null = null;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${window.location.origin}/ws`),
      debug: (str) => {
        console.log('STOMP Debug: ', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket Connected');
      this.connected = true;
    };

    this.client.onDisconnect = () => {
      console.log('WebSocket Disconnected');
      this.connected = false;
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP Error: ', frame);
    };
  }

  connect(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }

      this.client!.onConnect = () => {
        console.log('WebSocket Connected');
        this.connected = true;
        
        // Subscribe to user-specific notification queue
        this.client!.subscribe(`/user/${username}/queue/notifications`, (message) => {
          const notification: NotificationResponseDTO = JSON.parse(message.body);
          if (this.onNotificationCallback) {
            this.onNotificationCallback(notification);
          }
        });
        
        resolve();
      };

      this.client!.onStompError = (frame) => {
        console.error('STOMP Error: ', frame);
        reject(new Error(frame.headers['message']));
      };

      this.client!.activate();
    });
  }

  disconnect(): void {
    if (this.client && this.connected) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  onNotification(callback: (notification: NotificationResponseDTO) => void): void {
    this.onNotificationCallback = callback;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export const websocketService = new WebSocketService();