export type SendManualNotificationRecipientType = 'ALL_USERS' | 'SPECIFIC_USER';

export interface SendManualNotificationRequest {
  recipientType: SendManualNotificationRecipientType;
  recipientEmail: string | null;
  type: string;
  title: string;
  message: string;
  excludedEmails?: string[];
}
