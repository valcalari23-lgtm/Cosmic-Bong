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
- Sonido, solo si Valeria lo quiere y entrega los archivos.

## Etapa 8 (opcional): publicar

- Storyboard como introducción, si Valeria confirma que era parte del juego.
- Subir a GitHub Pages o similar para enlazarlo desde el portafolio.
- Control por giroscopio en celular como modo extra, fiel al original.
