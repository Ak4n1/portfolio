/** Opciones de filtro por tipo para la página de notificaciones (valor enviado al API y etiqueta). */
export const NOTIFICATION_TYPE_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'Todos los tipos' },
  { value: 'WELCOME', label: 'Bienvenida' },
  { value: 'EMAIL_VERIFIED', label: 'Email verificado' },
  { value: 'USER_REGISTERED', label: 'Usuario registrado' },
  { value: 'ADMIN_ANNOUNCEMENT', label: 'Anuncio' },
  { value: 'SYSTEM_MAINTENANCE', label: 'Mantenimiento' },
  { value: 'IMPORTANT_UPDATE', label: 'Actualización importante' },
  { value: 'PROMOTION', label: 'Promoción / Oferta' },
  { value: 'REMINDER', label: 'Recordatorio' },
];
