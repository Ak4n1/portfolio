export interface ExcludedUserDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CheckRecipientsResponse {
  excludedByPreference: ExcludedUserDto[];
  recipientCount: number;
}
