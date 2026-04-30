# Media de productos

Guarda aqui las fotos y videos reales de tus gorras.

## Estructura recomendada

- `public/productos/imagenes/` -> fotos de cada producto
- `public/productos/videos/` -> video corto de cada producto

## Formato recomendado

- Usa nombres en minusculas
- Sin espacios (usa guion medio `-`)
- Incluye modelo/codigo en el nombre
- Formato sugerido: `.webp` (tambien funciona `.jpg` o `.png`)
- Para video usa `.mp4` (H.264)

## Ejemplos de nombres

- `imagenes/s06-scream-edition-1.webp`
- `imagenes/s06-scream-edition-2.webp`
- `videos/s06-scream-edition.mp4`

## Como usarlo en el codigo

En `data/productos.ts`, usa estas propiedades:

- `imagen`: imagen principal para cards/home
- `imagenes`: galeria para detalle del producto
- `video`: video del detalle

Ejemplo de rutas:

- `/productos/imagenes/s06-scream-edition-1.webp`
- `/productos/imagenes/s06-scream-edition-2.webp`
- `/productos/videos/s06-scream-edition.mp4`

Todo lo que esta en `public/` se consume desde `/` en Next.js.
