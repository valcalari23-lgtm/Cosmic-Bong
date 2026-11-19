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
      langHint: 'Cambiar idioma. Atajo: tecla L.'      // [NEW]
    },
    title: {
      toStart: 'para iniciar'                          // [F]
    },
    instructions: {
      title: 'Instrucciones',                          // [F]
      goal: 'Llena la barra cósmica para ganar',       // [NEW] original only has the English line
      next: 'para continuar',                          // [NEW] the original advanced on tap
      rowMeteorite: 'Meteorito: dispárale y ganas 50 puntos.',        // [NEW] screen-reader text of row 1
      rowTrap: 'Tanque amarillo: si le disparas pierdes 50 puntos.',  // [NEW] screen-reader text of row 2
      rowStar: 'Estrella: dispárale y ganas tiempo extra.'            // [NEW] screen-reader text of row 3
    },
    controls: {
      title: 'Controles',                              // [F]
      aim: 'apuntar',                                  // [NEW] original says "aim"
      shoot: 'disparar',                               // [NEW] original says "shoot"
      mouseAim: 'Mueve el mouse',                      // [NEW] desktop controls
      mouseShoot: 'Clic izquierdo',                    // [NEW] desktop controls
      or: 'o',                                         // [NEW]
      keySpace: 'Espacio',                             // [NEW] key cap label
      keysAim: 'o las flechas, o las teclas W, A, S y D',             // [NEW] screen-reader text
      keysShoot: 'o la barra espaciadora, o Enter',                   // [NEW] screen-reader text
      pauseHow: 'P o Esc para pausar',                 // [NEW] desktop controls
      langHow: 'L cambia el idioma',                   // [NEW]
      phoneHint: 'En el celular: inclínalo para apuntar y toca la pantalla para disparar.'   // [NEW] like the original
    },
    hud: {
      level: 'Nivel',                                  // [F]
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
      toRestart: 'para reiniciar'                      // [F]
    },
    win: {
      headingLine1: 'Ahora sí...',                     // [F]
      headingLine2: 'Rumbo a la Tierra',               // [F]
      home: 'Llegaste a casa',                         // [F]
      playAgain: '¿Volver a jugar?',                   // [F]
      toRestart: 'para reiniciar'                      // [F]
    },
    story: {
      alarm: '¡Oh no, vienen meteoritos!',                                        // [NEW] original bubble is in English
      mission: '¡Recuperemos los tanques, pero cuidado con los meteoritos!'       // [NEW] original bubble is in English
    },
    pause: {
      title: 'Pausa',                                  // [NEW]
      hint: 'P o Esc para continuar',                  // [NEW]
      resume: 'Continuar'                              // [NEW]
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
      started: 'Empieza el juego. Dispara a los meteoritos.'                              // [NEW]
    }
  },

  en: {
    common: {
      press: 'Press',                                  // [FL]
      langHint: 'Change language. Shortcut: L key.'    // [NEW]
    },
    title: {
      toStart: 'to start'                              // [FL]
    },
    instructions: {
      title: 'Instructions',                           // [FL]
      goal: 'Fill the cosmic bar to win',              // [F]
      next: 'to continue',                             // [NEW] the original advanced on tap
      rowMeteorite: 'Meteorite: shoot it and you earn 50 points.',    // [NEW] screen-reader text of row 1
      rowTrap: 'Yellow tank: shoot it and you lose 50 points.',       // [NEW] screen-reader text of row 2
      rowStar: 'Star: shoot it and you earn extra time.'              // [NEW] screen-reader text of row 3
    },
    controls: {
      title: 'Controls',                               // [FL]
      aim: 'aim',                                      // [F]
      shoot: 'shoot',                                  // [F]
      mouseAim: 'Move the mouse',                      // [NEW] desktop controls
      mouseShoot: 'Left click',                        // [NEW] desktop controls
      or: 'or',                                        // [NEW]
      keySpace: 'Space',                               // [NEW] key cap label
      keysAim: 'or the arrow keys, or W, A, S and D',                 // [NEW] screen-reader text
      keysShoot: 'or the space bar, or Enter',                        // [NEW] screen-reader text
      pauseHow: 'P or Esc to pause',                   // [NEW] desktop controls
      langHow: 'L changes the language',               // [NEW]
      phoneHint: 'On a phone: tilt it to aim and tap the screen to shoot.'                   // [NEW] like the original
    },
    hud: {
      level: 'Level',                                  // [FL]
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
      toRestart: 'to restart'                          // [FL]
    },
    win: {
      headingLine1: 'Now for real...',                 // [FL]
      headingLine2: 'Heading to Earth',                // [FL]
      home: 'You made it home',                        // [FL]
      playAgain: 'Play again?',                        // [FL]
      toRestart: 'to restart'                          // [FL]
    },
    story: {
      alarm: 'Oh no, meteors are coming!',                                  // [F]
      mission: "Let's recover the tanks, but watch out for the meteors!"    // [F]
    },
    pause: {
      title: 'Paused',                                 // [NEW]
      hint: 'P or Esc to resume',                      // [NEW]
      resume: 'Resume'                                 // [NEW]
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
      started: 'Game on. Shoot the meteorites.'                                           // [NEW]
    }
  }
};
