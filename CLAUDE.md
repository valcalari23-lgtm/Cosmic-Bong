# Cosmic Boing: guía para Claude Code

## Qué es este proyecto

Versión para computadora (navegador de escritorio) del videojuego **Cosmic Boing**, de Valeria Calvo Arias.
El original se hizo en 2023 en **Java con Processing**: corría en la computadora y el celular era el control (se apuntaba girándolo).
Esta versión se juega con **mouse y teclado** y debe abrir con doble clic en `index.html`.

El juego terminado se enlazará desde el portafolio de diseño de Valeria, así que la fidelidad visual al diseño original importa tanto como que funcione.

## Fuentes de verdad, en este orden

1. `legacy-java/codigo-transcrito.md`: fragmentos del código original, transcritos de capturas. Es lo único que se conserva. Manda sobre todo lo demás para reglas y números, pero está incompleto.
2. `docs/01-diseno-del-juego.md`: reglas verificadas en Figma y lista de preguntas abiertas.
3. `docs/reference/`: capturas de las pantallas originales. Son la meta visual.
4. Figma: https://www.figma.com/design/yS5VJKlLr0XI9wNBUopeS3/behance-page?node-id=1-33846 (los node IDs de cada asset están en `docs/03-assets.md`).

## Reglas del proyecto

**No inventar.** Si una regla, número o texto no está en las fuentes de arriba, no lo decidas en silencio.
Los valores sin confirmar viven en `src/config.js` marcados como `PROVISIONAL`. Úsalos para que el juego corra, y pregúntale a Valeria antes de darlos por buenos. Cuando ella confirme uno, quítale la marca y actualiza `docs/01-diseno-del-juego.md`.

**Sin instalación ni build.**
- Solo HTML, CSS y JavaScript. Sin npm, sin frameworks, sin bundler, sin CDN.
- Debe funcionar abriendo `index.html` directo desde el disco (`file://`). Por eso: nada de `import`/`export` (módulos ES), nada de `fetch` a archivos locales. Los scripts son clásicos, se cargan con `<script src>` en orden al final de `index.html`, y todo cuelga del objeto global `CB`.
- Si alguna vez hace falta romper esta regla, explícale a Valeria por qué y espera su aprobación.

**Arte original.**
- Usa los archivos de `assets/` tal cual. No los redibujes, no los recolorees, no generes arte nuevo para reemplazarlos.
- Si falta un asset, usa un marcador evidente (un rectángulo con el nombre) y anótalo en `docs/03-assets.md` en "Pendientes". Valeria lo exporta de Figma.
- El fondo espacial es la imagen `assets/backgrounds/space.webp` (o `space.png` si existe), dibujada en el canvas por `src/stage.js`. El cielo dibujado por código queda solo como respaldo mientras carga o si falta el archivo.

**Texto real, no texto dentro de imágenes.**
- Las pantallas (inicio, instrucciones, controles, game over, victoria) y el HUD son HTML encima del canvas. El canvas es solo para la acción del juego.
- Todo texto visible sale de `src/strings.js`, en español e inglés. No escribas texto fijo en el HTML ni en el canvas.
- La única tipografía es Poppins (400 y 600). No agregues otras.

**Accesibilidad (WCAG 2.2 AA en todo lo que sea HTML).**
- Todo se puede jugar con teclado, además del mouse. El foco siempre es visible.
- Contraste mínimo 4.5:1 en texto. Ojo con el texto blanco sobre el fondo dorado de Game Over.
- Respeta `prefers-reduced-motion`: sin sacudidas de pantalla ni destellos, y animaciones de fondo quietas.
- Tecla de pausa. Los cambios importantes (nivel nuevo, game over) se anuncian en la región `#live`.
- Nada parpadea más de 3 veces por segundo.

**Idioma.**
- Con Valeria: español.
- Documentos: español. Código, nombres y comentarios: inglés.
- Interfaz del juego: bilingüe, inglés por defecto (`CB.config.defaultLang`), cambia con el botón ES/EN o la tecla `L`.

## Cómo trabajar

- Sigue las etapas de `docs/02-plan-por-etapas.md`, una a la vez. La etapa 0 ya está hecha.
- Antes de programar una etapa, di en pocas líneas qué vas a hacer y qué archivos tocas.
- Al terminar una etapa: dile a Valeria exactamente cómo probarla (qué abrir, qué hacer, qué debería ver) y espera su visto bueno antes de seguir.
- Si hay git, un commit por etapa con un mensaje claro.
- Compara cada pantalla contra su captura en `docs/reference/` antes de darla por terminada.

## Cómo correr y probar

- Jugar: doble clic en `index.html` (Chrome o Edge).
- Modo debug: abrir `index.html?debug=1`. Muestra FPS y el estado actual, y habilita los atajos de `CB.config.debug`.
- Errores: consola del navegador (F12).

## Mapa del código

```
index.html            estructura: canvas + pantallas HTML + HUD
css/styles.css        tokens de color y tipografía, pantallas, foco
src/config.js         todos los números ajustables (ver marcas PROVISIONAL)
src/strings.js        textos ES/EN con su origen
src/assets.js         lista de imágenes y precarga
src/stage.js          escalado 16:9, fondo espacial, bucle de animación
src/screens.js        cambio de pantalla, idioma, anuncios
src/audio.js          música y efectos CC0 de assets/audio (créditos en CREDITOS.md); respaldo sintetizado
src/input.js          mouse, teclado, inclinación del celular
src/entities.js       objetos, jefe, explosiones, héroe, mira
src/hud.js            barra, puntos, reloj, letreros, pausa
src/levels.js         meta y velocidad por nivel
src/game.js           máquina de estados y reglas
src/main.js           arranque
```

Todas las etapas del plan están construidas (0 a 10). Hay dos modos: `mission` (el juego original, niveles 1-4) y `survival` ("Lluvia de meteoritos", `CB.config.survival`); `CB.game.setMode()` pone la clase `mode-survival` en `#stage`, que cambia los textos marcados `.mission-only` / `.survival-only`. El orden de carga de los scripts está en `index.html`; `audio.js` va después de `screens.js` y antes de `game.js`.

## Datos para el portafolio

Si durante el trabajo aparece un dato útil para el caso de estudio (una decisión de diseño y su porqué, algo que se cambió respecto al original), anótalo en `docs/05-notas-para-portafolio.md`. No inventes métricas, fechas ni roles.
