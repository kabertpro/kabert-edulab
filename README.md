# Kabert EduLab — Portal web

Sitio oficial (PWA) que centraliza las aplicaciones educativas de Kabert
Studio. HTML5 + CSS3 + JavaScript vanilla (ES6), sin frameworks ni
dependencias de build — funciona publicando los archivos tal cual.

## Añadir, editar o quitar una aplicación

Todo el catálogo vive en `data/apps.json`. No es necesario tocar el HTML:

```json
{
  "id": "identificador-unico",
  "code": "ABC-07",
  "name": "Nombre de la app",
  "tagline": "Frase corta",
  "description": "Descripción de 1-2 líneas.",
  "category": "Lectoescritura",
  "version": "1.0.0",
  "url": "https://tu-app.vercel.app/",
  "thumbnail": "assets/img/apps/tu-app.jpg",
  "color": "#0F6E64"
}
```

Añade un objeto al arreglo y guarda — la tarjeta aparecerá automáticamente,
incluida en los filtros por categoría.

## Publicar novedades

Edita `data/news.json` (está vacío por defecto):

```json
[
  {
    "date": "Julio 2026",
    "title": "Título de la novedad",
    "description": "Descripción breve."
  }
]
```

## Imágenes reales

Ver `assets/img/README.md` para la lista de archivos esperados (foto del
fundador y miniaturas de cada app). Mientras no existan, el sitio muestra
automáticamente un reemplazo elegante en CSS — nada se rompe.

## Desplegar en GitHub Pages

1. Sube esta carpeta como raíz de un repositorio (o de la rama `gh-pages`).
2. En el repositorio: **Settings → Pages → Source** → selecciona la rama y
   la carpeta raíz (`/`).
3. Espera unos minutos; el sitio quedará disponible en
   `https://<usuario>.github.io/<repositorio>/`.

Si el repositorio no es de la forma `usuario.github.io` (sitio raíz), la
app quedará en una subruta. En ese caso no se requiere ningún cambio: todas
las rutas del proyecto (`css/`, `js/`, `data/`, `manifest.json`,
`service-worker.js`) son relativas.

## Desplegar en Vercel

1. Importa el repositorio en Vercel.
2. Framework preset: **Other** (sitio estático).
3. Build command: (ninguno). Output directory: `.` (raíz).
4. Deploy.

## Notas técnicas

- El Service Worker (`service-worker.js`) cachea el app shell y usa
  estrategia *network-first* para los archivos `.json`, así las novedades
  y el catálogo se actualizan sin esperar a una nueva versión del caché.
- Si cambias archivos del app shell (CSS/JS), sube la constante
  `CACHE_VERSION` en `service-worker.js` para forzar la actualización de
  caché en los navegadores de los usuarios.
- El tema claro/oscuro se guarda en `localStorage` y respeta
  `prefers-color-scheme` en la primera visita.
- Todas las animaciones respetan `prefers-reduced-motion`.
