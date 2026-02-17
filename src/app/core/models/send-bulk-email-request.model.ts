export type SendBulkEmailRecipientType = 'ALL_USERS' | 'SELECTED_USERS';

export interface SendBulkEmailRequest {
  subject: string;
  htmlBody: string;
  recipientType: SendBulkEmailRecipientType;
  excludedEmails?: string[];
  recipientEmails?: string[];
}
