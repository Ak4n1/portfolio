import { ContactResponse } from './contact-response.model';

export interface ContactsResponse {
    contacts: ContactResponse[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
    unreadCount: number;
}
