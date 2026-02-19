import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  computed,
  DestroyRef,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor, TOOLBAR_FULL } from 'ngx-editor';
import { pastePreserveNewlinesPlugin } from '../../../core/plugins/paste-preserve-newlines.plugin';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { from, of } from 'rxjs';
import { catchError, concatMap, map, toArray } from 'rxjs/operators';
import { UserNotificationService } from '../../../core/services/user-notification.service';
import { AdminManualNotificationService } from '../../../core/services/admin-manual-notification.service';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { SystemNotificationResponse } from '../../../core/models/system-notification-response.model';
import { SendManualNotificationRequest } from '../../../core/models/send-manual-notification-request.model';
import { SendManualNotificationResponse } from '../../../core/models/send-manual-notification-response.model';
import { UserSearchItem } from '../../../core/models/user-search-item.model';
import { getNotificationIcon, getRelativeTime } from '../../../core/utils/notification-display.util';
import { NOTIFICATION_TYPE_FILTERS } from '../../../core/constants/notification-type-filters';
import { WebSocketService } from '../../../core/services/websocket.service';
import { WebSocketMessageType } from '../../../core/models/websocket-message.model';
import { AdminEmailService } from '../../../core/services/admin-email.service';
import { SendBulkEmailResponse } from '../../../core/models/send-bulk-email-response.model';
import type { ExcludedUserDto } from '../../../core/models/check-recipients-response.model';

@Component({
  selector: 'app-dashboard-notificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEditorComponent, NgxEditorMenuComponent],
  templateUrl: './dashboard-notificaciones.component.html',
  styleUrl: './dashboard-notificaciones.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNotificacionesComponent implements OnInit, OnDestroy {
  private notificationService = inject(UserNotificationService);
  private adminManualNotificationService = inject(AdminManualNotificationService);
  private adminUserService = inject(AdminUserService);
  private adminEmailService = inject(AdminEmailService);
  private authStateService = inject(AuthStateService);
  private ws = inject(WebSocketService);
  private destroyRef = inject(DestroyRef);
  private elementRef = inject(ElementRef);

  private authState = toSignal(this.authStateService.authState, {
    initialValue: { isAuthenticated: false, user: null, isLoading: false },
  });

  notifications = signal<SystemNotificationResponse[]>([]);
  expandedMessages = signal<Record<number, boolean>>({});
  unreadCount = signal(0);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  pageSize = 8;
  loading = signal(true);
  error = signal<string | null>(null);

  readFilter = signal<'all' | 'unread' | 'read'>('all');
  typeFilter = signal<string>('');
  dateFrom = signal<string>('');
  dateTo = signal<string>('');
  searchText = signal<string>('');

  readonly typeFilterOptions = NOTIFICATION_TYPE_FILTERS;

  readonly readFilterOptions: { value: 'all' | 'unread' | 'read'; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'unread', label: 'No leídas' },
    { value: 'read', label: 'Leídas' },
  ];

  readonly manualRecipientOptions: { value: 'ALL_USERS' | 'SELECTED_USERS'; label: string }[] = [
    { value: 'ALL_USERS', label: 'Todos los usuarios' },
    { value: 'SELECTED_USERS', label: 'Usuarios seleccionados' },
  ];

  typeFilterOpen = signal(false);
  readFilterOpen = signal(false);
  manualRecipientOpen = signal(false);
  manualTypeOpen = signal(false);
  emailRecipientOpen = signal(false);

  activeStep = signal<'list' | 'send' | 'send_email'>('list');

  emailEditor: Editor = new Editor({ plugins: [pastePreserveNewlinesPlugin()] });
  emailEditorToolbar = TOOLBAR_FULL;
  emailSubject = signal('');
  emailBody = signal('');
  emailRecipientMode = signal<'ALL_USERS' | 'SELECTED_USERS'>('ALL_USERS');
  emailSelectedUsers = signal<UserSearchItem[]>([]);
  emailUserSearchQuery = signal('');
  emailUserSearchLoading = signal(false);
  emailUserSearchError = signal<string | null>(null);
  emailUserSearchResults = signal<UserSearchItem[]>([]);
  emailSending = signal(false);
  emailError = signal<string | null>(null);
  emailResult = signal<SendBulkEmailResponse | null>(null);
  emailAttachments = signal<File[]>([]);
  emailDragOver = signal(false);
  /** Modal: usuarios con preferencia de email desactivada (antes de encolar el envío). */
  emailExcludedModalVisible = signal(false);
  emailExcludedList = signal<ExcludedUserDto[]>([]);
  private emailPendingSendBody: { subject: string; htmlBody: string; recipientType: 'ALL_USERS' | 'SELECTED_USERS'; excludedEmails?: string[]; recipientEmails?: string[] } | null = null;
  private emailPendingSendFiles: File[] = [];

  isAdmin = computed(() => {
    const state = this.authState();
    return !!state?.user?.roles?.includes('ROLE_ADMIN');
  });

  getIcon = getNotificationIcon;
  getRelativeTime = getRelativeTime;

  getTypeFilterLabel(): string {
    const v = this.typeFilter();
    return this.typeFilterOptions.find((o) => o.value === v)?.label ?? 'Todos los tipos';
  }

  getReadFilterLabel(): string {
    return this.readFilterOptions.find((o) => o.value === this.readFilter())?.label ?? 'Todas';
  }

  getManualRecipientLabel(): string {
    return this.manualRecipientOptions.find((o) => o.value === this.manualRecipientMode())?.label ?? 'Todos los usuarios';
  }

  getManualTypeLabel(): string {
    return this.manualTypeOptions.find((o) => o.value === this.manualType())?.label ?? 'Anuncio';
  }

  closeAllSelects(): void {
    this.typeFilterOpen.set(false);
    this.readFilterOpen.set(false);
    this.manualRecipientOpen.set(false);
    this.manualTypeOpen.set(false);
    this.emailRecipientOpen.set(false);
  }

  manualRecipientMode = signal<'ALL_USERS' | 'SELECTED_USERS'>('ALL_USERS');
  manualType = signal('ADMIN_ANNOUNCEMENT');
  manualTitle = signal('');
  manualMessage = signal('');
  manualSending = signal(false);
  manualError = signal<string | null>(null);
  manualResult = signal<SendManualNotificationResponse | null>(null);

  userSearchQuery = signal('');
  userSearchLoading = signal(false);
  userSearchError = signal<string | null>(null);
  userSearchResults = signal<UserSearchItem[]>([]);
  selectedUsers = signal<UserSearchItem[]>([]);

  readonly manualTypeOptions: { value: string; label: string }[] = [
    { value: 'ADMIN_ANNOUNCEMENT', label: 'Anuncio' },
    { value: 'SYSTEM_MAINTENANCE', label: 'Mantenimiento del sistema' },
    { value: 'IMPORTANT_UPDATE', label: 'Actualización importante' },
    { value: 'PROMOTION', label: 'Promoción / Oferta' },
    { value: 'REMINDER', label: 'Recordatorio general' },
  ];

  ngOnInit(): void {
    if (!this.isAdmin() && (this.activeStep() === 'send' || this.activeStep() === 'send_email')) {
      this.activeStep.set('list');
    }
    const state = history.state as { preselectedEmails?: string[] } | undefined;
    if (state?.preselectedEmails?.length && this.isAdmin()) {
      this.activeStep.set('send');
      this.manualRecipientMode.set('SELECTED_USERS');
      this.selectedUsers.set(
        state.preselectedEmails.map((email, i) => ({ id: i, email, firstName: '', lastName: '' }))
      );
    }
    this.ws.messages
      .pipe(
        filter((m) => m.type === WebSocketMessageType.NOTIFICATION_COUNT_UPDATED),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.activeStep() === 'list') this.applyFilters();
      });
    this.applyFilters();
  }

  setStep(step: 'list' | 'send' | 'send_email'): void {
    if ((step === 'send' || step === 'send_email') && !this.isAdmin()) return;
    this.closeAllSelects();
    this.activeStep.set(step);
    this.manualError.set(null);
    this.manualResult.set(null);
    this.emailError.set(null);
    this.emailResult.set(null);
    if (step === 'list') {
      this.selectedUsers.set([]);
      this.userSearchQuery.set('');
      this.userSearchResults.set([]);
      this.emailSelectedUsers.set([]);
      this.emailUserSearchQuery.set('');
      this.emailUserSearchResults.set([]);
    }
  }

  ngOnDestroy(): void {
    this.emailEditor.destroy();
  }

  getEmailRecipientLabel(): string {
    return this.manualRecipientOptions.find((o) => o.value === this.emailRecipientMode())?.label ?? 'Todos los usuarios';
  }

  onEmailRecipientModeChange(mode: 'ALL_USERS' | 'SELECTED_USERS'): void {
    this.emailRecipientMode.set(mode);
  }

  onEmailUserSearchChange(value: string): void {
    const q = (value ?? '').trim();
    this.emailUserSearchQuery.set(value ?? '');
    this.emailUserSearchError.set(null);
    this.emailUserSearchResults.set([]);
    if (q.length < 2) {
      this.emailUserSearchLoading.set(false);
      return;
    }
    this.emailUserSearchLoading.set(true);
    this.adminUserService.searchUsers({ query: q, limit: 10 }).subscribe({
      next: (users) => {
        const selectedIds = new Set(this.emailSelectedUsers().map((u) => u.id));
        this.emailUserSearchResults.set((users ?? []).filter((u) => !selectedIds.has(u.id)));
        this.emailUserSearchLoading.set(false);
      },
      error: () => {
        this.emailUserSearchError.set('No se pudo buscar usuarios.');
        this.emailUserSearchLoading.set(false);
      },
    });
  }

  addEmailSelectedUser(user: UserSearchItem): void {
    if (!user?.email) return;
    const exists = this.emailSelectedUsers().some((u) => u.id === user.id || u.email === user.email);
    if (exists) return;
    this.emailSelectedUsers.update((prev) => [...prev, user]);
    this.emailUserSearchResults.update((prev) => prev.filter((u) => u.id !== user.id));
  }

  removeEmailSelectedUser(user: UserSearchItem): void {
    this.emailSelectedUsers.update((prev) => prev.filter((u) => u.id !== user.id));
  }

  sendBulkEmail(): void {
    this.emailError.set(null);
    this.emailResult.set(null);
    const subject = this.emailSubject().trim();
    const htmlBody = this.emailBody().trim();
    if (!subject) {
      this.emailError.set('El asunto es obligatorio.');
      return;
    }
    if (!htmlBody || htmlBody === '<p></p>') {
      this.emailError.set('El contenido del email es obligatorio.');
      return;
    }
    const mode = this.emailRecipientMode();
    if (mode === 'SELECTED_USERS' && this.emailSelectedUsers().length === 0) {
      this.emailError.set('Debes seleccionar al menos un usuario.');
      return;
    }
    const body = {
      subject,
      htmlBody,
      recipientType: mode,
      excludedEmails: mode === 'ALL_USERS' ? this.emailSelectedUsers().map((u) => u.email) : undefined,
      recipientEmails: mode === 'SELECTED_USERS' ? this.emailSelectedUsers().map((u) => u.email) : undefined,
    };
    const files = this.emailAttachments();
    const checkRequest = {
      recipientType: body.recipientType,
      excludedEmails: body.excludedEmails,
      recipientEmails: body.recipientEmails,
    };
    this.emailSending.set(true);
    this.adminEmailService.checkRecipients(checkRequest).subscribe({
      next: (res) => {
        const excluded = res?.excludedByPreference ?? [];
        if (excluded.length > 0) {
          this.emailExcludedList.set(excluded);
          this.emailPendingSendBody = body;
          this.emailPendingSendFiles = [...files];
          this.emailExcludedModalVisible.set(true);
        } else {
          this.doActualSend(body, files);
        }
        this.emailSending.set(false);
      },
      error: (err) => {
        this.emailError.set(err?.error?.message ?? 'No se pudo comprobar destinatarios.');
        this.emailSending.set(false);
      },
    });
  }

  closeEmailExcludedModalAndSend(): void {
    this.emailExcludedModalVisible.set(false);
    const body = this.emailPendingSendBody;
    const files = this.emailPendingSendFiles;
    this.emailPendingSendBody = null;
    this.emailPendingSendFiles = [];
    if (body) {
      this.emailSending.set(true);
      this.doActualSend(body, files);
    }
  }

  private doActualSend(
    body: { subject: string; htmlBody: string; recipientType: 'ALL_USERS' | 'SELECTED_USERS'; excludedEmails?: string[]; recipientEmails?: string[] },
    files: File[],
  ): void {
    this.adminEmailService.sendBulkEmail(body, files).subscribe({
      next: (res) => {
        this.emailResult.set(res);
        this.emailSending.set(false);
        this.emailAttachments.set([]);
      },
      error: (err) => {
        this.emailError.set(err?.error?.message ?? 'No se pudo enviar el email.');
        this.emailSending.set(false);
      },
    });
  }

  onEmailFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;
    this.emailAttachments.update((prev) => [...prev, ...Array.from(files)]);
    input.value = '';
  }

  removeEmailAttachment(index: number): void {
    this.emailAttachments.update((prev) => prev.filter((_, i) => i !== index));
  }

  onEmailDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.emailDragOver.set(true);
  }

  onEmailDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.emailDragOver.set(false);
  }

  onEmailDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.emailDragOver.set(false);
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.emailAttachments.update((prev) => [...prev, ...Array.from(files)]);
    }
  }

  resetEmailEditor(): void {
    this.emailBody.set('');
  }

  /** Inserta <br> en la posición del cursor del editor de email. */
  insertEmailLineBreak(event?: MouseEvent): void {
    event?.preventDefault();
    const view = this.emailEditor?.view;
    if (!view) return;
    const { state, dispatch } = view;
    const tr = state.tr.insertText('<br>', state.selection.from);
    dispatch(tr.scrollIntoView());
  }

  onRecipientModeChange(mode: 'ALL_USERS' | 'SELECTED_USERS'): void {
    this.manualRecipientMode.set(mode);
  }

  onUserSearchChange(value: string): void {
    const q = (value ?? '').trim();
    this.userSearchQuery.set(value ?? '');
    this.userSearchError.set(null);
    this.userSearchResults.set([]);
    if (q.length < 2) {
      this.userSearchLoading.set(false);
      return;
    }
    this.userSearchLoading.set(true);
    this.adminUserService.searchUsers({ query: q, limit: 10 }).subscribe({
      next: (users) => {
        const selectedIds = new Set(this.selectedUsers().map((u) => u.id));
        this.userSearchResults.set((users ?? []).filter((u) => !selectedIds.has(u.id)));
        this.userSearchLoading.set(false);
      },
      error: () => {
        this.userSearchError.set('No se pudo buscar usuarios.');
        this.userSearchLoading.set(false);
      },
    });
  }

  addSelectedUser(user: UserSearchItem): void {
    if (!user?.email) return;
    const exists = this.selectedUsers().some((u) => u.id === user.id || u.email === user.email);
    if (exists) return;
    this.selectedUsers.update((prev) => [...prev, user]);
    this.userSearchResults.update((prev) => prev.filter((u) => u.id !== user.id));
  }

  removeSelectedUser(user: UserSearchItem): void {
    this.selectedUsers.update((prev) => prev.filter((u) => u.id !== user.id));
  }

  getUserDisplayName(user: UserSearchItem): string {
    const first = (user.firstName ?? '').trim();
    const last = (user.lastName ?? '').trim();
    const name = `${first} ${last}`.trim();
    return name || user.email;
  }

  applyFilters(): void {
    this.loadPage(0);
  }

  onTypeFilterChange(value: string): void {
    this.typeFilter.set(value);
    this.applyFilters();
  }

  onReadFilterChange(value: 'all' | 'unread' | 'read'): void {
    this.readFilter.set(value);
    this.applyFilters();
  }

  onDateFromChange(value: string): void {
    this.dateFrom.set(value);
    this.applyFilters();
  }

  onDateToChange(value: string): void {
    this.dateTo.set(value);
    this.applyFilters();
  }

  clearFilters(): void {
    this.readFilter.set('all');
    this.typeFilter.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.searchText.set('');
    this.applyFilters();
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.error.set(null);

    const read =
      this.readFilter() === 'all'
        ? undefined
        : this.readFilter() === 'unread'
          ? false
          : true;
    const type = this.typeFilter() || undefined;
    const dateFrom = this.dateFrom() || undefined;
    const dateTo = this.dateTo() || undefined;
    const search = this.searchText().trim() || undefined;

    this.notificationService
      .getNotifications({
        page,
        size: this.pageSize,
        read,
        type,
        dateFrom,
        dateTo,
        search,
      })
      .subscribe({
        next: (res) => {
          this.notifications.set(res.notifications ?? []);
          this.expandedMessages.set({});
          this.totalElements.set(res.totalElements);
          this.totalPages.set(res.totalPages);
          this.currentPage.set(res.page);
          this.unreadCount.set(res.unreadCount);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar las notificaciones.');
          this.loading.set(false);
        },
      });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) this.loadPage(page);
  }

  markAsRead(notification: SystemNotificationResponse): void {
    if (notification.read) return;
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
        this.unreadCount.update((c) => Math.max(0, c - 1));
        this.notificationService.notifyUnreadCountChanged();
      },
    });
  }

  markAllAsRead(): void {
    if (this.unreadCount() === 0) return;
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.unreadCount.set(0);
        this.notifications.update((list) => list.map((n) => ({ ...n, read: true })));
        this.notificationService.notifyUnreadCountChanged();
      },
      error: () => {},
    });
  }

  deleteNotification(notification: SystemNotificationResponse): void {
    this.notificationService.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications.update((list) => list.filter((n) => n.id !== notification.id));
        if (!notification.read) this.unreadCount.update((c) => Math.max(0, c - 1));
        this.notificationService.notifyUnreadCountChanged();
      },
    });
  }

  isMessageExpanded(notificationId: number): boolean {
    return !!this.expandedMessages()[notificationId];
  }

  hasLongMessage(message: string | null | undefined): boolean {
    return (message?.trim().length ?? 0) > 110;
  }

  toggleMessageExpanded(notification: SystemNotificationResponse, event: Event): void {
    event.stopPropagation();
    const id = notification.id;
    this.expandedMessages.update((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  sendManualNotification(): void {
    this.manualError.set(null);
    this.manualResult.set(null);

    const recipientMode = this.manualRecipientMode();
    const title = this.manualTitle().trim();
    const message = this.manualMessage().trim();

    if (recipientMode === 'SELECTED_USERS' && this.selectedUsers().length === 0) {
      this.manualError.set('Debes seleccionar al menos un usuario.');
      return;
    }
    if (!title) {
      this.manualError.set('El título es obligatorio.');
      return;
    }
    if (!message) {
      this.manualError.set('El mensaje es obligatorio.');
      return;
    }

    this.manualSending.set(true);

    if (recipientMode === 'ALL_USERS') {
      const excludedEmails = this.selectedUsers().map((u) => u.email);
      const body: SendManualNotificationRequest = {
        recipientType: 'ALL_USERS',
        recipientEmail: null,
        type: this.manualType(),
        title,
        message,
        excludedEmails: excludedEmails.length > 0 ? excludedEmails : undefined,
      };

      this.adminManualNotificationService.sendManualNotification(body).subscribe({
        next: (res) => {
          this.manualResult.set(res);
          this.manualSending.set(false);
        },
        error: (err) => {
          const msg = err?.error?.message ?? 'No se pudo enviar la notificación.';
          this.manualError.set(msg);
          this.manualSending.set(false);
        },
      });
      return;
    }

    const recipients = this.selectedUsers();
    from(recipients)
      .pipe(
        concatMap((u) => {
          const body: SendManualNotificationRequest = {
            recipientType: 'SPECIFIC_USER',
            recipientEmail: u.email,
            type: this.manualType(),
            title,
            message,
          };
          return this.adminManualNotificationService.sendManualNotification(body).pipe(
            map((res) => ({ ok: true as const, res })),
            catchError((err) => of({ ok: false as const, err, user: u }))
          );
        }),
        toArray()
      )
      .subscribe({
        next: (results) => {
          const ok = results.filter((r) => r.ok) as Array<{ ok: true; res: SendManualNotificationResponse }>;
          const failed = results.filter((r) => !r.ok) as Array<{ ok: false; err: unknown; user: UserSearchItem }>;

          const aggregate: SendManualNotificationResponse = {
            success: failed.length === 0,
            totalRecipients: recipients.length,
            sentImmediately: ok.reduce((acc, r) => acc + (r.res.sentImmediately ?? 0), 0),
            pendingDelivery: ok.reduce((acc, r) => acc + (r.res.pendingDelivery ?? 0), 0),
            excludedByPreferences: ok.reduce((acc, r) => acc + (r.res.excludedByPreferences ?? 0), 0),
            notificationIds: ok.flatMap((r) => r.res.notificationIds ?? []),
            message:
              failed.length === 0
                ? `Notificación enviada a ${recipients.length} usuario(s).`
                : `Enviado a ${ok.length}/${recipients.length}. Fallaron ${failed.length}.`,
          };

          this.manualResult.set(aggregate);
          if (failed.length > 0) {
            this.manualError.set(`No se pudo enviar a: ${failed.map((f) => f.user.email).join(', ')}`);
          }
          this.manualSending.set(false);
        },
        error: () => {
          this.manualError.set('No se pudo enviar la notificación.');
          this.manualSending.set(false);
        },
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const el = this.elementRef.nativeElement as HTMLElement;
    const target = event.target as Node;
    if (!el.contains(target)) {
      this.closeAllSelects();
      return;
    }
    const allSelects = el.querySelectorAll('.custom-select');
    const clickedInsideSelect = Array.from(allSelects).some((select) => select.contains(target));
    if (!clickedInsideSelect) {
      this.closeAllSelects();
    }
  }
}
