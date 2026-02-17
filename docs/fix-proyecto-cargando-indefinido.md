# Fix: "Cargando proyecto..." indefinido y página inutilizable

**Fecha:** Febrero 2025  
**Componente:** `project-detail.component.ts`  
**Síntoma:** Al entrar a la página de detalle de un proyecto (`/project/:id`), la interfaz quedaba bloqueada en "Cargando proyecto...", el navegador se congelaba y los botones no respondían.

**Nota:** La consola mostraba `[ProjectDetail] getById success` (el API respondía bien), pero la UI no se actualizaba y el navegador se tildaba.

---

## Causa probable

El problema se debía a bloqueos del hilo principal durante el **change detection** de Angular al renderizar el contenido del proyecto:

1. **`getSafeHtml()`** se ejecutaba en cada ciclo de change detection y devolvía un objeto nuevo cada vez, provocando que Angular volviera a actualizar el `innerHTML` con descripciones/features grandes en cada ciclo.
2. La actualización síncrona de estado tras el HTTP hacía que todo (incluida la actualización del DOM) se ejecutara en el mismo bloque, generando tareas largas.
3. El carrusel con `setInterval` corría dentro de NgZone, añadiendo más trabajo al change detection.

---

## Soluciones implementadas

### 1. Cache de `getSafeHtml`

Se añadió un caché (`Map<string, SafeHtml>`) para no recalcular el HTML sanitizado en cada ciclo de change detection:

```ts
private _safeHtmlCache = new Map<string, SafeHtml>();

getSafeHtml(html: string | undefined): SafeHtml {
  const s = html || '';
  const cached = this._safeHtmlCache.get(s);
  if (cached) return cached;
  const processed = s.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  const safe = this.sanitizer.bypassSecurityTrustHtml(processed);
  this._safeHtmlCache.set(s, safe);
  return safe;
}
```

- Se invalida el caché al cargar un nuevo proyecto (`_safeHtmlCache.clear()` en el callback de éxito).

### 2. Actualización de estado en `setTimeout(0)`

La actualización de estado tras el éxito del API se pospone al siguiente tick del event loop:

```ts
next: (p) => {
  this._safeHtmlCache.clear();
  setTimeout(() => {
    this.project = p;
    this.loading = false;
    this.initializeCarousel();
    this.loadRelatedProjects(p.id);
    this.cdr.detectChanges();
  }, 0);
},
```

Así se evita que toda la actualización y el render pesado ocurran en el mismo bloque de ejecución.

### 3. Uso de `ChangeDetectorRef`

- Se inyecta `ChangeDetectorRef`.
- Tras actualizar `project` y `loading` se llama a `this.cdr.detectChanges()` para forzar un ciclo de detección de cambios.

### 4. Carrusel fuera de NgZone

El intervalo del carrusel se ejecuta fuera de NgZone; solo se vuelve a entrar en la zona al cambiar la imagen:

```ts
initializeCarousel() {
  if (this.project?.images && this.project.images.length > 1) {
    this.ngZone.runOutsideAngular(() => {
      this.carouselInterval = setInterval(() => {
        this.ngZone.run(() => this.nextImage());
      }, 4000);
    });
  }
}
```

Con esto se reduce la presión constante sobre el change detection.

---

## Archivos modificados

- `portafolio/src/app/pages/project-detail/project-detail.component.ts`

---

## Si el problema vuelve a aparecer

1. Revisar que estos cambios sigan presentes en `project-detail.component.ts`.
2. Comprobar si hay nuevos usos de `innerHTML` o HTML muy largo sin cachear.
3. Buscar otros `setInterval` o loops que corran dentro de NgZone en esta vista.
4. Revisar la pestaña Network para ver si el API responde bien y en tiempos normales.
