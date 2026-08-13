# TODO — Proyecto STELLA

Lista oficial de tareas pendientes del proyecto.

---

## Alta prioridad

- [ ] Reemplazar SVG placeholders de la galería con imágenes reales del proyecto.
- [ ] Agregar documentos reales (PDFs) en `documentos/` y referencias en `data/documentos.json`.

## Media prioridad

- [ ] Integrar un **mapa de la misión** con datos de trayectoria del vuelo (si existen).
- [ ] Ampliar la **telemetría** con nuevas variables: altitud, humedad, voltaje, velocidad, GPS.
- [ ] **Cronología del Proyecto** — línea de tiempo interactiva con hitos del proyecto.
- [ ] **Sistema de Misiones** — página dedicada a cada misión/lanzamiento con datos, fotos y resultados.
- [ ] **Biblioteca Técnica** — artículos educativos sobre globos estratosféricos, sensores, LoRa, GPS, Raspberry Pi y tecnologías utilizadas por STELLA.
- [ ] Agregar **páginas de detalle** de noticias (artículo completo) en lugar de tarjetas.
- [ ] Confirmar el **dominio real** del sitio y actualizar `og:url`, `canonical` y `sitemap.xml` (actualmente `stellaproject.com.ar`).

## Baja prioridad

- [ ] Fotografías del equipo (campo `foto` en `data/equipo.json`).
- [ ] Implementar modo oscuro / claro (variante del tema actual).
- [ ] Optimizar el rendimiento del sitio (lazy loading, formatos WebP, minificación).
- [ ] Internacionalización (soporte multi-idioma: español/inglés).
- [ ] Agregar tests automatizados para validar carga de JSON y renderizado.
- [ ] Crear páginas futuras (Misiones, Cronología, Prensa) que reutilicen `App.config`.

## Completadas

- [x] Sitio inicial single-page con telemetría simulada desde Flask.
- [x] Sección de documentación con tarjetas dinámicas.
- [x] Conversión a arquitectura multipágina.
- [x] Reorganización completa de carpetas (CSS, JS, assets, data, pages).
- [x] Navbar y footer reutilizables generados dinámicamente.
- [x] Sistema dinámico de documentos mediante JSON.
- [x] Sistema dinámico del equipo mediante JSON.
- [x] Galería dinámica con filtros, búsqueda y lightbox.
- [x] Gráficos en tiempo real con Chart.js en la página de telemetría.
- [x] Página de estadísticas integrada en la página de inicio.
- [x] Agrupación del equipo por áreas de trabajo.
- [x] Documentación: CHANGELOG.md, GUIA_MANTENIMIENTO.md, TODO.md.
- [x] Página de **Patrocinadores** completamente funcional con datos dinámicos desde JSON.
- [x] Página **Proyecto**: presentación institucional con 8 secciones dinámicas desde JSON.
- [x] **v3.0.0** — Landing page institucional: hero rediseñado, 10 secciones dinámicas, estado del proyecto desde JSON, animaciones Intersection Observer, menú reorganizado (eliminada Misión, agregado Contacto).
- [x] **v3.1.0** — Mejoras de calidad: favicon, 404 personalizada, skeleton loading, breadcrumbs, buscador en documentación, metadatos Open Graph / Twitter Cards, mejor manejo de errores en telemetría, limpieza de emojis.
- [x] **v3.2.0** — Centralización de configuración institucional: creado `data/config.json`, migración de datos institucionales desde constants.js, HTML y JS; footer, hero y contacto dinámicos; caché de configuración con `App.cargarConfig()`; separación de constantes técnicas vs institucionales.
- [x] **v3.4.0** — Galería profesional: categorías dinámicas, tarjetas modernas, lightbox con navegación, lazy loading, SVGs placeholder.
- [x] **v3.5.0** — Centro de Documentación Técnica: estadísticas automáticas, filtros por categoría, ordenamiento, documentos destacados, tarjetas con portada, visor PDF embebido, preparado para crecimiento.
- [x] **v4.0.0** — Actualización de información institucional (etapa actual del proyecto, lanzamiento octubre 2026, config técnica real).
- [x] **v4.1.0** — Mejoras integrales: página Noticias, formulario de contacto, buscador y miniaturas en galería, iconos SVG locales, barra de progreso + etapas, badge de lanzamiento con countdown, footer enriquecido, SEO (og-image, canonical, robots.txt, sitemap.xml), accesibilidad (role=dialog, aria, teclado), jerarquía h1, stats de documentos dinámicas, fix firebase.json, cache-busting `?v=3`.
