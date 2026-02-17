import type { SendBulkEmailRecipientType } from './send-bulk-email-request.model';

export interface CheckRecipientsRequest {
  recipientType: SendBulkEmailRecipientType;
  excludedEmails?: string[];
  recipientEmails?: string[];
}
