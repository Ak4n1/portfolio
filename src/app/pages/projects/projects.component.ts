import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { AnalyticsEventsService } from '../../core/services/analytics/analytics-events.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private analyticsEvents = inject(AnalyticsEventsService);

  projects: Project[] = [];
  categories: string[] = ['Todos'];
  selectedCategory = 'Todos';
  filteredProjects: Project[] = [];
  loading = true;
  error = '';

  isModalOpen = false;
  selectedImage = '';
  selectedProject: Project | null = null;

  carouselStates: { [key: number]: { currentIndex: number; interval: ReturnType<typeof setInterval> | null } } = {};

  ngOnInit() {
    this.projectService.list(true).subscribe({
      next: (data) => {
        this.projects = data;
        const cats = [...new Set(data.map((p) => p.category))].sort();
        this.categories = ['Todos', ...cats];
        this.filterProjects('Todos');
        this.initializeCarousels();
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error loading projects';
        this.loading = false;
      }
    });
  }

  getImageUrl(url: string): string {
    return this.projectService.getImageUrl(url);
  }

  /** URLs de imágenes: usa images o imageItems como fallback */
  getProjectImageUrls(project: Project): string[] {
    if (project.images?.length) return project.images;
    if (project.imageItems?.length) return project.imageItems.map(i => i.url);
    return [];
  }

  /** Para tarjetas: usa descripción breve o texto plano truncado de la descripción completa */
  getCardDescription(project: Project): string {
    if (project.shortDescription?.trim()) return project.shortDescription.trim();
    const text = (project.description || '').replace(/<[^>]*>/g, '').trim();
    return text.length > 200 ? text.slice(0, 197) + '...' : text;
  }

  getCategoryIcon(category: string): string {
    const c = (category || '').toLowerCase();
    if (c.includes('frontend')) return 'fas fa-code';
    if (c.includes('backend')) return 'fas fa-server';
    if (c.includes('desktop')) return 'fas fa-desktop';
    if (c.includes('fullstack')) return 'fas fa-layer-group';
    if (c.includes('mobile')) return 'fas fa-mobile-alt';
    if (c.includes('devops')) return 'fas fa-cogs';
    return 'fas fa-folder';
  }

  ngOnDestroy() {
    this.stopAllCarousels();
  }

  onProjectCardClick(project: Project): void {
    this.analyticsEvents.trackClickProjectCard(project.id, project.title);
  }

  onProjectGithubClick(project: Project): void {
    this.analyticsEvents.trackClickSocial('github', 'project_card', project.id);
  }

  onProjectDemoClick(project: Project): void {
    this.analyticsEvents.trackClickSocial('demo', 'project_card', project.id);
  }

  onCtaContactClick(): void {
    this.analyticsEvents.trackClickCtaContact('projects_page');
  }

  // Filter methods
  filterProjects(category: string) {
    this.selectedCategory = category;
    if (category === 'Todos') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(project => project.category === category);
    }
  }

  // Carousel methods
  initializeCarousels() {
    this.projects.forEach(project => {
      const urls = this.getProjectImageUrls(project);
      if (urls.length > 0) {
        this.carouselStates[project.id] = {
          currentIndex: 0,
          interval: urls.length > 1 ? setInterval(() => this.nextImage(project.id), 4000) : null
        };
      }
    });
  }

  stopAllCarousels() {
    Object.values(this.carouselStates).forEach(state => {
      if (state.interval) {
        clearInterval(state.interval);
      }
    });
  }

  pauseCarousel(projectId: number) {
    const state = this.carouselStates[projectId];
    if (state && state.interval) {
      clearInterval(state.interval);
      state.interval = null;
    }
  }

  resumeCarousel(projectId: number) {
    const project = this.projects.find(p => p.id === projectId);
    const state = this.carouselStates[projectId];
    if (project && this.getProjectImageUrls(project).length > 1 && state && !state.interval) {
      state.interval = setInterval(() => {
        this.nextImage(projectId);
      }, 4000);
    }
  }

  nextImage(projectId: number) {
    const state = this.carouselStates[projectId];
    const project = this.projects.find(p => p.id === projectId);
    const urls = project ? this.getProjectImageUrls(project) : [];
    if (state && urls.length) {
      state.currentIndex = (state.currentIndex + 1) % urls.length;
    }
  }

  prevImage(projectId: number) {
    const state = this.carouselStates[projectId];
    const project = this.projects.find(p => p.id === projectId);
    const urls = project ? this.getProjectImageUrls(project) : [];
    if (state && urls.length) {
      state.currentIndex = state.currentIndex === 0 ? urls.length - 1 : state.currentIndex - 1;
    }
  }

  goToImage(projectId: number, index: number) {
    const state = this.carouselStates[projectId];
    if (state) {
      state.currentIndex = index;
    }
  }

  getCurrentImage(projectId: number): string {
    const state = this.carouselStates[projectId];
    const project = this.projects.find(p => p.id === projectId);
    const urls = project ? this.getProjectImageUrls(project) : [];
    if (urls.length === 0) return '';
    const index = state?.currentIndex ?? 0;
    const url = urls[index];
    return url ? this.getImageUrl(url) : '';
  }

  getCurrentIndex(projectId: number): number {
    const state = this.carouselStates[projectId];
    return state?.currentIndex ?? 0;
  }

  // Modal methods
  openModal(project: Project) {
    const url = this.getCurrentImage(project.id);
    if (url) {
      this.selectedImage = url;
      this.selectedProject = project;
      this.isModalOpen = true;
      document.body.style.overflow = 'hidden';
      this.pauseCarousel(project.id);
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedImage = '';
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
    
    // Resume all carousels
    this.projects.forEach(project => {
      if (this.getProjectImageUrls(project).length > 1) {
        this.resumeCarousel(project.id);
      }
    });
  }

  onModalClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
