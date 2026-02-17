import {
  Component,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  inject,
  OnInit,
  DestroyRef,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, filter } from 'rxjs/operators';
import { ThemeService } from '../../../core/services/theme.service';
import { UserNotificationService } from '../../../core/services/user-notification.service';
import { NotificationSoundService } from '../../../core/services/notification-sound.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { WebSocketMessageType } from '../../../core/models/websocket-message.model';
import { SystemNotificationResponse } from '../../../core/models/system-notification-response.model';

/** Tipos WebSocket que actualizan la campanita (contador y/o lista). */
const NOTIFICATION_WS_TYPES = new Set<string>([
  WebSocketMessageType.CONTACT_SUBMITTED,
  WebSocketMessageType.USER_REGISTERED,
  WebSocketMessageType.EMAIL_VERIFIED,
  WebSocketMessageType.NOTIFICATION_COUNT_UPDATED,
]);

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeaderComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() closeSidebarRequest = new EventEmitter<void>();

  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(UserNotificationService);
  private notificationSound = inject(NotificationSoundService);
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private ws = inject(WebSocketService);

  isNotificationsOpen = false;
  unreadCount = signal(0);
  notifications = signal<SystemNotificationResponse[]>([]);
  loadingNotifications = signal(false);

  isDarkMode = toSignal(
    this.themeService.currentTheme$.pipe(map((t) => t === 'dark')),
    { initialValue: this.themeService.getCurrentTheme() === 'dark' }
  );

  get todayFormatted(): string {
    return new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  ngOnInit(): void {
    this.refreshUnreadCount();
    this.notificationService
      .getUnreadCountChanged()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshUnreadCount());
    this.ws.messages
      .pipe(
        filter((m) => NOTIFICATION_WS_TYPES.has(m.type)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        setTimeout(() => {
          this.notificationSound.play();
          this.refreshUnreadCount();
          if (this.isNotificationsOpen) {
            this.loadNotifications();
          }
        }, 0);
      });
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) {
      this.closeSidebarRequest.emit();
      this.loadNotifications();
    }
  }

  closeNotifications(): void {
    this.isNotificationsOpen = false;
  }

  loadNotifications(): void {
    this.loadingNotifications.set(true);
    this.notificationService.getNotifications({ page: 0, size: 10 }).subscribe({
      next: (res) => {
        this.notifications.set(res.notifications ?? []);
        this.loadingNotifications.set(false);
      },
      error: () => {
        this.notifications.set([]);
        this.loadingNotifications.set(false);
      },
    });
  }

  refreshUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadCount.set(count);
      },
      error: () => {},
    });
  }

  onNotificationClick(notification: SystemNotificationResponse): void {
    if (notification.read) {
      this.goToRelated(notification);
      return;
    }
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
        this.unreadCount.update((c) => Math.max(0, c - 1));
        this.goToRelated(notification);
      },
      error: () => this.goToRelated(notification),
    });
  }

  private goToRelated(notification: SystemNotificationResponse): void {
    this.closeNotifications();
    if (notification.relatedEntityType && notification.relatedEntityId) {
      if (notification.relatedEntityType === 'PROJECT') {
        this.router.navigate(['/dashboard/projects', notification.relatedEntityId]);
      }
    }
  }

  goToAllNotifications(): void {
    this.closeNotifications();
    this.router.navigate(['/dashboard/notificaciones']);
  }

  markAllAsRead(): void {
    if (this.unreadCount() === 0) return;
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.unreadCount.set(0);
        this.notifications.update((list) => list.map((n) => ({ ...n, read: true } as SystemNotificationResponse)));
        if (this.isNotificationsOpen) {
          this.loadNotifications();
        }
      },
      error: () => {},
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isNotificationsOpen) return;
    const el = this.elementRef.nativeElement as HTMLElement;
    if (el.contains(event.target as Node)) return;
    this.closeNotifications();
  }
}
