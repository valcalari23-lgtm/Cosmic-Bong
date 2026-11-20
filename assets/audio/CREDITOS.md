# Créditos de audio

Toda la música y los efectos de Cosmic Boing son de dominio público (licencia **CC0 1.0 Universal**:
https://creativecommons.org/publicdomain/zero/1.0/). CC0 no exige dar crédito; se da igual, con gusto.
Los archivos no se modificaron. El SHA-256 permite comprobar que son los originales.

Incorporados el 20 de noviembre de 2026. Si alguno de estos archivos no fuera CC0, avisar y se retira.

## Música (`assets/audio/music-*.mp3`)

Origen: **FreePD.com**, el catálogo de música de dominio público (CC0) que funcionó de 2008 a 2025.
El sitio cerró en 2025; los archivos se tomaron del espejo CC0 **SoundSafari/CC0-1.0-Music** en GitHub
(https://github.com/SoundSafari/CC0-1.0-Music, carpeta `freepd.com/`, licencia del repositorio: CC0 1.0).
El compositor se indica cuando el propio archivo lo trae en sus etiquetas.

| Archivo en el juego | Título original | Compositor | Dónde suena | SHA-256 |
|---|---|---|---|---|
| `music-title.mp3` | Alien Spaceship Atmosphere | no indicado en el archivo (FreePD) | Inicio, Instrucciones, Controles (bucle) | `e8feefb42d99ffb72aa6c64da6a5535f4f2080d51a3bf468bf4dcd3f8e4eb939` |
| `music-play.mp3` | Blippy Trance | Kevin MacLeod | Niveles 1 a 3 (bucle) | `68ab5625f1b723d7fcfeaa47b44379fddc7bb5ffcc9d71017fabd07b5c2ca93a` |
| `music-boss.mp3` | Epic Boss Battle | no indicado en el archivo (FreePD) | Nivel 4, el jefe (bucle) | `9ea1753ae8bdf665e2b7011c9dd115bf764146d75004301a08a5efc7e6d7eaa7` |
| `music-win.mp3` | Strength of the Titans | Kevin MacLeod | Pantallas de victoria (una vez) | `7b97a9253a244cb1d279c3294269bde3cc4e5971d389df0af0ec969b03fbd52c` |
| `music-over.mp3` | Go On Without Me | no indicado en el archivo (FreePD) | Game Over (una vez) | `5101fa0a410cff668fc036f021b12c2175f3bc695c61dd04088a340b9f62373f` |

## Efectos (`assets/audio/sfx/*.wav`)

Origen: **"The Essential Retro Video Game Sound Effects Collection [512 sounds]"** de **Juhani Junkala**
(SubspaceAudio), publicado en OpenGameArt bajo CC0: https://opengameart.org/content/512-sound-effects-8-bit-style.
Tomados del espejo CC0 **Mcamento8/open-game-sfx-index** en GitHub (https://github.com/Mcamento8/open-game-sfx-index),
que documenta la procedencia de cada paquete.

| Archivo en el juego | Archivo original | Cuándo suena | SHA-256 |
|---|---|---|---|
| `sfx/shoot.wav` | Weapons/Lasers/sfx_wpn_laser2.wav | Cada disparo | `141e8db71eb4c28a1f91965e5c4976832116dc4285a14986e3899d227975d907` |
| `sfx/hit-meteorite.wav` | Explosions/Short/sfx_exp_short_hard1.wav | Acierto a un meteorito | `c5fdc18752339a39fa8b4819227bdbdd3cf29b92302ed0c81b47946d4c83b089` |
| `sfx/hit-trap.wav` | General Sounds/Negative Sounds/sfx_sounds_error1.wav | Disparo al tanque trampa | `04088388f3fb97ac2d1c8268f6dcb003fd5cf8a62b4246be3af5f5818b3add39` |
| `sfx/star.wav` | General Sounds/Positive Sounds/sfx_sounds_powerup16.wav | Estrella de tiempo extra | `2780e2f9b436fea9528eba103480972d10b81669551c638b6f7a1772e913e77b` |
| `sfx/boss-hit.wav` | Explosions/Medium Length/sfx_exp_medium1.wav | Impacto al jefe | `b07044452a498157efbfa56b10790d3c4442c831ea36f7ae4af895f46848d0c0` |
| `sfx/boss-arrives.wav` | General Sounds/Alarms/Alarms/sfx_alarm_loop1.wav | Llegada del jefe (tres veces) | `c4db084ae8937ba36ca5069b2a38ce029d383b22ad8d7b3f70c006d4dd333304` |
| `sfx/level-up.wav` | General Sounds/Fanfares/sfx_sounds_fanfare1.wav | Nivel superado | `f66509a79af67f2cc3efd3c524d54809c2be2235bf27562e5d6fd0542c2fcad3` |
| `sfx/warning.wav` | General Sounds/Alarms/Low health Alarms/sfx_lowhealth_alarmloop1.wav | Últimos 10 segundos (dos veces) | `588993839a7fd772f36a5d56ca3ea10e4c6957f56200457193676d8a5cee52bb` |
| `sfx/pause.wav` | General Sounds/Pause Sounds/sfx_sounds_pause1_in.wav | Pausa | `749a9d13b35eb9980ca25b8f8da7c0340bbff46e09df7ca74a8c05b5674889d8` |
| `sfx/resume.wav` | General Sounds/Pause Sounds/sfx_sounds_pause1_out.wav | Continuar | `746cdb20f6e85e42743a97f861f3321361f0969f3a15fd619b503752f7a193a5` |
| `sfx/lose.wav` | General Sounds/Negative Sounds/sfx_sounds_negative1.wav | Game Over, antes de la música | `a6cc77a4d6f7bb201e678ef199caa8b3882e8241ec182e8f8fafa4f8a2b69f0e` |
| `sfx/ui-press.wav` | General Sounds/Menu Sounds/sfx_menu_select1.wav | Clic en cualquier botón | `a739f6c39b90ba2551d5fd81d8bc2b1cd9b72b3cc1e35d76fc7e2ef6f7e6f392` |
| `sfx/ui-toggle.wav` | General Sounds/Menu Sounds/sfx_menu_move2.wav | Botones de sonido e idioma | `f8704e22a03bf45c5f1a9c244ea025b1e33a8e5cf39dd936131f40f60e3afef5` |

## Respaldo

Si un archivo falta o el navegador no puede reproducir su formato, `src/audio.js` genera una versión
sintetizada equivalente, así ningún evento queda en silencio.
