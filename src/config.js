/* Cosmic Boing: every tunable number in one place.

   VERIFIED    = from Valeria's Figma file or from the screenshots of the original
                 2023 code (legacy-java/codigo-transcrito.md). Do not change without asking her.
   PROVISIONAL = placeholder so the game can run. Not from the original game.
                 Confirm with Valeria before treating it as final, then move it under VERIFIED.
   ADAPTATION  = new for the desktop version.

   See docs/01-diseno-del-juego.md. */

window.CB = window.CB || {};

CB.config = {
  /* ADAPTATION: logical stage size. The original ran at 1280 x 720 (code),
     so every pixel value taken from the code is multiplied by 1.5. */
  stage: { width: 1920, height: 1080 },
  scaleFromOriginal: 1.5,

  /* ADAPTATION: English first for the portfolio audience. 'es' or 'en'. */
  defaultLang: 'en',

  /* ---------- VERIFIED ---------- */
  points: {
    meteorite: 50,          // Figma + code: puntaje += 50
    trap: -50               // Figma + code: puntaje -= 50
  },
  levelCount: 4,            // Figma: boss "appears in the fourth and final level"
  normalLevels: 3,          // code: if (nivel <= 3) { ...normal play... }
  boss: {
    level: 4,
    lives: 10,              // Figma: "it must be shot 10 times to win the game"
    /* ---- PROVISIONAL (question 9): how the boss behaves. Nothing below is from the original. ---- */
    patrol: { y: 330, minX: 420, maxX: 1500 },   // moves left-right along this line, bouncing at the ends
    speedFactor: 1.0,       // times the level-4 object speed
    hitRadiusPx: 110,       // bigger target than hit.radiusPx: the boss is a large sprite
    flashMs: 150,           // brief dim after a hit (one flash per hit, never repeated)
    othersKeepSpawning: true,
    timed: true             // the 60 s timer also runs in the boss level
  },
  winFlow: {
    headingMs: 3500         // PROVISIONAL: how long "Heading to Earth" stays before "You made it home"
  },
  timer: {
    levelMs: 60000          // code: interCronometro = 60000
  },
  spawn: {
    meteoriteEveryMs: 5000, // code: intervaloEnemigo = 5000
    trapEveryMs: 10000,     // code: intervaloTrampas = 10000
    starEveryMs: 12000,     // code: intervaloComodin = 12000
    /* PROVISIONAL: delay before the first object of each kind, so the screen is not
       empty at the start and the three kinds do not appear all at once. */
    firstDelayMs: { meteorite: 400, trap: 3000, star: 6000 }
  },
  hit: {
    radiusPx: 60            // code: distance < 40 at 1280 x 720, times 1.5
  },

  /* ---------- PROVISIONAL (not from the original) ---------- */
  levels: [
    /* Points needed to clear each level. Unknown in the original.
       Keep in mind: one meteorite every 5 s for 60 s is 12 meteorites, 600 points
       at most, before extra time. A target above that cannot be reached unless
       the spawn rate changes. The Figma mock-up shows "400 pts" during level 1. */
    { targetScore: 300 },
    { targetScore: 400 },
    { targetScore: 500 }
  ],
  scoreResetsEachLevel: true,  // unknown: does the score carry over between levels?
  movement: {
    speedPxPerSec: 180,        // original uses one shared, variable speed (velEne); value unknown
    speedGrowthPerLevel: 1.25, // unknown whether speed changes by level
    lifetimeMs: 6000,          // unknown when an object stops being "alive"
    /* Open question 7 (docs/01): direction of movement. The trail in the sprite points
       up-right, so the rock is drawn drifting down-left along it. */
    driftAngleDeg: 135,
    fadeOutMs: 500,            // objects fade out instead of popping away at end of life
    spawnMargin: { left: 320, right: 120, top: 120, bottom: 420 }   // keep spawns clear of edges and hero
  },
  powerup: {
    extraMs: 5000              // how much time one star adds
  },
  score: {
    canGoBelowZero: false      // the visible code has no floor, but the screenshot is cut there
  },
  outOfTime: 'gameOver',       // what happens when the timer reaches zero
  shot: {
    instantAtCrosshair: true   // original creates "bullets" (BalaJug); unknown whether they travel (question 14)
  },
  hud: {
    barShows: 'scoreProgress', // PROVISIONAL, question 4: the white bar fills toward levels[i].targetScore
                               // (alternative: 'timeLeft')
    popup: { durationMs: 700, offsetY: -130 },  // ADAPTATION: floating +50 sits above the explosion
    warnAtMs: 10000            // ADAPTATION: clock turns red and is announced with this much time left
  },
  levelFlow: {
    bannerMs: 1500             // PROVISIONAL (question 13): "Level 02" banner between levels, play paused meanwhile
  },

  /* ---------- ADAPTATION (how the gameplay is drawn on the 1920 x 1080 stage) ----------
     Sizes and positions read off docs/reference/00-gameplay-mockup.png. */
  colors: { bad: '#fe0000', good: '#14ff00' },
  entities: {
    hero: {
      centerX: 960,
      width: 317, height: 360,         // hero-back.png is 141 x 160, kept at that ratio
      bottomOverflow: 10,              // the sprite is cut at the bottom; sink it a little
      aimOrigin: { x: 36, y: 56 }      // where the dotted line leaves the hero (top-right of the helmet)
    },
    crosshair: { size: 200 },
    aimLine: { width: 6, widthOnShot: 12, dash: [14, 20], pulseMs: 120 },
    /* size = sprite height on screen (width keeps the file's ratio).
       center = where the body sits inside the sprite, as fractions of width / height;
       the rest of the sprite is trail. That point is the object's "position" that
       hit.radiusPx is measured from. */
    meteorite: { size: 230, center: { x: 0.34, y: 0.79 } },   // rock, bottom left of the sprite
    trap:      { size: 200, center: { x: 0.50, y: 0.50 } },   // the tank is the whole sprite
    star:      { size: 230, center: { x: 0.38, y: 0.62 } },   // star body, below its purple trail
    boss:      { size: 340, center: { x: 0.34, y: 0.72 } },   // rock with red fire; body bottom left
    explosion: { size: 240, durationMs: 450, scaleFrom: 0.6, scaleTo: 1.15 }
  },

  /* ---------- ADAPTATION (desktop controls) ---------- */
  input: {
    keyboardAimSpeedPxPerSec: 900,
    keys: {
      up: ['ArrowUp', 'KeyW'],
      down: ['ArrowDown', 'KeyS'],
      left: ['ArrowLeft', 'KeyA'],
      right: ['ArrowRight', 'KeyD'],
      shoot: ['Space', 'Enter'],
      pause: ['KeyP', 'Escape'],
      language: ['KeyL']
    }
  },

  /* ADAPTATION, faithful to the original phone control (stage 8): on a phone, tilting
     aims and a tap shoots. Tilt switches on by itself when orientation data arrives. */
  tilt: {
    rangeDeg: 18,              // tilting this far from the starting hold puts the crosshair at the stage edge
    smoothing: 0.25            // 0..1: higher follows the hand faster, lower is steadier
  },

  /* Only active with index.html?debug=1 */
  debug: {
    enabled: /[?&]debug=1/.test(window.location.search),
    skipLevelKey: 'KeyN'
  }
};
