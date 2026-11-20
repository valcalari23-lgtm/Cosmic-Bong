# Plan por etapas

Una etapa a la vez. Cada una termina cuando Valeria la prueba y da el visto bueno.
Las reglas y los datos por confirmar están en `01-diseno-del-juego.md`.

## Etapa 0: base del proyecto (hecha)

- Escenario 16:9 de 1920 × 1080 que se ajusta a la ventana.
- Fondo espacial dibujado por código.
- Pantalla de inicio con logo, héroe y botón "Presiona para iniciar".
- Textos en español e inglés, cambio con el botón ES/EN o la tecla L.
- Precarga de imágenes.

**Probar:** doble clic en `index.html`. Se ve la pantalla de inicio. Cambiar el tamaño de la ventana mantiene la proporción. La tecla L cambia el idioma. Tab enfoca el botón y se ve el borde de foco. Al presionar el botón aparece un aviso de "Etapa 1 pendiente".

## Etapa 1: apuntar y disparar

- `src/input.js`: posición de la mira con mouse; flechas y WASD como alternativa; disparo con clic, Espacio o Enter.
- Pantalla de juego: héroe de espaldas abajo al centro, mira, línea roja punteada del héroe a la mira.
- Meteoritos que aparecen al azar. Al acertar: explosión y desaparece.
- Cursor del sistema oculto sobre el juego.
- Ya verificado en el código original: un meteorito cada 5 segundos y radio de impacto de 60 px (`src/config.js`).

**Antes de empezar:** resolver con Valeria las preguntas 7 y 14 (cómo se mueven los objetos y si el disparo viaja).

**Listo cuando:** se le puede dar a un meteorito con mouse y también solo con teclado; fallar no hace nada; la mira no se sale del escenario.

## Etapa 2: puntaje y HUD

- `src/hud.js`: barra, puntos y nivel en HTML, con el estilo de la maqueta.
- +50 por meteorito, con el "+50" verde flotando sobre el impacto.
- La barra se llena según la regla que Valeria confirme (pregunta 4 del documento de diseño).

**Listo cuando:** el puntaje sube de 50 en 50 y el HUD se parece a `00-gameplay-mockup.png`.

## Etapa 3: trampas, estrellas y tiempo

- Tanques trampa: −50 y un "−50" rojo. Uno cada 10 segundos.
- Estrellas: suman tiempo, con el icono de reloj verde. Una cada 12 segundos.
- Temporizador de nivel: 60 segundos.

**Antes de empezar:** resolver con Valeria las preguntas 2, 3, 5 y 6.

**Listo cuando:** los tres objetos se distinguen a simple vista, cada uno hace lo suyo y el tiempo corre.

## Etapa 4: niveles y Game Over

- `src/levels.js`: tres niveles con meta de puntaje y dificultad creciente.
- Pantalla de Game Over con el fondo dorado, el vidrio roto y el botón de reinicio.
- Pausa con P o Esc.

**Antes de empezar:** resolver las preguntas 1, 8 y 13.

**Listo cuando:** se puede ganar y perder cada nivel, reiniciar funciona y no queda nada del intento anterior.

## Etapa 5: jefe y victoria

- Nivel 4: jefe con 10 vidas e indicador de vidas.
- Secuencia de victoria: "Ahora sí... rumbo a la Tierra" y luego "Llegaste a casa" con "¿Volver a jugar?".

**Antes de empezar:** resolver la pregunta 9. Pedir a Valeria los assets del cohete y la Tierra (ver `03-assets.md`).

**Listo cuando:** el décimo disparo al jefe lleva a la victoria y desde ahí se puede volver a jugar.

## Etapa 6: instrucciones y controles

- Pantalla de Instrucciones igual a `02-instructions.png`, con texto real.
- Pantalla de Controles nueva para mouse y teclado.
- Flujo completo: inicio → instrucciones → controles → juego.

**Antes de empezar:** resolver la pregunta 11 (el código original no tenía pantalla de Controles).

**Listo cuando:** alguien que nunca vio el juego entiende qué hacer sin ayuda.

## Etapa 7: pulido y accesibilidad

- Revisión completa con solo teclado.
- Contraste de todos los textos (ojo con Game Over).
- `prefers-reduced-motion`.
- Anuncios en `#live` para lector de pantalla.
- Comparación final de cada pantalla contra `docs/reference/`.
- Sonido, solo si Valeria lo quiere y entrega los archivos. *(Hecho en la etapa 9: lo pidió el 20 de noviembre de 2026; sin archivos, generado por código.)*

## Etapa 8 (opcional): publicar

- Storyboard como introducción, si Valeria confirma que era parte del juego.
- Subir a GitHub Pages o similar para enlazarlo desde el portafolio.
- Control por giroscopio en celular como modo extra, fiel al original.

## Etapa 11: tercer modo, pantallas con aire y salida al inicio (20 de noviembre de 2026)

Pedido de Valeria tras probar la etapa 10: las pantallas seguían recargadas (textos grandes y pegados), faltaba una forma de salir del juego al inicio, el personaje de la última pantalla quedaba tapado por los botones, y el modo "Lluvia" se parecía demasiado al juego original: quería algo de otro género con los mismos personajes.

- **Instrucciones:** todo alineado a la izquierda en una columna, dibujos a 88 px, resultado a 50 px, flechas cortas, y cada fila termina con la regla escrita (27 px). Una lista por modo. Títulos de panel a 52 px.
- **Salir:** botón "Salir al inicio" en el cuadro de pausa (Tab recorre Continuar y Salir), y "Volver al inicio" en Game Over y en la última pantalla de victoria. Todos llevan a la portada.
- **Victoria 2:** el personaje pasa al lado izquierdo y el título baja a 104 px, para que la placa de botones no lo tape.
- **Modo "Carrera espacial"** (`CB.config.run`): sin disparos. El héroe se mueve de lado a lado abajo (mouse, flechas o A/D, inclinar el celular) mientras todo cae. Meteorito que lo toca: una vida menos y un instante de parpadeo invulnerable. Tanque: se recoge, +100 y cuenta en el HUD ("Tanques 03", la historia dice "recuperemos los tanques"). Estrella: una vida (o +200 con las tres). +10 puntos por segundo. Velocidad e intervalos aprietan con el tiempo. Game Over con puntos y récord propio.
- Portada: fila "Modos extra" con los dos botones (Lluvia de meteoritos, Carrera espacial) bajo el botón principal.
- Pantalla de Controles en la carrera: la columna "apuntar" pasa a "mover" (mouse de lado a lado, ← → o A D) y la de "disparar" se oculta.

**Probar:** portada → "Carrera espacial" → instrucciones de tres filas → controles con una sola columna → mover al héroe con el mouse, las flechas o inclinando el celular. Esc → "Salir al inicio" vuelve a la portada. Ganar la misión: el personaje de la última pantalla se ve completo, a la izquierda.

## Etapa 10: segundo modo, controles ordenados y más dificultad (20 de noviembre de 2026)

Pedido de Valeria tras jugar la versión publicada: la pantalla de Controles se leía amontonada, los niveles seguían fáciles y quería "otro juego" con los mismos personajes.

- **Pantalla de Controles:** cada columna es una tabla pequeña (Mouse / Teclado / Celular → qué hacer), teclas dibujadas más chicas, y los atajos (P o Esc, L, M) como fichas debajo. Una sola jerarquía tipográfica: título 61, verbo 44, acciones 28, etiquetas 20 en mayúsculas.
- **Dificultad (TUNED, segunda pasada):** meteoritos cada 2 s en el nivel 1 y cada nivel acorta más (×0.7, ×0.5, ×0.4); desde el nivel 3 salen de a dos (`spawn.burst`); velocidad 300 px/s creciendo ×1.4 (300, 420, 588, 823); metas 450 / 600 / 800.
- **Modo "Lluvia de meteoritos"** (`CB.config.survival`, botón extra en la portada y en la última pantalla de victoria): sin tiempo, tres vidas. Los meteoritos caen desde arriba; si uno llega abajo, se pierde una vida; la estrella devuelve una vida (o da 100 puntos si están completas); el tanque sigue restando 50. Cada diez meteoritos sube la oleada y todo acelera (×1.12 la velocidad, ×0.92 los intervalos). La barra cósmica cuenta los meteoritos de la oleada. Game Over muestra puntos y récord (guardado en el navegador). Desde la oleada 5 suena la música del jefe.
- Las pantallas de Instrucciones cambian su texto según el modo (`#stage.mode-survival`).

**Probar:** en la portada, "Modo extra: Lluvia de meteoritos" → instrucciones con cuatro filas → controles → juego con tres corazones arriba a la izquierda y "Oleada 01". Dejar caer tres meteoritos termina la partida y muestra "Puntos … · Récord …". En la misión, el nivel 3 trae los meteoritos de a dos.

## Etapa 9: sonido e ilustraciones de controles (20 de noviembre de 2026)

- `src/audio.js`: música por estado (menús, niveles 1 a 3, jefe, victoria, Game Over) y un efecto por evento, todo generado con Web Audio. Sin archivos.
- Botón de sonido abajo a la izquierda, tecla M, estado recordado en el navegador. La música baja de volumen en pausa.
- Las ilustraciones `controls-aim.png` y `controls-shoot.png` de Valeria ocupan los recuadros de la pantalla de Controles.
- Si Valeria entrega pistas propias con los nombres de `docs/03-assets.md`, el juego las usa en lugar de las generadas.
- Tercera vuelta el mismo día: música y efectos reales de dominio público (CC0) con ambiente espacial, elegidos y documentados en `assets/audio/CREDITOS.md`; cada botón suena al pulsarlo. Lo sintetizado queda como respaldo.
- Segunda vuelta el mismo día: música y efectos en estilo arcade clásico de disparos, y niveles más difíciles (meteoritos cada 2.5 s en el nivel 1 y más seguidos en cada nivel, objetos más rápidos, metas 400 / 550 / 700). Valores en `src/config.js` marcados TUNED, con el original al lado.

**Probar:** abrir el juego y pulsar "Presiona para iniciar": empieza la música de menú. En Controles se ven las dos ilustraciones. Al jugar cambia la música; cada disparo, acierto, tanque y estrella suena distinto; a los 10 segundos finales hay un doble pitido; el jefe trae otra música; ganar y perder tienen su propia melodía corta. M o el botón del altavoz silencian todo y el estado se mantiene al recargar.
