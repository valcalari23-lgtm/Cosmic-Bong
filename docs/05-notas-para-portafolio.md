# Notas para el caso de estudio del portafolio

Aquí se anota lo que sirva para la página de Cosmic Boing en el portafolio. Solo hechos. Nada de métricas, fechas ni roles inventados.

## Lo que ya se sabe

- Videojuego hecho en 2023. Proyecto individual de Valeria. (Valeria)
- Programado en Java con Processing; diseño en Figma y Adobe Illustrator. (Figma, código)
- El juego corría en la computadora y el celular era el control inalámbrico, conectado con la librería Tramontana. (código)
- Público: 7 años en adelante. (Figma)
- Reto original: usar el giroscopio del celular como control para apuntar. (Figma)
- Versión para navegador de escritorio, con mouse y teclado, en desarrollo con Claude Code desde noviembre de 2026. (este proyecto)

## Falta que Valeria confirme

- Si fue proyecto de un curso, y cuál.
- Si se publica con el nombre "Cosmic Boing" y en qué nivel del portafolio (Selected o Archive).

## Decisiones de diseño de esta versión

Anotar aquí cada cambio respecto al original y su porqué, a medida que ocurran.

| Decisión | Por qué |
|---|---|
| Mouse y teclado en lugar de giroscopio | El juego debe poder probarse en computadora y abrirse desde un link del portafolio. |
| Textos del juego en HTML y no dentro de imágenes | Lectores de pantalla, traducción ES/EN y nitidez a cualquier tamaño. |
| Control completo por teclado y tecla de pausa | Accesibilidad (WCAG 2.2 AA). |
| Poppins como única tipografía | Decisión de Valeria. Licencia abierta, sin depender de las fuentes del diseño original. |
| El disparo es instantáneo: acierta lo que esté bajo la mira al disparar | No hay proyectil en la maqueta original (solo mira, línea punteada y explosión en el punto de impacto). Un disparo instantáneo es lo más fiel a eso y lo más fácil de leer para niños. |
| El radio de impacto se mide desde el centro de la roca, no del sprite completo (la estela no cuenta) | El código original compara la bala con la "posición" del objeto a menos de 40 px (60 px a 1920 × 1080), pero no dice qué punto es esa posición. El centro de la roca es lo que un niño intenta apuntar. |
| En Game Over, "¿Reiniciar?" y el botón van en morado oscuro en lugar de blanco | El blanco sobre el dorado `#CBA004` da un contraste de ~1.9:1, por debajo del 4.5:1 de WCAG 2.2 AA. El morado `#2C1B35` del título da ~7:1 y mantiene la paleta. Valeria decide si prefiere el blanco con una placa oscura detrás. |
| Pausa con P o Esc, con un cuadro que oscurece la escena | El original no tenía pausa; se agrega por accesibilidad y para poder soltar el mouse sin perder la partida. |
| El jefe patrulla de lado a lado por la parte alta y los demás objetos siguen saliendo | El código original no muestra al jefe (pregunta 9). Patrullar lo hace predecible para niños y mantiene el ritmo de los niveles anteriores. Provisional. |
| En el nivel del jefe la barra cósmica se llena con los impactos al jefe (10) | Mantiene la regla "llena la barra cósmica para ganar" también en el último nivel, con un indicador de vidas aparte. |
| Las pantallas de Instrucciones y Controles explican con texto real y teclas dibujadas en CSS, no con imágenes | Lectores de pantalla, traducción y nitidez. Las ilustraciones de mouse y teclado se añaden cuando Valeria las diseñe, sin tocar el texto. |
| Con `prefers-reduced-motion` los objetos y el jefe siguen moviéndose; se quitan solo las animaciones decorativas (parpadeo de estrellas, letreros que suben, explosión que crece, pulso de la línea) | El movimiento de los blancos es el juego; quitarlo lo haría otro juego. Lo decorativo sí se quieta, como pide WCAG 2.2. |
| Con un botón enfocado (idioma, continuar), Espacio y Enter activan el botón y no disparan | Evita disparos accidentales y respeta el comportamiento estándar de los botones con teclado. |
| La pantalla "Rumbo a la Tierra" usa la ilustración completa con el título en español, también en inglés | Decisión de Valeria (19 de noviembre de 2026): es la pieza original y el texto forma parte del arte. El título traducido sigue existiendo para lectores de pantalla. |
| En el celular se apunta inclinándolo y se dispara tocando la pantalla, en el mismo juego web | Recupera el control original (giroscopio) sin servidor ni app: el navegador del celular entrega la orientación. La posición en que se sostiene el celular al empezar es el centro; el rango y la suavidad están en `config.tilt`. |
| Música y efectos reales de dominio público (CC0), con ambiente espacial: FreePD para la música y la colección retro de Juhani Junkala para los efectos | El original tenía la música prevista pero desactivada y no dejó archivos (pregunta 12). Valeria probó dos versiones sintetizadas por código (chiptune suave, luego arcade) y no le gustaron; pidió música "de espacio" y libre de derechos. CC0 permite publicarla en el portafolio sin condiciones; los créditos y las huellas SHA-256 están en `assets/audio/CREDITOS.md`. Los archivos se reproducen con `<audio>`, que funciona desde `file://` sin `fetch`. Pesan 21 MB: se precargan solo la música de menús y la de niveles, y el resto se pide al empezar la partida. Lo sintetizado queda como respaldo si falta un archivo o el navegador no reproduce el formato. |
| Un efecto por evento, todos de la misma colección retro de 8 bits (coherencia de estilo): láser al disparar, explosión al acertar, zumbador en el tanque, arpegio en la estrella, alarma cuando llega el jefe, alarma de energía baja a los 10 segundos, pausa, derrota, y un clic en cada botón | Cada efecto refuerza lo que ya muestra la pantalla (color de los puntos, reloj en rojo), así que no es la única señal: WCAG pide que la información no dependa solo del sonido. |
| Botón de sonido junto al de idioma y tecla M; la elección se recuerda entre partidas | Silenciar debe ser inmediato y estar siempre a la vista. El botón dice lo que hará al pulsarlo ("Silenciar el sonido" / "Activar el sonido") y el cambio se anuncia al lector de pantalla. |
| El sonido arranca con el primer clic o tecla, no al cargar | Regla de los navegadores: no hay audio sin un gesto del usuario. En la práctica suena desde que se pulsa "Presiona para iniciar". Al pausar, la música baja de volumen en lugar de cortarse. |
| Niveles más difíciles que el original: meteoritos cada 2.5 s en el nivel 1 (el original, cada 5 s) y cada nivel acorta los intervalos (×0.75, ×0.55, ×0.45); objetos a 260 px/s creciendo ×1.35 por nivel; metas 400 / 550 / 700; el jefe patrulla a 0.8 de la velocidad del nivel 4 | Valeria probó la versión publicada el 20 de noviembre de 2026 y la encontró lenta y poco entretenida. Los valores originales quedan anotados en `src/config.js` (nivel TUNED) por si quiere volver a ellos o afinarlos. |
| Segunda pasada de dificultad: meteoritos cada 2 s en el nivel 1, intervalos ×0.7 / ×0.5 / ×0.4 por nivel, parejas desde el nivel 3, 300 px/s creciendo ×1.4, metas 450 / 600 / 800 | Valeria volvió a jugar la versión publicada y seguía fácil. Las parejas de meteoritos se notan más que acortar aún más los intervalos. Los valores anteriores siguen anotados en `src/config.js`. |
| Segundo modo de juego, "Lluvia de meteoritos": sin tiempo, tres vidas, oleadas cada vez más rápidas, récord guardado | Valeria quería dos formas de jugar con los mismos personajes. Entre las opciones (rescate de tanques, jefe infinito, supervivencia), la lluvia es la que mejor reutiliza todo lo existente y cambia de verdad la sensación: en la misión llenas una barra; aquí defiendes al héroe. Reglas y números en `CB.config.survival`, todo ADAPTATION. |
| Tercer modo, "Carrera espacial": esquivar y recoger, sin disparar | Valeria pidió "algo diferente, tipo Mario Kart": otro género con los mismos personajes. Mover al héroe en lugar de apuntar cambia la mano y la lectura de la pantalla; el tanque pasa de trampa a tesoro, como en la historia original ("recuperemos los tanques"). Todo con los sprites existentes (`hero-back`, meteorito, tanque, estrella). Reglas en `CB.config.run`. |
| Instrucciones alineadas a la izquierda, con dibujos pequeños y la regla escrita al lado de cada fila | Comentario de Valeria: los textos eran demasiado grandes y todo estaba pegado. Una columna izquierda, filas con aire y la frase visible hacen que se lea de un vistazo; la frase también sirve a los lectores de pantalla (antes estaba oculta). |
| Flecha de avance en Instrucciones y Controles, y "Presiona para iniciar" en una pantalla propia | Valeria acomodó los elementos en Figma y pidió quitar el botón grande de esas pantallas: a la derecha una flecha redonda para pasar, y el llamado a jugar solo, centrado, en su propio panel. Separa leer de empezar. |
| Botón "Salir al inicio" en la pausa, Game Over y la última victoria | Faltaba una salida: una vez dentro del juego no había forma de volver a la portada sin recargar. La pausa es el lugar natural (ya se abre con Esc); el cuadro recorre sus dos botones con Tab. |
| La pantalla de Controles como dos tablas pequeñas (dispositivo → acción) con los atajos en fichas debajo | La versión anterior mezclaba frases y teclas en una sola línea y se leía amontonada (comentario de Valeria). Separar dispositivo y acción, bajar el tamaño de las teclas y usar un solo tamaño por nivel de jerarquía hace que la información se recorra por filas. |
| Las ilustraciones de controles muestran el celular, también en computadora | Son las que diseñó Valeria (20 de noviembre de 2026) y recuerdan el control original; el texto y las teclas dibujadas al lado explican el mouse y el teclado. |
