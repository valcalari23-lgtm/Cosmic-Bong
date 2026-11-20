# Cosmic Boing

Versión para computadora del videojuego Cosmic Boing (Valeria Calvo Arias, 2023, original en Java con Processing y el celular como control). Se juega en el navegador con mouse y teclado.

## Jugar en línea

https://valcalari23-lgtm.github.io/Cosmic-Bong/

Código: https://github.com/valcalari23-lgtm/Cosmic-Bong

## Probarlo en tu computadora

Doble clic en `index.html`. Se abre en tu navegador. No hay que instalar nada.

El juego completo está construido (etapas 0 a 10 de `docs/02-plan-por-etapas.md`): la misión de cuatro niveles con jefe, Game Over y victoria; un modo extra "Lluvia de meteoritos" (sin tiempo, tres vidas, oleadas cada vez más rápidas y récord); instrucciones y controles; música y efectos; en español e inglés y jugable con mouse, solo teclado o inclinando el celular. La tecla M o el botón del altavoz silencian el sonido. La música y los efectos son de dominio público (CC0): FreePD y la colección retro de Juhani Junkala, ver `assets/audio/CREDITOS.md`.

## Empezar con Claude Code

1. Abre esta carpeta en Claude Code.
2. Pega el mensaje que está en `docs/04-primer-prompt.md`.
3. Responde sus preguntas y prueba cada etapa antes de pasar a la siguiente.

## Lo que ya está resuelto

- **Código original:** tus capturas están transcritas en `legacy-java/codigo-transcrito.md`. De ahí salieron los tiempos de aparición, el cronómetro de 60 segundos y el radio de impacto.
- **Tipografía:** Poppins para todo.

Lo que las capturas no muestran (meta de puntos por nivel, velocidad, jefe) lo defines tú mientras pruebas. Claude Code te lo va a preguntar.

## Qué hay en cada carpeta

```
cosmic-boing/
├── index.html              abre el juego
├── CLAUDE.md               reglas que Claude Code lee solo al abrir la carpeta
├── README.md               este archivo
├── css/
│   └── styles.css          colores, tipografías y pantallas
├── src/
│   ├── config.js           todos los números del juego (verificados y provisionales)
│   ├── strings.js          textos en español e inglés
│   ├── assets.js           lista y carga de imágenes
│   ├── stage.js            tamaño de pantalla, fondo espacial, animación
│   ├── screens.js          cambio de pantalla e idioma
│   ├── audio.js            música y efectos generados con Web Audio
│   ├── input.js            mouse, teclado e inclinación del celular
│   ├── entities.js         meteoritos, tanques, estrellas, jefe, explosiones
│   ├── hud.js              barra cósmica, puntos, reloj, pausa
│   ├── levels.js           metas y velocidad por nivel
│   ├── game.js             estados y reglas del juego
│   └── main.js             arranque
├── assets/
│   ├── sprites/            héroe, meteorito, tanque, estrella, jefe, explosión
│   ├── ui/                 logo, mira, panel, iconos
│   ├── backgrounds/        paisaje final y vidrio roto de Game Over
│   ├── fonts/              Poppins
│   └── audio/              música y efectos CC0 (créditos en assets/audio/CREDITOS.md)
├── docs/
│   ├── 01-diseno-del-juego.md     reglas con su origen y preguntas abiertas
│   ├── 02-plan-por-etapas.md      qué se construye en cada etapa y cómo probarla
│   ├── 03-assets.md               inventario con los IDs de Figma y lo que falta
│   ├── 04-primer-prompt.md        el mensaje para arrancar con Claude Code
│   ├── 05-notas-para-portafolio.md
│   └── reference/                 capturas de tus pantallas originales
└── legacy-java/            capturas del código de 2023 y su transcripción
```

## Diseño original

Figma: https://www.figma.com/design/yS5VJKlLr0XI9wNBUopeS3/behance-page?node-id=1-33846
