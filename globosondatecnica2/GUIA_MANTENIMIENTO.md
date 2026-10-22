# Guía de Mantenimiento — Proyecto STELLA

Manual para administrar y actualizar el sitio web del proyecto STELLA sin necesidad de revisar el código fuente.

---

## Índice

1. [Estructura del proyecto](#1-estructura-del-proyecto)
2. [Configuración general del sitio (config.json)](#2-configuración-general-del-sitio-configjson)
3. [Agregar un integrante al equipo](#3-agregar-un-integrante-al-equipo)
4. [Agregar un documento](#4-agregar-un-documento)
5. [Agregar imágenes a la galería](#5-agregar-imágenes-a-la-galería)
6. [Modificar las estadísticas](#6-modificar-las-estadísticas)
7. [Cambiar enlaces de redes sociales](#7-cambiar-enlaces-de-redes-sociales)
8. [Cambiar la URL de la API Flask](#8-cambiar-la-url-de-la-api-flask)
9. [Agregar un patrocinador](#9-agregar-un-patrocinador)
10. [Agregar una nueva página](#10-agregar-una-nueva-página)
11. [Cambiar imágenes del sitio](#11-cambiar-imágenes-del-sitio)
12. [Organización de carpetas](#12-organización-de-carpetas)
13. [Buenas prácticas](#13-buenas-prácticas)
14. [Modificar la página Proyecto](#14-modificar-la-página-proyecto)
15. [Modificar secciones de la página Inicio](#15-modificar-secciones-de-la-página-inicio)
16. [Modificar las novedades (Noticias)](#16-modificar-las-novedades-noticias)
17. [SEO y compartir en redes](#17-seo-y-compartir-en-redes)
18. [Desplegar en Vercel](#18-desplegar-en-vercel)
19. [Agregar una entrevista (Prensa)](#19-agregar-una-entrevista-prensa)

---

## 1. Estructura del proyecto

```
globosondatecnica2/                    # Carpeta raíz del proyecto en Vercel
├── email_contacto_web.gs                  # Script de Google Apps Script para enviar el formulario de contacto por Gmail
├── frontend/
├── index.html                          # Landing page institucional con 10 secciones dinámicas
├── 404.html                            # Página de error personalizada
├── vercel.json                         # Configuración de despliegue en Vercel (headers de caché)
├── api/                                # Serverless functions de Vercel
│   └── datos.py                        # Endpoint de telemetría (/api/datos)
│
├── pages/                              # Páginas internas del sitio
│   ├── proyecto.html                   # Presentación institucional del proyecto
│   ├── telemetria.html                 # Telemetría en vivo con gráficos (oculta del menú)
│   ├── documentacion.html              # Biblioteca técnica con estadísticas, filtros, destacados y visor PDF
│   ├── galeria.html                    # Galería de imágenes con buscador y lightbox
│   ├── noticias.html                   # Novedades y actualizaciones del proyecto
│   ├── entrevistas.html                # Entrevistas y notas de prensa (portada + grid con links)
│   ├── equipo.html                     # Integrantes del equipo
│   ├── patrocinadores.html             # Patrocinadores con datos dinámicos
│   └── contacto.html                   # Contacto institucional con formulario
│
    ├── css/
    │   ├── base/                           # Estilos base del sitio
    │   │   ├── reset.css                   # Reset, body, tipografía base
    │   │   └── background.css              # Fondo espacial, estrellas, overlay
    │   ├── components/                     # Componentes reutilizables
    │   │   ├── navbar.css                  # Barra de navegación
    │   │   ├── footer.css                  # Pie de página y redes sociales
    │   │   ├── section.css                 # Secciones compartidas (page-section)
    │   │   ├── skeleton.css                # Animaciones de skeleton loading (shimmer)
    │   │   └── breadcrumb.css              # Estilos de migas de pan
    │   └── pages/                          # Estilos específicos por página
    │       ├── inicio.css                  # Landing page: hero, estado, stats, áreas, galería, etc.
    │       ├── telemetria.css              # Cards de telemetría y contenedores de gráficos
│       ├── documentacion.css           # Estadísticas, filtros, tarjetas, modal PDF, responsive
│       ├── galeria.css                 # Grid, lightbox, filtros y buscador
│       ├── entrevistas.css             # Portada y tarjetas de entrevistas
│       ├── equipo.css                  # Cards de integrantes
│       ├── patrocinadores.css          # Cards de patrocinadores
│       ├── contacto.css                # Formulario y tarjetas de contacto
│       └── noticias.css                # Grid de novedades
│
    ├── js/
    │   ├── utils/                          # Utilidades compartidas
    │   │   ├── constants.js                # Constantes técnicas: API, páginas del nav
    │   │   ├── helpers.js                  # Funciones auxiliares (rutas relativas)
    │   │   └── iconos.js                   # Iconos SVG inline (convierte emojis a SVG)
    │   ├── components/                     # Componentes reutilizables
    │   │   ├── navbar.js                   # Genera el menú de navegación
    │   │   ├── breadcrumb.js               # Genera migas de pan dinámicas
    │   │   └── footer.js                   # Genera el pie de página (desde config.json)
    │   └── pages/                          # Lógica específica por página
    │       ├── telemetria.js               # Fetch de datos de la API (con reintentos y validación)
    │       ├── graficos.js                 # Gráficos Chart.js en tiempo real
│       ├── documentacion.js            # Carga documentos, estadísticas, filtros, ordenamiento, destacados, PDF modal
│       ├── galeria.js                  # Galería, filtros, búsqueda, lightbox
│       ├── equipo.js                   # Carga integrantes desde JSON
│       ├── patrocinadores.js           # Carga patrocinadores desde JSON
│       ├── contacto.js                 # Renderiza página de contacto desde config.json
│       ├── noticias.js                 # Carga y renderiza las novedades
│       ├── entrevistas.js              # Carga y renderiza las entrevistas (cards con link externo)
│       ├── proyecto.js                 # Carga secciones del proyecto desde JSON
│       └── inicio.js                   # Landing page: carga 9 JSONs (incluye config), renderiza 12 secciones
│
├── assets/
│   ├── backgrounds/
│   │   └── fototierra.jpg             # Imagen de fondo del sitio
│   ├── logos/                          # Logos de patrocinadores
│   │   ├── default-logo.svg
│   │   └── escuela-tecnica-2.svg
│   ├── icons/                          # Iconos de redes sociales (locales)
│   │   ├── instagram.svg
│   │   └── tiktok.svg
│   └── images/                         # Imágenes del sitio
│       ├── og-portada.png              # Imagen Open Graph para compartir en redes
│       ├── entrevistas/                 # Portadas de las entrevistas (png)
│       │   ├── Entrevista - Vamos con vos.png
│       │   ├── Entrevista - En accion olavarria.png
│       │   ├── Entrevista - Central de noticias olavarria.png
│       │   └── Entrevista - Canal uno.png
│       └── galeria/                    # Imágenes de la galería (jpeg/jpg)
│           ├── Feria1.jpg, Feria2.jpg, Feria3.jpg, Feria4.jpg
│           ├── hardware1.jpg, hardware2.jpeg
│           ├── diseño1.jpg, diseño2.jpeg
│           ├── blender1.jpeg, blender2.jpeg, blender3.jpeg
│           └── impresion1.jpeg, impresion2.jpeg, impresion3.jpeg
│
├── data/                               # Datos editables (JSON)
│   ├── config.json                     # Configuración general del sitio (fuente oficial de datos institucionales)
│   ├── equipo.json                     # Lista de integrantes
│   ├── documentos.json                 # Lista de documentos
│   ├── galeria.json                    # Lista de imágenes
│   ├── noticias.json                   # Lista de novedades
│   ├── entrevistas.json                # Lista de entrevistas y notas de prensa
│   ├── patrocinadores.json             # Lista de patrocinadores
│   ├── estado.json                     # Estado actual del proyecto
│   ├── proyecto.json                   # Contenido de la página Proyecto
│   ├── estadisticas.json               # Datos de estadísticas
│
├── robots.txt                         # Reglas para buscadores
├── sitemap.xml                        # Mapa del sitio para SEO
│
├── documentos/                         # Archivos para descargar
│   ├── carpetas_de_campo/
│   ├── informes/
│   ├── investigacion/
│   ├── manuales/
│   ├── otros/
│   ├── posters/
│   └── presentaciones/
│
├── favicon.svg                        # Icono de página (favicon)
├── CHANGELOG.md                       # Historial de versiones del proyecto
├── GUIA_MANTENIMIENTO.md              # Este archivo — manual de administración
└── TODO.md                            # Lista de tareas pendientes del desarrollo
```

---

## 2. Configuración general del sitio (config.json)

El archivo `globosondatecnica2/frontend/data/config.json` centraliza toda la información institucional del proyecto. Es la fuente oficial para el hero, el footer, la página de contacto, el copyright y la versión del sitio.

### Archivo a modificar

`globosondatecnica2/frontend/data/config.json`

### Estructura del JSON

```json
{
    "nombre_proyecto": "STELLA",
    "descripcion_corta": "Proyecto educativo de exploración estratosférica",
    "descripcion_larga": "Descripción extensa del proyecto...",
    "escuela": "Escuela Técnica N°2 \"Luciano Fortabat\"",
    "tecnicatura": "Tecnicatura en Informática",
    "profesor": "Alejandro Wagner",
    "ciudad": "Olavarría",
    "provincia": "Provincia de Buenos Aires",
    "pais": "Argentina",
    "anio_inicio": 2026,
    "correo": "santatrinidad2026@gmail.com",
    "contacto_endpoint": "https://script.google.com/macros/s/.../exec",
    "telefono": "",
    "direccion": "",
    "hero_titulo": "Título principal del hero",
    "hero_descripcion": "Descripción que aparece debajo del título en la página de inicio",
    "estado_actual": "En desarrollo",
    "redes_sociales": { ... },
    "copyright": "© {year} {nombre_proyecto} - {escuela}",
    "version_actual": "v4.1.3"
}
```

### Campos principales

| Campo | Descripción | Visible en |
|---|---|---|
| `nombre_proyecto` | Nombre del proyecto | Footer, navbar |
| `descripcion_corta` | Frase breve del proyecto | Hero (subtítulo) |
| `hero_titulo` | Título del hero en la página de inicio | Hero de index.html |
| `hero_descripcion` | Texto debajo del título del hero | Hero de index.html |
| `escuela` | Nombre completo de la institución | Footer, contacto, hero |
| `ciudad`, `provincia`, `pais` | Ubicación institucional | Footer, contacto |
| `correo` | Email de contacto | Página contacto, sección contacto en inicio |
| `contacto_endpoint` | URL de la Web App de Google Apps Script que envía los mensajes del formulario por Gmail. Si está vacío (`""`), el formulario usa `mailto` como respaldo | Formulario de contacto |
| `telefono` | Teléfono (puede estar vacío) | Página contacto |
| `redes_sociales` | Objeto con plataformas y sus URLs | Footer, página contacto |
| `copyright` | Plantilla de copyright. Usa `{year}` para el año actual y `{nombre_proyecto}` / `{escuela}` como placeholders | Footer |
| `version_actual` | Versión del sitio (ej: "v4.0.0") | Footer |

### Redes sociales

```json
"redes_sociales": {
    "instagram": { "url": "https://...", "icono": "assets/icons/instagram.svg" },
    "tiktok": { "url": "https://...", "icono": "assets/icons/tiktok.svg" }
}
```

Cada red necesita una `url` (puede estar vacía si no se usa) y un `icono` (ruta local en `globosondatecnica2/frontend/assets/icons/`). Solo las redes con `url` no vacía se muestran en el footer y en la página de contacto. Para agregar una nueva red, agregar una nueva clave al objeto con su `url` e `icono`. Para nuevos iconos, colocar un SVG en `globosondatecnica2/frontend/assets/icons/` y referenciarlo (los íconos externos por CDN ya no se usan).

### Cómo modificar

1. Abrir `globosondatecnica2/frontend/data/config.json`.
2. Cambiar el valor del campo deseado.
3. Guardar el archivo.
4. Recargar cualquier página del sitio para ver los cambios reflejados.

### Notas importantes

- El footer, hero, contacto y versión leen automáticamente desde `globosondatecnica2/frontend/data/config.json`. No es necesario modificar HTML ni JavaScript.
- `telefono` y `direccion` pueden dejarse como `""` si no están disponibles; la página de contacto los omitirá automáticamente.
- La marca `{year}` en `copyright` se reemplaza automáticamente por el año actual.
- Para cambiar la versión del sitio, actualizar `version_actual`. El valor puede mostrarse en el futuro sin modificar código.
- Las secciones narrativas de `globosondatecnica2/frontend/data/proyecto.json` (como "¿Qué es STELLA?") mencionan información institucional dentro del texto; esos datos deben actualizarse tanto en `config.json` como en `proyecto.json` si cambian, porque forman parte del contenido textual de la página.

---

## 3. Agregar un integrante al equipo

### Archivo a modificar

`globosondatecnica2/frontend/data/equipo.json`

### Estructura del JSON

Cada integrante es un objeto con dos campos:

```json
{
    "nombre": "Nombre Apellido",
    "rol": "Desarrollador"
}
```

### Ejemplo

```json
{ "nombre": "Juan Pérez", "rol": "Desarrollador" }
```

### Pasos

1. Abrir `globosondatecnica2/frontend/data/equipo.json`.
2. Agregar una nueva línea al final del array (después del último integrante, antes de `]`).
3. Si no es el último, agregar una coma al final del objeto anterior.
4. Guardar el archivo.
5. La página de equipo (`globosondatecnica2/frontend/pages/equipo.html`) mostrará automáticamente la nueva tarjeta.

### Campos disponibles

| Campo     | Obligatorio | Descripción                     |
|-----------|-------------|----------------------------------|
| `nombre`  | Sí          | Nombre y apellido del integrante |
| `rol`     | Sí          | Rol o cargo en el proyecto       |

### Nota

Actualmente no se usa fotografía de perfil. Cada tarjeta muestra la inicial del nombre. Si en el futuro se agregan fotos, deben colocarse en `globosondatecnica2/frontend/assets/images/` y agregarse el campo `"foto": "ruta/de/la/imagen.jpg"` en el JSON.

---

## 4. Agregar un documento

### Carpeta para el archivo

Colocar el archivo en la carpeta correspondiente según su tipo:

| Tipo                 | Carpeta                           |
|----------------------|-----------------------------------|
| Carpeta de campo     | `documentos/carpetas_de_campo/`   |
| Informe técnico      | `documentos/informes/`            |
| Presentación         | `documentos/presentaciones/`      |
| Manual / Guía        | `documentos/manuales/`            |
| Poster               | `documentos/posters/`             |
| Investigación        | `documentos/investigacion/`       |
| Otros                | `documentos/otros/`               |

### Archivo a modificar

`globosondatecnica2/frontend/data/documentos.json`

### Estructura del JSON (v3.5.0)

```json
{
    "id": 1,
    "titulo": "Nombre del documento",
    "descripcion": "Descripción breve del contenido del documento.",
    "categoria": "Informes Técnicos",
    "tipo": "PDF",
    "fecha": "2026-03-15",
    "autor": "Área Técnica",
    "version": "1.0",
    "archivo": "documentos/informes/mi-documento.pdf",
    "portada": "assets/images/documentos/mi-portada.svg",
    "destacado": true
}
```

### Campos

| Campo         | Obligatorio | Descripción |
|---------------|-------------|-------------|
| `id`          | Sí          | Número entero único correlativo |
| `titulo`      | Sí          | Título visible del documento |
| `descripcion` | Sí          | Texto breve usado en la tarjeta y por el buscador |
| `categoria`   | Sí          | Categoría para el filtro (ver lista) |
| `tipo`        | Sí          | Formato del archivo: PDF, Hoja de cálculo, Imagen, etc. |
| `fecha`       | No          | Fecha del documento (YYYY-MM-DD). Se usa para ordenar |
| `autor`       | No          | Autor o área responsable del documento |
| `version`     | No          | Versión del documento (ej: "1.0", "2.1") |
| `archivo`     | Sí          | Ruta del archivo desde la raíz del frontend |
| `portada`     | No          | Ruta de la imagen de portada. Si se omite, se usa una por defecto |
| `destacado`   | No          | `true` o `false`. Si es `true`, aparece en la sección "Documentos destacados" |

### Categorías disponibles

- Informes Técnicos
- Carpetas de Campo
- Presentaciones
- Manuales
- Posters
- Investigación
- Otros

Las categorías se generan automáticamente desde el JSON. Si se escribe una nueva, aparecerá como filtro sin modificar código.

### Cómo destacar un documento

Asignar `"destacado": true` en la entrada del JSON. Aparecerá automáticamente en la sección superior "Documentos destacados".

### Cómo agregar una portada

1. Crear una imagen en `globosondatecnica2/frontend/assets/images/documentos/` (puede ser SVG, PNG o JPG, 300×420 recomendado).
2. Agregar el campo `"portada": "assets/images/documentos/mi-portada.svg"` en la entrada del JSON.
3. Si no se especifica portada, se usa `default-portada.svg`.

### Pasos

1. Colocar el archivo en la carpeta correspondiente dentro de `documentos/`.
2. Abrir `globosondatecnica2/frontend/data/documentos.json`.
3. Agregar un nuevo objeto al array con todos los campos (id correlativo al último).
4. La página de documentación mostrará la nueva tarjeta automáticamente.

### Compatibilidad con documentos existentes

Si se usa la estructura anterior (con `ruta` en lugar de `archivo`), el sistema la detecta automáticamente. Los campos faltantes (autor, version, portada, destacado) usan valores por defecto sin generar errores.

---

## 5. Agregar imágenes a la galería

### Carpeta para las imágenes

`globosondatecnica2/frontend/assets/images/galeria/`

### Archivo a modificar

`globosondatecnica2/frontend/data/galeria.json`

### Estructura del JSON (v3.4.0)

```json
{
    "id": 1,
    "titulo": "Título de la imagen",
    "descripcion": "Descripción breve de la imagen.",
    "categoria": "Blender",
    "imagen": "assets/images/galeria/mi-imagen.jpg",
    "fecha": "2026-03-15"
}
```

### Campos

| Campo | Obligatorio | Descripción |
|---|---|---|
| `id` | Sí | Número entero único correlativo |
| `titulo` | Sí | Título visible de la imagen |
| `descripcion` | Sí | Texto breve que describe la imagen |
| `categoria` | Sí | Categoría para el filtro (ver lista) |
| `imagen` | Sí | Ruta del archivo desde la raíz del frontend |
| `fecha` | No | Fecha asociada a la imagen (opcional) |

### Categorías disponibles (v3.4.0)

- Blender
- Impresión 3D
- Desarrollo
- Hardware
- Software
- Vuelo
- General

Las categorías no están limitadas a esta lista. Si se escribe una nueva, aparecerá automáticamente como filtro en la galería. Los filtros se generan dinámicamente leyendo el JSON.

### Pasos

1. Copiar la imagen a `globosondatecnica2/frontend/assets/images/galeria/`.
2. Abrir `globosondatecnica2/frontend/data/galeria.json`.
3. Agregar un nuevo objeto al array con todos los campos.
4. Asignar un `id` correlativo al último existente.
5. La galería y la página de inicio mostrarán la imagen automáticamente.

### Recomendaciones

- Usar imágenes en formato JPG, PNG, WebP o SVG.
- Escalar las imágenes a un tamaño razonable (máximo 1920 px de ancho) para evitar carga lenta.
- Mantener nombres de archivo sin espacios (usar guiones).
- Para crear un placeholder SVG, copiar uno existente de `globosondatecnica2/frontend/assets/images/galeria/` y modificar el texto.

---

## 6. Modificar las estadísticas

### Archivo a modificar

`globosondatecnica2/frontend/data/estadisticas.json`

### Significado de cada campo

```json
{
    "titulo": "Misiones realizadas",       // Texto que identifica la estadística
    "valor": 1,                             // Número a mostrar (se anima desde 0)
    "origen": "documentos",                 // (opcional) Solo "documentos": el valor se toma automáticamente de la cantidad real de entradas en documentos.json
    "unidad": "",                           // Unidad (ej: "km", "°C", "hs"). Dejar "" si no aplica
    "icono": "\uD83D\uDE80",                // Emoji o ícono representativo
    "descripcion": "Lanzamientos exitosos"  // Texto breve explicativo
}
```

> **Nota:** la tarjeta "Documentos publicados" incluye `"origen": "documentos"`, así su valor se calcula solo al contar los elementos de `globosondatecnica2/frontend/data/documentos.json`. No hace falta editar `valor` manualmente; al agregar o quitar documentos, la tarjeta se actualiza sola. Si `documentos.json` no carga, se muestra el `valor` de respaldo.

### Cómo agregar una nueva tarjeta

1. Abrir `globosondatecnica2/frontend/data/estadisticas.json`.
2. Agregar un nuevo objeto al array con todos los campos.
3. La página principal mostrará la nueva tarjeta automáticamente con la animación de contador.

### Ejemplo para agregar altitud

```json
{
    "titulo": "Altitud máxima",
    "valor": 35,
    "unidad": "km",
    "icono": "\u26F5",
    "descripcion": "Altitud máxima alcanzada por la cápsula"
}
```

---

## 7. Cambiar enlaces de redes sociales

### Archivo a modificar

`globosondatecnica2/frontend/data/config.json` (campo `redes_sociales`)

### Estructura

```json
"redes_sociales": {
    "instagram": { "url": "https://...", "icono": "assets/icons/instagram.svg" },
    "tiktok": { "url": "https://...", "icono": "assets/icons/tiktok.svg" }
}
```

Cada red tiene dos campos:
- `url`: enlace a la red social. Si está vacío (`""`), no se muestra.
- `icono`: ruta local del ícono dentro de `globosondatecnica2/frontend/assets/icons/` (formato SVG).

### Pasos

1. Abrir `globosondatecnica2/frontend/data/config.json`.
2. Modificar la `url` y/o `icono` de la red que corresponda.
3. Para agregar una nueva red, agregar una nueva clave dentro de `redes_sociales` con su `url` e `icono`.

---

## 8. Cambiar la URL de la API de telemetría

### Archivo a modificar

`globosondatecnica2/frontend/data/config.json` (campo `api_url`) y, como respaldo, `globosondatecnica2/frontend/js/utils/constants.js` (constante `API_URL`).

### Valor por defecto

```js
API_URL: '/api/datos'
```

- En **Vercel**, la URL es relativa `/api/datos` y apunta a la serverless function `globosondatecnica2/frontend/api/datos.py`.
- Para **probar localmente con Flask**, cambiar el valor por `http://127.0.0.1:5000/datos` (tanto en `config.json` como en `constants.js`).

> Nota: la página de telemetría lee primero `api_url` de `config.json`; si ese campo falta, usa `App.constants.API_URL` como respaldo. Ambos deben apuntar al mismo endpoint.

---

## 9. Agregar un patrocinador

### Archivo a modificar

`globosondatecnica2/frontend/data/patrocinadores.json`

### Carpeta para el logo

`globosondatecnica2/frontend/assets/logos/`

### Estructura del JSON

Cada patrocinador es un objeto con los siguientes campos:

| Campo        | Obligatorio | Descripción                                          |
|--------------|-------------|------------------------------------------------------|
| `nombre`     | Sí          | Nombre del patrocinador                              |
| `descripcion`| Sí          | Breve descripción de su vínculo con el proyecto      |
| `logo`       | No          | Ruta del archivo de logo dentro de `globosondatecnica2/frontend/assets/logos/`. Si está vacío (`""`) se muestra un logo por defecto |
| `sitio_web`  | No          | URL completa del sitio web. Si está vacío (`""`) no se muestra el botón |
| `categoria`  | No          | Categoría para agrupar (ej: "Empresas", "Instituciones Educativas"). Si no se especifica, se agrupa en "Otros" |

### Pasos

1. Colocar el archivo del logo en `globosondatecnica2/frontend/assets/logos/`. Formatos recomendados: SVG, PNG. Tamaño sugerido: 200×100 px o proporción similar.
2. Abrir `globosondatecnica2/frontend/data/patrocinadores.json`.
3. Agregar un nuevo objeto al array (respetando las comas entre objetos).
4. Si el patrocinador no tiene logo, usar `"logo": ""`.
5. Si el patrocinador no tiene sitio web, usar `"sitio_web": ""`.
6. Guardar el archivo.
7. La página de patrocinadores (`globosondatecnica2/frontend/pages/patrocinadores.html`) mostrará automáticamente la nueva tarjeta, agrupada en su categoría.

### Notas

- Los patrocinadores se agrupan automáticamente por categoría en el orden en que aparecen en el JSON.
- Si no hay patrocinadores en el JSON, se muestra un mensaje indicándolo.
- Si un logo no se encuentra en la ruta especificada, se muestra automáticamente el logo por defecto (`globosondatecnica2/frontend/assets/logos/default-logo.svg`).

---

## 10. Agregar una nueva página

### Paso 1: Crear el HTML

Crear un archivo en `globosondatecnica2/frontend/pages/` con el nombre deseado (ej: `globosondatecnica2/frontend/pages/contacto.html`).

Estructura base:

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Descripción breve de la página para SEO.">
<meta name="theme-color" content="#0a0a1a">
<meta property="og:title" content="Título | STELLA">
<meta property="og:description" content="Descripción para compartir en redes.">
<meta property="og:type" content="website">
<meta property="og:image" content="https://stellaproject.com.ar/assets/images/og-portada.png">
<link rel="canonical" href="https://stellaproject.com.ar/pages/contacto.html">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
<title>Título | STELLA</title>
<link rel="stylesheet" href="../css/base/reset.css">
<link rel="stylesheet" href="../css/base/background.css">
<link rel="stylesheet" href="../css/components/navbar.css">
<link rel="stylesheet" href="../css/components/footer.css">
<link rel="stylesheet" href="../css/components/section.css">
<link rel="stylesheet" href="../css/components/skeleton.css">
<link rel="stylesheet" href="../css/components/breadcrumb.css">
<!-- Agregar CSS específico si es necesario -->
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>

<div id="navbar"></div>
<div id="breadcrumb"></div>

<main>
    <section class="page-section">
        <h1>Título de la página</h1>
        <p class="subtitle">Subtítulo</p>
        <!-- Contenido -->
    </section>
</main>

<div id="footer"></div>

<script src="../js/utils/constants.js"></script>
<script src="../js/utils/helpers.js"></script>
<script src="../js/utils/iconos.js"></script>
<script src="../js/components/navbar.js"></script>
<script src="../js/components/breadcrumb.js"></script>
<script src="../js/components/footer.js"></script>
<!-- Agregar JS específico si es necesario -->
</body>
</html>
```

> Notas: el título principal debe ser `<h1>` (único por página). Cada página debe incluir `iconos.js`, `canonical` y `og:image`. Los archivos nuevos se referencian con `?v=3` (cache-busting).

### Paso 2: Crear el CSS (si es necesario)

Crear un archivo en `globosondatecnica2/frontend/css/pages/nombre-de-la-pagina.css` con los estilos específicos.
No incluir estilos que ya existen en `globosondatecnica2/frontend/css/base/` o `globosondatecnica2/frontend/css/components/`.

### Paso 3: Crear el JS (si es necesario)

- Si la página carga datos desde JSON, crear un archivo en `globosondatecnica2/frontend/js/pages/`.
- Usar `App.utils.dataUrl('data/archivo.json')` para obtener la ruta correcta del JSON.
- Si es lógica compartida, considerar colocarla en `globosondatecnica2/frontend/js/components/`.

### Paso 4: Agregar la página al menú de navegación

1. Abrir `globosondatecnica2/frontend/js/utils/constants.js`.
2. Agregar una entrada en el array `NAV_PAGES`:

```js
{ file: 'contacto.html', label: 'Contacto' }
```

El navbar se actualizará automáticamente en todas las páginas.

---

## 11. Cambiar imágenes del sitio

### Imagen de fondo

- **Ubicación:** `globosondatecnica2/frontend/assets/backgrounds/fototierra.jpg`
- **Tamaño recomendado:** 1920×1080 px o superior, en formato JPG.
- **Para reemplazar:** colocar el nuevo archivo con el mismo nombre y la misma ruta, o actualizar la referencia en `globosondatecnica2/frontend/css/base/background.css`.

### Imágenes de la galería

- **Ubicación:** `globosondatecnica2/frontend/assets/images/galeria/`
- **Formatos aceptados:** JPG, PNG, WebP, SVG.
- **Tamaño recomendado:** Máximo 1920 px de ancho. Imágenes muy grandes ralentizan la carga.
- **Para reemplazar:** colocar el nuevo archivo y actualizar la `ruta` en `globosondatecnica2/frontend/data/galeria.json`.

---

## 12. Organización de carpetas

| Carpeta       | Propósito                                                   |
|---------------|-------------------------------------------------------------|
| `globosondatecnica2/frontend/pages/`      | Archivos HTML de cada página del sitio                      |
| `globosondatecnica2/frontend/css/base/`   | Estilos fundamentales (reset, fondo espacial, tipografía)   |
| `globosondatecnica2/frontend/css/components/` | Estilos de componentes reutilizables (navbar, footer, secciones) |
| `globosondatecnica2/frontend/css/pages/`  | Estilos específicos de cada página                          |
| `globosondatecnica2/frontend/js/utils/`   | Constantes y funciones auxiliares compartidas               |
| `globosondatecnica2/frontend/js/components/` | Scripts que generan componentes reutilizables (navbar, footer) |
| `globosondatecnica2/frontend/js/pages/`   | Lógica específica de cada página                            |
| `globosondatecnica2/frontend/assets/`     | Recursos estáticos (imágenes, fondos, iconos, fuentes)      |
| `globosondatecnica2/frontend/data/`       | Archivos JSON editables (config, equipo, documentos, galería, patrocinadores, proyecto, estado, estadísticas) |
| `documentos/` | PDFs descargables (informes, carpetas de campo)             |

---

## 13. Buenas prácticas

- **No escribir datos directamente en el HTML** si existe un archivo JSON para ello. Usar siempre `globosondatecnica2/frontend/data/`.
- **Mantener separados estilos, lógica y contenido:** CSS solo para estilos, JS solo para lógica, JSON para datos, HTML para estructura.
- **Reutilizar componentes existentes:** navbar, footer, `page-section` y `subtitle` están disponibles globalmente.
- **No duplicar código:** si una función o estilo se repite, moverlo a `globosondatecnica2/frontend/js/utils/` o `globosondatecnica2/frontend/css/components/`.
- **Usar nombres descriptivos** para archivos y carpetas (ej: `galeria.js`, no `script3.js`).
- **Mantener la organización actual:** no mezclar archivos de distintas categorías en la misma carpeta.
- **Rutas relativas desde `globosondatecnica2/frontend/pages/`:** las páginas dentro de `globosondatecnica2/frontend/pages/` deben usar `../` para referirse a CSS, JS, datos y assets.
- **Archivos JSON:** mantener el formato válido. Después de la última entrada no debe haber coma. Usar un validador JSON si es necesario.
- **Probar los cambios:** después de modificar un JSON, recargar la página para verificar que los datos se muestren correctamente.
- **No modificar el endpoint de telemetría** (`globosondatecnica2/frontend/api/datos.py` en Vercel o `globosondatecnica2/backend/app.py` con Flask local) a menos que sea estrictamente necesario. El frontend está diseñado para funcionar con la API existente.
- **Mantener la documentación actualizada:** después de cada modificación, verificar que `CHANGELOG.md`, `GUIA_MANTENIMIENTO.md` y `TODO.md` reflejen el estado actual del proyecto.

---

## 14. Modificar la página Proyecto

La página Proyecto (`globosondatecnica2/frontend/pages/proyecto.html`) es la presentación institucional de STELLA. Todo su contenido se carga dinámicamente desde un único archivo JSON.

### Archivo a modificar

`globosondatecnica2/frontend/data/proyecto.json`

### Estructura del JSON

```json
{
    "sections": [
        {
            "id": "identificador-unico",
            "titulo": "Título de la sección",
            "tipo": "texto|pasos|cards|areas",
            "contenido": ["párrafo 1", "párrafo 2"],
            "intro": "Introducción opcional (solo tipo areas)",
            "pasos": [
                { "titulo": "Paso 1", "descripcion": "..." }
            ],
            "items": [
                { "nombre": "...", "descripcion": "...", "icono": "🔧" }
            ],
            "areas": [
                { "nombre": "...", "descripcion": "...", "icono": "👥" }
            ]
        }
    ],
    "infografia": {
        "titulo": "Infografía de la misión",
        "pasos": [
            { "icono": "🚀", "nombre": "Despegue" }
        ]
    }
}
```

### Tipos de sección

| Tipo     | Campos requeridos                      | Qué genera                                    |
|----------|----------------------------------------|-----------------------------------------------|
| `texto`  | `id`, `titulo`, `contenido[]`          | Párrafos de texto                             |
| `pasos`  | `id`, `titulo`, `pasos[]`              | Lista numerada con tarjetas con borde izquierdo |
| `cards`  | `id`, `titulo`, `items[]`              | Grid de tarjetas con icono opcional           |
| `areas`  | `id`, `titulo`, `areas[]`             | Diagrama vertical de flujo de trabajo         |

### Pasos para modificar una sección existente

1. Abrir `globosondatecnica2/frontend/data/proyecto.json`.
2. Localizar la sección por su `id` (ej: `"que-es"`, `"funcionamiento"`, `"tecnologias"`).
3. Modificar los campos necesarios.
4. Guardar el archivo.
5. Recargar la página Proyecto para ver los cambios.

### Pasos para agregar una nueva sección

1. Agregar un nuevo objeto al array `sections` en `globosondatecnica2/frontend/data/proyecto.json`.
2. Asignar un `id` único (en minúsculas, sin espacios, con guiones).
3. Elegir el `tipo` según el contenido deseado.
4. Completar los campos según el tipo.
5. Guardar el archivo. La página mostrará automáticamente la nueva sección.

### Pasos para modificar la infografía

1. Localizar la clave `"infografia"` en `globosondatecnica2/frontend/data/proyecto.json`.
2. Modificar `"titulo"` o los pasos dentro de `"pasos"`.
3. Cada paso requiere un `"icono"` (emoji) y un `"nombre"`.
4. Guardar el archivo.

### Notas

- No es necesario modificar HTML ni JavaScript para cambiar el contenido.
- Las secciones se renderizan en el orden en que aparecen en el array `sections`.
- En las secciones tipo `areas`, el campo `intro` (opcional) reemplaza el texto introductorio fijo. Cada área puede llevar un `icono` (emoji).
- Los iconos emoji (`icono`) se convierten automáticamente a iconos SVG mediante `globosondatecnica2/frontend/js/utils/iconos.js`. Si un emoji no está en el mapa de iconos, se muestra el emoji original.
- Las animaciones de entrada (fade-in + slide-up) se aplican automáticamente a cada sección.
- La infografía se construye con HTML+CSS; no requiere imágenes externas.
- Si ocurre un error de carga, se muestra un mensaje de error sin romper el sitio.

---

## 15. Modificar secciones de la página Inicio

La página de inicio (`index.html`) es una landing page que carga datos desde múltiples archivos JSON. Cada sección se renderiza dinámicamente desde su fuente de datos correspondiente.

### Secciones y sus fuentes de datos

| Sección en la página | Archivo JSON | Archivo JS (función) | Contenido |
|---|---|---|---|
| Hero principal | `globosondatecnica2/frontend/data/config.json` | `renderizarHero()` | Título, descripción y badge de lanzamiento (countdown) |
| Estado del proyecto | `globosondatecnica2/frontend/data/estado.json` | `renderizarEstado()` | Indicador con color, texto, barra de progreso y etapas |
| STELLA en números | `globosondatecnica2/frontend/data/estadisticas.json` | `renderizarStats()` | Tarjetas con icono, valor animado, título y descripción |
| ¿Qué es STELLA? (resumen) | `globosondatecnica2/frontend/data/proyecto.json` (campo `home_resumen`) | `renderizarResumen()` | Párrafos de texto con botón "Conocer más" |
| Áreas del proyecto | `globosondatecnica2/frontend/data/proyecto.json` (sección `como-trabajamos`) | `renderizarAreas()` | Diagrama vertical con iconos y flechas |
| Tecnologías utilizadas | `globosondatecnica2/frontend/data/proyecto.json` (sección `tecnologias`) | `renderizarTecnologias()` | Primeras 6 tarjetas + enlace a página Proyecto |
| Últimos documentos | `globosondatecnica2/frontend/data/documentos.json` | `renderizarDocumentos()` | Últimos 3 documentos con botón Ver |
| Galería destacada | `globosondatecnica2/frontend/data/galeria.json` | `renderizarGaleria()` | Primeras 4 imágenes con overlay |
| Patrocinadores destacados | `globosondatecnica2/frontend/data/patrocinadores.json` | `renderizarPatrocinadores()` | Primeros 4 logos |
| Novedades | `globosondatecnica2/frontend/data/noticias.json` | `renderizarNoticias()` | Últimas 3 novedades + enlace a la página de noticias |
| Entrevistas | `globosondatecnica2/frontend/data/entrevistas.json` | `renderizarEntrevistas()` | Primeras 4 entrevistas con portada + enlace a la página de entrevistas |
| Contacto rápido | `globosondatecnica2/frontend/data/config.json` | `renderizarContacto()` | Escuela, ubicación y email desde config.json |

### Modificar el hero principal

1. Abrir `globosondatecnica2/frontend/data/config.json`.
2. Modificar `hero_titulo` (título principal) y/o `hero_descripcion` (texto secundario).
3. Guardar el archivo. La página de inicio se actualiza automáticamente.

### Modificar la sección de contacto rápido

1. Abrir `globosondatecnica2/frontend/data/config.json`.
2. Modificar `escuela`, `ciudad`, `provincia`, `pais` y/o `correo`.
3. Guardar el archivo. La página de inicio se actualiza automáticamente.

### Envío del formulario de contacto (Google Apps Script)

El formulario "Envianos un mensaje" envía los mensajes directo al correo del proyecto mediante una Web App de Google Apps Script que usa la cuenta Gmail oficial (`santatrinidad2026@gmail.com`).

1. Abrir `globosondatecnica2/email_contacto_web.gs` (raíz del proyecto) y seguir los pasos de instalación que documenta en su cabecera (script.google.com → Nuevo proyecto → pegar el código → Implementar como "Aplicación web" → Ejecutar como "Yo" → acceso "Cualquier persona").
2. Copiar la URL de implementación (termina en `/exec`).
3. Pegarla en `globosondatecnica2/frontend/data/config.json` → `contacto_endpoint`.
4. Desplegar el sitio en Vercel.

Si `contacto_endpoint` está vacío, el formulario usa `mailto` como respaldo.

### Modificar el estado del proyecto

1. Abrir `globosondatecnica2/frontend/data/estado.json`.
2. Modificar los campos:
   - `"estado"`: texto breve del estado actual.
   - `"color"`: emoji indicador (🟢 verde, 🟡 amarillo, 🔴 rojo, etc.).
   - `"descripcion"`: texto explicativo del estado.
   - `"progreso"`: porcentaje de avance (número de 0 a 100) para la barra de progreso.
   - `"etapas"`: array con las etapas de la misión. Cada una tiene `"nombre"` y `"completa"` (`true`/`false`).
3. Guardar el archivo. La página se actualiza automáticamente.

### Modificar el badge de lanzamiento (hero)

1. Abrir `globosondatecnica2/frontend/data/config.json`.
2. Modificar `fecha_lanzamiento` (formato texto, ej: "Octubre de 2026"). El badge muestra los días restantes calculados al primer día de ese mes y año.
3. Si la fecha ya pasó, el badge se oculta automáticamente.

### Modificar el resumen de STELLA

1. Abrir `globosondatecnica2/frontend/data/proyecto.json`.
2. Localizar el campo `"home_resumen"` (al inicio del archivo).
3. Es un array de strings. Cada string es un párrafo.
4. Guardar el archivo.

### Modificar áreas o tecnologías mostradas en Inicio

Estas secciones reutilizan los datos de `globosondatecnica2/frontend/data/proyecto.json`. Para modificarlas, ver la [sección 14](#14-modificar-la-página-proyecto).

### Modificar documentos destacados

1. Agregar o modificar entradas en `globosondatecnica2/frontend/data/documentos.json` (ver [sección 4](#4-agregar-un-documento)).
2. La página de inicio muestra automáticamente los últimos 3 documentos del array.

### Modificar galería destacada

1. Agregar o modificar entradas en `globosondatecnica2/frontend/data/galeria.json` (ver [sección 5](#5-agregar-imágenes-a-la-galería)).
2. La página de inicio muestra automáticamente las primeras 4 imágenes del array.

### Modificar patrocinadores destacados

1. Agregar o modificar entradas en `globosondatecnica2/frontend/data/patrocinadores.json` (ver [sección 8](#8-agregar-un-patrocinador)).
2. La página de inicio muestra automáticamente los primeros 4 patrocinadores del array.

### Notas

- Para cambiar el orden de las secciones en la página de inicio, modificar `index.html`.
- Para cambiar el diseño o estilo de una sección, modificar `globosondatecnica2/frontend/css/pages/inicio.css`.
- Las animaciones de entrada se aplican automáticamente mediante Intersection Observer en todas las secciones con clase `animar-entrada`.
- No es necesario modificar JavaScript para cambiar el contenido de ninguna sección.

---

## 16. Modificar las novedades (Noticias)

### Archivo a modificar

`globosondatecnica2/frontend/data/noticias.json`

### Estructura del JSON (v4.4.2)

```json
[
    {
        "id": 1,
        "titulo": "Título de la novedad",
        "fecha": "12/08/2026",
        "categoria": "Proyecto",
        "descripcion": "Texto breve de la novedad.",
        "link": "https://www.instagram.com/reel/XXXXXXX/"
    }
]
```

### Campos

| Campo | Obligatorio | Descripción |
|---|---|---|
| `id` | Sí | Número entero único correlativo |
| `titulo` | Sí | Título visible de la novedad |
| `fecha` | No | Fecha en formato DD/MM/AAAA |
| `categoria` | No | Etiqueta de la novedad (ej: Proyecto, Eventos, Tecnología, Prensa) |
| `descripcion` | Sí | Texto breve que se muestra en la tarjeta |
| `link` | No | Si está presente, la tarjeta se vuelve clickeable y abre el link en una pestaña nueva (se usa para las entrevistas de Instagram) |

### Pasos

1. Abrir `globosondatecnica2/frontend/data/noticias.json`.
2. Agregar un nuevo objeto al array con un `id` correlativo.
3. Guardar el archivo.
4. La página de noticias (`globosondatecnica2/frontend/pages/noticias.html`) y la sección "Novedades" del inicio mostrarán la novedad automáticamente (el inicio muestra las 3 últimas).

### Entrevistas en Noticias

Las 4 entrevistas de prensa también están cargadas como novedades, con categoría `Prensa` y un `link` al reel de Instagram:

| Fecha | Titular | Link |
|---|---|---|
| 11/09/2026 | El equipo STELLA en En acción Olavarría | `instagram.com/reel/DdJqF6vxeXV/` |
| 22/08/2026 | Entrevista en Canal Uno | `instagram.com/reel/DcV-e2mhS6r/` |
| 16/08/2026 | STELLA en la Central de Noticias de Olavarría | `instagram.com/reel/DcHg4mloV1G/` |
| 16/07/2026 | El equipo STELLA en Vamos con vos | `instagram.com/reel/Da3RVYTRWZg/` |

> El orden del array es el orden en que se muestran. Está ordenado de la novedad más reciente a la más antigua.

---

## 17. SEO y compartir en redes

- **`og:image`:** se usa `globosondatecnica2/frontend/assets/images/og-portada.png` (1200×630). Para regenerarla, editar el script de PowerShell de referencia.
- **`canonical` y `og:url`:** usan el dominio `https://stellaproject.com.ar`. Si el dominio real cambia, actualizar los `<link rel="canonical">` y `<meta property="og:url">` de todos los HTML.
- **`robots.txt`:** excluye `globosondatecnica2/frontend/pages/telemetria.html` (página oculta) y la carpeta `globosondatecnica2/frontend/data/`.
- **`sitemap.xml`:** lista las páginas indexables. Actualizarlo si se agregan páginas nuevas.
- **Versionado de archivos:** al modificar JS/CSS, incrementar el `?v=` en las referencias de los HTML para forzar la actualización de caché (actualmente `?v=19`).

---

## 18. Desplegar en Vercel

El sitio se despliega en Vercel. Vercel sirve el contenido estático de `frontend/` y ejecuta la telemetría mediante una serverless function Python (`globosondatecnica2/frontend/api/datos.py`), sin necesidad de Flask.

### Requisitos

- El directorio raíz (Root Directory) debe ser **`frontend`** (desde la raíz del repositorio).
- El archivo `frontend/vercel.json` contiene los headers de caché del sitio.
- La función `globosondatecnica2/frontend/api/datos.py` expone el endpoint `/api/datos` (misma respuesta JSON que el backend Flask local).

### Desplegar desde la consola de Vercel

1. Importar el repositorio en https://vercel.com (New Project).
2. Configurar **Root Directory → `globosondatecnica2/frontend`**.
3. Framework Preset: **Other** (es un sitio estático).
4. Deploy. La telemetría queda disponible en `https://<proyecto>.vercel.app/api/datos`.

### Desplegar con la CLI de Vercel

```bash
cd frontend
npx vercel --prod
```

### Verificar

- Inicio y subpáginas cargan correctamente.
- La página de telemetría (`globosondatecnica2/frontend/pages/telemetria.html`) muestra valores actualizados cada 2 segundos (usa `/api/datos`).
- El formulario de contacto sigue usando `contacto_endpoint` de `config.json` (Google Apps Script), independiente del hosting.

### Notas

- `404.html` es respetado por Vercel como página de error personalizada.
- Los datos `globosondatecnica2/frontend/data/**` y los HTML se sirven con `no-cache`.
- Para pruebas locales con Flask, cambiar `api_url` en `globosondatecnica2/frontend/data/config.json` y `API_URL` en `globosondatecnica2/frontend/js/utils/constants.js` a `http://127.0.0.1:5000/datos`.

---

## 19. Agregar una entrevista (Prensa)

Las entrevistas se muestran en la página `globosondatecnica2/frontend/pages/entrevistas.html` (con portada propia) y en un bloque de la página de inicio. Cada tarjeta es un enlace que abre la entrevista original en una pestaña nueva.

### Archivo a modificar

`globosondatecnica2/frontend/data/entrevistas.json`

### Estructura del JSON (v4.4.1)

```json
[
    {
        "id": 1,
        "titulo": "Título de la entrevista",
        "medio": "Instagram",
        "descripcion": "Texto breve que se muestra en la tarjeta.",
        "portada": "assets/images/entrevistas/Entrevista - Canal uno.png",
        "link": "https://www.instagram.com/reel/DcV-e2mhS6r/",
        "destacado": false
    }
]
```

### Campos

| Campo | Obligatorio | Descripción |
|---|---|---|
| `id` | Sí | Número entero único correlativo |
| `titulo` | Sí | Título visible de la entrevista (ej: el nombre del programa o medio) |
| `medio` | No | Etiqueta del medio (ej: Instagram, Radio, TV). Si se omite, no se muestra |
| `fecha` | No | Fecha en formato `AAAA-MM-DD`. Si se omite, no se muestra |
| `descripcion` | No | Texto breve que se muestra en la tarjeta |
| `portada` | No | Ruta de la imagen de portada (relativa a `globosondatecnica2/frontend/`) |
| `link` | Sí | URL de la entrevista (se abre en pestaña nueva) |
| `destacado` | No | `true` muestra la etiqueta "Destacada" |

### Pasos

1. Abrir `globosondatecnica2/frontend/data/entrevistas.json`.
2. Agregar un nuevo objeto al array con un `id` correlativo.
3. Copiar el link del reel de Instagram y pegarlo en `"link"`.
4. Guardar el archivo. La página de entrevistas y el bloque del inicio se actualizan automáticamente (el inicio muestra las primeras 4).

### Portadas

- Las portadas están en `globosondatecnica2/frontend/assets/images/entrevistas/` (archivos `.png`).
- Para usar una foto nueva, guardarla en esa carpeta y actualizar el campo `"portada"`.
- El nombre del archivo puede llevar espacios; se referencia tal cual en el JSON.
- Si el campo `"portada"` se omite o el archivo no existe, la tarjeta se muestra con un fondo degradado sin imagen.

### Entrevistas cargadas actualmente

| id | Título | Fecha | Link |
|---|---|---|---|
| 1 | Vamos con vos | 16/07/2026 | `instagram.com/reel/Da3RVYTRWZg/` |
| 2 | En acción Olavarría | 11/09/2026 | `instagram.com/reel/DdJqF6vxeXV/` |
| 3 | Central de noticias Olavarría | 16/08/2026 | `instagram.com/reel/DcHg4mloV1G/` |
| 4 | Canal Uno | 22/08/2026 | `instagram.com/reel/DcV-e2mhS6r/` |

> El campo `fecha` usa el formato `AAAA-MM-DD` y se muestra en la tarjeta como `DD/MM/AAAA`. Las fechas de publicación de los reels no se pueden leer desde Instagram sin iniciar sesión: se cargaron a mano.

### Notas

- Los enlaces se abren con `target="_blank"` y `rel="noopener"`.
- La portada de la página (con el fondo de la Tierra y el enlace a Instagram) es fija; el contador de entrevistas se calcula automáticamente al cargar los datos.
- No es necesario tocar HTML ni JavaScript para agregar o quitar entrevistas.

