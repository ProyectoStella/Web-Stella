# STELLA — Sitio web del proyecto

Sitio institucional del proyecto educativo de globo estratosférico **STELLA** de la **EEST N°2 "Luciano Fortabat"** de Olavarría, Buenos Aires.

**"Más Allá del Cielo Comienza Nuestra Misión"**

---

## Índice

1. [Stack tecnológico](#1-stack-tecnológico)
2. [Estructura del repositorio](#2-estructura-del-repositorio)
3. [Cómo iniciarlo localmente](#3-cómo-iniciarlo-localmente)
4. [Publicar en Vercel](#4-publicar-en-vercel)
5. [Dónde editar el contenido](#5-dónde-editar-el-contenido)
6. [Documentación del proyecto](#6-documentación-del-proyecto)

---

## 1. Stack tecnológico

| Parte | Tecnología |
|---|---|
| Frontend | HTML5, CSS3 y JavaScript vanilla (sin framework, sin build) |
| Datos del sitio | Archivos JSON estáticos en `globosondatecnica2/frontend/data/` |
| Gráficos | Chart.js (CDN) |
| Telemetría en producción | Serverless function Python (`globosondatecnica2/frontend/api/datos.py`) en Vercel |
| Telemetría en desarrollo | Backend Flask (`globosondatecnica2/backend/app.py`) |
| Formulario de contacto | Google Apps Script (`globosondatecnica2/email_contacto_web.gs`) |
| Hosting | Vercel |

El frontend **no requiere build ni `npm install`**. Es HTML/CSS/JS servible tal cual.

---

## 2. Estructura del repositorio

El proyecto vive dentro de la carpeta `globosondatecnica2/`, que es la **carpeta raíz en Vercel**:

```
.
└── globosondatecnica2/
    ├── README.md                   # Este archivo
    ├── CHANGELOG.md                # Historial de versiones
    ├── GUIA_MANTENIMIENTO.md       # Guía para editar contenido sin tocar código
    ├── TODO.md                     # Lista de tareas pendientes
    ├── email_contacto_web.gs       # Google Apps Script del formulario de contacto
    │
    ├── backend/
    │   └── app.py                  # API Flask para desarrollo local (/datos)
    │
    └── frontend/                   # EL SITIO (carpeta raíz en Vercel)
        ├── index.html              # Landing page
        ├── 404.html                # Página de error
        ├── vercel.json             # Headers de caché y config de despliegue
        ├── robots.txt
        ├── sitemap.xml
        ├── api/
        │   └── datos.py            # Serverless function de telemetría (/api/datos)
        ├── pages/                  # Páginas internas
        │   ├── proyecto.html
        │   ├── telemetria.html
        │   ├── documentacion.html
        │   ├── galeria.html
        │   ├── noticias.html
        │   ├── entrevistas.html
        │   ├── equipo.html
        │   ├── patrocinadores.html
        │   └── contacto.html
        ├── css/
        │   ├── base/               # reset, fondo espacial
        │   ├── components/         # navbar, footer, breadcrumb, skeleton
        │   └── pages/              # estilos por página
        ├── js/
        │   ├── utils/              # constants.js (API URL, nav), helpers.js, iconos.js
        │   ├── components/         # navbar.js, footer.js, breadcrumb.js
        │   └── pages/              # un JS por página
        ├── assets/                 # backgrounds, icons, images, logos, favicon
        ├── data/                   # JSON editables (contenido del sitio)
        │   ├── config.json
        │   ├── estado.json
        │   ├── estadisticas.json
        │   ├── proyecto.json
        │   ├── equipo.json
        │   ├── patrocinadores.json
        │   ├── galeria.json
        │   ├── documentos.json
        │   ├── noticias.json
        │   └── entrevistas.json
        └── documentos/             # Archivos descargables (docx, pdf)
```

---

## 3. Cómo iniciarlo localmente

El sitio tiene **dos partes** que se levantan por separado:

- **Frontend** — estático, se sirve con cualquier servidor HTTP.
- **Telemetría** — en producción corre como serverless function; en local podés usar Flask o la CLI de Vercel.

### 3.1 Requisitos

- **Python 3.8+** (probado en 3.14)
- Un navegador moderno
- Opcional: Node.js, si preferís `npx serve` o `npx vercel dev`

### 3.2 Instalar dependencias (solo la primera vez)

```bash
python -m pip install flask
```

### 3.3 Levantar el frontend

En la carpeta `globosondatecnica2/frontend/`:

```bash
python -m http.server 8000
```

Después abrí <http://localhost:8000>.

Alternativa con Node.js:

```bash
npx serve .
```

### 3.4 Levantar la telemetría

**Opción A — con la CLI de Vercel (recomendada).** Levanta el sitio **y** la serverless function, con la misma URL que en producción:

```bash
npm i -g vercel
cd globosondatecnica2/frontend
vercel dev
```

La telemetría queda en <http://localhost:3000/api/datos>.

**Opción B — con Flask.** En la carpeta `globosondatecnica2/backend/`:

```bash
python app.py
```

Queda escuchando en <http://127.0.0.1:5000>. Verificalo con:

```bash
curl http://127.0.0.1:5000/datos
```

Respuesta esperada:

```json
{ "temperatura": -0.02, "presion": 919.28 }
```

Los valores son **simulados y aleatorios** (temperatura de -50 a 30 °C, presión de 100 a 1000 hPa).

> **Importante:** con Flask local hay que apuntar el frontend a esa URL. Editá `globosondatecnica2/frontend/data/config.json` → `"api_url"` y `globosondatecnica2/frontend/js/utils/constants.js` → `API_URL`, y poné `http://127.0.0.1:5000/datos` en ambos. Recordá devolverlos a `/api/datos` antes de commitear.

### 3.5 Abrir el sitio

| URL | Qué es |
|---|---|
| <http://localhost:8000> | Landing page |
| <http://localhost:8000/pages/proyecto.html> | El proyecto |
| <http://localhost:8000/pages/noticias.html> | Noticias |
| <http://localhost:8000/pages/documentacion.html> | Documentación |
| <http://localhost:8000/pages/entrevistas.html> | Entrevistas |
| <http://localhost:8000/pages/telemetria.html> | Telemetría (necesita la API) |

### 3.6 Troubleshooting

**La página queda vacía / dice "Cargando..."**
El sitio lee los JSON con `fetch()`. Nunca abras `index.html` con doble clic: bajo `file://` los `fetch` fallan por CORS. Siempre usá un servidor HTTP.

**La telemetría muestra "Error de conexión"**
Levantá la API (Flask en el 5000 o `vercel dev`) y verificá que `api_url` en `config.json` y `API_URL` en `constants.js` apunten al endpoint correcto.

**Los cambios en CSS/JS no se ven**
El navegador cachea los estáticos. Recargá con `Ctrl+F5` (forzar recarga). Los scripts ya incluyen un parámetro de versión (`?v=19`); si cambiás la versión en el HTML, se invalida la caché.

**Puerto 8000 u 5000 ocupado**
Cambialo: `python -m http.server 8080` acepta el puerto como argumento. Para Flask, editá `app.run(...)` en `globosondatecnica2/backend/app.py` (lee `PORT` del entorno) y actualizá `api_url`.

### 3.7 Detener los servidores

En la terminal donde corre cada uno: `Ctrl+C`.

---

## 4. Publicar en Vercel

El sitio es 100 % estático (más una serverless function), así que no hay build step.

### 4.1 Configuración en el panel

| Setting | Valor |
|---|---|
| **Root Directory** | `globosondatecnica2/frontend` |
| **Framework Preset** | Other |
| **Build Command** | *(dejar vacío)* |
| **Output Directory** | *(dejar vacío)* |

> Si el Root Directory no apunta a `globosondatecnica2/frontend`, Vercel no encuentra `index.html` y muestra 404 en todas las rutas.

### 4.2 Deploy desde la CLI

```bash
npm i -g vercel
cd globosondatecnica2/frontend
vercel          # preview
vercel --prod   # producción
```

El primer `vercel` te pregunta por el directorio del proyecto: elegí `globosondatecnica2/frontend` como **Root Directory** y respondé `N` a todas las preguntas de build (dejá el build en blanco).

### 4.3 Deploy desde Git

Conectá el repo en Vercel y configurá el Root Directory como `globosondatecnica2/frontend`. Cada push a `main` dispara un deploy automático.

### 4.4 Caché

`globosondatecnica2/frontend/vercel.json` define los headers:

| Ruta | Cache-Control |
|---|---|
| `/data/**` y `*.html` | `no-cache, max-age=0, must-revalidate` |
| `*.css` y `*.js` | `public, max-age=86400` |
| `/assets/**` | `public, max-age=604800` |

Si tocás un JSON o un HTML y no se actualiza, es caché del navegador: recargá con `Ctrl+F5`.

### 4.5 Dominio

- `stellaproject.com.ar` — configurá los DNS en el panel de Vercel.
- `www.stellaproject.com.ar` — agregalo como alias y redirigí al principal.

> El dominio real todavía no está confirmado. Si cambia, actualizá `og:url`, `canonical` y `sitemap.xml`.

### 4.6 404

Vercel sirve `globosondatecnica2/frontend/404.html` automáticamente para rutas inexistentes. Ya está personalizado con el estilo del sitio.

---

## 5. Dónde editar el contenido

La mayor parte del contenido del sitio se edita **sin tocar código**, en archivos JSON de `globosondatecnica2/frontend/data/`:

| Archivo | Qué controla |
|---|---|
| `config.json` | Nombre, lema, contacto, redes, hero, API, footer, versión |
| `estado.json` | Estado actual, progreso y etapas de la misión |
| `estadisticas.json` | Números de la sección "STELLA en números" |
| `proyecto.json` | Contenido de la página Proyecto |
| `equipo.json` | Integrantes y áreas de trabajo |
| `patrocinadores.json` | Patrocinadores |
| `galeria.json` | Imágenes de la galería |
| `documentos.json` | Documentos descargables |
| 
oticias.json | Novedades de la página Noticias |
| entrevistas.json | Entrevistas y notas de prensa (página Entrevistas) |

`GUIA_MANTENIMIENTO.md` tiene el detalle paso a paso de cada uno.

---

## 6. Documentación del proyecto

| Archivo | Contenido |
|---|---|
| `README.md` | Este archivo: arranque local y deploy |
| `GUIA_MANTENIMIENTO.md` | Guía completa para editar el sitio sin programar |
| `CHANGELOG.md` | Historial de versiones |
| `TODO.md` | Tareas pendientes del proyecto |
