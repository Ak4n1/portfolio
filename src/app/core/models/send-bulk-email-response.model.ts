export interface SendBulkEmailResponse {
  totalRecipients: number;
  sentCount: number;
  message: string;
  /** true cuando el envío se ha encolado y se procesa en segundo plano (202). */
  queued?: boolean;
}
