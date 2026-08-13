# Changelog — Proyecto STELLA

Todas las modificaciones importantes del proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/), y el versionado sigue [Semantic Versioning](https://semver.org/).

---

## [v4.2.0] — Compatibilidad con Vercel

### Nuevas funcionalidades
- **Despliegue en Vercel** — el sitio ahora se puede publicar en Vercel además de Firebase:
  - `frontend/vercel.json` con headers de caché equivalentes a los de `firebase.json` (`no-cache` para `data/**` y HTML; caché pública para CSS, JS y assets).
  - `frontend/api/datos.py` — serverless function Python que reemplaza al backend Flask en producción. Expone el endpoint `/api/datos` con la misma respuesta JSON (temperatura y presión simuladas).
- `frontend/.gitignore` — agregado `.vercel/` (caché local de la CLI de Vercel).

### Cambios
- `data/config.json` → `api_url` ahora apunta a `/api/datos` (ruta relativa, funciona en cualquier dominio).
- `js/utils/constants.js` → `API_URL` pasa a `/api/datos` como valor de respaldo.
- Cache-busting global actualizado a `?v=18` en los 10 HTML.

### Archivos creados
- `frontend/vercel.json`
- `frontend/api/datos.py`

### Notas
- Para desplegar: Root Directory = `frontend` (o `npx vercel --prod` desde esa carpeta).
- El backend Flask (`backend/app.py`) se mantiene para desarrollo local; la página de telemetría usa `/api/datos` en producción.

---

## [v4.1.3] — Corrección del envío y rediseño visual de Contacto

- **Causa del botón que no enviaba:** Firebase cacheaba `config.json` (~1h), y con la versión vieja el formulario caía al fallback `mailto`. Ahora:
  - `App.cargarConfig()` usa `cache: 'no-store'` + parámetro de tiempo.
  - `firebase.json` agrega encabezados `Cache-Control: no-cache` para `/data/**` y los HTML.
- Rediseño visual de la página Contacto alineado con el estilo del sitio: tarjetas limpias (`rgba(17,24,39,.7)`, borde sutil), títulos Orbitron con subrayado, botón ghost tipo `hero-btn`, íconos SVG en campos y datos.
- Ícono propio para "Redes sociales"; se quitó el párrafo introductorio redundante (el subtítulo de la página ya lo cumple).
- Cache-busting global a `?v=5`.

---

## [v4.1.2] — Contacto rediseñado con feedback de envío

- Rediseño estético de la página Contacto: tarjetas con borde degradado, íconos SVG en los campos y en los datos institucionales, botón con degradado y hover.
- Feedback visible al enviar: spinner en el botón ("Enviando..."), pantalla de éxito con check animado y botón "Enviar otro mensaje", o mensaje de error en pantalla.
- Validación visual de campos vacíos/incorrectos (borde rojo + mensaje).
- Corrección del envío que "no hacía nada": se subió el cache-busting de `?v=3` a `?v=4` en todos los HTML para evitar que el navegador sirviera el JS/CSS viejo cacheado.
- Los datos institucionales se omiten automáticamente si están vacíos.

---

## [v4.1.1] — Formulario de contacto que envía a Gmail

- El formulario "Envianos un mensaje" ahora envía el mensaje directo al correo del proyecto (`santatrinidad2026@gmail.com`) mediante una Web App de Google Apps Script (usa la cuenta Gmail oficial, sin servicios de terceros).
- Nuevo campo `contacto_endpoint` en `data/config.json` con la URL de la Web App. Mientras esté vacío, el formulario usa `mailto` como respaldo.
- Estado de envío en la página: "Enviando...", éxito o error con `aria-live`; botón deshabilitado durante el envío.
- Nuevo archivo `email_contacto_web.gs` (raíz del proyecto) con el script y las instrucciones de instalación.
- `version_actual` pasó de v4.0.0 a v4.1.0 en `data/config.json`.

---

## [v4.1.0] — Mejoras integrales: SEO, accesibilidad, noticias y más

### Nuevas funcionalidades
- **Página de Noticias** — nueva página `pages/noticias.html` con datos desde `data/noticias.json`. Sección "Novedades" en el inicio con las 3 últimas. Agregada al menú de navegación y breadcrumbs.
- **Formulario de contacto** — formulario (nombre, correo, asunto, mensaje) que abre el cliente de correo con el contenido precargado (`mailto`). Nuevos estilos en `css/pages/contacto.css`.
- **Buscador en la galería** — filtra por título, categoría y descripción combinado con los filtros existentes.
- **Miniaturas en el lightbox** — tira de miniaturas con navegación rápida dentro de la galería de imágenes.
- **Iconos SVG locales** — reemplazados los hotlinks de Flaticon por SVGs locales (`assets/icons/instagram.svg`, `assets/icons/tiktok.svg`) y mapa de 22 emojis→SVG en `js/utils/iconos.js` (stats, áreas, cards e infografía del proyecto).
- **Barra de progreso y etapas** — el estado del proyecto (`data/estado.json`) ahora muestra `progreso` (%) y `etapas` con marcado de completas.
- **Badge de lanzamiento en el hero** — cuenta regresiva de días hasta la fecha de `config.json` (`fecha_lanzamiento`). Segundo CTA "Ver novedades".
- **Footer enriquecido** — 3 columnas: marca+lema, secciones, contacto+versión. Copyright y redes desde `config.json`.
- **SEO** — `og:image` (1200×630 `assets/images/og-portada.png`), `canonical` en todas las páginas, `robots.txt`, `sitemap.xml`.
- **Menú móvil con animación** — transición suave, `aria-expanded`, cierre al navegar y transformación del botón hamburguesa.
- **Logo y favicon desde config** — el navbar y el favicon se leen de `config.json`.

### Mejoras
- **Accesibilidad** — `role="dialog"`, `aria-modal`, `aria-label`, foco al abrir modales, tarjetas de galería navegables por teclado (Enter/Espacio), navegación por teclado existente.
- **Jerarquía de encabezados** — títulos de página en `<h1>` único (index hero y todas las páginas); navbar pasa a `<span>`.
- **Estadísticas de documentación dinámicas** — las 2 categorías más grandes se calculan desde el JSON (antes estaban fijas).
- **Orden de áreas del equipo** — se toma de `data/proyecto.json` (`como-trabajamos.areas`), no está hardcodeado.
- **Intro de sección "¿Cómo trabajamos?"** — lee el campo `intro` de `proyecto.json`.

### Correcciones
- `frontend/firebase.json` — eliminado el rewrite catch-all a `index.html` (ahora funciona `404.html`) y agregado `skills-lock.json` a `ignore`.
- Cache-busting `?v=3` en todos los JS/CSS locales de los 9 HTML (los CDN quedan intactos).
- "Documentos publicados" se calcula automáticamente desde `documentos.json` (`origen: "documentos"`); "Áreas de trabajo" pasa de 4 a 6.
- Iconos de redes locales en footer y contacto (se eliminaron dependencias de Flaticon).
- Enlaces del footer según ubicación de la página (`../` en subpáginas).

### Archivos creados
- `frontend/pages/noticias.html`
- `frontend/js/pages/noticias.js`
- `frontend/css/pages/noticias.css`
- `frontend/data/noticias.json`
- `frontend/js/utils/iconos.js`
- `frontend/css/pages/contacto.css`
- `frontend/assets/icons/instagram.svg`
- `frontend/assets/icons/tiktok.svg`
- `frontend/assets/images/og-portada.png`
- `frontend/robots.txt`
- `frontend/sitemap.xml`

### Archivos modificados
- `frontend/firebase.json`, `frontend/index.html`, `frontend/pages/*.html` (9)
- `frontend/js/components/navbar.js`, `footer.js`, `breadcrumb.js`
- `frontend/js/pages/inicio.js`, `proyecto.js`, `equipo.js`, `documentacion.js`, `galeria.js`, `contacto.js`
- `frontend/css/components/navbar.css`, `footer.css`, `section.css`
- `frontend/css/pages/inicio.css`, `proyecto.css`, `galeria.css`
- `frontend/data/config.json`, `proyecto.json`, `estado.json`, `estadisticas.json`
- `frontend/js/utils/constants.js` (nuevo orden NAV_PAGES con Noticias)

---

## [v4.0.0] — Actualización de información institucional

### Cambios importantes
- Actualización de toda la información del proyecto a la etapa actual: el lanzamiento todavía no se realizó y está previsto para **octubre de 2026**.
- Nombre institucional: **EEST N°2 "Luciano Fortabat"** (Olavarría, Buenos Aires, Argentina).
- Nuevo lema del proyecto: **"Más Allá del Cielo Comienza Nuestra Misión"**.

### Datos actualizados
- `data/config.json` — nombre, descripción, lema, hero, estado, fecha de lanzamiento, versión v4.0.0.
- `data/estado.json` — "En etapa de desarrollo y preparación", lanzamiento previsto para octubre de 2026.
- `data/estadisticas.json` — parámetros y estimaciones de la misión (altura objetivo 35 km, velocidades de ascenso 5,5 m/s y descenso 5,8 m/s, tiempo de vuelo 3 h 26 min 38 s, alcance 151,6 km, helio 5,45 m³, carga útil 2 kg, 25 integrantes, 4 áreas, 15 documentos). Valores presentados como estimaciones, no como resultados.
- `data/proyecto.json` — objetivos, componentes y configuración técnica actual (Raspberry Pi 4, sensores GY-63 MS5611 y DS18B20, cámara Caddx Ratel 2, RUSH TANK II V2, Eachine ROTG02, IMX708, 2x LoRa LA66 915 MHz, GPS NEO-M8N, microSD SanDisk 128 GB, 10 baterías Energizer, StepDown XL4015, cápsula PETG con aislamiento de poliestireno, 4 globos de 48", paracaídas de nylon). Nuevas secciones: Comunicaciones, Trayectoria estimada, Recuperación, Programación y datos, Presupuesto estimado ($1.416.404 ARS sin envíos / $1.682.086 ARS con envíos), Estado y avances.
- `data/equipo.json` — equipo unificado en 4 áreas + jefatura y coordinación general del informe. Jefatura: Juan Pablo Koziel y Facundo Nahuel Terenzano.
- `data/patrocinadores.json` — se eliminaron sponsors no respaldados; se conserva la EEST N°2 como institución anfitriona y se agrega presentación de búsqueda de sponsors.
- `data/galeria.json` — eliminados textos que implicaban lanzamiento o recuperación ya realizados; componentes actualizados.
- `data/documentos.json` — eliminadas referencias a vuelos realizados y a ESP32.
- `js/pages/inicio.js` y `js/pages/estadisticas.js` — los contadores ahora soportan decimales y valores de texto (ej: tiempo de vuelo).
- `js/pages/equipo.js` — nuevo orden de áreas del equipo unificado.
- `js/pages/patrocinadores.js` + `css/pages/patrocinadores.css` — presentación de búsqueda de sponsors.

### Archivos modificados
- `frontend/data/config.json`
- `frontend/data/estado.json`
- `frontend/data/estadisticas.json`
- `frontend/data/proyecto.json`
- `frontend/data/equipo.json`
- `frontend/data/patrocinadores.json`
- `frontend/data/galeria.json`
- `frontend/data/documentos.json`
- `frontend/js/pages/inicio.js`
- `frontend/js/pages/estadisticas.js`
- `frontend/js/pages/equipo.js`
- `frontend/js/pages/patrocinadores.js`
- `frontend/css/pages/patrocinadores.css`
- `frontend/index.html`
- `frontend/pages/telemetria.html`
- `frontend/pages/proyecto.html`
- `frontend/pages/equipo.html`
- `frontend/pages/patrocinadores.html`


---

## [v3.5.0] — Centro de Documentación Técnica

### Cambios importantes
- Documentación completamente reescrita como biblioteca técnica organizada, escalable y preparada para el crecimiento del proyecto.
- `data/documentos.json` reestructurado: nuevos campos (id, categoria, tipo, autor, version, archivo, portada, destacado). De 2 a 15 documentos de ejemplo.
- Se agregaron 7 SVGs de portada para documentos destacados, más un default-portada.svg como fallback.

### Nuevas funcionalidades
- **Estadísticas automáticas** — se muestran: total de documentos, categorías, informes técnicos y carpetas de campo, calculados desde el JSON.
- **Filtros por categoría** — dinámicos desde el JSON. Compatibles con el buscador. Sin recarga de página.
- **Buscador mejorado** — busca por título, descripción, categoría, tipo y autor.
- **Ordenamiento** — selector: Más recientes, Más antiguos, Orden alfabético. Todo en frontend.
- **Documentos destacados** — sección superior que muestra automáticamente los documentos con `destacado: true`.
- **Tarjetas mejoradas** — portada (o default si no existe), título, categoría, tipo, fecha, descripción, autor, versión. Botones: Vista previa, Abrir, Descargar.
- **Vista previa de PDF** — modal con visor embebido (iframe) para ver PDFs sin descargar. Cierre con X, ESC y clic fuera.
- **Badges visuales** — tipo, categoría, destacado, versión, autor en las tarjetas.
- **Navegación por teclado** — ESC cierra el modal de PDF.

### Escalabilidad
- Agregar un documento nuevo = 1) copiar archivo, 2) agregar entrada en JSON. Sin modificar HTML ni JS.
- Categorías, tipos y destacados se auto-generan desde los datos.
- Backward compatibility: `archivo` y `ruta` conviven; campos faltantes usan valores por defecto.

### Archivos modificados
- `frontend/data/documentos.json` — reescrito: 15 documentos con estructura completa (id, titulo, descripcion, categoria, tipo, fecha, autor, version, archivo, portada, destacado).
- `frontend/js/pages/documentacion.js` — reescrito: estadísticas, filtros dinámicos, ordenamiento, destacados, PDF modal, búsqueda combinada.
- `frontend/css/pages/documentacion.css` — reescrito: estadísticas, filtros, tarjetas con portada, modal PDF, grid responsive.
- `frontend/pages/documentacion.html` — nuevas secciones: estadísticas, filtros, ordenamiento, destacados, modal PDF. Sin plantilla antigua.
- `frontend/js/pages/inicio.js` — `renderizarDocumentos` compatible con campos `archivo` y `ruta`.

### Archivos creados
- `frontend/assets/images/documentos/portada-carpeta-campo.svg`
- `frontend/assets/images/documentos/portada-informe-1.svg`
- `frontend/assets/images/documentos/portada-informe-2.svg`
- `frontend/assets/images/documentos/portada-presentacion.svg`
- `frontend/assets/images/documentos/portada-poster.svg`
- `frontend/assets/images/documentos/portada-investigacion.svg`
- `frontend/assets/images/documentos/portada-plan-vuelo.svg`
- `frontend/assets/images/documentos/default-portada.svg`

### Nueva estructura de documentos.json
```json
{
    "id": 1,
    "titulo": "Título del documento",
    "descripcion": "Descripción breve.",
    "categoria": "Informes Técnicos",
    "tipo": "PDF",
    "fecha": "2026-03-15",
    "autor": "Área Técnica",
    "version": "1.0",
    "archivo": "documentos/informes/informe.pdf",
    "portada": "assets/images/documentos/portada.svg",
    "destacado": true
}
```

### Categorías disponibles
Informes Técnicos, Carpetas de Campo, Presentaciones, Manuales, Posters, Investigación, Otros.

---

## [v3.4.0] — Galería profesional con categorías dinámicas y lightbox mejorado

### Cambios importantes
- Galería completamente reescrita: categorías dinámicas (Blender, Impresión 3D, Desarrollo, Hardware, Software, Vuelo, General), tarjetas modernas con overlay al hover, lightbox profesional.
- `data/galeria.json` reestructurado: nuevo campo `id`, `ruta` renombrado a `imagen`, categorías actualizadas a las áreas reales del proyecto.
- Se agregaron 12 nuevos SVGs placeholder para cubrir todas las categorías.

### Nuevas funcionalidades
- **Categorías dinámicas** — se generan automáticamente desde los datos del JSON. Filtros: Todas, Blender, Impresión 3D, Desarrollo, Hardware, Software, Vuelo, General.
- **Tarjetas modernas** — imagen con efecto zoom al hover, overlay degradado con categoría, descripción visible.
- **Lightbox profesional** — visor con imagen grande, título, descripción, fecha, contador. Navegación Anterior/Siguiente filtrada por categoría actual.
- **Cierre del lightbox** — botón X, tecla ESC, clic fuera de la imagen.
- **Navegación por teclado** — flechas izquierda/derecha dentro del lightbox.
- **Lazy loading** — todas las imágenes usan `loading="lazy"`.
- **Escalabilidad** — la arquitectura soporta cientos de imágenes sin modificar HTML ni JS.

### Archivos creados
- `frontend/assets/images/galeria/blender-1.svg`, `blender-2.svg`
- `frontend/assets/images/galeria/impresion-1.svg`, `impresion-2.svg`
- `frontend/assets/images/galeria/desarrollo-1.svg`, `desarrollo-2.svg`
- `frontend/assets/images/galeria/hardware-1.svg`, `hardware-2.svg`
- `frontend/assets/images/galeria/software-1.svg`, `software-2.svg`
- `frontend/assets/images/galeria/general-1.svg`, `general-2.svg`

### Archivos modificados
- `frontend/data/galeria.json` — reescrito: 16 items con nueva estructura (id, titulo, descripcion, categoria, imagen, fecha).
- `frontend/js/pages/galeria.js` — reescrito: filtros dinámicos, lightbox con fecha, navegación por ID.
- `frontend/css/pages/galeria.css` — reescrito: tarjetas con overlay, efecto zoom, lightbox mejorado.
- `frontend/pages/galeria.html` — lightbox con fecha, skeleton actualizado, sin buscador.
- `frontend/js/pages/inicio.js` — `renderizarGaleria` compatible con campos `imagen` y `ruta`.

### Nueva estructura de galeria.json
```json
{
    "id": 1,
    "titulo": "Modelado 3D de la cápsula",
    "descripcion": "Descripción de la imagen.",
    "categoria": "Blender",
    "imagen": "assets/images/galeria/blender-1.svg",
    "fecha": "2026-03-01"
}
```

### Mejoras de rendimiento
- Lazy loading nativo (`loading="lazy"`) en todas las imágenes.
- Sin dependencias externas: HTML, CSS y JavaScript vanilla.
- Las imágenes solo se cargan cuando están cerca del viewport.

### Cómo agregar una nueva imagen
1. Copiar la imagen a `assets/images/galeria/`.
2. Agregar una entrada en `data/galeria.json` con id correlativo.
3. La galería y la página de inicio la muestran automáticamente.

---

## [v3.2.0] — Centralización de configuración institucional (config.json)

### Cambios importantes
- Creado `data/config.json` como fuente oficial única de toda la información institucional del sitio.
- Eliminada la duplicación de datos institucionales que antes estaban dispersos en HTML, JS y JSON.
- Las constantes de `js/utils/constants.js` se dividen: datos institucionales migran a `config.json`; solo quedan constantes técnicas (API_URL, NAV_PAGES).
- Footer, hero, contacto y versión ahora se obtienen exclusivamente desde `config.json`.

### Nuevas funcionalidades
- **config.json** — archivo con 20+ campos: nombre del proyecto, escuela, ubicación, correo, redes sociales, hero, copyright, versión.
- **Carga con caché** — `App.cargarConfig()` en `helpers.js` carga el archivo una sola vez y lo reutiliza en todas las páginas mediante `Promise` cacheadas.
- **Footer dinámico** — genera año actual (`new Date().getFullYear()`), nombre del proyecto y escuela desde config. Redes sociales se renderizan desde `redes_sociales` del config.
- **Hero dinámico** — título y descripción desde `config.json` (`hero_titulo`, `hero_descripcion`).
- **Contacto dinámico** — página de contacto y sección de contacto en inicio leen escuela, ubicación, correo, teléfono y redes desde config.json.
- **Navbar preparado** — ya puede leer `App.config.nombre_proyecto` (configuración futura de logo y nombre).

### Archivos creados
- `frontend/data/config.json` — configuración central del sitio.
- `frontend/js/pages/contacto.js` — renderizador dinámico de la página de contacto.

### Archivos modificados
- `frontend/js/utils/helpers.js` — agregado `App.cargarConfig()` con sistema de caché (evita múltiples fetch).
- `frontend/js/utils/constants.js` — eliminado `SOCIAL_LINKS` (migrado a config.json).
- `frontend/js/components/footer.js` — reescrito para leer desde `config.json` con año dinámico.
- `frontend/js/components/navbar.js` — preparado para usar `App.config.nombre_proyecto` si está disponible.
- `frontend/index.html` — hero y contacto ahora son contenedores vacíos renderizados por JS.
- `frontend/js/pages/inicio.js` — agregada carga de config, funciones `renderizarHero()` y `renderizarContacto()`.
- `frontend/pages/contacto.html` — contenido reemplazado por contenedor dinámico.
- `frontend/data/config.json` — agregados `hero_titulo` y `hero_descripcion`.

### Datos centralizados
| Dato | Antes | Ahora |
|---|---|---|
| Redes sociales | `constants.js` → `SOCIAL_LINKS` | `config.json` → `redes_sociales` |
| Footer copyright | Hardcodeado en `footer.js` | `config.json` → `copyright` con año dinámico |
| Hero título/desc | Hardcodeado en `index.html` | `config.json` → `hero_titulo`, `hero_descripcion` |
| Contacto (escuela, ciudad, email) | Hardcodeado en `contacto.html` e `index.html` | `config.json` → `escuela`, `ciudad`, `provincia`, `correo` |
| Versión del sitio | No existía centralizado | `config.json` → `version_actual` |

### Código eliminado por duplicación
- Hero HTML hardcodeado en `index.html` (título + descripción).
- Sección de contacto hardcodeada en `index.html`.
- Contenido hardcodeado de `pages/contacto.html`.
- `SOCIAL_LINKS` array en `js/utils/constants.js`.
- Copyright fijo (año 2026) en `footer.js`.

### Mejoras arquitectónicas
- **Única fuente de verdad**: modificar `config.json` cambia el footer, hero y contacto automáticamente.
- **Carga diferida con caché**: `App.cargarConfig()` usa una promesa compartida para evitar fetch repetidos.
- **Separación de responsabilidades**: `constants.js` es solo para valores técnicos; `config.json` para datos institucionales.
- **Preparado para escalar**: futuras páginas (Misiones, Prensa, Noticias) pueden leer `App.config` sin modificaciones.
- **Año dinámico**: el footer muestra el año actual sin hardcodear.

---

## [v3.1.0] — Calidad, buscador y mejora de errores

### Nuevas funcionalidades
- **Favicon** — archivo `assets/favicon.svg` con logo STELLA, vinculado en todas las páginas HTML.
- **404 personalizada** — `404.html` con diseño acorde al tema espacial del sitio, enlace de regreso al inicio y navegación dinámica.
- **Skeleton loading** — `css/components/skeleton.css` con animación shimmer (`skeleton-pulse`). Aplicado en 6 páginas: documentación, equipo, galería, patrocinadores, proyecto y telemetría (gráficos).
- **Breadcrumbs** — `js/components/breadcrumb.js` y `css/components/breadcrumb.css`. Generación dinámica de migas de pan con detección de página actual. Incluido en todas las páginas secundarias.
- **Buscador en documentación** — campo de búsqueda en `pages/documentacion.html` que filtra documentos por título, tipo o descripción en tiempo real.
- **Mejora de metadatos** — todas las páginas HTML ahora incluyen: `viewport`, `description`, `theme-color`, Open Graph (`og:title`, `og:description`, `og:type`), Twitter Card.

### Mejoras
- **Manejo de errores en telemetría** — tras 5 fallos consecutivos de la API se muestra "-- °C" / "-- hPa" en lugar de valores anteriores.
- **Validación de datos en telemetría** — verifica que `temperatura` y `presion` sean numéricos; marca temperatura >40°C en rojo.
- **Documentos filtrables** — `data/documentos.json` extendido con campo `descripcion` para alimentar el buscador.
- **Emojis eliminados de títulos** — removido 🚀 del navbar, de inicio.js (icono de áreas), y de proyecto.json (infografía).
- **Limpieza de emojis en títulos HTML** — eliminados 📸, 👥, 📋 de los `<h2>` en galería, equipo y documentación respectivamente.

### Archivos nuevos
- `frontend/assets/favicon.svg`
- `frontend/404.html`
- `frontend/css/components/skeleton.css`
- `frontend/css/components/breadcrumb.css`
- `frontend/js/components/breadcrumb.js`

### Archivos modificados
- `frontend/index.html` — metadatos, favicon, skeleton.css
- `frontend/pages/proyecto.html` — metadatos, favicon, skeleton.css, breadcrumb.css, breadcrumb.js
- `frontend/pages/telemetria.html` — metadatos, favicon, skeleton.css, breadcrumb.css, breadcrumb.js
- `frontend/pages/documentacion.html` — metadatos, favicon, buscador HTML, skeleton.css, breadcrumb.css, breadcrumb.js
- `frontend/pages/equipo.html` — metadatos, favicon, skeleton.css, breadcrumb.css, breadcrumb.js
- `frontend/pages/galeria.html` — metadatos, favicon, skeleton.css, breadcrumb.css, breadcrumb.js
- `frontend/pages/patrocinadores.html` — metadatos, favicon, skeleton.css, breadcrumb.css, breadcrumb.js
- `frontend/pages/contacto.html` — metadatos, favicon, breadcrumb.css, breadcrumb.js
- `frontend/js/pages/documentacion.js` — reescrito con buscador, cache de datos, filtrado en tiempo real
- `frontend/js/pages/telemetria.js` — validación de datos, conteo de fallos, límite de 5 reintentos
- `frontend/js/components/navbar.js` — removido 🚀 del título
- `frontend/js/pages/inicio.js` — cambiado 🚀 por 🔧 en icono de áreas
- `frontend/data/proyecto.json` — cambiado 🚀 por 🗺️ en infografía
- `frontend/data/documentos.json` — agregado campo `descripcion` a cada documento
- `frontend/css/pages/documentacion.css` — agregados estilos de buscador y descripción

---

## [v3.0.0] — Landing page institucional y reorganización del menú

### Cambios importantes
- Menú reorganizado: eliminada la página "Misión", agregada página "Contacto". Orden: Inicio, Proyecto, Telemetría, Documentación, Equipo, Galería, Patrocinadores, Contacto.
- Página de inicio rediseñada completamente como landing page institucional con 10 secciones dinámicas.

### Nuevas funcionalidades
- Hero principal con nuevo título, descripción y botones hacia Proyecto y Telemetría.
- **Estado del proyecto** — tarjeta dinámica desde `data/estado.json` con indicador de color y descripción.
- **STELLA en números** — estadísticas con carga dinámica desde `data/estadisticas.json` y animación de conteo ease-out cúbico.
- **¿Qué es STELLA?** — resumen del proyecto cargado desde `data/proyecto.json` (campo `home_resumen`).
- **Áreas del proyecto** — diagrama visual de flujo de trabajo con iconos, desde datos de proyecto.json.
- **Tecnologías utilizadas** — grid de tarjetas con las primeras 6 tecnologías desde proyecto.json.
- **Últimos documentos** — los 3 documentos más recientes desde `data/documentos.json`, con botón "Ver toda la documentación".
- **Galería destacada** — vista previa con las primeras 4 imágenes desde `data/galeria.json`, overlay con título al hover.
- **Patrocinadores destacados** — logos de los primeros 4 patrocinadores desde `data/patrocinadores.json`.
- **Contacto rápido** — tarjeta con datos institucionales, email y botón hacia página Contacto.
- Animaciones de entrada con Intersection Observer en todas las secciones (fade-in + slide-up).

### Archivos principales
- `index.html` — reescrito (10 secciones dinámicas + hero + contacto rápido).
- `data/estado.json` — creado (estado, color, descripción).
- `data/proyecto.json` — modificado (agregado campo `home_resumen`).
- `js/pages/inicio.js` — creado (carga 6 JSONs en paralelo, renderiza 8 secciones, animación de stats, Intersection Observer).
- `css/pages/inicio.css` — creado (hero, estado, stats grid, áreas, tecnologías, documentos, galería, patrocinadores, contacto, responsive completo).
- `pages/contacto.html` — creado (datos institucionales y redes).
- `js/utils/constants.js` — modificado (nuevo orden NAV_PAGES, eliminada Misión, agregado Contacto).

---

## [v2.8.0] — Página Proyecto: presentación institucional dinámica

### Nuevas funcionalidades
- Nueva página `/pages/proyecto.html` con contenido dinámico desde `data/proyecto.json`.
- 8 secciones de contenido renderizadas desde JSON con tipos: `texto`, `pasos`, `cards`, `areas`.
- Infografía visual del recorrido de la misión construida con HTML+CSS (sin imágenes externas).
- Animaciones de entrada con Intersection Observer (fade-in + slide-up) al hacer scroll.
- Sección "¿Cómo trabajamos?" con diagrama de flujo de áreas del proyecto conectadas.
- Cards de componentes principales y tecnologías utilizadas con datos desde JSON.
- Sección de próximos pasos con texto institucional.
- Agregada entrada "Proyecto" al menú de navegación (segundo lugar, después de Inicio).

### Archivos principales
- `data/proyecto.json` — creado (8 secciones + infografía en estructura flexible).
- `js/pages/proyecto.js` — creado (renderizador por tipo de sección + Intersection Observer).
- `css/pages/proyecto.css` — creado (animaciones, infografía, pasos, cards, áreas, responsive).
- `pages/proyecto.html` — creado (estructura con cargador dinámico).
- `js/utils/constants.js` — modificado (agregada entrada Proyecto en NAV_PAGES).

---

## [v2.7.0] — Página de Patrocinadores dinámica

### Nuevas funcionalidades
- Página `/pages/patrocinadores.html` completamente funcional con datos dinámicos desde `data/patrocinadores.json`.
- Los patrocinadores se agrupan automáticamente por categoría (Instituciones Educativas, Organismos Públicos, Empresas, Colaboradores).
- Las categorías se ordenan según aparecen en el JSON; nuevas categorías se agregan automáticamente.
- Tarjetas con logo, nombre, descripción y botón de sitio web (cuando está disponible).
- Logo por defecto (`assets/logos/default-logo.svg`) cuando el patrocinador no tiene logo asignado.
- Fallback automático con `onerror` si la imagen del logo no se carga.
- Almacén de logos en `assets/logos/` con SVGs placeholder para los patrocinadores de ejemplo.

### Archivos principales
- `data/patrocinadores.json` — creado (9 patrocinadores de ejemplo en 4 categorías).
- `js/pages/patrocinadores.js` — creado (lógica de carga, agrupación y renderizado).
- `css/pages/patrocinadores.css` — creado (grid responsive, glassmorphism, hover).
- `pages/patrocinadores.html` — reescrito (estructura dinámica con cargador).
- `assets/logos/default-logo.svg`, `assets/logos/escuela-tecnica-2.svg`, `assets/logos/unicen-ingenieria.svg`, `assets/logos/inta.svg`, `assets/logos/conae.svg` — creados.

---

## [v2.6.0] — Documentación obligatoria y mantenimiento

### Nuevas funcionalidades
- Creación de `TODO.md` como lista oficial de tareas pendientes del proyecto, organizada por prioridad (alta, media, baja) con sección de completadas.
- Establecida regla permanente: toda modificación futura debe incluir actualización automática de `CHANGELOG.md`, `GUIA_MANTENIMIENTO.md` y `TODO.md`.

### Mejoras
- La documentación del proyecto ahora debe evolucionar sincronizada con el código.
- `TODO.md` refleja el estado actual del desarrollo con tareas pendientes identificadas.

### Archivos principales
- `TODO.md` — creado.

---

## [v2.5.0] — Documentación de mantenimiento

### Nuevas funcionalidades
- Archivo `GUIA_MANTENIMIENTO.md` con documentación completa para administrar el sitio.
- Archivo `CHANGELOG.md` con historial de versiones del proyecto.

### Mejoras
- Guía que cubre: agregar integrantes, documentos, imágenes, estadísticas; cambiar redes, API, fondo; agregar páginas; organización y buenas prácticas.

---

### Cambios importantes
- Conversión del sitio de una sola página (single-page con scroll) a arquitectura multipágina con navegación real entre archivos HTML independientes.
- Reorganización completa de carpetas: `css/`, `js/`, `assets/`, `data/`, `pages/`.
- Separación de estilos en `css/base/`, `css/components/` y `css/pages/`.
- Separación de lógica en `js/utils/`, `js/components/` y `js/pages/`.
- Navbar y footer ahora se generan dinámicamente mediante JavaScript, compartidos por todas las páginas.
- Indicador visual de página activa en el menú de navegación.

### Nuevas funcionalidades
- Página de inicio (`index.html`) como portada con presentación y botones de acceso rápido.
- Página de Misión (`pages/mision.html`) con toda la información del proyecto.
- Página de Telemetría (`pages/telemetria.html`) dedicada exclusivamente a la visualización de datos.
- Página de Documentación (`pages/documentacion.html`) con sistema dinámico de tarjetas.
- Página de Equipo (`pages/equipo.html`) con cards generadas desde JSON.
- Página de Galería (`pages/galeria.html`) con placeholder "próximamente".
- Página de Patrocinadores (`pages/patrocinadores.html`) con placeholder "próximamente".

### Mejoras
- Rutas relativas corregidas para funcionar desde cualquier nivel de carpeta.
- `App.utils.dataUrl()` unifica la resolución de rutas entre `index.html` y `pages/`.
- Constantes centralizadas en `js/utils/constants.js` (API, redes sociales, navegación).

### Cambios internos
- Creada estructura modular con `App.constants`, `App.utils` y `App.graficos`.
- CSS global, de componentes y de páginas ahora en subdirectorios separados.
- Datos externalizados a `data/equipo.json` y `data/documentos.json`.

### Eliminaciones
- Eliminado `styles.css` (monolítico) en favor de la nueva estructura modular.
- Eliminado `script.js` (telemetría antigua) reemplazado por `js/pages/telemetria.js`.
- Eliminado `documentos/documentos.js` (obsoleto).

---

## [v1.1.0] — Documentación dinámica y optimización

### Nuevas funcionalidades
- Sección de Documentación con tarjetas generadas desde `documentos.js`.
- Sistema de renderizado dinámico a partir de un array de objetos JavaScript.

### Mejoras
- Integración con los estilos glassmorphism existentes.
- Diseño responsive de las tarjetas de documentación.

---

## [v1.0.0] — Sitio inicial

### Nuevas funcionalidades
- Sitio web de una sola página con scroll suave entre secciones.
- Diseño espacial con fondo de la Tierra, gradiente nocturno, estrellas animadas y tipografía Orbitron.
- Menú de navegación fijo con efecto glassmorphism y menú hamburguesa responsive.
- Secciones: Proyecto STELLA, Finalidad, Beneficiarios, Producto, Actividades, Telemetría, Especificaciones Técnicas, Equipo.
- Telemetría en vivo con datos simulados desde backend Flask (`/datos` con temperatura y presión).
- Cards de telemetría con efecto hover y actualización cada 2 segundos.
- Integración con redes sociales (Instagram, TikTok, YouTube).
- Footer con copyright de la institución.

### Backend
- API Flask en `backend/app.py` con endpoint `/datos` que genera valores aleatorios de temperatura (-50 a 30 °C) y presión (100 a 1000 hPa).

---

## [v2.1.0] — Galería dinámica

### Nuevas funcionalidades
- Página de Galería completamente funcional con imágenes cargadas desde `data/galeria.json`.
- Grid responsive con CSS Grid (`auto-fill` / `minmax`).
- Filtros por categoría generados dinámicamente desde los datos.
- Buscador en tiempo real por título.
- Lightbox con navegación entre imágenes, teclado (Escape, flechas) y clic fuera para cerrar.
- Contador de posición (ej: "3 / 8").
- Efectos hover con glassmorphism.
- 8 imágenes placeholder SVG representativas de cada categoría.

### Archivos creados
- `data/galeria.json`
- `assets/images/galeria/*.svg`
- `css/pages/galeria.css`
- `js/pages/galeria.js`
- `pages/galeria.html`

---

## [v2.2.0] — Gráficos en tiempo real

### Nuevas funcionalidades
- Gráficos dinámicos de temperatura y presión en la página de telemetría mediante Chart.js.
- Cada gráfico mantiene un buffer de 50 muestras con desplazamiento automático.
- Eje X con marcas de tiempo (HH:MM:SS).
- Tema oscuro integrado con la estética del sitio (colores, glassmorphism, tipografía).

### Mejoras
- Las tarjetas de telemetría y los gráficos ahora se actualizan simultáneamente.
- Estructura preparada para agregar nuevas variables (altitud, humedad, voltaje, etc.).

### Archivos creados
- `js/pages/graficos.js`

### Dependencias
- Chart.js v4.4.7 (cargado desde CDN).

---

## [v2.3.0] — Estadísticas del proyecto

### Nuevas funcionalidades
- Página de Estadísticas con 12 tarjetas dinámicas cargadas desde `data/estadisticas.json`.
- Animación de contador con `requestAnimationFrame` y easing cúbico (ease-out).
- Grid responsive (4→2→1 columnas).
- Cada tarjeta: icono, valor numérico con unidad, título y descripción.

### Archivos creados
- `data/estadisticas.json`
- `css/pages/estadisticas.css`
- `js/pages/estadisticas.js`
- `pages/estadisticas.html`

---

## [v2.4.0] — Gráficos en telemetría y estadísticas en inicio

### Nuevas funcionalidades
- Sección de estadísticas integrada en la página de inicio (`index.html`) debajo de la presentación del proyecto.
- Las tarjetas se cargan dinámicamente desde `data/estadisticas.json` con animación de contador.

### Eliminaciones
- Eliminada la página independiente `pages/estadisticas.html`.
- Eliminada la entrada "Estadísticas" del menú de navegación.

### Mejoras
- Reutilización del CSS y JS existentes de estadísticas sin duplicación de código.
- Las estadísticas ahora son visibles inmediatamente al ingresar al sitio.

---

## [v2.5.0] — Documentación de mantenimiento

### Nuevas funcionalidades
- Archivo `GUIA_MANTENIMIENTO.md` con documentación completa para administrar el sitio.
- Archivo `CHANGELOG.md` con historial de versiones del proyecto.

### Mejoras
- Guía que cubre: agregar integrantes, documentos, imágenes, estadísticas; cambiar redes, API, fondo; agregar páginas; organización y buenas prácticas.

---

## Cómo registrar futuros cambios

Al agregar una nueva funcionalidad, corrección o mejora al proyecto, seguir estos pasos:

1. Determinar el tipo de cambio:
   - **MAJOR (v3.0.0):** cambios que rompen compatibilidad o reestructuraciones grandes.
   - **MINOR (v2.6.0):** nuevas funcionalidades compatibles con la versión actual.
   - **PATCH (v2.5.1):** correcciones de errores, ajustes menores, documentación.

2. Agregar una nueva entrada al inicio del archivo (arriba de la última versión) con el formato:

```markdown
## [vX.Y.Z] — Título breve del cambio

### Nuevas funcionalidades
- Descripción de la nueva característica.

### Mejoras
- Descripción de la mejora realizada.

### Correcciones
- Descripción del error corregido.

### Eliminaciones
- Descripción de lo eliminado (si aplica).
```

3. Mantener un lenguaje claro y conciso. Cada entrada debe responder a *qué* cambió, no *cómo*.
