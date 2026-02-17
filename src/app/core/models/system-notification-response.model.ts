/** Una notificación del sistema (campanita / lista). */
export interface SystemNotificationResponse {
  id: number;
  type: string;
  recipientId: number;
  title: string;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  read: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt?: string;
}
