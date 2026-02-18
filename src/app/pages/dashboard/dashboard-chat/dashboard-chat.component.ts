import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent, ChatPersistedMessage } from '../../../shared/organisms/chat/chat.component';
import { ConfirmModalComponent } from '../../../core/components/confirm-modal/confirm-modal.component';

interface ChatHistoryItem {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatPersistedMessage[];
}

@Component({
  selector: 'app-dashboard-chat',
  standalone: true,
  imports: [CommonModule, ChatComponent, ConfirmModalComponent],
  templateUrl: './dashboard-chat.component.html',
  styleUrl: './dashboard-chat.component.css'
})
export class DashboardChatComponent {
  private readonly storageKey = 'dashboard_chat_histories_v1';

  readonly histories = signal<ChatHistoryItem[]>(this.loadHistories());
  readonly selectedHistoryId = signal<string | null>(null);
  readonly activeSeedMessages = signal<ChatPersistedMessage[] | null>(null);
  readonly deleteModalVisible = signal(false);
  readonly pendingDeleteHistoryId = signal<string | null>(null);

  readonly sortedHistories = computed(() =>
    [...this.histories()].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  );

  constructor() {
    const first = this.sortedHistories()[0];
    if (first) {
      this.selectHistory(first.id);
    } else {
      this.createNewChat();
    }
  }

  createNewChat(): void {
    const id = this.makeId();
    const now = new Date().toISOString();
    const fresh: ChatHistoryItem = {
      id,
      title: 'Nuevo chat',
      updatedAt: now,
      messages: [],
    };
    this.histories.update((items) => [fresh, ...items]);
    this.selectedHistoryId.set(id);
    this.activeSeedMessages.set([]);
    this.persistHistories();
  }

  selectHistory(id: string): void {
    this.selectedHistoryId.set(id);
    const found = this.histories().find((item) => item.id === id);
    this.activeSeedMessages.set(found?.messages ?? []);
  }

  openDeleteHistoryConfirm(historyId: string, event: Event): void {
    event.stopPropagation();
    this.pendingDeleteHistoryId.set(historyId);
    this.deleteModalVisible.set(true);
  }

  closeDeleteHistoryConfirm(): void {
    this.deleteModalVisible.set(false);
    this.pendingDeleteHistoryId.set(null);
  }

  confirmDeleteHistory(): void {
    const historyId = this.pendingDeleteHistoryId();
    if (!historyId) {
      this.closeDeleteHistoryConfirm();
      return;
    }

    const remaining = this.histories().filter((item) => item.id !== historyId);
    this.histories.set(remaining);
    this.persistHistories();

    const selectedId = this.selectedHistoryId();
    if (selectedId === historyId) {
      const next = this.sortedHistories()[0];
      if (next) {
        this.selectHistory(next.id);
      } else {
        this.createNewChat();
      }
    }

    this.closeDeleteHistoryConfirm();
  }

  onConversationChange(messages: ChatPersistedMessage[]): void {
    const selectedId = this.selectedHistoryId();
    if (!selectedId) return;

    const cleaned = messages.filter((msg) => msg.content.trim().length > 0);
    const current = this.histories().find((item) => item.id === selectedId);
    if (!current) return;

    const noRealChange = JSON.stringify(current.messages) === JSON.stringify(cleaned);
    if (noRealChange) return;

    this.histories.update((items) =>
      items.map((item) => {
        if (item.id !== selectedId) return item;
        return {
          ...item,
          messages: cleaned,
          title: this.resolveTitle(cleaned),
          updatedAt: new Date().toISOString(),
        };
      })
    );
    this.persistHistories();
  }

  trackByHistoryId(_: number, item: ChatHistoryItem): string {
    return item.id;
  }

  formatUpdatedAt(iso: string): string {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  getPendingDeleteTitle(): string {
    const id = this.pendingDeleteHistoryId();
    if (!id) return 'este chat';
    const found = this.histories().find((item) => item.id === id);
    if (!found) return 'este chat';
    return `"${found.title}"`;
  }

  private resolveTitle(messages: ChatPersistedMessage[]): string {
    const firstUser = messages.find((msg) => msg.role === 'user')?.content?.trim();
    if (!firstUser) return 'Nuevo chat';
    return firstUser.length > 42 ? `${firstUser.slice(0, 42)}...` : firstUser;
  }

  private loadHistories(): ChatHistoryItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as ChatHistoryItem[];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) =>
        item
        && typeof item.id === 'string'
        && typeof item.title === 'string'
        && typeof item.updatedAt === 'string'
        && Array.isArray(item.messages)
      );
    } catch {
      return [];
    }
  }

  private persistHistories(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.histories()));
  }

  private makeId(): string {
    return `chat_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  }
}
