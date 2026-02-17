export interface SendManualNotificationResponse {
  success: boolean;
  totalRecipients: number;
  sentImmediately: number;
  pendingDelivery: number;
  excludedByPreferences: number;
  notificationIds?: number[];
  message: string;
}
