export interface AdminUserListItem {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  emailVerified: boolean;
  /** Backend envía array de nombres de rol */
  roles: string[];
  createdAt: string;
}
