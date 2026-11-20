# Audio

Carpeta vacía a propósito: el juego no trae archivos de sonido. La música y los efectos se generan en el navegador con Web Audio (`src/audio.js`), así el juego sigue siendo un solo paquete sin descargas ni licencias.

Si quieres usar tus propias pistas, guárdalas aquí con estos nombres (`.mp3`) y el juego las usa en lugar de las generadas:

- `music-title.mp3`: inicio, instrucciones y controles (en bucle)
- `music-play.mp3`: niveles 1 a 3 (en bucle)
- `music-boss.mp3`: nivel 4, el jefe (en bucle)
- `music-win.mp3`: victoria (una vez)
- `music-over.mp3`: Game Over (una vez)

Usa solo audio propio o con licencia que permita publicarlo. Los efectos (disparo, acierto, tanque, estrella…) siguen siendo generados.
