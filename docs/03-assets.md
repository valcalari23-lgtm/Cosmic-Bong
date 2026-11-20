# Inventario de assets

Todo salió del archivo de Figma de Valeria, página "cosmic bong":
https://www.figma.com/design/yS5VJKlLr0XI9wNBUopeS3/behance-page?node-id=1-33846

Clave del archivo: `yS5VJKlLr0XI9wNBUopeS3`. Para abrir una capa, cambia el final del link por `?node-id=` y el ID con guion (por ejemplo `38-2140`).

Los PNG se exportaron al tamaño que tienen en Figma (1x), con fondo transparente. Si alguno se ve borroso en pantalla grande, Valeria puede reexportarlo a 2x o 4x, o como SVG, con el mismo nombre de archivo.

## Incluidos

### `assets/sprites/`

Cinco de estos sprites existen también como SVG, exportados por Valeria el 18 de noviembre de 2026 (`meteorite.svg`, `trap-tank.svg`, `powerup-star.svg`, `boss.svg`, `hero-front.svg`). El juego usa el SVG cuando existe, porque escala sin perder nitidez; el PNG queda como copia. El `meteorite.svg` mide 220 × 285 (el PNG es 288 × 290): el código dibuja cada sprite con la proporción del archivo.

| Archivo | Tamaño | Nodo Figma | Qué es | Uso |
|---|---|---|---|---|
| `hero-back.png` | 141 × 160 | 38:1773 | Héroe de espaldas | Juego, abajo al centro. Es pequeño: conviene reexportar a 4x. |
| `hero-front.png` | 195 × 237 | 38:1964 | Héroe de frente, cuerpo completo | Instrucciones, pausa |
| `hero-title.png` | 607 × 648 | 38:2140 | Héroe de frente, grande. Viene recortado abajo porque así está en la pantalla de inicio. | Inicio, pegado al borde inferior derecho |
| `hero-home.png` | 292 × 449 | 38:2969 | Personaje sin casco | Victoria 2 |
| `meteorite.png` | 288 × 290 | 38:2160 | Meteorito con estela amarilla y azul | Enemigo, +50 |
| `trap-tank.png` | 121 × 279 | 38:1992 | Tanque amarillo con medidor rojo | Trampa, −50 |
| `powerup-star.png` | 292 × 277 | 38:2018 | Estrella con estela morada | Potenciador, tiempo extra |
| `boss.png` | 237 × 315 | 38:2034 | Meteorito con fuego rojo | Jefe del nivel 4 |
| `explosion.png` | 185 × 186 | 38:2357 | Explosión | Al acertar cualquier disparo |

### `assets/ui/`

| Archivo | Tamaño | Nodo Figma | Qué es |
|---|---|---|---|
| `logo.png` | 922 × 385 | 38:2154 | Logo "Cosmic Boing" con su placa oscura |
| `crosshair.png` | 143 × 143 | 38:1794 | Mira roja |
| `panel.png` | 1712 × 982 | 38:2344 | Panel morado con marco metálico (instrucciones y controles). En las pantallas originales el panel se ve translúcido sobre el fondo espacial. |
| `icon-tap.png` | 114 × 114 | 38:2246 | Icono blanco de mano tocando una pantalla, va entre "Presiona" y "para iniciar" |
| `icon-time.png` | 87 × 87 | 38:2425 | Reloj verde, recompensa de la estrella |
| `controls-aim.png` | 584 × 421 | (nuevo, fuera de Figma) | Ilustración de "apuntar": dos manos inclinan el celular con la mira en pantalla. Entregada por Valeria el 20 de noviembre de 2026. Se muestra en la pantalla de Controles también en computadora. |
| `controls-shoot.png` | 546 × 328 | (nuevo, fuera de Figma) | Ilustración de "disparar": una mano toca la pantalla. Misma entrega. |

### `assets/backgrounds/`

| Archivo | Tamaño | Nodo Figma | Qué es |
|---|---|---|---|
| `home.png` | 2166 × 1218 | 38:2660 | Paisaje de Victoria 2, sin texto ni personaje |
| `game-over-glass-overlay.png` | 2166 × 1218 | 38:2623 | Vidrio roto de Game Over. Es una capa en escala de grises que en Figma va mezclada sobre el fondo dorado `#CBA004`. Hay que probar el modo de mezcla en CSS (`mix-blend-mode`) hasta que se parezca a `docs/reference/04-game-over.png`. |
| `space.webp` | 2000 × 1125 | (fuera de Figma) | Fondo espacial que Valeria entregó el 18 de noviembre de 2026. Se dibuja al tamaño del escenario. Si copia el original como `space.png`, el juego lo usa en lugar del `.webp`. |

### `assets/audio/`

Música y efectos de dominio público (CC0), incorporados el 20 de noviembre de 2026 a pedido de Valeria ("música de espacio, libre de derechos, que cambie con el juego"). Procedencia, autores y SHA-256 de cada archivo en `assets/audio/CREDITOS.md`.

| Archivo | Pieza | Cuándo suena |
|---|---|---|
| `music-title.mp3` | "Alien Spaceship Atmosphere" (FreePD, CC0) | Inicio, Instrucciones y Controles (en bucle) |
| `music-play.mp3` | "Blippy Trance", Kevin MacLeod (FreePD, CC0) | Niveles 1 a 3 (en bucle) |
| `music-boss.mp3` | "Epic Boss Battle" (FreePD, CC0) | Nivel 4, el jefe (en bucle) |
| `music-win.mp3` | "Strength of the Titans", Kevin MacLeod (FreePD, CC0) | Pantallas de victoria (una vez) |
| `music-over.mp3` | "Go On Without Me" (FreePD, CC0) | Game Over (una vez) |
| `sfx/*.wav` | 13 efectos de "The Essential Retro Video Game Sound Effects Collection", Juhani Junkala (CC0) | Disparo, aciertos, tanque, estrella, jefe, nivel superado, alarma de 10 s, pausa, clic en botones, derrota |

Para cambiar una pieza, reemplazar el archivo con el mismo nombre (o la ruta en `src/config.js`, bloque `audio`) y anotarlo en `CREDITOS.md`. Si un archivo falta o el navegador no reproduce su formato, `src/audio.js` genera una versión sintetizada.

### `assets/fonts/`

Poppins 400 y 600 (licencia OFL, incluida). Es la única fuente del juego, por decisión de Valeria.

### `docs/reference/`

Capturas completas de cada pantalla, a 1920 × 1080. Son la meta visual. **No se usan como imágenes dentro del juego**, porque traen el texto incrustado.

| Archivo | Nodo Figma |
|---|---|
| `00-gameplay-mockup.png` | 38:1732 |
| `01-title.png` | 38:2043 |
| `02-instructions.png` | 38:2247 |
| `03-controls-mobile-original.png` | 38:2427 |
| `04-game-over.png` | 38:2588 |
| `05-win-heading-to-earth.png` | 38:2631 |
| `06-win-home.png` | 38:2659 |
| `07-characters.png` | 38:1959 |
| `08-storyboard.png` | 38:1664 |

## Pendientes

Lo que falta y quién lo resuelve.

| Qué | Para qué etapa | Dónde está en Figma | Nota |
|---|---|---|---|
| Héroe de espaldas en alta resolución | 1 | 38:1773 | Exportar como `hero-back.svg` (como los otros cinco SVG) o a 4x como `hero-back.png` |
| Pantalla "Rumbo a la Tierra" en alta resolución | 5 | 38:2631 | Valeria entregó la pantalla completa el 19 de noviembre de 2026 (`assets/backgrounds/win-heading.webp`, comprimida por el chat). El título va incrustado en español en ambos idiomas, por decisión de Valeria. Si copia el PNG original como `win-heading.png`, el juego lo prefiere. Los recuadros de cohete, Tierra y destello solo aparecen si falta esta imagen. |
| Medidor vacío de Game Over | 4 | 38:2593 (Group 47) | Hecho con CSS en la etapa 4 (`.meter`). Si Valeria prefiere el dibujo original, exportarlo como `assets/ui/meter-empty.png`. |
| Barras verticales de Game Over | 4 | 38:2614 a 38:2620 | Hechas con CSS en la etapa 4 (`.side-bar`). |
| Tanque decorativo girado | 0, opcional | 38:2188 | Decoración de la pantalla de inicio |
| Ilustraciones de controles | 6 | 38:2536 y 38:2574 | Resuelto el 20 de noviembre de 2026: Valeria entregó `controls-aim.png` y `controls-shoot.png` (ver `assets/ui/`). Muestran el celular, también en computadora, por decisión suya; el texto y las teclas dibujadas siguen explicando el mouse y el teclado. |
| Viñetas del storyboard | 8, opcional | 38:1666, 38:1690, 38:1801, 38:1831, 38:1855, 38:1731 | Solo si la historia va dentro del juego |
| Sonidos y música | 9 | No existen | Resuelto el 20 de noviembre de 2026: primero con sonido generado por código y, el mismo día a pedido de Valeria, con música y efectos CC0 reales (ver `assets/audio/`). Lo generado queda como respaldo. |

Las flechas blancas de Instrucciones y los textos "+50" y "−50" no necesitan imagen: se hacen con texto real.

## Cómo exportar desde Figma

**A mano:** seleccionar la capa, panel derecho → Export → PNG a 2x o 4x (o SVG) → guardar en la carpeta que corresponde con el nombre de la tabla.

**Con Claude Code:** si el conector de Figma está activo en Claude Code, puede pedir cada nodo por su ID con la clave del archivo y guardarlo directo en `assets/`.
