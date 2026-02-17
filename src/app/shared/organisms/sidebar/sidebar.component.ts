import { Component, OnInit, inject, computed, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { AuthService } from '../../../core/services/auth.service';

interface SidebarMenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

interface SidebarSection {
  title: string;
  items: SidebarMenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidebarContent') sidebarContentRef!: ElementRef<HTMLElement>;

  private authStateService = inject(AuthStateService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isOpen = false;
  menuSections: SidebarSection[] = [];
  userRoles: string[] = [];

  private authState = toSignal(this.authStateService.authState, {
    initialValue: { isAuthenticated: false, user: null, isLoading: true }
  });

  displayName = computed(() => {
    const user = this.authState()?.user;
    if (!user) return '';
    const first = user.firstName?.trim() || '';
    const last = user.lastName?.trim() || '';
    if (first || last) return `${first} ${last}`.trim();
    return user.email || '';
  });

  initials = computed(() => {
    const user = this.authState()?.user;
    if (!user) return '?';
    const first = (user.firstName || '').trim();
    const last = (user.lastName || '').trim();
    if (first && last) return (first[0] + last[0]).toUpperCase();
    if (first) return first.slice(0, 2).toUpperCase();
    if (user.email) return user.email.slice(0, 2).toUpperCase();
    return '?';
  });

  roleLabel = computed(() => {
    const user = this.authState()?.user;
    if (!user?.roles?.length) return '';
    if (user.roles.includes('ROLE_ADMIN')) return 'Administrador';
    if (user.roles.includes('ROLE_USER')) return 'Usuario';
    return user.roles[0] || '';
  });

  userEmail = computed(() => this.authState()?.user?.email ?? '');

  private userMenuSections: SidebarSection[] = [
    {
      title: 'Sistema',
      items: [
        { label: 'Dashboard', icon: 'fas fa-home', route: '/dashboard/user' },
        { label: 'Notificaciones', icon: 'fas fa-bell', route: '/dashboard/notificaciones' }
      ]
    }
  ];

  private adminMenuSections: SidebarSection[] = [
    {
      title: 'Sistema',
      items: [
        { label: 'Dashboard', icon: 'fas fa-home', route: '/dashboard/admin' },
        { label: 'Notificaciones', icon: 'fas fa-bell', route: '/dashboard/notificaciones' }
      ]
    },
    {
      title: 'Gestión',
      items: [
        { label: 'Proyectos', icon: 'fas fa-folder-open', route: '/dashboard/projects' },
        { label: 'Usuarios', icon: 'fas fa-users', route: '/dashboard/usuarios' },
        { label: 'Ofertas', icon: 'fas fa-briefcase', route: '/dashboard/ofertas' },
        { label: 'Mensajes', icon: 'fas fa-address-book', route: '/dashboard/contactos' }
      ]
    }
  ];

  ngOnInit(): void {
    this.authStateService.authState.subscribe(state => {
      if (state.user) {
        this.userRoles = state.user.roles || [];
        this.updateMenuItems();
      } else {
        this.userRoles = [];
        this.menuSections = [];
      }
    });
  }

  private updateMenuItems(): void {
    const isAdmin = this.userRoles.includes('ROLE_ADMIN');
    this.menuSections = isAdmin ? this.adminMenuSections : this.userMenuSections;
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  closeSidebar(): void {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;
    const target = event.target as Node;
    const content = this.sidebarContentRef?.nativeElement;
    if (content?.contains(target)) return;
    if ((target as Element).closest?.('.sidebar-toggle-mobile')) return;
    this.closeSidebar();
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authStateService.setLoggedOut();
        this.closeSidebar();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authStateService.setLoggedOut();
        this.closeSidebar();
        this.router.navigate(['/login']);
      }
    });
  }
}
