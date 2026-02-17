import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-dashboard-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-projects.component.html',
  styleUrl: './dashboard-projects.component.css'
})
export class DashboardProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);

  projects: Project[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = '';
    this.projectService.list(false).subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al cargar proyectos';
        this.loading = false;
      }
    });
  }

  getImageUrl(url: string): string {
    return this.projectService.getImageUrl(url);
  }

  /** URLs de imágenes: usa images o imageItems como fallback */
  getProjectImageUrls(p: Project): string[] {
    if (p.images?.length) return p.images;
    if (p.imageItems?.length) return p.imageItems.map(i => i.url);
    return [];
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

  deleteProject(id: number, title: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm(`¿Eliminar el proyecto "${title}"?`)) return;
    this.projectService.delete(id).subscribe({
      next: () => this.loadProjects(),
      error: (err) => alert(err?.error?.message || 'Error al eliminar')
    });
  }
}
