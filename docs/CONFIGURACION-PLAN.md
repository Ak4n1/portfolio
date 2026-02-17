# Plan: Página de Configuración

Documento de ideas y secciones para la página **Configuración** del dashboard (`/dashboard/configuracion`).

---

## 1. Datos de la cuenta

- **Objetivo:** Mostrar (y opcionalmente editar) la información básica del usuario.
- **Datos a mostrar:**
  - Nombre
  - Apellido
  - Email
  - **Miembro desde:** fecha de creación de la cuenta (`createdAt` — ya existe en backend y en `UserResponse`).
- **Opciones:**
  - Solo lectura: mostrar los datos que ya vienen de `GET /api/auth/me`.
  - Edición: permitir cambiar nombre y apellido (endpoint `PATCH /api/auth/me` o similar). El email podría quedar solo lectura o requerir flujo de verificación.

---

## 2. Seguridad: cambiar contraseña

- **Objetivo:** Que el usuario cambie su contraseña estando logueado (sin “olvidé contraseña”).
- **Flujo:**
  - Contraseña actual (obligatoria).
  - Nueva contraseña + confirmación.
  - Validaciones: mínimo 6 caracteres, coincidencia.
- **Backend:** Nuevo endpoint `POST /api/auth/change-password` con body `{ currentPassword, newPassword }`, validar contraseña actual y actualizar.

---

## 3. Preferencias de notificaciones (email)

- **Objetivo:** Que el usuario pueda elegir si quiere recibir emails opcionales (anuncios, promociones, recordatorios, etc.). Los emails **transaccionales** no son negociables y siempre se envían.
- **Emails que siempre se envían (no negociables):**
  - Restablecer contraseña
  - Verificar email (verificación de cuenta)
  - Cualquier otro email necesario para el funcionamiento o seguridad de la cuenta
- **Preferencia configurable:** “Recibir emails” = ¿recibir notificaciones por correo que no son obligatorias?
  - **Sí:** el usuario recibe por email los tipos opcionales (anuncios de administración, mantenimiento, actualizaciones importantes, promociones, recordatorios, etc.).
  - **No:** solo recibe los emails transaccionales (restablecer contraseña, verificar email); el resto de notificaciones puede seguir existiendo en la app (centro de notificaciones) pero no se envían por correo.
- **Implementación sugerida:**
  - Un solo switch en configuración: **“Recibir notificaciones por email”** (anuncios, promociones, recordatorios).
  - Backend: un flag en el usuario, ej. `users.receive_notification_emails` (boolean, default `true`), o tabla de preferencias con una entrada por usuario. API: `GET/PATCH /api/auth/me` o `GET/PATCH /api/users/me/preferences` para leer y guardar.
  - Al enviar cualquier email “opcional” (ADMIN_ANNOUNCEMENT, PROMOTION, REMINDER, SYSTEM_MAINTENANCE, IMPORTANT_UPDATE, etc.), el servicio de email comprueba este flag y solo envía si está activo; los de restablecer contraseña y verificar email se envían siempre.

---

## 4. Otras ideas (futuro o opcional)

- **Sesiones / seguridad:** Listado de sesiones activas o "Cerrar sesión en todos los dispositivos" (requiere gestión de tokens en backend).
- **Eliminar cuenta:** Flujo de baja con confirmación y posible periodo de gracia (requiere política y endpoints).
- **Exportar mis datos:** Descarga de datos personales (RGPD-style), si aplica.

---

## Resumen de secciones propuestas

| Sección                    | Prioridad | Complejidad | Notas                                      |
|---------------------------|-----------|-------------|--------------------------------------------|
| Datos de la cuenta        | Alta      | Baja        | Mostrar + “Miembro desde”; edición opcional |
| Cambiar contraseña        | Alta      | Media       | Nuevo endpoint + formulario                 |
| Preferencias (email)       | Media     | Media       | Un switch "Recibir notificaciones por email"|

---

## Orden sugerido de implementación

1. **Datos de la cuenta** (solo lectura): cargar perfil con `GET /api/auth/me`, mostrar nombre, apellido, email y “Miembro desde” con formato de fecha.
2. **Cambiar contraseña:** backend `change-password` + formulario en configuración.
3. **Editar nombre/apellido** (opcional): `PATCH /api/auth/me` y formulario.
4. **Preferencias de notificaciones:** flag "recibir emails" en backend + switch en configuración; que el envío de emails opcionales respete ese flag.

Cuando quieras bajar esto a tareas concretas (endpoints, componentes, DTOs), se puede desglosar en issues o checklist en este mismo doc.
