/* Cosmic Boing: every visible text, in Spanish and English.

   Origin of each string:
     [F]   visible on the original Figma screens
     [FL]  English version taken from the Figma layer names ("EN -> ...")
     [NEW] did not exist in the original. Written for this version; Valeria to review.

   Never hard-code text in index.html or on the canvas. Add it here and use
   data-i18n="group.key" in HTML or CB.t('group.key') in JavaScript. */

window.CB = window.CB || {};

CB.strings = {
  es: {
    common: {
      press: 'Presiona',                               // [F]
      langHint: 'Cambiar idioma. Atajo: tecla L.',     // [NEW]
      soundMute: 'Silenciar el sonido. Atajo: tecla M.',   // [NEW] sound button label while sound is on
      soundUnmute: 'Activar el sonido. Atajo: tecla M.',   // [NEW] sound button label while muted
      soundOn: 'Sonido activado',                      // [NEW] live-region text
      soundOff: 'Sonido silenciado',                   // [NEW] live-region text
      home: 'Volver al inicio'                         // [NEW] exit button on Game Over and the last win screen
    },
    title: {
      toStart: 'para iniciar',                         // [F]
      extraMode: 'Modos extra',                        // [NEW] label over the extra mode buttons
      survival: 'Lluvia de meteoritos',                // [NEW] name of the second game mode
      run: 'Carrera espacial'                          // [NEW] name of the third game mode
    },
    instructions: {
      title: 'Instrucciones',                          // [F]
      goal: 'Llena la barra cósmica para ganar',       // [NEW] original only has the English line
      goalSurvival: 'Aguanta la lluvia de meteoritos todo lo que puedas',   // [NEW] second mode
      goalRun: 'Esquiva los meteoritos y recupera los tanques',              // [NEW] third mode
      next: 'para continuar',                          // [NEW] the original advanced on tap
      rowMeteorite: 'Meteorito: dispárale y ganas 50 puntos.',        // [NEW] screen-reader text of row 1
      rowTrap: 'Tanque amarillo: si le disparas pierdes 50 puntos.',  // [NEW] screen-reader text of row 2
      rowStar: 'Estrella: dispárale y ganas tiempo extra.',           // [NEW] screen-reader text of row 3
      rowStarSurvival: 'Estrella: dispárale y recuperas una vida.',   // [NEW] second mode, row 3
      rowGround: 'Si un meteorito llega hasta abajo, pierdes una vida. Tienes tres.',  // [NEW] second mode, row 4
      rowRunMeteorite: 'Meteorito: si te golpea, pierdes una vida. Tienes tres.',       // [NEW] third mode
      rowRunTank: 'Tanque: recógelo y ganas 100 puntos.',                               // [NEW] third mode
      rowRunStar: 'Estrella: recógela y recuperas una vida.'                            // [NEW] third mode
    },
    controls: {
      title: 'Controles',                              // [F]
      aim: 'apuntar',                                  // [NEW] original says "aim"
      shoot: 'disparar',                               // [NEW] original says "shoot"
      move: 'mover',                                   // [NEW] third mode: the hero moves instead of aiming
      mouseMove: 'Muévelo de lado a lado',             // [NEW] third mode
      keysMove: 'flechas izquierda y derecha, o A y D',   // [NEW] screen-reader text, third mode
      mouse: 'Mouse',                                  // [NEW] row label
      keyboard: 'Teclado',                             // [NEW] row label
      phone: 'Celular',                                // [NEW] row label, touch devices only
      mouseAim: 'Mueve el mouse',                      // [NEW] desktop controls
      mouseShoot: 'Clic izquierdo',                    // [NEW] desktop controls
      phoneAim: 'Inclínalo',                           // [NEW] like the original
      phoneShoot: 'Toca la pantalla',                  // [NEW] like the original
      or: 'o',                                         // [NEW]
      keySpace: 'Espacio',                             // [NEW] key cap label
      keysAim: 'flechas, o las teclas W, A, S y D',    // [NEW] screen-reader text
      keysShoot: 'barra espaciadora, o Enter',         // [NEW] screen-reader text
      shortcuts: 'Atajos',                             // [NEW] screen-reader name of the shortcut list
      pause: 'Pausa',                                  // [NEW]
      language: 'Idioma',                              // [NEW]
      sound: 'Sonido'                                  // [NEW]
    },
    hud: {
      level: 'Nivel',                                  // [F]
      wave: 'Oleada',                                  // [NEW] second mode
      tanks: 'Tanques',                                // [NEW] third mode: recovered tanks
      tankGot: 'Tanque recuperado. Llevas {n}.',       // [NEW] live-region text
      hit: 'Te golpeó un meteorito. Vidas: {n}',       // [NEW] live-region text
      lives: 'Vidas: {n}',                             // [NEW] second mode, lives indicator
      lifeLost: 'Un meteorito cayó. Vidas: {n}',       // [NEW] live-region text
      lifeBack: 'Vida recuperada. Vidas: {n}',         // [NEW] live-region text
      waveUp: 'Oleada {n}. Más rápido.',               // [NEW] live-region text
      points: 'pts',                                   // [F]
      barLabel: 'Barra cósmica: avance hacia la meta del nivel',   // [NEW] screen-reader name of the bar
      scored: 'Puntos: {score}',                       // [NEW] live-region text after a hit
      timeLabel: 'Tiempo restante',                    // [NEW] screen-reader name of the clock
      extraTime: '+{s} s',                             // [NEW] floating label when a star is shot
      timeAdded: 'Tiempo extra: {s} segundos',         // [NEW] live-region text
      timeWarning: 'Quedan {s} segundos'               // [NEW] live-region text
    },
    gameOver: {
      title: 'Game Over',                              // [F]
      restartQuestion: '¿Reiniciar?',                  // [F] original shows "REINICIAR?"
      toRestart: 'para reiniciar',                     // [F]
      score: 'Puntos: {score}',                        // [NEW] second mode
      best: 'Récord: {best}',                          // [NEW] second mode
      newBest: '¡Nuevo récord!'                        // [NEW] second mode
    },
    win: {
      headingLine1: 'Ahora sí...',                     // [F]
      headingLine2: 'Rumbo a la Tierra',               // [F]
      home: 'Llegaste a casa',                         // [F]
      playAgain: '¿Volver a jugar?',                   // [F]
      toRestart: 'para reiniciar',                     // [F]
      trySurvival: 'O prueba la lluvia de meteoritos'  // [NEW] second button on the last screen
    },
    story: {
      alarm: '¡Oh no, vienen meteoritos!',                                        // [NEW] original bubble is in English
      mission: '¡Recuperemos los tanques, pero cuidado con los meteoritos!'       // [NEW] original bubble is in English
    },
    pause: {
      title: 'Pausa',                                  // [NEW]
      hint: 'P o Esc para continuar',                  // [NEW]
      resume: 'Continuar',                             // [NEW]
      exit: 'Salir al inicio'                          // [NEW] leaves the game, back to the title screen
    },
    levels: {
      cleared: 'Nivel {n} superado.'                   // [NEW] live-region text
    },
    boss: {
      arrives: '¡Llega el jefe! Dispárale diez veces.',  // [NEW] live-region text
      lives: 'Jefe: {n} vidas'                           // [NEW] lives indicator and live-region text
    },
    game: {
      areaLabel: 'Zona de juego',                                                         // [NEW]
      help: 'Mueve el mouse o las flechas para apuntar. Clic, Espacio o Enter para disparar.', // [NEW]
      started: 'Empieza el juego. Dispara a los meteoritos.',                             // [NEW]
      startedSurvival: 'Lluvia de meteoritos. No dejes que lleguen abajo.',                // [NEW]
      startedRun: 'Carrera espacial. Muévete para esquivar los meteoritos.',                // [NEW]
      exited: 'Saliste al inicio.'                                                          // [NEW]
    }
  },

  en: {
    common: {
      press: 'Press',                                  // [FL]
      langHint: 'Change language. Shortcut: L key.',   // [NEW]
      soundMute: 'Mute the sound. Shortcut: M key.',   // [NEW] sound button label while sound is on
      soundUnmute: 'Turn the sound on. Shortcut: M key.',  // [NEW] sound button label while muted
      soundOn: 'Sound on',                             // [NEW] live-region text
      soundOff: 'Sound off',                           // [NEW] live-region text
      home: 'Back to start'                            // [NEW]
    },
    title: {
      toStart: 'to start',                             // [FL]
      extraMode: 'Extra modes',                        // [NEW]
      survival: 'Meteor shower',                       // [NEW]
      run: 'Space run'                                 // [NEW]
    },
    instructions: {
      title: 'Instructions',                           // [FL]
      goal: 'Fill the cosmic bar to win',              // [F]
      goalSurvival: 'Survive the meteor shower as long as you can',   // [NEW]
      goalRun: 'Dodge the meteorites and recover the tanks',           // [NEW]
      next: 'to continue',                             // [NEW] the original advanced on tap
      rowMeteorite: 'Meteorite: shoot it and you earn 50 points.',    // [NEW] screen-reader text of row 1
      rowTrap: 'Yellow tank: shoot it and you lose 50 points.',       // [NEW] screen-reader text of row 2
      rowStar: 'Star: shoot it and you earn extra time.',             // [NEW] screen-reader text of row 3
      rowStarSurvival: 'Star: shoot it and you get a life back.',     // [NEW]
      rowGround: 'If a meteorite reaches the ground you lose a life. You have three.',  // [NEW]
      rowRunMeteorite: 'Meteorite: if it hits you, you lose a life. You have three.',   // [NEW]
      rowRunTank: 'Tank: pick it up and you earn 100 points.',                          // [NEW]
      rowRunStar: 'Star: pick it up and you get a life back.'                           // [NEW]
    },
    controls: {
      title: 'Controls',                               // [FL]
      aim: 'aim',                                      // [F]
      shoot: 'shoot',                                  // [F]
      move: 'move',                                    // [NEW]
      mouseMove: 'Move it side to side',               // [NEW]
      keysMove: 'left and right arrows, or A and D',   // [NEW]
      mouse: 'Mouse',                                  // [NEW]
      keyboard: 'Keyboard',                            // [NEW]
      phone: 'Phone',                                  // [NEW]
      mouseAim: 'Move the mouse',                      // [NEW] desktop controls
      mouseShoot: 'Left click',                        // [NEW] desktop controls
      phoneAim: 'Tilt it',                             // [NEW] like the original
      phoneShoot: 'Tap the screen',                    // [NEW] like the original
      or: 'or',                                        // [NEW]
      keySpace: 'Space',                               // [NEW] key cap label
      keysAim: 'arrow keys, or W, A, S and D',         // [NEW] screen-reader text
      keysShoot: 'space bar, or Enter',                // [NEW] screen-reader text
      shortcuts: 'Shortcuts',                          // [NEW]
      pause: 'Pause',                                  // [NEW]
      language: 'Language',                            // [NEW]
      sound: 'Sound'                                   // [NEW]
    },
    hud: {
      level: 'Level',                                  // [FL]
      wave: 'Wave',                                    // [NEW]
      tanks: 'Tanks',                                  // [NEW]
      tankGot: 'Tank recovered. You have {n}.',        // [NEW]
      hit: 'A meteorite hit you. Lives: {n}',          // [NEW]
      lives: 'Lives: {n}',                             // [NEW]
      lifeLost: 'A meteorite landed. Lives: {n}',      // [NEW]
      lifeBack: 'Life back. Lives: {n}',               // [NEW]
      waveUp: 'Wave {n}. Faster.',                     // [NEW]
      points: 'pts',                                   // [F]
      barLabel: 'Cosmic bar: progress toward the level target',    // [NEW] screen-reader name of the bar
      scored: 'Score: {score}',                        // [NEW] live-region text after a hit
      timeLabel: 'Time left',                          // [NEW] screen-reader name of the clock
      extraTime: '+{s} s',                             // [NEW] floating label when a star is shot
      timeAdded: 'Extra time: {s} seconds',            // [NEW] live-region text
      timeWarning: '{s} seconds left'                  // [NEW] live-region text
    },
    gameOver: {
      title: 'Game Over',                              // [F]
      restartQuestion: 'Restart?',                     // [FL]
      toRestart: 'to restart',                         // [FL]
      score: 'Score: {score}',                         // [NEW]
      best: 'Best: {best}',                            // [NEW]
      newBest: 'New record!'                           // [NEW]
    },
    win: {
      headingLine1: 'Now for real...',                 // [FL]
      headingLine2: 'Heading to Earth',                // [FL]
      home: 'You made it home',                        // [FL]
      playAgain: 'Play again?',                        // [FL]
      toRestart: 'to restart',                         // [FL]
      trySurvival: 'Or try the meteor shower'          // [NEW]
    },
    story: {
      alarm: 'Oh no, meteors are coming!',                                  // [F]
      mission: "Let's recover the tanks, but watch out for the meteors!"    // [F]
    },
    pause: {
      title: 'Paused',                                 // [NEW]
      hint: 'P or Esc to resume',                      // [NEW]
      resume: 'Resume',                                // [NEW]
      exit: 'Exit to start'                            // [NEW]
    },
    levels: {
      cleared: 'Level {n} cleared.'                    // [NEW] live-region text
    },
    boss: {
      arrives: 'The boss arrives! Shoot it ten times.',  // [NEW] live-region text
      lives: 'Boss: {n} lives'                           // [NEW] lives indicator and live-region text
    },
    game: {
      areaLabel: 'Game area',                                                             // [NEW]
      help: 'Move the mouse or the arrow keys to aim. Click, Space or Enter to shoot.',    // [NEW]
      started: 'Game on. Shoot the meteorites.',                                          // [NEW]
      startedSurvival: 'Meteor shower. Do not let them reach the ground.',                 // [NEW]
      startedRun: 'Space run. Move to dodge the meteorites.',                                // [NEW]
      exited: 'Back at the start screen.'                                                    // [NEW]
    }
  }
};
