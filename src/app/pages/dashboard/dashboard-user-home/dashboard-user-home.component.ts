import { Component, OnInit, OnDestroy, signal, inject, ElementRef, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { ProjectService } from '../../../core/services/project.service';
import { NewsService } from '../../../core/services/news.service';
import { Project, NewsBroadcast } from '../../../core/models/project.model';
import { WebSocketMessageType } from '../../../core/models/websocket-message.model';
import { UserNotificationService } from '../../../core/services/user-notification.service';
import { SystemNotificationResponse } from '../../../core/models/system-notification-response.model';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { ActivityLogResponse } from '../../../core/models/activity-log-response.model';
import { getRelativeTime } from '../../../core/utils/notification-display.util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-user-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-user-home.component.html',
  styleUrl: './dashboard-user-home.component.css'
})
export class DashboardUserHomeComponent implements OnInit, OnDestroy {
  private readonly ACTIVITY_LOGS_LIMIT = 20;
  private readonly NEWS_PAGE_SIZE = 1;

  private authStateService = inject(AuthStateService);
  private wsService = inject(WebSocketService);
  private projectService = inject(ProjectService);
  private newsService = inject(NewsService);
  private userNotificationService = inject(UserNotificationService);
  private activityLogService = inject(ActivityLogService);

  @ViewChild('consoleBody') consoleBody!: ElementRef;

  user = this.authStateService.currentUser;
  accessLevel = computed(() => {
    const roles = this.user()?.roles ?? [];
    if (roles.includes('ROLE_ADMIN')) return 'ADMIN';
    if (roles.includes('ROLE_USER')) return 'USER';
    return 'VISITOR';
  });

  newsItems = signal<NewsBroadcast[]>([]);
  newsLoading = signal(true);
  newsError = signal<string | null>(null);
  newsPage = signal(0);

  pagedNewsItems = computed(() => {
    const page = this.newsPage();
    const start = page * this.NEWS_PAGE_SIZE;
    const end = start + this.NEWS_PAGE_SIZE;
    return this.newsItems().slice(start, end);
  });

  newsTotalPages = computed(() => {
    const total = this.newsItems().length;
    return total === 0 ? 1 : Math.ceil(total / this.NEWS_PAGE_SIZE);
  });

  popularProjects = signal<Project[]>([]);
  projectsLoading = signal(true);
  projectsError = signal<string | null>(null);

  userNotifications = signal<SystemNotificationResponse[]>([]);
  notificationsLoading = signal(true);
  notificationsError = signal<string | null>(null);

  activityLogs = signal<ActivityLogItem[]>([]);
  projectTitlesById = signal<Record<number, string>>({});
  logSortOrder = signal<'asc' | 'desc'>('desc');
  sortedActivityLogs = computed(() => {
    const order = this.logSortOrder();
    return [...this.activityLogs()].sort((a, b) =>
      order === 'asc'
        ? a.timestamp.getTime() - b.timestamp.getTime()
        : b.timestamp.getTime() - a.timestamp.getTime()
    );
  });
  loadingLike: { [key: number]: boolean } = {};

  readonly getRelativeTime = getRelativeTime;

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.loadInitialData();
    this.setupWebSocket();
    this.addLog('SYSTEM_BOOT', 'System initialized. Waiting for uplink...');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadInitialData(): void {
    this.loadActivityLogs();
    this.loadNews();
    this.loadPopularProjects();
    this.loadUserNotifications();
  }

  private loadActivityLogs(): void {
    this.activityLogService.getRecent(this.ACTIVITY_LOGS_LIMIT).subscribe({
      next: (logs) => {
        const fromApi = this.toActivityLogItems(logs ?? []);
        const merged = [...fromApi, ...this.activityLogs()]
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
          .slice(-this.ACTIVITY_LOGS_LIMIT);
        this.activityLogs.set(merged);
        this.syncProjectTitlesForLogs(merged);
      },
      error: () => {
        // No bloquear home por error en historial de actividad
      },
    });
  }

  private toActivityLogItems(logs: ActivityLogResponse[]): ActivityLogItem[] {
    return logs
      .map((log) => {
        const timestamp = new Date(log.createdAt);
        if (Number.isNaN(timestamp.getTime())) return null;
        const relatedEntityId =
          typeof log.relatedEntityId === 'number'
            ? log.relatedEntityId
            : null;
        const relatedEntityType =
          typeof log.relatedEntityType === 'string' && log.relatedEntityType.trim()
            ? log.relatedEntityType.trim().toUpperCase()
            : null;
        return {
          timestamp,
          type: (log.type ?? 'LOG').toUpperCase(),
          message: log.message ?? '',
          relatedEntityType,
          relatedEntityId,
        } as ActivityLogItem;
      })
      .filter((item): item is ActivityLogItem => item !== null)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private loadNews(): void {
    this.newsLoading.set(true);
    this.newsError.set(null);
    this.newsService.getAll().subscribe({
      next: (news) => {
        this.newsItems.set(news ?? []);
        this.newsPage.set(0);
        this.newsLoading.set(false);
      },
      error: () => {
        this.newsError.set('No se pudieron cargar las noticias.');
        this.newsItems.set([]);
        this.newsPage.set(0);
        this.newsLoading.set(false);
      },
    });
  }

  private loadPopularProjects(): void {
    this.projectsLoading.set(true);
    this.projectsError.set(null);

    this.projectService.list(true).subscribe({
      next: (projects) => {
        const sorted = [...projects]
          .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
          .slice(0, 5);

        this.popularProjects.set(sorted);
        this.projectsLoading.set(false);

        const userId = this.user()?.id;
        if (userId) {
          sorted.forEach((p) => {
            if (!p.id) return;
            this.projectService.getLikeStatus(p.id).subscribe({
              next: (status) => {
                p.likedByUser = status.liked;
                p.likesCount = status.likesCount;
                this.popularProjects.set([...sorted]);
              },
              error: () => {
                // Ignorar error individual para no bloquear el ranking
              },
            });
          });
        }
      },
      error: () => {
        this.projectsError.set('No se pudieron cargar los proyectos.');
        this.popularProjects.set([]);
        this.projectsLoading.set(false);
      },
    });
  }

  private loadUserNotifications(): void {
    this.notificationsLoading.set(true);
    this.notificationsError.set(null);

    this.userNotificationService
      .getNotifications({
        page: 0,
        size: 5,
        read: false,
      })
      .subscribe({
        next: (res) => {
          this.userNotifications.set(res.notifications ?? []);
          this.notificationsLoading.set(false);
        },
        error: () => {
          this.notificationsError.set('No se pudieron cargar los avisos.');
          this.userNotifications.set([]);
          this.notificationsLoading.set(false);
        },
      });
  }

  private setupWebSocket(): void {
    this.subscriptions.add(
      this.wsService.messages.subscribe((msg) => {
        switch (msg.type) {
          case WebSocketMessageType.PROJECT_LIKED:
            this.handleProjectLiked(msg.data);
            break;
          case WebSocketMessageType.NEWS_BROADCASTED:
            this.handleNewsBroadcasted(msg as { title?: string; message?: string; data?: Record<string, unknown> });
            break;
          case WebSocketMessageType.ACTIVITY_LOGGED:
            this.addLog(msg.title || 'LOG', msg.message || '', msg.data);
            break;
          case WebSocketMessageType.NOTIFICATION_COUNT_UPDATED:
            this.loadUserNotifications();
            break;
          default:
            break;
        }
      })
    );
  }

  private handleProjectLiked(data: unknown): void {
    if (!data || typeof data !== 'object') return;

    const projectIdValue = (data as { projectId?: unknown }).projectId;
    const likesCountValue = (data as { likesCount?: unknown }).likesCount;

    if (typeof projectIdValue !== 'number' || typeof likesCountValue !== 'number') return;

    const current = this.popularProjects();
    const index = current.findIndex((p) => p.id === projectIdValue);

    if (index !== -1) {
      current[index].likesCount = likesCountValue;
      const sorted = [...current].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
      this.popularProjects.set(sorted);
      return;
    }

    this.refreshPopularProjectsSnapshot();
  }

  private handleNewsBroadcasted(msg: { title?: string; message?: string; data?: Record<string, unknown> }): void {
    const payload = msg.data ?? {};
    const isDeleted = payload['deleted'] === true || payload['action'] === 'DELETED';
    const newsIdFromPayload = typeof payload['newsId'] === 'number' ? payload['newsId'] : null;

    if (isDeleted && newsIdFromPayload !== null) {
      const current = this.newsItems();
      const updated = current.filter((item) => item.id !== newsIdFromPayload);
      if (updated.length === current.length) {
        return;
      }
      this.newsItems.set(updated);
      const maxPage = Math.max(Math.ceil(updated.length / this.NEWS_PAGE_SIZE) - 1, 0);
      if (this.newsPage() > maxPage) {
        this.newsPage.set(maxPage);
      }
      return;
    }

    const title = typeof payload['title'] === 'string' ? payload['title'] : msg.title ?? 'Nueva noticia';
    const content = typeof msg.message === 'string' && msg.message.trim() ? msg.message : 'Sin detalle disponible.';
    const priorityRaw = typeof payload['priority'] === 'string' ? payload['priority'] : 'MEDIUM';
    const createdAtRaw = typeof payload['createdAt'] === 'string' ? payload['createdAt'] : null;
    const createdAt = createdAtRaw && !Number.isNaN(new Date(createdAtRaw).getTime())
      ? createdAtRaw
      : new Date().toISOString();

    const news: NewsBroadcast = {
      id: newsIdFromPayload ?? Date.now(),
      title,
      content,
      priority: this.normalizePriority(priorityRaw),
      createdAt,
    };

    this.newsItems.update((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === news.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = news;
        return updated;
      }
      return [news, ...prev];
    });
    this.newsPage.set(0);
  }

  toggleLike(project: Project): void {
    if (!project.id || this.loadingLike[project.id]) return;

    this.loadingLike[project.id] = true;
    this.projectService.toggleLike(project.id).subscribe({
      next: (res) => {
        project.likedByUser = res.liked;
        project.likesCount = res.likesCount;
        this.loadingLike[project.id!] = false;
        const sorted = [...this.popularProjects()].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
        this.popularProjects.set(sorted);
      },
      error: () => {
        this.loadingLike[project.id!] = false;
      }
    });
  }

  addLog(type: string, message: string, data?: Record<string, unknown>): void {
    const relatedEntityType =
      typeof data?.['relatedEntityType'] === 'string' && data['relatedEntityType'].trim()
        ? data['relatedEntityType'].trim().toUpperCase()
        : null;
    const relatedEntityId =
      typeof data?.['relatedEntityId'] === 'number'
        ? data['relatedEntityId']
        : null;

    this.activityLogs.update((prev) => {
      const newLogs = [
        ...prev,
        {
          timestamp: new Date(),
          type,
          message,
          relatedEntityType,
          relatedEntityId,
        },
      ];
      return newLogs.slice(-this.ACTIVITY_LOGS_LIMIT);
    });

    if (relatedEntityType === 'PROJECT' && typeof relatedEntityId === 'number') {
      this.cacheProjectTitleFromMessage(relatedEntityId, message);
      this.syncProjectTitlesForLogs(this.activityLogs());
    }

    this.scrollConsoleToActiveEdge();
  }

  setLogSortOrder(order: 'asc' | 'desc'): void {
    if (this.logSortOrder() === order) return;
    this.logSortOrder.set(order);
    this.scrollConsoleToActiveEdge();
  }

  private scrollConsoleToActiveEdge(): void {
    setTimeout(() => {
      if (!this.consoleBody) return;
      const el = this.consoleBody.nativeElement as HTMLElement;
      el.scrollTop = this.logSortOrder() === 'asc' ? el.scrollHeight : 0;
    }, 100);
  }

  private refreshPopularProjectsSnapshot(): void {
    this.projectService.list(true).subscribe({
      next: (projects) => {
        const sorted = [...projects]
          .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
          .slice(0, 5);
        this.popularProjects.set(sorted);
      },
      error: () => {
        // no-op: no bloquear UI por refresh parcial
      },
    });
  }

  getNewsPriorityClass(news: NewsBroadcast): string {
    return `priority-${this.normalizePriority(news.priority).toLowerCase()}`;
  }

  formatActivityMessage(log: ActivityLogItem): string {
    const personalized = this.personalizeActivityMessage(log.message ?? '');
    if (log.relatedEntityType !== 'PROJECT' || typeof log.relatedEntityId !== 'number') {
      return personalized;
    }

    const currentTitle = this.projectTitlesById()[log.relatedEntityId];
    if (!currentTitle) {
      return personalized;
    }

    return personalized.replace(/'[^']*'/, `'${currentTitle}'`);
  }

  private personalizeActivityMessage(message: string): string {
    const raw = (message ?? '').trim();
    if (!raw) return '';

    const firstName = (this.user()?.firstName ?? '').trim();
    const lastName = (this.user()?.lastName ?? '').trim();
    const fullName = `${firstName} ${lastName}`.trim();

    if (!fullName) {
      return raw;
    }

    const escapedName = this.escapeRegExp(fullName);
    const likeAdded = new RegExp(`^${escapedName}\\s+dio like a\\s+(.+)$`, 'i');
    const likeRemoved = new RegExp(`^${escapedName}\\s+quit[oó] like de\\s+(.+)$`, 'i');
    const resetRequested = new RegExp(`^${escapedName}\\s+solicit[oó]\\s+restablecer tu contrase[nñ]a por email\\.?$`, 'i');

    const likeAddedMatch = raw.match(likeAdded);
    if (likeAddedMatch?.[1]) {
      return `Le diste like a ${likeAddedMatch[1]}`;
    }

    const likeRemovedMatch = raw.match(likeRemoved);
    if (likeRemovedMatch?.[1]) {
      return `Quitaste tu like de ${likeRemovedMatch[1]}`;
    }

    if (resetRequested.test(raw)) {
      return 'Solicitaste restablecer tu contrasena por email.';
    }

    return raw;
  }

  private syncProjectTitlesForLogs(logs: ActivityLogItem[]): void {
    const toFetch = new Set<number>();
    const currentCache = this.projectTitlesById();

    logs.forEach((log) => {
      if (log.relatedEntityType !== 'PROJECT' || typeof log.relatedEntityId !== 'number') {
        return;
      }

      this.cacheProjectTitleFromMessage(log.relatedEntityId, log.message);
      if (!currentCache[log.relatedEntityId]) {
        toFetch.add(log.relatedEntityId);
      }
    });

    toFetch.forEach((projectId) => {
      this.projectService.getById(projectId).subscribe({
        next: (project) => {
          const title = (project?.title ?? '').trim();
          if (!title) return;
          this.projectTitlesById.update((prev) => ({ ...prev, [projectId]: title }));
        },
        error: () => {
          // Ignore stale/removed projects; fallback keeps original log text.
        }
      });
    });
  }

  private cacheProjectTitleFromMessage(projectId: number, message: string): void {
    const match = (message ?? '').match(/'([^']+)'/);
    const title = match?.[1]?.trim();
    if (!title) return;
    this.projectTitlesById.update((prev) => {
      if (prev[projectId] === title) {
        return prev;
      }
      return { ...prev, [projectId]: title };
    });
  }

  previousNewsPage(): void {
    const currentPage = this.newsPage();
    if (currentPage <= 0) {
      return;
    }
    this.newsPage.set(currentPage - 1);
  }

  nextNewsPage(): void {
    const currentPage = this.newsPage();
    const totalPages = this.newsTotalPages();
    if (currentPage >= totalPages - 1) {
      return;
    }
    this.newsPage.set(currentPage + 1);
  }

  private normalizePriority(value: unknown): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (typeof value !== 'string') return 'MEDIUM';
    const normalized = value.toUpperCase();
    if (normalized === 'LOW' || normalized === 'MEDIUM' || normalized === 'HIGH') {
      return normalized;
    }
    return 'MEDIUM';
  }

  downloadCV(): void {
    this.addLog('IO_REQUEST', 'CV download initiated by user...');
    window.open('/assets/cv_juan_encabo.pdf', '_blank');
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

interface ActivityLogItem {
  timestamp: Date;
  type: string;
  message: string;
  relatedEntityType?: string | null;
  relatedEntityId?: number | null;
}
