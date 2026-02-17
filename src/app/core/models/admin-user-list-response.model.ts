import { AdminUserListItem } from './admin-user-list-item.model';

export interface AdminUserListResponse {
  content: AdminUserListItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
