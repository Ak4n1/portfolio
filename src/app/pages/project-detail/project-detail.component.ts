import { Component, OnInit, OnDestroy, AfterViewChecked, inject, computed, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGamepad, faPlug, faDesktop, faServer } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from '../../core/services/project.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { AnalyticsService } from '../../core/services/analytics/analytics.service';
import { AnalyticsEventsService } from '../../core/services/analytics/analytics-events.service';
import { Project } from '../../core/models/project.model';
import { WebSocketService } from '../../core/services/websocket.service';
import { WebSocketMessageType } from '../../core/models/websocket-message.model';
import { ConfirmModalComponent } from '../../core/components/confirm-modal/confirm-modal.component';
import { ImageLightboxComponent } from '../../core/components/image-lightbox/image-lightbox.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, ConfirmModalComponent, ImageLightboxComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class ProjectDetailComponent implements OnInit, OnDestroy, AfterViewChecked {
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);
  private authStateService = inject(AuthStateService);
  private wsService = inject(WebSocketService);
  private analyticsService = inject(AnalyticsService);
  private analyticsEvents = inject(AnalyticsEventsService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private destroy$ = new Subject<void>();

  private scrollTracked = false;
  private scrollListenerAttached = false;

  /** Cache para evitar recalcular SafeHtml en cada ciclo de change detection */
  private _safeHtmlCache = new Map<string, SafeHtml>();

  private authState = toSignal(this.authStateService.authState, { initialValue: null });
  isAdmin = computed(() => {
    const state = this.authState();
    return !!state?.isAuthenticated && state?.user?.roles?.includes('ROLE_ADMIN');
  });
  isAuthenticated = computed(() => !!this.authState()?.isAuthenticated);

  project: Project | null = null;
  relatedProjects: Project[] = [];
  loading = true;
  error = '';
  likeLoading = false;
  likeError = '';
  loginModalVisible = false;
  currentImageIndex = 0;
  carouselInterval: ReturnType<typeof setInterval> | null = null;

  isModalOpen = false;
  lightboxImages: string[] = [];
  lightboxStartIndex = 0;

  faGamepad = faGamepad;
  faPlug = faPlug;
  faDesktop = faDesktop;
  faServer = faServer;

  /** Permite estilos inline y br codificados (&lt;br&gt;). Con cache para no bloquear CD. */
  getSafeHtml(html: string | undefined): SafeHtml {
    const s = html || '';
    const cached = this._safeHtmlCache.get(s);
    if (cached) return cached;
    const processed = s.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
    const safe = this.sanitizer.bypassSecurityTrustHtml(processed);
    this._safeHtmlCache.set(s, safe);
    return safe;
  }

  onProjectLinkClick(type: 'github' | 'demo'): void {
    if (this.project) {
      this.analyticsEvents.trackClickSocial(type, 'project_detail', this.project.id);
    }
  }

  getProjectIcon(project: Project) {
    const cat = (project.category || '').toLowerCase();
    if (cat.includes('backend') || cat.includes('api')) return faPlug;
    if (cat.includes('desktop')) return faDesktop;
    if (cat.includes('server')) return faServer;
    return faGamepad;
  }

  ngOnInit() {
    console.log('[ProjectDetail] ngOnInit');
    this.authStateService.authState.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      const projectId = this.project?.id;
      if (!projectId) return;
      if (state?.isAuthenticated) {
        this.loadLikeStatus(projectId);
      } else if (this.project) {
        this.project.likedByUser = false;
      }
    });

    this.wsService.messages.pipe(takeUntil(this.destroy$)).subscribe((msg) => {
      if (msg.type === WebSocketMessageType.PROJECT_LIKED) {
        this.handleProjectLikedEvent(msg.data);
      }
    });

    this.route.paramMap.pipe(
      switchMap((params) => {
        const idParam = params.get('id');
        const projectId = idParam ? +idParam : 0;
        console.log('[ProjectDetail] paramMap emit, idParam:', idParam, 'projectId:', projectId);
        this.loading = true;
        this.error = '';
        this.currentImageIndex = 0;
        return this.projectService.getById(projectId);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (p) => {
        console.log('[ProjectDetail] getById success:', p?.id, p?.title);
        this._safeHtmlCache.clear();
        const projectTitle = p?.title?.trim() || 'Detalle de proyecto';
        this.titleService.setTitle(`Juan Encabo | ${projectTitle}`);
        // Diferir actualización para evitar bloquear el hilo principal durante CD
        setTimeout(() => {
          this.project = p;
          this.loading = false;
          this.likeLoading = false;
          this.likeError = '';
          this.scrollTracked = false;
          this.scrollListenerAttached = false;
          this.loadLikeStatus(p.id);
          this.initializeCarousel();
          this.loadRelatedProjects(p.id);
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('[ProjectDetail] getById error:', err);
        this.titleService.setTitle('Juan Encabo | Detalle de proyecto');
        this.project = null;
        this.loading = false;
        if (err?.name === 'TimeoutError') {
          this.error = 'La solicitud tardó demasiado. Comprueba que el servidor (puerto 8080) esté en ejecución.';
        } else {
          this.error = err?.error?.message || 'Error al cargar el proyecto';
        }
      },
      complete: () => console.log('[ProjectDetail] subscribe complete')
    });
  }

  private loadRelatedProjects(excludeId: number): void {
    const current = this.project;
    if (!current) return;
    this.projectService.list(true).subscribe({
      next: (list) => {
        const sameCategory = list.filter((p) => p.id !== excludeId && p.category === current.category);
        this.relatedProjects = (sameCategory.length > 0 ? sameCategory : list.filter((p) => p.id !== excludeId))
          .slice(0, 3);
      }
    });
  }

  private loadLikeStatus(projectId: number): void {
    if (!this.isAuthenticated()) {
      if (this.project && this.project.id === projectId) {
        this.project.likedByUser = false;
      }
      return;
    }

    this.projectService.getLikeStatus(projectId).subscribe({
      next: (status) => {
        if (!this.project || this.project.id !== projectId) return;
        this.project.likedByUser = status.liked;
        this.project.likesCount = status.likesCount;
      },
      error: () => {
        // No bloquear la pantalla por error de estado de like
      },
    });
  }

  toggleLike(): void {
    if (!this.project?.id || this.likeLoading) {
      return;
    }

    if (!this.isAuthenticated()) {
      this.likeError = '';
      this.loginModalVisible = true;
      return;
    }

    this.likeError = '';
    this.likeLoading = true;
    const projectId = this.project.id;

    this.projectService.toggleLike(projectId).subscribe({
      next: (res) => {
        if (!this.project || this.project.id !== projectId) return;
        this.project.likedByUser = res.liked;
        this.project.likesCount = res.likesCount;
        this.likeLoading = false;
      },
      error: () => {
        this.likeError = 'No se pudo actualizar tu like.';
        this.likeLoading = false;
      },
    });
  }

  onLoginModalCancelled(): void {
    this.loginModalVisible = false;
  }

  onLoginModalConfirmed(): void {
    this.loginModalVisible = false;
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url },
    });
  }

  private handleProjectLikedEvent(data: unknown): void {
    if (!this.project || !data || typeof data !== 'object') return;

    const payload = data as { projectId?: unknown; likesCount?: unknown };
    const projectId = payload.projectId;
    const likesCount = payload.likesCount;
    if (typeof projectId !== 'number' || typeof likesCount !== 'number') return;
    if (this.project.id !== projectId) return;

    this.project.likesCount = likesCount;
  }

  getImageUrl(url: string): string {
    return this.projectService.getImageUrl(url);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopCarousel();
  }

  initializeCarousel() {
    if (this.project?.images && this.project.images.length > 1) {
      this.ngZone.runOutsideAngular(() => {
        this.carouselInterval = setInterval(() => {
          this.ngZone.run(() => this.nextImage());
        }, 4000);
      });
    }
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  pauseCarousel() {
    this.stopCarousel();
  }

  resumeCarousel() {
    if (this.project && this.project.images && this.project.images.length > 1) {
      this.initializeCarousel();
    }
  }

  nextImage() {
    if (this.project && this.project.images) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.project.images.length;
    }
  }

  prevImage() {
    if (this.project && this.project.images) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.project.images.length - 1
        : this.currentImageIndex - 1;
    }
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
  }

  getCurrentImage(): string {
    if (this.project?.images?.length) {
      const url = this.project.images[this.currentImageIndex];
      return url ? this.getImageUrl(url) : '';
    }
    return '';
  }

  goBack() {
    this.router.navigate(['/projects']);
  }

  goToProject(projectId: number) {
    this.router.navigate(['/project', projectId]);
  }

  // Modal methods
  openModal() {
    if (this.project && this.project.images) {
      this.lightboxImages = this.project.images.map((image) => this.getImageUrl(image));
      this.lightboxStartIndex = this.currentImageIndex;
      this.isModalOpen = true;
      this.pauseCarousel();
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.lightboxImages = [];
    this.lightboxStartIndex = 0;
    this.resumeCarousel();
  }

  onLightboxIndexChanged(index: number): void {
    this.currentImageIndex = index;
  }

  ngAfterViewChecked(): void {
    if (this.project && !this.scrollTracked) {
      this.setupScrollTracking();
    }
  }

  private setupScrollTracking(): void {
    if (this.scrollTracked || this.scrollListenerAttached) return;
    const el = document.querySelector('.project-description-scroll') as HTMLElement | null;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight) {
      this.scrollTracked = true;
      this.trackScrollComplete();
      return;
    }
    this.scrollListenerAttached = true;
    const handler = (): void => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        el.removeEventListener('scroll', handler);
        this.scrollTracked = true;
        this.trackScrollComplete();
      }
    };
    el.addEventListener('scroll', handler);
  }

  private trackScrollComplete(): void {
    if (!this.project) return;
    this.analyticsService.trackEvent('project_scroll_complete', {
      project_id: this.project.id,
      project_title: this.project.title
    });
  }
}
