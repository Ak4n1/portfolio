export enum WebSocketMessageType {
  CONTACT_SUBMITTED = 'CONTACT_SUBMITTED',
  USER_REGISTERED = 'USER_REGISTERED',
  ONLINE_USERS_COUNT = 'ONLINE_USERS_COUNT',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  /** El backend envía este tipo cuando cambia el contador de no leídas (para actualizar la campanita). */
  NOTIFICATION_COUNT_UPDATED = 'NOTIFICATION_COUNT_UPDATED',
  PING = 'PING',
  PONG = 'PONG',
  ACK = 'ACK',
  TOKEN_REFRESH_REQUIRED = 'TOKEN_REFRESH_REQUIRED',
  IDLE_TIMEOUT = 'IDLE_TIMEOUT',
  SERVER_SHUTDOWN = 'SERVER_SHUTDOWN',
}

export enum WebSocketConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR',
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  title?: string;
  message?: string;
  data?: Record<string, unknown>;
  timestamp?: number;
  reconnectInSeconds?: number;
}
