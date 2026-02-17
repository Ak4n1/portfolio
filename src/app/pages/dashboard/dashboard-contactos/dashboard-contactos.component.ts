import {
    Component,
    inject,
    OnInit,
    signal,
    computed,
    DestroyRef,
    ChangeDetectionStrategy,
    HostListener,
    ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AdminContactService } from '../../../core/services/admin-contact.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { WebSocketMessageType } from '../../../core/models/websocket-message.model';
import { ContactResponse } from '../../../core/models/contact-response.model';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getRelativeTime } from '../../../core/utils/notification-display.util';
import { filter } from 'rxjs';

@Component({
    selector: 'app-dashboard-contactos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard-contactos.component.html',
    styleUrl: './dashboard-contactos.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContactosComponent implements OnInit {
    private contactService = inject(AdminContactService);
    private authStateService = inject(AuthStateService);
    private ws = inject(WebSocketService);
    private destroyRef = inject(DestroyRef);
    private elementRef = inject(ElementRef);
    private sanitizer = inject(DomSanitizer);

    private authState = toSignal(this.authStateService.authState, {
        initialValue: { isAuthenticated: false, user: null, isLoading: false },
    });

    private _safeHtmlCache = new Map<string, SafeHtml>();

    contacts = signal<ContactResponse[]>([]);
    unreadCount = signal(0);
    totalElements = signal(0);
    totalPages = signal(0);
    currentPage = signal(0);
    pageSize = 8;
    loading = signal(true);
    error = signal<string | null>(null);

    readFilter = signal<'all' | 'unread' | 'read'>('all');
    dateFrom = signal<string>('');
    dateTo = signal<string>('');
    searchText = signal<string>('');

    readFilterOpen = signal(false);
    selectedContact = signal<ContactResponse | null>(null);
    modalVisible = signal(false);

    readonly readFilterOptions: { value: 'all' | 'unread' | 'read'; label: string }[] = [
        { value: 'all', label: 'Todos' },
        { value: 'unread', label: 'No leídos' },
        { value: 'read', label: 'Leídos' },
    ];

    isAdmin = computed(() => {
        const state = this.authState();
        return !!state?.user?.roles?.includes('ROLE_ADMIN');
    });

    getRelativeTime = getRelativeTime;

    getSafeHtml(html: string | undefined): SafeHtml {
        const s = html || '';
        const cached = this._safeHtmlCache.get(s);
        if (cached) return cached;
        // Procesar saltos de línea literales si los hay
        const processed = s.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
        const safe = this.sanitizer.bypassSecurityTrustHtml(processed);
        this._safeHtmlCache.set(s, safe);
        return safe;
    }

    getReadFilterLabel(): string {
        return this.readFilterOptions.find((o) => o.value === this.readFilter())?.label ?? 'Todos';
    }

    ngOnInit(): void {
        this.ws.messages
            .pipe(
                filter(
                    (m) =>
                        m.type === WebSocketMessageType.NOTIFICATION_COUNT_UPDATED ||
                        m.type === WebSocketMessageType.CONTACT_SUBMITTED
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.loadPage(this.currentPage());
            });

        if (this.isAdmin()) {
            this.applyFilters();
        }
    }

    applyFilters(): void {
        this.loadPage(0);
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

        const dateFrom = this.dateFrom() || undefined;
        const dateTo = this.dateTo() || undefined;
        const search = this.searchText().trim() || undefined;

        this.contactService
            .getContacts({
                page,
                size: this.pageSize,
                read,
                dateFrom,
                dateTo,
                search,
            })
            .subscribe({
                next: (res) => {
                    this._safeHtmlCache.clear();
                    this.contacts.set(res.contacts ?? []);
                    this.totalElements.set(res.totalElements);
                    this.totalPages.set(res.totalPages);
                    this.currentPage.set(res.page);
                    this.unreadCount.set(res.unreadCount);
                    this.loading.set(false);
                },
                error: () => {
                    this.error.set('No se pudieron cargar los contactos.');
                    this.loading.set(false);
                },
            });
    }

    goToPage(page: number): void {
        if (page >= 0 && page < this.totalPages()) this.loadPage(page);
    }

    openDetails(contact: ContactResponse): void {
        this.selectedContact.set(contact);
        this.modalVisible.set(true);
        if (!contact.read) {
            this.markAsRead(contact);
        }
    }

    closeModal(): void {
        this.modalVisible.set(false);
        this.selectedContact.set(null);
    }

    markAsRead(contact: ContactResponse): void {
        if (contact.read) return;
        this.contactService.markAsRead(contact.id).subscribe({
            next: () => {
                contact.read = true;
                this.unreadCount.update((c) => Math.max(0, c - 1));
                // Si estamos filtrando específicamente por no leídos, refrescamos la página
                if (this.readFilter() === 'unread') {
                    this.loadPage(this.currentPage());
                }
            },
        });
    }

    markAllAsRead(): void {
        if (this.unreadCount() === 0) return;
        this.contactService.markAllAsRead().subscribe({
            next: () => {
                this.unreadCount.set(0);
                this.contacts.update((list) => list.map((c) => ({ ...c, read: true })));
                if (this.readFilter() === 'unread') {
                    this.loadPage(this.currentPage());
                }
                // The provided snippet seems to be incomplete or refers to external context (ws, WebSocketMessageType, destroyRef)
                // Assuming the intent was to add a refresh after marking all as read,
                // and that the WebSocket logic is handled elsewhere or is a future addition.
                // For now, just ensure the list is refreshed.
                this.applyFilters();
            },
        });
    }

    deleteContact(contact: ContactResponse): void {
        if (confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
            this.contactService.deleteContact(contact.id).subscribe({
                next: () => {
                    this.contacts.update((list) => list.filter((c) => c.id !== contact.id));
                    if (!contact.read) this.unreadCount.update((c) => Math.max(0, c - 1));
                },
            });
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const el = this.elementRef.nativeElement as HTMLElement;
        const target = event.target as Node;
        if (!el.contains(target)) {
            this.readFilterOpen.set(false);
            return;
        }
        const select = el.querySelector('.custom-select');
        if (select && !select.contains(target)) {
            this.readFilterOpen.set(false);
        }
    }
}
