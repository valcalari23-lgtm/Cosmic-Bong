# Cosmic Boing: diseño del juego

Cada dato lleva su origen:

- **[Figma]** leído de la página "cosmic bong" del archivo de Valeria (nodo 1:33846).
- **[Código]** leído de las capturas del código original de 2023 (`legacy-java/codigo-transcrito.md`).
- **[Valeria]** confirmado por ella en conversación.
- **[Adaptación]** decisión nueva para la versión de computadora. No existía en el original.
- **[Por confirmar]** no está en ninguna fuente. No lo des por cierto.

## 1. Ficha

| Dato | Valor | Origen |
|---|---|---|
| Nombre | Cosmic Boing | [Figma] logo y títulos. La página de Figma se llama "cosmic bong" por un error de tipeo. |
| Año | 2023 | [Figma] "made 2023" |
| Autoría | Proyecto individual de Valeria Calvo Arias | [Valeria] |
| Tecnología original | Java, con Processing | [Valeria] [Código] |
| Dónde corría | En la computadora, en una ventana de 1280 × 720 | [Código] |
| Control original | El celular como control inalámbrico (librería Tramontana): se apuntaba girándolo y se disparaba tocando la pantalla | [Figma] [Código] |
| Herramientas de diseño | Figma, Adobe Illustrator | [Figma] |
| Público | 7 años en adelante | [Figma] |
| Género | Disparos con mira, por niveles y con puntaje | [Figma] |
| Plataforma de esta versión | Navegador de escritorio, mouse y teclado | [Valeria] |

## 2. Historia

Tomada del storyboard de seis viñetas [Figma] (`docs/reference/08-storyboard.png`):

1. Un personaje blanco mira la Tierra por la ventana de su nave.
2. La nave, en el espacio, pierde sus tanques amarillos.
3. Dentro de la nave, luz roja de alarma. El personaje se asusta.
4. Tanques y meteoritos flotan alrededor. Globo de texto: "Oh no, meteors are coming!"
5. El personaje, ya con casco de astronauta, dice: "Let's recover the tanks, but watch out for the meteors!"
6. Pantalla de juego.

Al ganar: "Ahora sí... rumbo a la Tierra" (cohete saliendo hacia la Tierra) y luego "Llegaste a casa" (el personaje sin casco en un paisaje verde).

[Por confirmar] Si el storyboard aparecía dentro del juego original como introducción. En el código solo hay cinco pantallas y ninguna es una introducción.

## 3. Reglas

### Verificadas

| Elemento | Regla | Origen |
|---|---|---|
| Héroe | "The character who shoots the meteorites to win oxygen tanks, collecting them until the current level is won." | [Figma] |
| Enemigo (meteorito) | Cada uno que explotas da **+50 puntos**. Aparece uno cada **5 segundos**. | [Figma] [Código] |
| Trampa (tanque amarillo) | Explotar uno quita **50 puntos**. Aparece uno cada **10 segundos**. | [Figma] [Código] |
| Potenciador (estrella) | Dispararle a una **suma tiempo extra**. Aparece una cada **12 segundos**. | [Figma] [Código] |
| Movimiento | Meteoritos, tanques y estrellas se mueven, todos con la misma velocidad. | [Código] |
| Impacto | Cuenta cuando el disparo queda a menos de 40 px del objeto en la ventana original de 1280 × 720. En el escenario de 1920 × 1080 son 60 px. | [Código] |
| Tiempo | **60 segundos** de cronómetro. | [Código] |
| Niveles | 4: los niveles 1 a 3 son normales y el cuarto es el del jefe. | [Figma] [Código] |
| Jefe | Tiene **10 vidas**: hay que dispararle 10 veces para ganar el juego. | [Figma] |
| Objetivo | "Fill the cosmic bar to win." | [Figma] |
| Avance | Hay que alcanzar cierto puntaje para pasar al siguiente nivel. | [Figma] |
| Respuesta al disparo | Explosión en el punto de impacto y un "+50" verde flotando encima. | [Figma] |

### Por confirmar

No programes estas respuestas como definitivas. Usa los valores `PROVISIONAL` de `src/config.js` y pregunta. Los números de esta lista se usan en `02-plan-por-etapas.md`, así que no se renumeran.

1. **Puntaje para pasar cada nivel.** La maqueta muestra "400 pts" en el nivel 1, pero no dice cuál es la meta. Dato útil: con un meteorito cada 5 segundos, en 60 segundos salen 12 meteoritos, o sea 600 puntos como máximo antes del tiempo extra. También falta saber si el puntaje se reinicia en cada nivel.
2. **Cuánto tiempo suma la estrella.** (La duración ya está resuelta: 60 segundos.)
3. **Qué pasa al acabarse el tiempo.** Se asume Game Over, pero no está escrito.
4. **Qué mide la barra blanca del HUD.** Puede ser el avance hacia la meta de puntos ("barra cósmica") o el tiempo restante. En Game Over aparece un medidor con "−" y "+" vacío, parecido al del tanque.
5. **Dónde se ve el tiempo** en pantalla. La maqueta no muestra reloj.
6. **Si el puntaje puede bajar de cero.** En el código visible no hay límite después de restar, pero la captura se corta ahí.
7. **Hacia dónde se mueven los objetos, a qué velocidad y cuándo desaparecen.** Se sabe que se mueven y que la velocidad es una variable compartida (`velEne`), nada más. Las estelas sugieren movimiento en diagonal.
8. **Si la frecuencia de aparición o la velocidad cambian por nivel.** Solo se conocen los valores iniciales.
9. **Comportamiento del jefe:** si se mueve, si siguen saliendo meteoritos y tanques, si hay tiempo límite.
10. **Tanques de oxígeno.** El storyboard muestra tanques con medidor azul que hay que recuperar; la trampa es un tanque con medidor rojo. No está claro si en el juego se recogen tanques o si solo es la historia.
11. **Pantallas de Controles y segunda de victoria.** El código original tiene cinco pantallas: Portada, Instrucciones, Fondo (juego), Game Over y Win. En Figma hay además una de Controles y dos de victoria. Falta decidir si esta versión usa las del diseño (lo asumido) o solo las cinco del código.
12. **Sonido y música.** El original importaba la librería de sonido y tenía una música de introducción prevista, pero estaba desactivada. No hay archivos de audio.
13. **Si existe pantalla de transición entre niveles.**
14. **Si el disparo viaja o es instantáneo.** El original crea "balas"; no se ve si salen del héroe y viajan o si aparecen donde está la mira. La maqueta muestra una línea punteada del héroe a la mira y la explosión en la mira.

## 4. Pantallas

Todas son 16:9. En Figma miden 2165 × 1218 y el original corría a 1280 × 720. Las capturas de `docs/reference/` están a 1920 × 1080, que es el tamaño lógico de esta versión.

| Pantalla | Referencia | Contenido [Figma] |
|---|---|---|
| Inicio | `01-title.png` | Fondo espacial, logo arriba al centro, "Presiona [icono] para iniciar", héroe abajo a la derecha, meteorito y tanques decorativos. |
| Instrucciones | `02-instructions.png` | Panel morado con marco metálico a la izquierda. Tres filas: meteorito → explosión → +50 (verde); tanque → explosión → −50 (rojo); estrella → explosión → +reloj (verde). Abajo: "Fill the cosmic bar to win". |
| Controles | `03-controls-mobile-original.png` | Mismo panel. Dos mitades: "aim" (girar el celular) y "shoot" (tocar). **Hay que rehacerla para mouse y teclado**, ver sección 5. |
| Juego | `00-gameplay-mockup.png` | HUD arriba: barra blanca a la izquierda, "400 pts" al centro, "Nivel 01" a la derecha. Héroe de espaldas abajo al centro. Línea roja punteada del héroe a la mira. Mira roja circular. La maqueta es cuadrada porque se hizo para redes; el juego es 16:9. |
| Game Over | `04-game-over.png` | Fondo dorado con vidrio roto. "Game Over" en morado oscuro, medidor gris vacío con "−" y "+", "¿Reiniciar?", "Presiona [icono] para reiniciar". |
| Victoria 1 | `05-win-heading-to-earth.png` | Cohete visto desde atrás rumbo a la Tierra. "Ahora sí... rumbo a la Tierra". |
| Victoria 2 | `06-win-home.png` | Paisaje verde, personaje sin casco. "Llegaste a casa", "¿Volver a jugar?", "Presiona [icono] para reiniciar". |

## 5. Adaptación a computadora

Todo esto es **[Adaptación]**: decisiones nuevas, propuestas para que Valeria las apruebe.

| Acción | Mouse | Teclado |
|---|---|---|
| Apuntar | Mover el mouse | Flechas o WASD mueven la mira |
| Disparar | Clic izquierdo | Espacio o Enter |
| Pausa | | P o Esc |
| Idioma | Botón ES/EN | L |
| Avanzar en pantallas | Clic en el botón | Enter o Espacio con el botón enfocado |

- El cursor del sistema se oculta sobre el área de juego y se reemplaza por la mira (`ui/crosshair.png`).
- La pantalla de Controles necesita ilustraciones nuevas (mouse y teclas) en el estilo de línea blanca del original. Mientras Valeria las diseña, se muestran con texto.
- El icono de "Presiona" es una mano tocando una pantalla. Se mantiene por ahora; Valeria decide si lo cambia por un icono de clic.
- La maqueta original no tiene pausa. Se agrega por accesibilidad.
- Las medidas en pixeles que vienen del código (1280 × 720) se multiplican por 1.5 para el escenario de 1920 × 1080.

## 6. Estilo visual

### Colores [Figma] (muestreados de las exportaciones)

| Uso | Color |
|---|---|
| Dorado del logo y títulos | `#CFA818` |
| Azul de la "I" del logo | `#18A3CF` |
| Placa oscura del logo | `#0F0912` |
| Fondo espacial | casi negro `#020103`, con nubes moradas `#1B011D` y verdes `#172202`, y estrellas suaves color crema |
| Panel de instrucciones | `#24162C`, translúcido |
| Marco metálico | `#CDCDCD` |
| Positivo (+50, tiempo) | `#14FF00` |
| Negativo (−50) y mira | `#FE0000` |
| Texto | blanco `#FFFFFF` |
| Fondo de Game Over | `#CBA004` |
| Título de Game Over | `#2C1B35` |
| Medidor de Game Over | `#606068` |
| Fondo de las láminas de presentación | `#0C0D2C` |

### Tipografía

**Poppins para todo el texto** [Valeria]. Pesos 400 y 600, incluidos en `assets/fonts/` con licencia abierta.

El diseño original en Figma usaba además Space Crusaders en los títulos y Hey Comic en el HUD. Valeria decidió no usarlas en esta versión. El logo no se ve afectado porque es una imagen.

Para acercarse al aspecto original: títulos en Poppins 600, mayúsculas. HUD en Poppins 600.

## 7. Textos

Están en `src/strings.js`, cada uno con su origen. Las pantallas originales están en español con algunas frases en inglés; los nombres de capa en Figma traen la versión en inglés ("EN → …"). Las traducciones que no existían están marcadas como nuevas para que Valeria las revise.
