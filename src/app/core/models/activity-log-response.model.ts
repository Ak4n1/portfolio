export interface ActivityLogResponse {
  id: number;
  type: string;
  message: string;
  relatedEntityType?: string | null;
  relatedEntityId?: number | null;
  createdAt: string;
}
