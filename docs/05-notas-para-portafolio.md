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
