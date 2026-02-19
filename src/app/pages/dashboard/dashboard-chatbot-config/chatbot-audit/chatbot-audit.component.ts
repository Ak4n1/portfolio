import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserService } from '../../../../core/services/admin-user.service';
import { ChatbotAuditService } from '../../../../core/services/chatbot-audit.service';
import { UserSearchItem } from '../../../../core/models/user-search-item.model';
import {
  ChatAuditConversationDetail,
  ChatAuditConversationSummary,
} from '../../../../core/models/chatbot-audit.model';

@Component({
  selector: 'app-chatbot-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot-audit.component.html',
  styleUrl: './chatbot-audit.component.css',
})
export class ChatbotAuditComponent {
  private readonly adminUserService = inject(AdminUserService);
  private readonly chatbotAuditService = inject(ChatbotAuditService);

  readonly query = signal('');
  readonly searchingUsers = signal(false);
  readonly userSearchError = signal<string | null>(null);
  readonly users = signal<UserSearchItem[]>([]);

  readonly selectedUser = signal<UserSearchItem | null>(null);
  readonly loadingConversations = signal(false);
  readonly conversationsError = signal<string | null>(null);
  readonly conversations = signal<ChatAuditConversationSummary[]>([]);

  readonly selectedConversationId = signal<number | null>(null);
  readonly loadingConversationDetail = signal(false);
  readonly conversationDetailError = signal<string | null>(null);
  readonly conversationDetail = signal<ChatAuditConversationDetail | null>(null);

  setQuery(value: string): void {
    this.query.set(value);
  }

  searchUsers(): void {
    const q = this.query().trim();
    if (q.length < 2) {
      this.users.set([]);
      this.userSearchError.set('Escribe al menos 2 caracteres para buscar usuarios.');
      return;
    }

    this.searchingUsers.set(true);
    this.userSearchError.set(null);
    this.users.set([]);

    this.adminUserService.searchUsers({ query: q, limit: 15 }).subscribe({
      next: (items) => {
        this.users.set(items ?? []);
        this.searchingUsers.set(false);
      },
      error: () => {
        this.searchingUsers.set(false);
        this.userSearchError.set('No se pudo buscar usuarios.');
      },
    });
  }

  selectUser(user: UserSearchItem): void {
    this.selectedUser.set(user);
    this.selectedConversationId.set(null);
    this.conversationDetail.set(null);
    this.conversationDetailError.set(null);
    this.loadConversations(user.id);
  }

  selectConversation(conversation: ChatAuditConversationSummary): void {
    this.selectedConversationId.set(conversation.conversationId);
    this.conversationDetail.set(null);
    this.conversationDetailError.set(null);
    this.loadingConversationDetail.set(true);

    this.chatbotAuditService.getConversationDetail(conversation.conversationId).subscribe({
      next: (detail) => {
        this.conversationDetail.set(detail);
        this.loadingConversationDetail.set(false);
      },
      error: () => {
        this.loadingConversationDetail.set(false);
        this.conversationDetailError.set('No se pudo cargar el detalle de la conversacion.');
      },
    });
  }

  formatDate(iso: string): string {
    if (!iso) return '-';
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  }

  getUserDisplayName(user: UserSearchItem): string {
    const firstName = user.firstName?.trim() ?? '';
    const lastName = user.lastName?.trim() ?? '';
    const full = `${firstName} ${lastName}`.trim();
    return full || user.email;
  }

  private loadConversations(userId: number): void {
    this.loadingConversations.set(true);
    this.conversationsError.set(null);
    this.conversations.set([]);

    this.chatbotAuditService.getConversationsByUser({ userId, page: 0, size: 50 }).subscribe({
      next: (response) => {
        this.conversations.set(response.items ?? []);
        this.loadingConversations.set(false);
      },
      error: () => {
        this.loadingConversations.set(false);
        this.conversationsError.set('No se pudieron cargar las conversaciones de este usuario.');
      },
    });
  }
}
