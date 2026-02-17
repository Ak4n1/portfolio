import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Igual que sistema_turnos: asegura withCredentials: true en todas las peticiones.
 * Las cookies HTTP-only se envían automáticamente cuando withCredentials está presente.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({ withCredentials: true });
  return next(cloned);
};
