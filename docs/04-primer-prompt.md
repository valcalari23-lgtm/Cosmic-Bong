# Primer mensaje para Claude Code

Abre esta carpeta en Claude Code y pega esto tal cual:

---

Lee `CLAUDE.md` y los documentos de `docs/` (01, 02 y 03). Mira también las capturas de `docs/reference/`.

Después:

1. Lee `legacy-java/codigo-transcrito.md` (lo único que queda del código original) y dime si ves algo ahí que contradiga `docs/01-diseno-del-juego.md` o `src/config.js`.
2. Abre `index.html` y confirma que la etapa 0 funciona.
3. Hazme las preguntas de la sección "Por confirmar" que necesites para la etapa 1, y solo esas.
4. Preséntame tu plan para la etapa 1 antes de escribir código.

No avances a la etapa 2 hasta que yo pruebe la etapa 1 y te diga que está bien.

---

## Mensajes útiles para después

**Al empezar cada etapa**

> Vamos con la etapa N de `docs/02-plan-por-etapas.md`. Dime qué preguntas abiertas necesitas resolver primero y luego tu plan.

**Cuando algo no se parece al diseño**

> Compara la pantalla de [nombre] con `docs/reference/[archivo].png` y dime las diferencias antes de corregir.

**Cuando confirmes un dato**

> Confirmo: [dato]. Actualiza `src/config.js` y `docs/01-diseno-del-juego.md` y quita la marca de provisional.

**Para revisar accesibilidad**

> Juega una partida completa usando solo el teclado y dime dónde te atoraste.
