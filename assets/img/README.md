# Imágenes reales pendientes

El sitio funciona completo sin estas imágenes (usa gráficos generados en CSS/SVG
como reemplazo elegante), pero para la versión final se recomienda añadir:

| Archivo esperado                        | Uso                                   | Tamaño sugerido |
|------------------------------------------|----------------------------------------|------------------|
| `assets/img/founder.jpg`                 | Foto del fundador (sección "Acerca de")| 800×800 px, cuadrada |
| `assets/img/apps/vocalaventura.jpg`      | Miniatura de la tarjeta VocalAventura  | 800×600 px |
| `assets/img/apps/contando-numeros.jpg`   | Miniatura de Contando Números          | 800×600 px |
| `assets/img/apps/lasvocales.jpg`         | Miniatura de Las Vocales               | 800×600 px |
| `assets/img/apps/silabin.jpg`            | Miniatura de Silabín                   | 800×600 px |
| `assets/img/apps/silabaventura.jpg`      | Miniatura de SilabAventura             | 800×600 px |
| `assets/img/apps/yupay.jpg`              | Miniatura de Yupay                     | 800×600 px |

Simplemente coloca los archivos con esos nombres exactos y `js/ui.js` los
mostrará automáticamente en lugar del icono/gradiente de respaldo — no hace
falta tocar el HTML ni el JS.

## Sección "Seminarios realizados"

Esta sección no tiene nombres de archivo fijos — se define completa en
`data/seminars.json` (vacío por defecto). Guarda tus fotos en
`assets/img/seminarios/` con el nombre que quieras (ej. `taller-cochabamba-2026.jpg`)
y agrega una entrada así:

```json
{
  "title": "Taller de lectoescritura con SilabAventura",
  "date": "Junio 2026",
  "place": "Cochabamba, Bolivia",
  "thumbnail": "assets/img/seminarios/taller-cochabamba-2026.jpg"
}
```
Tamaño recomendado: 1000×750 px (relación 4:3).
