# Audio

Música y efectos de dominio público (CC0), incorporados el 20 de noviembre de 2026. Quién hizo cada
pieza, de dónde salió y su huella SHA-256 están en `CREDITOS.md`.

- `music-title.mp3`: inicio, instrucciones y controles (en bucle)
- `music-play.mp3`: niveles 1 a 3 (en bucle)
- `music-boss.mp3`: nivel 4, el jefe (en bucle)
- `music-win.mp3`: victoria (una vez)
- `music-over.mp3`: Game Over (una vez)
- `sfx/`: un efecto por evento (disparo, acierto, tanque, estrella, jefe, nivel, alarma, pausa, botones)

Para cambiar una pieza basta con reemplazar el archivo por otro con el mismo nombre (o cambiar la ruta
en `src/config.js`, bloque `audio`). Usa solo audio propio o con licencia que permita publicarlo, y
anótalo en `CREDITOS.md`. Si un archivo falta, el juego genera un sonido sintetizado en su lugar.
