/** Icono y clase de color por tipo de notificación (compatible con tema claro/oscuro). */
export function getNotificationIcon(type: string): { icon: string; colorClass: string } {
  switch (type) {
    case 'WELCOME':
      return { icon: 'fas fa-hand-sparkles', colorClass: 'notif-icon-primary' };
    case 'EMAIL_VERIFIED':
      return { icon: 'fas fa-check-circle', colorClass: 'notif-icon-green' };
    case 'USER_REGISTERED':
      return { icon: 'fas fa-user-plus', colorClass: 'notif-icon-primary' };
    case 'CONTACT_SUBMITTED':
      return { icon: 'fas fa-envelope', colorClass: 'notif-icon-orange' };
    case 'ADMIN_ANNOUNCEMENT':
      return { icon: 'fas fa-bullhorn', colorClass: 'notif-icon-primary' };
    case 'SYSTEM_MAINTENANCE':
      return { icon: 'fas fa-tools', colorClass: 'notif-icon-orange' };
    case 'IMPORTANT_UPDATE':
      return { icon: 'fas fa-exclamation-circle', colorClass: 'notif-icon-primary' };
    case 'PROMOTION':
    case 'REMINDER':
      return { icon: 'fas fa-bell', colorClass: 'notif-icon-primary' };
    default:
      return { icon: 'fas fa-bell', colorClass: 'notif-icon-slate' };
  }
}

/** Fecha relativa en español: "Hace X horas", "Ayer", "10 Feb", etc. */
export function getRelativeTime(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
