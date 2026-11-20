/* Cosmic Boing: the game loop.
   Stage 1: aim and shoot meteorites. Stage 2: score and HUD.
   Stage 3: trap tanks (-50), stars (extra time) and the 60 s level timer.
   Stage 4: levels 1-3 with a target score, Game Over when time runs out, pause.
   Stage 5: level 4 is the boss (10 lives); the tenth hit wins the game.
   Stage 10: a second mode, 'survival' ("Meteor shower"): endless, meteorites fall from the top,
   one that reaches the ground costs a life (3), every ten meteorites the wave speeds up.

   Modes: 'mission' (the original game, levels 1-4) and 'survival'.
   States: 'idle' (not playing), 'playing', 'transition' (level banner),
   'paused', 'over' (Game Over screen showing), 'won' (win screens showing).

   Sound (src/audio.js) is told what happens from here: music per level, one effect per event. */

window.CB = window.CB || {};

CB.game = (function () {
  var cfg = CB.config;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var KINDS = ['meteorite', 'trap', 'star'];

  var mode = 'mission';
  var state = 'idle';
  var objects = [];
  var explosions = [];
  var spawnTimers = {};          // seconds until the next object of each kind
  var shotPulse = 0;             // seconds left of the thicker aim line after a shot
  var stats = { shots: 0, hits: 0 };
  var score = 0;
  var level = 1;                 // mission: level 1-4
  var timeLeft = 0;              // mission: seconds left in the level
  var warned = false;            // "10 seconds left" announced once per level
  var transitionLeft = 0;        // seconds the level banner stays (play paused meanwhile)
  var endTimer = null;
  var boss = null;               // the boss object while in level 4
  /* survival */
  var lives = 0;
  var wave = 1;
  var spawnedInWave = 0;
  var bannerLeft = 0;            // seconds the wave banner stays (play continues)

  function isSurvival() {
    return mode === 'survival';
  }

  function isBossLevel() {
    return !isSurvival() && level === cfg.boss.level;
  }

  function twoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function aimOrigin() {
    var h = cfg.entities.hero;
    return {
      x: h.centerX + h.aimOrigin.x,
      y: cfg.stage.height - h.height + h.bottomOverflow + h.aimOrigin.y
    };
  }

  /* ---------- pacing ---------- */

  /* Seconds between two objects of a kind. Mission: spawn.*EveryMs scaled per level (TUNED).
     Survival: survival.*EveryMs scaled per wave, with a floor for meteorites. */
  function spawnEvery(kind) {
    if (isSurvival()) {
      var s = cfg.survival;
      var ms = s[kind + 'EveryMs'] * Math.pow(s.intervalScalePerWave, wave - 1);
      if (kind === 'meteorite') { ms = Math.max(s.minMeteoriteEveryMs, ms); }
      return ms / 1000;
    }
    var scale = cfg.spawn.levelScale || [1];
    var factor = scale[Math.min(level, scale.length) - 1];
    return cfg.spawn[kind + 'EveryMs'] * factor / 1000;
  }

  /* Meteorites per spawn (mission only: spawn.burst per level). */
  function burstSize(kind) {
    if (kind !== 'meteorite' || isSurvival()) { return 1; }
    var b = cfg.spawn.burst || [1];
    return b[Math.min(level, b.length) - 1];
  }

  function objectSpeed() {
    if (isSurvival()) {
      return cfg.survival.speedPxPerSec * Math.pow(cfg.survival.speedGrowthPerWave, wave - 1);
    }
    return CB.levels.speed(level);
  }

  /* ---------- score, time and lives ---------- */

  /* VERIFIED: +50 per meteorite, -50 per trap (points.*). Score cannot go below zero
     (score.canGoBelowZero, PROVISIONAL, question 6). Reaching the level target
     ("fill the cosmic bar") clears the level (mission, levels 1-3). */
  function addPoints(delta, x, y) {
    score += delta;
    if (score < 0 && !cfg.score.canGoBelowZero) { score = 0; }
    /* In the boss level and in survival the bar means something else, so only the numbers change. */
    var target = (isBossLevel() || isSurvival()) ? null : CB.levels.target(level);
    CB.hud.update(score, isSurvival() ? wave : level, target);
    CB.hud.popup(x, y, (delta > 0 ? '+' : '−') + Math.abs(delta), delta > 0 ? 'good' : 'bad');
    if (target !== null && score >= target) {
      levelCleared();
    } else {
      CB.screens.announce(CB.t('hud.scored').replace('{score}', score));
    }
  }

  /* One hit on the boss. VERIFIED: ten hits win the game. */
  function hitBossOnce(x, y) {
    var left = CB.entities.hitBoss(boss);
    CB.hud.setBar(cfg.boss.lives - left, cfg.boss.lives);
    CB.hud.setBossLives(left, cfg.boss.lives);
    if (left <= 0) {
      explosions.push(CB.entities.spawnExplosion(x, y));
      win();
      return;
    }
    CB.audio.play('bossHit');
    CB.screens.announce(CB.t('boss.lives').replace('{n}', left));
  }

  /* PROVISIONAL: how much a star adds (powerup.extraMs, question 2). Mission only. */
  function addTime(ms, x, y) {
    timeLeft += ms / 1000;
    CB.hud.updateTime(timeLeft);
    CB.hud.popup(x, y, CB.t('hud.extraTime').replace('{s}', Math.round(ms / 1000)), 'good', true);
    CB.screens.announce(CB.t('hud.timeAdded').replace('{s}', Math.round(ms / 1000)));
  }

  /* Survival: a star gives a life back, or points when lives are full. */
  function addLife(x, y) {
    if (lives >= cfg.survival.lives) {
      addPoints(cfg.survival.starPoints, x, y);
      return;
    }
    lives += 1;
    CB.hud.setLives(lives, cfg.survival.lives);
    CB.hud.popup(x, y, '+1 ♥', 'good');
    CB.screens.announce(CB.t('hud.lifeBack').replace('{n}', lives));
  }

  /* Survival: a meteorite reached the ground. */
  function loseLife(o) {
    explosions.push(CB.entities.spawnExplosion(o.x, Math.min(o.y, cfg.survival.groundY)));
    lives -= 1;
    CB.hud.setLives(lives, cfg.survival.lives);
    CB.hud.popup(o.x, cfg.survival.groundY - 60, '−1 ♥', 'bad');
    CB.audio.play('hitTrap');
    if (lives <= 0) {
      gameOver();
      return;
    }
    CB.screens.announce(CB.t('hud.lifeLost').replace('{n}', lives));
  }

  function tickTimer(dt) {
    timeLeft -= dt;
    if (timeLeft <= cfg.hud.warnAtMs / 1000 && !warned && timeLeft > 0) {
      warned = true;
      CB.audio.play('warning');
      CB.screens.announce(CB.t('hud.timeWarning').replace('{s}', Math.ceil(timeLeft)));
    }
    if (timeLeft <= 0) {
      timeLeft = 0;
      CB.hud.updateTime(0);
      gameOver();                 // PROVISIONAL (question 3): outOfTime = 'gameOver'
      return;
    }
    CB.hud.updateTime(timeLeft);
  }

  /* ---------- levels (mission) and waves (survival) ---------- */

  function resetSpawnTimers() {
    for (var i = 0; i < KINDS.length; i++) {
      spawnTimers[KINDS[i]] = cfg.spawn.firstDelayMs[KINDS[i]] / 1000;
    }
  }

  function clearStage() {
    objects = [];
    explosions = [];
    resetSpawnTimers();
    shotPulse = 0;
    CB.hud.clearPopups();
  }

  /* Sets up the current mission level. withBanner shows "Level 0N" for a moment before play
     resumes (PROVISIONAL, question 13: the original has no known transition screen). */
  function beginLevel(withBanner) {
    clearStage();
    if (cfg.scoreResetsEachLevel) { score = 0; }     // PROVISIONAL (question 1)
    timeLeft = cfg.timer.levelMs / 1000;             // VERIFIED: 60 s per level
    warned = false;
    if (isBossLevel()) {
      boss = CB.entities.spawnBoss(CB.levels.speed(level));
      CB.hud.update(score, level, null);
      CB.hud.setBar(0, cfg.boss.lives);
      CB.hud.setBossLives(cfg.boss.lives, cfg.boss.lives);
    } else {
      boss = null;
      CB.hud.update(score, level, CB.levels.target(level));
      CB.hud.setBossLives(null);
    }
    CB.hud.setLives(null);
    CB.hud.showTimer(true);
    CB.hud.updateTime(timeLeft);
    CB.audio.music(isBossLevel() ? 'boss' : 'play');   // levels 1-3 share one loop; the boss has its own
    if (withBanner) {
      state = 'transition';
      transitionLeft = cfg.levelFlow.bannerMs / 1000;
      CB.hud.showBanner(CB.t('hud.level') + ' ' + twoDigits(level));
    } else {
      state = 'playing';
      CB.hud.hideBanner();
    }
  }

  /* Levels 1-3 are cleared by score; level 3 leads into the boss level (4). */
  function levelCleared() {
    var next = level + 1;
    var text = CB.t('levels.cleared').replace('{n}', level) + ' ';
    text += (next === cfg.boss.level) ? CB.t('boss.arrives') : (CB.t('hud.level') + ' ' + next + '.');
    CB.screens.announce(text);
    CB.audio.play(next === cfg.boss.level ? 'bossArrives' : 'levelUp');
    level = next;
    beginLevel(true);
  }

  /* Survival from wave 1: three lives, no clock, the bar counts meteorites toward the next wave. */
  function beginSurvival() {
    clearStage();
    score = 0;
    lives = cfg.survival.lives;
    wave = 1;
    spawnedInWave = 0;
    bannerLeft = 0;
    boss = null;
    timeLeft = 0;
    warned = false;
    CB.hud.update(score, wave, null);
    CB.hud.setBar(0, cfg.survival.perWave);
    CB.hud.setBossLives(null);
    CB.hud.setLives(lives, cfg.survival.lives);
    CB.hud.showTimer(false);
    CB.hud.hideBanner();
    CB.audio.music('play');
    state = 'playing';
  }

  /* Next wave: faster objects and shorter intervals; the banner shows while play goes on. */
  function nextWave() {
    wave += 1;
    spawnedInWave = 0;
    CB.hud.update(score, wave, null);
    CB.hud.setBar(0, cfg.survival.perWave);
    CB.hud.showBanner(CB.t('hud.wave') + ' ' + twoDigits(wave));
    bannerLeft = cfg.levelFlow.bannerMs / 1000;
    CB.audio.play('levelUp');
    if (wave >= cfg.survival.bossMusicFromWave) { CB.audio.music('boss'); }
    CB.screens.announce(CB.t('hud.waveUp').replace('{n}', wave));
  }

  /* ---------- win, game over and pause ---------- */

  /* VERIFIED sequence (Figma): "Now for real... heading to Earth", then "You made it home"
     with "Play again?". PROVISIONAL: the first screen lasts winFlow.headingMs. */
  function win() {
    stopPlay();
    state = 'won';
    CB.screens.show('win1');
    CB.audio.music('win');
    CB.screens.announce(CB.t('win.headingLine1') + ' ' + CB.t('win.headingLine2'));
    endTimer = window.setTimeout(function () {
      endTimer = null;
      CB.screens.show('win2');
      CB.screens.announce(CB.t('win.home') + ' ' + CB.t('win.playAgain'));
    }, cfg.winFlow.headingMs);
  }

  function readBest() {
    try { return parseInt(window.localStorage.getItem(cfg.survival.bestKey), 10) || 0; } catch (e) { return 0; }
  }

  function storeBest(value) {
    try { window.localStorage.setItem(cfg.survival.bestKey, String(value)); } catch (e) { /* private mode */ }
  }

  function gameOver() {
    stopPlay();
    state = 'over';
    var extra = '';
    if (isSurvival()) {
      var best = readBest();
      var isNew = score > best;
      if (isNew) { best = score; storeBest(best); }
      extra = CB.t('gameOver.score').replace('{score}', score) + ' · ' +
        (isNew ? CB.t('gameOver.newBest') : CB.t('gameOver.best').replace('{best}', best));
      document.getElementById('gameover-score').textContent = extra;
    }
    CB.screens.show('gameover');
    CB.audio.play('lose');
    CB.audio.music('over');
    CB.screens.announce(CB.t('gameOver.title') + (extra ? '. ' + extra : ''));
  }

  function pause() {
    if (state !== 'playing') { return; }
    state = 'paused';
    CB.input.disable();                       // shows the cursor, releases held keys
    CB.audio.duck(true);
    CB.audio.play('pause');
    CB.hud.showPause();
    CB.screens.announce(CB.t('pause.title'));
  }

  function resume() {
    if (state !== 'paused') { return; }
    state = 'playing';
    CB.hud.hidePause();
    CB.audio.duck(false);
    CB.audio.play('resume');
    CB.input.enable();
    CB.screens.focusGame();
  }

  function togglePause() {
    if (state === 'playing') { pause(); }
    else if (state === 'paused') { resume(); }
  }

  /* ---------- objects ---------- */

  function spawnAll(dt) {
    if (isBossLevel() && !cfg.boss.othersKeepSpawning) { return; }
    var speed = objectSpeed();
    var waveDone = false;
    for (var i = 0; i < KINDS.length; i++) {
      var kind = KINDS[i];
      spawnTimers[kind] -= dt;
      if (spawnTimers[kind] > 0) { continue; }
      spawnTimers[kind] = spawnEvery(kind);
      var n = burstSize(kind);
      for (var k = 0; k < n; k++) {
        objects.push(CB.entities.spawn(kind, speed, { fromTop: isSurvival() }));
      }
      if (isSurvival() && kind === 'meteorite') {
        spawnedInWave += 1;
        CB.hud.setBar(spawnedInWave, cfg.survival.perWave);
        if (spawnedInWave >= cfg.survival.perWave) { waveDone = true; }
      }
    }
    if (waveDone) { nextWave(); }
  }

  /* A shot is instant: whatever is under the crosshair at that moment is hit
     (CB.config.shot.instantAtCrosshair, PROVISIONAL: the original made "bullets",
     open question 14). Missing does nothing. One shot hits at most one object,
     the most recent one on top. */
  function shoot() {
    if (state !== 'playing') { return; }
    stats.shots += 1;
    CB.audio.play('shoot');
    if (!reducedMotion.matches) { shotPulse = cfg.entities.aimLine.pulseMs / 1000; }

    var aim = CB.input.aim;
    /* The boss is drawn on top, so it is checked first. */
    if (boss && CB.entities.bossHitBy(boss, aim.x, aim.y)) {
      explosions.push(CB.entities.spawnExplosion(aim.x, aim.y));
      stats.hits += 1;
      hitBossOnce(aim.x, aim.y);
      return;
    }
    for (var i = objects.length - 1; i >= 0; i--) {
      var o = objects[i];
      if (!CB.entities.hitBy(o, aim.x, aim.y)) { continue; }
      objects.splice(i, 1);
      explosions.push(CB.entities.spawnExplosion(o.x, o.y));
      stats.hits += 1;
      if (o.kind === 'meteorite') { CB.audio.play('hitMeteorite'); addPoints(cfg.points.meteorite, o.x, o.y); }
      else if (o.kind === 'trap') { CB.audio.play('hitTrap'); addPoints(cfg.points.trap, o.x, o.y); }
      else if (o.kind === 'star') {
        CB.audio.play('star');
        if (isSurvival()) { addLife(o.x, o.y); } else { addTime(cfg.powerup.extraMs, o.x, o.y); }
      }
      return;
    }
  }

  function updateEffects(dt) {
    for (var i = explosions.length - 1; i >= 0; i--) {
      if (!CB.entities.updateExplosion(explosions[i], dt)) { explosions.splice(i, 1); }
    }
    if (shotPulse > 0) { shotPulse -= dt; }
  }

  function update(dt) {
    CB.input.update(dt);
    spawnAll(dt);
    for (var i = objects.length - 1; i >= 0; i--) {
      var o = objects[i];
      if (isSurvival() && o.kind === 'meteorite' && o.y >= cfg.survival.groundY) {
        objects.splice(i, 1);
        loseLife(o);
        if (state !== 'playing') { return; }    // the last life ended the game
        continue;
      }
      if (!CB.entities.update(o, dt)) { objects.splice(i, 1); }
    }
    if (boss) { CB.entities.updateBoss(boss, dt); }
    updateEffects(dt);
    if (isSurvival()) {
      if (bannerLeft > 0) {
        bannerLeft -= dt;
        if (bannerLeft <= 0) { CB.hud.hideBanner(); }
      }
    } else if (!isBossLevel() || cfg.boss.timed) {
      tickTimer(dt);
    }
  }

  function draw(ctx) {
    var i;
    for (i = 0; i < objects.length; i++) { CB.entities.draw(ctx, objects[i]); }
    if (boss) { CB.entities.draw(ctx, boss); }
    for (i = 0; i < explosions.length; i++) { CB.entities.drawExplosion(ctx, explosions[i]); }
    CB.entities.drawHero(ctx);
    CB.entities.drawAimLine(ctx, aimOrigin(), CB.input.aim, shotPulse > 0);
    CB.entities.drawCrosshair(ctx, CB.input.aim);
  }

  function frame(dt, ctx) {
    if (state === 'idle' || state === 'over' || state === 'won') { return; }
    if (state === 'playing') {
      update(dt);
    } else if (state === 'transition') {
      updateEffects(dt);
      transitionLeft -= dt;
      if (transitionLeft <= 0) {
        state = 'playing';
        CB.hud.hideBanner();
      }
    }
    /* paused: scene stays as it was. A win inside update() switches to 'won'. */
    if (state === 'playing' || state === 'transition' || state === 'paused') { draw(ctx); }
  }

  /* ---------- lifecycle ---------- */

  function stopPlay() {
    state = 'idle';
    boss = null;
    CB.input.disable();
    if (endTimer) { window.clearTimeout(endTimer); endTimer = null; }
  }

  /* 'mission' or 'survival'. Also flips the mode-specific texts (#stage.mode-survival, css). */
  function setMode(next) {
    mode = next === 'survival' ? 'survival' : 'mission';
    CB.state.mode = mode;
    var stage = document.getElementById('stage');
    if (stage) { stage.classList.toggle('mode-survival', mode === 'survival'); }
  }

  /* New game in the current mode. Also what "restart" does from Game Over. */
  function start() {
    if (endTimer) { window.clearTimeout(endTimer); endTimer = null; }
    stats.shots = 0;
    stats.hits = 0;
    level = 1;
    score = 0;
    CB.input.resetAim();
    CB.hud.hidePause();
    CB.audio.warm();                 // start fetching the boss, win and Game Over music now
    if (isSurvival()) { beginSurvival(); } else { beginLevel(false); }
    CB.screens.show('game');
    CB.input.enable();
    CB.screens.announce(CB.t(isSurvival() ? 'game.startedSurvival' : 'game.started'));
  }

  function startSurvival() {
    setMode('survival');
    start();
  }

  function stop() {
    stopPlay();
    CB.hud.hidePause();
    CB.hud.hideBanner();
  }

  /* Debug only (index.html?debug=1, key CB.config.debug.skipLevelKey). In the boss level it wins;
     in survival it skips to the next wave. */
  function debugSkipLevel() {
    if (state === 'transition') {           // cut the banner short so repeated presses chain
      state = 'playing';
      CB.hud.hideBanner();
    }
    if (state !== 'playing') { return; }
    if (isSurvival()) { nextWave(); }
    else if (isBossLevel()) { win(); }
    else { levelCleared(); }
  }

  /* While paused, Tab stays on the pause dialog (its only control is the resume button). */
  function trapFocusWhilePaused(event) {
    if (state !== 'paused' || event.code !== 'Tab') { return; }
    event.preventDefault();
    var btn = document.getElementById('btn-resume');
    if (btn) { btn.focus(); }
  }

  function init() {
    CB.input.init();
    CB.hud.init();
    CB.input.onShoot(shoot);
    CB.input.onPause(togglePause);
    document.addEventListener('keydown', trapFocusWhilePaused);
    CB.stage.onFrame(frame);
    setMode('mission');
  }

  return {
    init: init,
    start: start,
    startSurvival: startSurvival,
    setMode: setMode,
    stop: stop,
    pause: pause,
    resume: resume,
    togglePause: togglePause,
    debugSkipLevel: debugSkipLevel,
    isPlaying: function () { return state === 'playing'; },
    getState: function () { return state; },
    getMode: function () { return mode; },
    stats: stats,
    getScore: function () { return score; },
    getLevel: function () { return level; },
    getWave: function () { return wave; },
    getLives: function () { return lives; },
    getTimeLeft: function () { return timeLeft; },
    count: function () { return objects.length; },
    list: function () { return objects; },    // read-only view for the debug overlay and tests
    getBoss: function () { return boss; }
  };
})();
