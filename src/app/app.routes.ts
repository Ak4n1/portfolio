import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest-guard';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'projects', loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent) },
  { path: 'project/:id', loadComponent: () => import('./pages/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'skills', loadComponent: () => import('./pages/skills/skills.component').then(m => m.SkillsComponent) },

  // Solo accesibles si NO estás logueado (si ya estás logueado redirige a /dashboard)
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent), canActivate: [guestGuard] },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent), canActivate: [guestGuard] },

  { path: 'verify-email-pending', loadComponent: () => import('./pages/verify-email-pending/verify-email-pending.component').then(m => m.VerifyEmailPendingComponent) },
  { path: 'verify-email', loadComponent: () => import('./pages/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password/:token', loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },

  // Dashboard - requiere auth
  {
    path: 'dashboard',
    loadComponent: () => import('./shared/templates/dashboard-layout/dashboard-layout-wrapper.component').then(m => m.DashboardLayoutWrapperComponent),
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./core/components/dashboard-redirect/dashboard-redirect.component').then(m => m.DashboardRedirectComponent) },
      { path: 'user', loadComponent: () => import('./pages/dashboard/dashboard-user-home/dashboard-user-home.component').then(m => m.DashboardUserHomeComponent) },
      { path: 'admin', loadComponent: () => import('./pages/dashboard/dashboard-admin-home/dashboard-admin-home.component').then(m => m.DashboardAdminHomeComponent), canActivate: [roleGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path: 'projects', loadComponent: () => import('./pages/dashboard/dashboard-projects/dashboard-projects.component').then(m => m.DashboardProjectsComponent), canActivate: [roleGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path: 'projects/new', loadComponent: () => import('./pages/dashboard/dashboard-project-detail/dashboard-project-detail.component').then(m => m.DashboardProjectDetailComponent), canActivate: [roleGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path: 'projects/:id', loadComponent: () => import('./pages/dashboard/dashboard-project-detail/dashboard-project-detail.component').then(m => m.DashboardProjectDetailComponent), canActivate: [roleGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path: 'noticias', loadComponent: () => import('./pages/dashboard/dashboard-news/dashboard-news.component').then(m => m.DashboardNewsComponent), canActivate: [roleGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path: 'usuarios', loadComponent: () => import('./pages/dashboard/dashboard-usuarios/dashboard-usuarios.component').then(m => m.DashboardUsuariosComponent), canActivate: [roleGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path: 'notificaciones', loadComponent: () => import('./pages/dashboard/dashboard-notificaciones/dashboard-notificaciones.component').then(m => m.DashboardNotificacionesComponent) },
      { path: 'contactos', loadComponent: () => import('./pages/dashboard/dashboard-contactos/dashboard-contactos.component').then(m => m.DashboardContactosComponent), canActivate: [roleGuard], data: { roles: ['ROLE_ADMIN'] } },
      { path: 'configuracion', loadComponent: () => import('./pages/dashboard/dashboard-configuracion/dashboard-configuracion.component').then(m => m.DashboardConfiguracionComponent) },
      { path: 'ofertas', loadComponent: () => import('./pages/dashboard/dashboard-ofertas/dashboard-ofertas.component').then(m => m.DashboardOfertasComponent), canActivate: [roleGuard], data: { roles: ['ROLE_ADMIN'] } },
    ]
  },

  { path: '**', redirectTo: '/home' }
];
