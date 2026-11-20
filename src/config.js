/* Cosmic Boing: every tunable number in one place.

   VERIFIED    = from Valeria's Figma file or from the screenshots of the original
                 2023 code (legacy-java/codigo-transcrito.md). Do not change without asking her.
   PROVISIONAL = placeholder so the game can run. Not from the original game.
                 Confirm with Valeria before treating it as final, then move it under VERIFIED.
   ADAPTATION  = new for the desktop version.
   TUNED       = Valeria changed it on purpose for this version (date beside it); the original
                 value stays in the comment so the change is traceable.

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
    speedFactor: 0.8,       // times the level-4 object speed (TUNED 2026-11-20 with the faster levels; was 1.0)
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
  /* TUNED 2026-11-20: Valeria found the levels too easy and slow on a big screen, so objects
     come faster than in the original and each level shortens the intervals further. */
  spawn: {
    meteoriteEveryMs: 2500, // level 1. Original code: intervaloEnemigo = 5000
    trapEveryMs: 6000,      // level 1. Original code: intervaloTrampas = 10000
    starEveryMs: 12000,     // code: intervaloComodin = 12000 (unchanged: stars are the lifeline)
    /* Interval multiplier per level (1-4). Level 3 meteorites every 1.4 s; level 4 every 1.1 s. */
    levelScale: [1, 0.75, 0.55, 0.45],
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
       TUNED 2026-11-20 (were 300 / 400 / 500) together with the faster spawns:
       level 1 offers ~24 meteorites in 60 s (1200 points), so 400 needs 8 hits;
       level 2 ~31 (550 = 11 hits); level 3 ~42 (700 = 14 hits), all moving faster.
       The Figma mock-up shows "400 pts" during level 1. */
    { targetScore: 400 },
    { targetScore: 550 },
    { targetScore: 700 }
  ],
  scoreResetsEachLevel: true,  // unknown: does the score carry over between levels?
  movement: {
    speedPxPerSec: 260,        // TUNED 2026-11-20 (was 180). Original: one shared, variable speed (velEne), value unknown
    speedGrowthPerLevel: 1.35, // TUNED 2026-11-20 (was 1.25): 260, 351, 474, 640 px/s on levels 1-4
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
      language: ['KeyL'],
      sound: ['KeyM']
    }
  },

  /* ADAPTATION: sound. The original game had none (docs/03-assets.md). Since 2026-11-20 the game
     ships public-domain (CC0) music and effects in assets/audio (credits: assets/audio/CREDITOS.md).
     src/audio.js plays those files; if one is missing or the browser cannot play its format, a
     synthesized version takes its place, so nothing is ever silent. Sound starts after the first
     click or key (browser autoplay rules) and the choice to mute is remembered in localStorage. */
  audio: {
    musicVolume: 0.5,          // 0..1, applied to the music files
    sfxVolume: 0.7,            // 0..1, times each effect's own gain below
    duckWhilePaused: 0.3,      // music level while paused, relative to musicVolume
    storageKey: 'cosmic-boing-sound',
    /* Music per state. 'title' covers the three menu screens; 'play' covers levels 1-3. */
    files: {
      title: 'assets/audio/music-title.mp3',   // "Alien Spaceship Atmosphere" (FreePD, CC0), loops
      play: 'assets/audio/music-play.mp3',     // "Blippy Trance", Kevin MacLeod (FreePD, CC0), loops
      boss: 'assets/audio/music-boss.mp3',     // "Epic Boss Battle" (FreePD, CC0), loops
      win: 'assets/audio/music-win.mp3',       // "Strength of the Titans", Kevin MacLeod (FreePD, CC0), once
      over: 'assets/audio/music-over.mp3'      // "Go On Without Me" (FreePD, CC0), once
    },
    preloadFirst: ['title', 'play'],           // fetched on load; the rest when a game starts
    /* One effect per event. All from "The Essential Retro Video Game Sound Effects Collection"
       by Juhani Junkala (CC0). gain is relative to sfxVolume; repeat/everyMs play a short loop a few times. */
    sfx: {
      shoot:        { file: 'assets/audio/sfx/shoot.wav',         gain: 0.45 },
      hitMeteorite: { file: 'assets/audio/sfx/hit-meteorite.wav', gain: 0.8 },
      hitTrap:      { file: 'assets/audio/sfx/hit-trap.wav',      gain: 0.6 },
      star:         { file: 'assets/audio/sfx/star.wav',          gain: 0.6 },
      bossHit:      { file: 'assets/audio/sfx/boss-hit.wav',      gain: 0.9 },
      bossArrives:  { file: 'assets/audio/sfx/boss-arrives.wav',  gain: 0.6, repeat: 3, everyMs: 790 },
      levelUp:      { file: 'assets/audio/sfx/level-up.wav',      gain: 0.7 },
      warning:      { file: 'assets/audio/sfx/warning.wav',       gain: 0.6, repeat: 2, everyMs: 800 },
      pause:        { file: 'assets/audio/sfx/pause.wav',         gain: 0.8 },
      resume:       { file: 'assets/audio/sfx/resume.wav',        gain: 1.0 },
      lose:         { file: 'assets/audio/sfx/lose.wav',          gain: 0.8 },
      uiPress:      { file: 'assets/audio/sfx/ui-press.wav',      gain: 0.5 },
      uiToggle:     { file: 'assets/audio/sfx/ui-toggle.wav',     gain: 0.6 }
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
