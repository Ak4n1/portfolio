import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import {
  WebSocketMessage,
  WebSocketMessageType,
  WebSocketConnectionState,
} from '../models/websocket-message.model';

const WS_PATH = '/api/ws/notifications';
const API_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private connectionState$ = new BehaviorSubject<WebSocketConnectionState>(
    WebSocketConnectionState.DISCONNECTED
  );
  private messages$ = new Subject<WebSocketMessage>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isManualClose = false;
  private tokenRefreshInProgress = false;

  private authStateService = inject(AuthStateService);

  readonly connectionState: Observable<WebSocketConnectionState>;
  readonly messages: Observable<WebSocketMessage>;

  constructor() {
    this.connectionState = this.connectionState$.asObservable();
    this.messages = this.messages$.asObservable();

    this.authStateService.authState.subscribe((state) => {
      if (state.isAuthenticated && !state.isLoading) {
        this.connect();
      } else if (!state.isLoading) {
        this.disconnect();
      }
    });
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    this.isManualClose = false;
    this.connectionState$.next(WebSocketConnectionState.CONNECTING);

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = API_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const wsUrl = `${wsProtocol}//${wsHost}${WS_PATH}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.connectionState$.next(WebSocketConnectionState.CONNECTED);
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => this.handleMessage(event.data);

      this.ws.onerror = () => {
        this.connectionState$.next(WebSocketConnectionState.ERROR);
      };

      this.ws.onclose = () => {
        if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        } else {
          this.connectionState$.next(WebSocketConnectionState.DISCONNECTED);
        }
      };
    } catch {
      this.connectionState$.next(WebSocketConnectionState.ERROR);
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.isManualClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connectionState$.next(WebSocketConnectionState.DISCONNECTED);
  }

  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);

      switch (message.type) {
        case WebSocketMessageType.CONTACT_SUBMITTED:
        case WebSocketMessageType.USER_REGISTERED:
        case WebSocketMessageType.ONLINE_USERS_COUNT:
        case WebSocketMessageType.EMAIL_VERIFIED:
        case WebSocketMessageType.NOTIFICATION_COUNT_UPDATED:
        case WebSocketMessageType.PROJECT_LIKED:
        case WebSocketMessageType.ACTIVITY_LOGGED:
        case WebSocketMessageType.NEWS_BROADCASTED:
          this.messages$.next(message);
          break;

        case WebSocketMessageType.PING:
          this.sendMessage({
            type: WebSocketMessageType.PONG,
            timestamp: message.timestamp,
          });
          break;

        case WebSocketMessageType.TOKEN_REFRESH_REQUIRED:
          this.handleTokenRefreshRequired();
          break;

        case WebSocketMessageType.IDLE_TIMEOUT:
          break;

        case WebSocketMessageType.SERVER_SHUTDOWN:
          this.handleServerShutdown(message.reconnectInSeconds ?? 30);
          break;

        default:
          break;
      }
    } catch {
      // ignore parse errors
    }
  }

  private handleTokenRefreshRequired(): void {
    if (this.tokenRefreshInProgress) return;
    this.tokenRefreshInProgress = true;

    this.authStateService
      .refreshUserState()
      .then(() => {
        this.disconnect();
        setTimeout(() => {
          this.tokenRefreshInProgress = false;
          this.connect();
        }, 1000);
      })
      .catch(() => {
        this.tokenRefreshInProgress = false;
        this.disconnect();
      });
  }

  private handleServerShutdown(reconnectInSeconds: number): void {
    this.disconnect();
    setTimeout(() => {
      this.isManualClose = false;
      this.connect();
    }, reconnectInSeconds * 1000);
  }

  private scheduleReconnect(): void {
    if (this.isManualClose) return;
    this.reconnectAttempts++;
    this.connectionState$.next(WebSocketConnectionState.RECONNECTING);
    const delay = this.reconnectDelay * this.reconnectAttempts;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  private sendMessage(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch {
        // ignore
      }
    }
  }

  getCurrentState(): WebSocketConnectionState {
    return this.connectionState$.value;
  }
}
