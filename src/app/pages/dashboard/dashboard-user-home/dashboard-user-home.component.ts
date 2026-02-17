import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-user-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page">
      <h1 class="dashboard-page-title">Inicio</h1>
      <p class="dashboard-page-subtitle">Panel de usuario</p>
      <div class="dashboard-page-content">
        <p>Bienvenido a tu panel. Aquí podrás gestionar tus proyectos y ver notificaciones.</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page { padding: var(--spacing-xl); }
    .dashboard-page-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; color: var(--title-primary); }
    .dashboard-page-subtitle { color: var(--text-secondary); margin-bottom: var(--spacing-lg); }
    .dashboard-page-content p { color: var(--text-secondary); }
  `]
})
export class DashboardUserHomeComponent {}
