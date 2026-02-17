import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { AdminUserListItem } from '../../../core/models/admin-user-list-item.model';
import { WebSocketService } from '../../../core/services/websocket.service';
import { WebSocketMessageType } from '../../../core/models/websocket-message.model';
import { ConfirmModalComponent, ConfirmModalType } from '../../../core/components/confirm-modal/confirm-modal.component';

const ROLES_OPTIONS = ['ROLE_USER', 'ROLE_ADMIN'];

type PendingConfirmAction =
  | { type: 'disable'; user: AdminUserListItem }
  | { type: 'enable'; user: AdminUserListItem }
  | { type: 'resendVerification'; user: AdminUserListItem }
  | { type: 'sendPasswordReset'; user: AdminUserListItem }
  | { type: 'setRoles'; userId: number; roleNames: string[] }
  | null;

@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './dashboard-usuarios.component.html',
  styleUrl: './dashboard-usuarios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardUsuariosComponent implements OnInit {
  private adminUserService = inject(AdminUserService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);
  private ws = inject(WebSocketService);
  private destroyRef = inject(DestroyRef);

  users = signal<AdminUserListItem[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  pageSize = 20;
  loading = signal(true);
  error = signal<string | null>(null);
  searchQuery = signal('');
  searchInput = signal('');
  /** Filtros aplicados (null = todos) */
  filterRole = signal<string | null>(null);
  filterEnabled = signal<boolean | null>(null);
  filterOnlineOnly = signal<boolean | null>(null);
  /** Valores en el modal antes de aplicar */
  filterRoleInput = signal<string>('');
  filterEnabledInput = signal<boolean | null>(null);
  filterOnlineOnlyInput = signal<boolean | null>(null);

  /** Usuarios conectados vía WebSocket (emails). Actualizado en tiempo real. */
  onlineUserEmails = signal<Set<string>>(new Set());
  /** Número de usuarios en línea (para el badge). */
  onlineUsersCount = signal(0);

  /** Usuario sobre el que se muestra el menú de roles (id o null) */
  rolesMenuOpenFor = signal<number | null>(null);
  /** Usuario sobre el que se está ejecutando una acción (id) */
  actionLoadingFor = signal<number | null>(null);

  /** Modal de confirmación: estado y acción pendiente */
  confirmModalVisible = signal(false);
  confirmModalTitle = signal('');
  confirmModalMessage = signal('');
  confirmModalType = signal<ConfirmModalType>('primary');
  confirmModalConfirmText = signal('Confirmar');
  pendingConfirmAction = signal<PendingConfirmAction>(null);

  /** Modal de filtros */
  filtersModalVisible = signal(false);
  /** Custom selects del modal de filtros */
  roleFilterOpen = signal(false);
  enabledFilterOpen = signal(false);
  onlineFilterOpen = signal(false);
  readonly roleFilterOptions: { value: string; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'ROLE_USER', label: 'Usuario' },
    { value: 'ROLE_ADMIN', label: 'Administrador' },
  ];
  readonly enabledFilterOptions: { value: string; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Activos' },
    { value: 'false', label: 'Deshabilitados' },
  ];
  readonly onlineFilterOptions: { value: string; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'En línea' },
    { value: 'false', label: 'Desconectado' },
  ];

  ngOnInit(): void {
    this.loadPage();
    this.fetchOnlineCount();
    this.ws.messages
      .pipe(
        filter((msg) => msg.type === WebSocketMessageType.ONLINE_USERS_COUNT && msg.data != null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((msg) => {
        const data = msg.data as { onlineUsersCount?: number; onlineUserEmails?: string[] };
        if (data.onlineUsersCount != null) this.onlineUsersCount.set(Number(data.onlineUsersCount));
        if (Array.isArray(data.onlineUserEmails)) this.onlineUserEmails.set(new Set(data.onlineUserEmails));
      });
  }

  private fetchOnlineCount(): void {
    this.adminUserService.getOnlineUsersCount().subscribe({
      next: (res) => {
        this.onlineUsersCount.set(res.count ?? 0);
        this.onlineUserEmails.set(new Set(res.emails ?? []));
      },
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    const el = this.elementRef.nativeElement as HTMLElement;
    if (!el.contains(target)) {
      this.rolesMenuOpenFor.set(null);
      this.closeFilterSelects();
      return;
    }
    const customSelects = el.querySelectorAll('.custom-select');
    const insideSelect = Array.from(customSelects).some((s) => s.contains(target));
    if (!insideSelect) this.closeFilterSelects();
  }

  loadPage(): void {
    this.loading.set(true);
    this.error.set(null);
    const page = this.currentPage();
    const search = this.searchQuery().trim();
    const enabled = this.filterEnabled();
    const role = this.filterRole();
    const onlineOnly = this.filterOnlineOnly();
    const offlineOnly = onlineOnly === false ? true : undefined;
    this.adminUserService.list({ page, size: this.pageSize, search, enabled, role: role ?? undefined, onlineOnly: onlineOnly === true ? true : undefined, offlineOnly }).subscribe({
      next: (res) => {
        this.users.set(res.content);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages);
        this.currentPage.set(res.number);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Error al cargar usuarios');
        this.loading.set(false);
      },
    });
  }

  applySearch(): void {
    this.searchQuery.set(this.searchInput().trim());
    this.currentPage.set(0);
    this.loadPage();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    this.loadPage();
  }

  toggleRolesMenu(userId: number): void {
    this.rolesMenuOpenFor.update((id) => (id === userId ? null : userId));
  }

  closeRolesMenu(): void {
    this.rolesMenuOpenFor.set(null);
  }

  openConfirmDisable(user: AdminUserListItem): void {
    this.pendingConfirmAction.set({ type: 'disable', user });
    this.confirmModalTitle.set('Deshabilitar usuario');
    this.confirmModalMessage.set(`¿Deshabilitar a ${user.firstName} ${user.lastName} (${user.email})? No podrá iniciar sesión hasta que se reactive.`);
    this.confirmModalType.set('danger');
    this.confirmModalConfirmText.set('Deshabilitar');
    this.confirmModalVisible.set(true);
  }

  openConfirmEnable(user: AdminUserListItem): void {
    this.pendingConfirmAction.set({ type: 'enable', user });
    this.confirmModalTitle.set('Habilitar usuario');
    this.confirmModalMessage.set(`¿Habilitar de nuevo a ${user.firstName} ${user.lastName} (${user.email})?`);
    this.confirmModalType.set('primary');
    this.confirmModalConfirmText.set('Habilitar');
    this.confirmModalVisible.set(true);
  }

  openConfirmResendVerification(user: AdminUserListItem): void {
    this.pendingConfirmAction.set({ type: 'resendVerification', user });
    this.confirmModalTitle.set('Reenviar email de verificación');
    this.confirmModalMessage.set(`¿Enviar de nuevo el email de verificación a ${user.email}?`);
    this.confirmModalType.set('primary');
    this.confirmModalConfirmText.set('Reenviar');
    this.confirmModalVisible.set(true);
  }

  openConfirmSendPasswordReset(user: AdminUserListItem): void {
    this.pendingConfirmAction.set({ type: 'sendPasswordReset', user });
    this.confirmModalTitle.set('Enviar recuperar contraseña');
    this.confirmModalMessage.set(`¿Enviar email de recuperación de contraseña a ${user.email}?`);
    this.confirmModalType.set('warning');
    this.confirmModalConfirmText.set('Enviar');
    this.confirmModalVisible.set(true);
  }

  openConfirmSetRoles(userId: number, roleNames: string[]): void {
    this.closeRolesMenu();
    this.pendingConfirmAction.set({ type: 'setRoles', userId, roleNames });
    const roleLabel = roleNames.includes('ROLE_ADMIN') ? 'Administrador' : 'Usuario';
    this.confirmModalTitle.set('Cambiar rol');
    this.confirmModalMessage.set(`¿Asignar el rol "${roleLabel}" a este usuario?`);
    this.confirmModalType.set('primary');
    this.confirmModalConfirmText.set('Cambiar');
    this.confirmModalVisible.set(true);
  }

  onConfirmModalConfirmed(): void {
    const pending = this.pendingConfirmAction();
    this.confirmModalVisible.set(false);
    this.pendingConfirmAction.set(null);
    if (!pending) return;
    switch (pending.type) {
      case 'disable':
        this.setEnabled(pending.user, false);
        break;
      case 'enable':
        this.setEnabled(pending.user, true);
        break;
      case 'resendVerification':
        this.resendVerification(pending.user);
        break;
      case 'sendPasswordReset':
        this.sendPasswordReset(pending.user);
        break;
      case 'setRoles':
        this.setRoles(pending.userId, pending.roleNames);
        break;
    }
  }

  onConfirmModalCancelled(): void {
    this.confirmModalVisible.set(false);
    this.pendingConfirmAction.set(null);
    this.rolesMenuOpenFor.set(null);
  }

  setEnabled(user: AdminUserListItem, enabled: boolean): void {
    this.actionLoadingFor.set(user.id);
    this.adminUserService.updateEnabled(user.id, enabled).subscribe({
      next: () => {
        this.actionLoadingFor.set(null);
        this.loadPage();
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Error al actualizar');
        this.actionLoadingFor.set(null);
      },
    });
  }

  resendVerification(user: AdminUserListItem): void {
    this.actionLoadingFor.set(user.id);
    this.adminUserService.resendVerification(user.id).subscribe({
      next: () => {
        this.actionLoadingFor.set(null);
        this.loadPage();
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Error al reenviar');
        this.actionLoadingFor.set(null);
      },
    });
  }

  sendPasswordReset(user: AdminUserListItem): void {
    this.actionLoadingFor.set(user.id);
    this.adminUserService.sendPasswordReset(user.id).subscribe({
      next: () => {
        this.actionLoadingFor.set(null);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Error al enviar email');
        this.actionLoadingFor.set(null);
      },
    });
  }

  setRoles(userId: number, roleNames: string[]): void {
    this.actionLoadingFor.set(userId);
    this.adminUserService.updateRoles(userId, roleNames).subscribe({
      next: () => {
        this.actionLoadingFor.set(null);
        this.rolesMenuOpenFor.set(null);
        this.loadPage();
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Error al actualizar roles');
        this.actionLoadingFor.set(null);
      },
    });
  }

  openFiltersModal(): void {
    this.filterRoleInput.set(this.filterRole() ?? '');
    this.filterEnabledInput.set(this.filterEnabled());
    this.filterOnlineOnlyInput.set(this.filterOnlineOnly());
    this.filtersModalVisible.set(true);
  }

  closeFiltersModal(): void {
    this.filtersModalVisible.set(false);
    this.closeFilterSelects();
  }

  closeFilterSelects(): void {
    this.roleFilterOpen.set(false);
    this.enabledFilterOpen.set(false);
    this.onlineFilterOpen.set(false);
  }

  /** Abre solo el select de Rol y cierra los demás; si ya estaba abierto lo cierra */
  openOnlyRoleFilter(): void {
    const wasOpen = this.roleFilterOpen();
    this.closeFilterSelects();
    if (!wasOpen) this.roleFilterOpen.set(true);
  }

  /** Abre solo el select de Estado y cierra los demás; si ya estaba abierto lo cierra */
  openOnlyEnabledFilter(): void {
    const wasOpen = this.enabledFilterOpen();
    this.closeFilterSelects();
    if (!wasOpen) this.enabledFilterOpen.set(true);
  }

  /** Abre solo el select En línea y cierra los demás; si ya estaba abierto lo cierra */
  openOnlyOnlineFilter(): void {
    const wasOpen = this.onlineFilterOpen();
    this.closeFilterSelects();
    if (!wasOpen) this.onlineFilterOpen.set(true);
  }

  /** Cierra los selects del modal al hacer clic dentro del modal pero fuera de un select */
  onFiltersModalClick(event: MouseEvent): void {
    const target = event.target as Node;
    const modal = event.currentTarget as HTMLElement;
    const insideSelect = Array.from(modal.querySelectorAll('.custom-select')).some((el) => el.contains(target));
    if (!insideSelect) this.closeFilterSelects();
  }

  applyFilters(): void {
    const roleVal = this.filterRoleInput().trim();
    this.filterRole.set(roleVal === '' ? null : roleVal);
    this.filterEnabled.set(this.filterEnabledInput());
    this.filterOnlineOnly.set(this.filterOnlineOnlyInput());
    this.currentPage.set(0);
    this.loadPage();
    this.closeFiltersModal();
  }

  clearFilters(): void {
    this.filterRoleInput.set('');
    this.filterEnabledInput.set(null);
    this.filterOnlineOnlyInput.set(null);
    this.filterRole.set(null);
    this.filterEnabled.set(null);
    this.filterOnlineOnly.set(null);
    this.currentPage.set(0);
    this.loadPage();
    this.closeFiltersModal();
  }

  /** Valor para el select de estado en el modal (string '' | 'true' | 'false') */
  filterEnabledSelectValue(): string {
    const v = this.filterEnabledInput();
    if (v === null) return '';
    return v ? 'true' : 'false';
  }

  onFilterEnabledSelect(value: string): void {
    this.filterEnabledInput.set(value === '' ? null : value === 'true');
  }

  /** Valor de opción para el filtro En línea: '' | 'true' | 'false' */
  filterOnlineOnlyOptionValue(): string {
    const v = this.filterOnlineOnlyInput();
    if (v === null) return '';
    return v ? 'true' : 'false';
  }

  onFilterOnlineOnlySelect(value: string): void {
    if (value === '') this.filterOnlineOnlyInput.set(null);
    else if (value === 'true') this.filterOnlineOnlyInput.set(true);
    else this.filterOnlineOnlyInput.set(false);
  }

  getRoleFilterLabel(): string {
    const v = this.filterRoleInput();
    const opt = this.roleFilterOptions.find((o) => o.value === v);
    return opt?.label ?? 'Todos';
  }

  getEnabledFilterLabel(): string {
    const v = this.filterEnabledInput();
    if (v === null) return 'Todos';
    return v ? 'Activos' : 'Deshabilitados';
  }

  getOnlineFilterLabel(): string {
    const v = this.filterOnlineOnlyInput();
    if (v === null) return 'Todos';
    return v ? 'En línea' : 'Desconectado';
  }

  onFilterRoleChoice(value: string): void {
    this.filterRoleInput.set(value);
    this.closeFilterSelects();
  }

  onFilterEnabledChoice(value: string): void {
    this.onFilterEnabledSelect(value);
    this.closeFilterSelects();
  }

  onFilterOnlineChoice(value: string): void {
    this.onFilterOnlineOnlySelect(value);
    this.closeFilterSelects();
  }

  goToSendNotification(user: AdminUserListItem): void {
    this.router.navigate(['/dashboard/notificaciones'], {
      queryParams: { step: 'send' },
      state: { preselectedEmails: [user.email] },
    });
  }

  getRoleLabel(role: string): string {
    if (role === 'ROLE_ADMIN') return 'Admin';
    if (role === 'ROLE_USER') return 'Usuario';
    return role;
  }

  getRolesList(user: AdminUserListItem): string[] {
    return Array.isArray(user.roles) ? user.roles : [];
  }

  isUserOnline(email: string): boolean {
    return this.onlineUserEmails().has(email);
  }

  getInitials(user: AdminUserListItem): string {
    const first = (user.firstName || '').trim();
    const last = (user.lastName || '').trim();
    if (first && last) return (first[0] + last[0]).toUpperCase();
    if (first) return first.slice(0, 2).toUpperCase();
    if (user.email) return user.email.slice(0, 2).toUpperCase();
    return '?';
  }

  formatDate(isoDate: string): string {
    if (!isoDate) return '—';
    const d = new Date(isoDate);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  readonly rolesOptions = ROLES_OPTIONS;
}
