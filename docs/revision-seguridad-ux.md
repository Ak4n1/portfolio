# Revision de Seguridad, UX y Errores

Fecha: 2026-02-24
Proyecto: `portafolio`

## Lista de hallazgos

1. **[Alta]** Riesgo de XSS almacenado en mensajes de contacto por uso de `bypassSecurityTrustHtml` con contenido de usuarios.
2. **[Media-Alta]** Riesgo de XSS en detalle de proyectos por uso de `bypassSecurityTrustHtml` en campos HTML dinámicos.
3. **[Media]** `guestGuard` dispara `refresh` al entrar a login/register y genera ruido (`400`) + carga innecesaria.
4. **[Media]** UX: al forzar logout después de desactivar 2FA, login no muestra contexto (`reason=2fa-disabled`).
5. **[Media-Baja]** UX/flujo: en "Olvidaste tu contraseña" solo navega si `logout` responde OK.
6. **[Baja]** Error de CSS real: llaves extra en `project-detail.component.css`.
7. **[Baja]** Warning de formulario: falta `autocomplete` en email de forgot-password.

## Progreso de fixes

### FIX-01 (Terminado): XSS en dashboard contactos
- Objetivo: eliminar `bypassSecurityTrustHtml` para contenido de contacto y renderizar HTML seguro.

### FIX-02 (Terminado): XSS en project detail
- Objetivo: evitar `bypassSecurityTrustHtml` en descripción/features dinámicos.

### FIX-03 (Terminado): guestGuard refresh agresivo
- Objetivo: evitar refresh innecesario en rutas de invitado.

### FIX-04 (Terminado): mensaje UX post 2FA disable en login
- Objetivo: mostrar aviso claro cuando se redirige por `reason=2fa-disabled`.

### FIX-05 (Terminado): fallback en goToForgotPassword
- Objetivo: navegar aunque falle `logout`.

### FIX-06 (Terminado): llaves extra CSS
- Objetivo: corregir error de sintaxis CSS en project-detail.

### FIX-07 (Terminado): autocomplete en forgot-password
- Objetivo: agregar atributo `autocomplete` en campo email.

