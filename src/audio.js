/* Cosmic Boing: music and sound effects.

   The original game had no audio (docs/03-assets.md), so everything here is new (ADAPTATION).
   Music and effects are synthesized with the Web Audio API: the game ships no audio files and
   fetches nothing. If Valeria adds her own tracks under the names in CB.config.audio.files,
   those play instead of the synthesized loops (same fallback idea as the images).

   Browsers only start sound after a user gesture, so unlock() runs on the first click or key.
   Without Web Audio (very old browser, the test harness) every function is a harmless no-op.

   Tracks: 'title' (menus), 'play' (levels 1-3), 'boss' (level 4), 'win' and 'over' (jingles).
   Effects: see SFX below. */

window.CB = window.CB || {};

CB.audio = (function () {
  var cfg = CB.config.audio;
  var Ctx = window.AudioContext || window.webkitAudioContext;
  var supported = !!Ctx;

  var ctx = null;
  var master = null;       // mute switch
  var duckGain = null;     // lowers the music while paused
  var musicGain = null;    // music volume
  var sfxGain = null;
  var noiseBuffer = null;

  var unlocked = false;
  var muted = false;
  var wanted = null;       // music track asked for before the first gesture
  var current = null;      // music track playing now
  var player = null;       // { stop() } of the running track
  var files = {};          // track name -> HTMLAudioElement that finished loading
  var button = null;

  var MENU_SCREENS = { title: true, instructions: true, controls: true };
  var LOOKAHEAD_S = 0.25;
  var TICK_MS = 50;

  function noop() {}

  /* ---------- notes ---------- */

  var NOTE_INDEX = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };

  /* 'A4' -> 440 Hz */
  function freq(note) {
    var m = /^([A-G][#b]?)(-?\d)$/.exec(note);
    var semitone = NOTE_INDEX[m[1]] + (parseInt(m[2], 10) + 1) * 12;   // A4 = 69
    return 440 * Math.pow(2, (semitone - 69) / 12);
  }

  /* 'C4 . E4 | G4 . . .' -> one entry per eighth note; '.' is a rest. Bars ('|') are only for reading. */
  function steps(pattern) {
    return pattern.replace(/\|/g, ' ').trim().split(/\s+/).map(function (s) {
      return s === '.' ? null : s;
    });
  }

  /* ---------- the music, written as patterns ----------
     Each voice loops on its own length, so a 4-bar bass line fits under an 8-bar melody.
     len = note length in eighths. Drums: k = kick, s = snare, h = hi-hat (letters can combine). */

  var TRACKS = {
    /* Menus: calm, major, slow. C - Am - F - G. */
    title: {
      bpm: 96,
      loop: true,
      voices: [
        { wave: 'triangle', vol: 0.45, len: 1.6, pattern:
          'E5 . G5 . A5 . G5 . | E5 . . . D5 . C5 . | D5 . E5 . G5 . E5 . | D5 . . . . . . . | ' +
          'E5 . G5 . A5 . C6 . | B5 . . . A5 . G5 . | A5 . G5 . E5 . D5 . | C5 . . . . . . .' },
        { wave: 'square', vol: 0.09, len: 1.8, pattern:
          'C3 . . . G3 . . . | A2 . . . E3 . . . | F2 . . . C3 . . . | G2 . . . D3 . . .' },
        { wave: 'sine', vol: 0.18, len: 0.9, pattern:
          '. C4 E4 G4 . E4 G4 C5 | . A3 C4 E4 . C4 E4 A4 | . F3 A3 C4 . A3 C4 F4 | . G3 B3 D4 . B3 D4 G4' }
      ]
    },
    /* Levels 1-3: upbeat. Am - F - C - G. */
    play: {
      bpm: 140,
      loop: true,
      voices: [
        { wave: 'square', vol: 0.14, len: 0.9, pattern:
          'A4 . C5 . E5 . C5 . | F4 . A4 . C5 . A4 . | C5 . E5 . G5 . E5 . | G4 . B4 . D5 . B4 . | ' +
          'A4 . A4 C5 E5 . E5 . | F5 . E5 . C5 . A4 . | G4 . A4 . C5 . D5 . | E5 . . . . . . .' },
        { wave: 'square', vol: 0.11, len: 0.8, pattern:
          'A2 . A2 A2 A3 . A2 A2 | F2 . F2 F2 F3 . F2 F2 | C3 . C3 C3 C4 . C3 C3 | G2 . G2 G2 G3 . G2 G2' }
      ],
      drums: 'k h s h k h s hh'
    },
    /* Boss: tense, minor, fast. Dm - Dm - Bb - A. */
    boss: {
      bpm: 160,
      loop: true,
      voices: [
        { wave: 'square', vol: 0.14, len: 0.9, pattern:
          'D5 . D5 F5 . E5 D5 . | C5 . D5 . A4 . . . | Bb4 . D5 . F5 . D5 . | A4 . C#5 . E5 . A5 . | ' +
          'D5 . D5 F5 . E5 D5 . | C5 . D5 . A4 . . . | Bb4 . A4 . G4 . F4 . | E4 . C#5 . . . . .' },
        { wave: 'sawtooth', vol: 0.1, len: 0.7, pattern:
          'D2 D2 D3 D2 D2 D2 D3 D2 | D2 D2 D3 D2 D2 D2 D3 D2 | Bb1 Bb1 Bb2 Bb1 Bb1 Bb1 Bb2 Bb1 | A1 A1 A2 A1 A1 A1 A2 A1' }
      ],
      drums: 'k h s h k k s h'
    },
    /* "Heading to Earth": a short bright fanfare, played once. */
    win: {
      bpm: 120,
      loop: false,
      voices: [
        { wave: 'triangle', vol: 0.4, len: 1.4, pattern: 'C5 E5 G5 C6 . G5 C6 . | E6 . . . . . . .' },
        { wave: 'sine', vol: 0.16, len: 8, pattern: 'C4 . . . . . . . | C4 . . . . . . .' },
        { wave: 'sine', vol: 0.12, len: 8, pattern: 'G4 . . . . . . . | E4 . . . . . . .' }
      ]
    },
    /* Game Over: four steps down and a low note, played once. */
    over: {
      bpm: 72,
      loop: false,
      voices: [
        { wave: 'square', vol: 0.14, len: 1.9, pattern: 'E4 . Eb4 . D4 . C#4 . | C4 . . . . . . .' },
        { wave: 'triangle', vol: 0.2, len: 8, pattern: 'A2 . . . . . . . | F2 . . . . . . .' }
      ]
    }
  };

  /* ---------- synthesis ---------- */

  function tone(dest, wave, f, t, dur, vol, slideTo) {
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(f, t);
    if (slideTo) { osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur); }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  function noise(dest, t, dur, vol, filterType, filterHz) {
    if (!noiseBuffer) {
      noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var data = noiseBuffer.getChannelData(0);
      for (var i = 0; i < data.length; i++) { data[i] = Math.random() * 2 - 1; }
    }
    var src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    var filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = filterHz;
    var g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(dest);
    src.start(t);
    src.stop(t + dur + 0.03);
  }

  function kick(dest, t)  { tone(dest, 'sine', 150, t, 0.13, 0.5, 45); }
  function snare(dest, t) { noise(dest, t, 0.12, 0.25, 'highpass', 1500); tone(dest, 'triangle', 180, t, 0.08, 0.2); }
  function hat(dest, t)   { noise(dest, t, 0.04, 0.1, 'highpass', 7000); }

  /* ---------- sound effects ---------- */

  var SFX = {
    shoot: function (t) { tone(sfxGain, 'square', 900, t, 0.12, 0.22, 200); },
    hitMeteorite: function (t) {
      noise(sfxGain, t, 0.3, 0.5, 'lowpass', 1400);
      tone(sfxGain, 'sine', 140, t, 0.25, 0.5, 40);
    },
    hitTrap: function (t) {
      tone(sfxGain, 'sawtooth', 320, t, 0.35, 0.2, 70);
      tone(sfxGain, 'square', 240, t + 0.05, 0.3, 0.1, 60);
    },
    star: function (t) {
      ['C6', 'E6', 'G6', 'C7'].forEach(function (n, i) { tone(sfxGain, 'triangle', freq(n), t + i * 0.07, 0.18, 0.3); });
    },
    bossHit: function (t) {
      noise(sfxGain, t, 0.35, 0.6, 'lowpass', 900);
      tone(sfxGain, 'square', 220, t, 0.3, 0.28, 50);
    },
    bossArrives: function (t) {
      tone(sfxGain, 'sawtooth', freq('D2'), t, 0.9, 0.28);
      tone(sfxGain, 'sawtooth', freq('A2'), t + 0.1, 0.8, 0.18);
    },
    levelUp: function (t) {
      ['G5', 'C6', 'E6', 'G6'].forEach(function (n, i) { tone(sfxGain, 'square', freq(n), t + i * 0.09, 0.2, 0.16); });
    },
    warning: function (t) {
      tone(sfxGain, 'square', 880, t, 0.1, 0.18);
      tone(sfxGain, 'square', 880, t + 0.2, 0.1, 0.18);
    },
    pause: function (t)  { tone(sfxGain, 'triangle', 660, t, 0.1, 0.2); tone(sfxGain, 'triangle', 440, t + 0.1, 0.15, 0.2); },
    resume: function (t) { tone(sfxGain, 'triangle', 440, t, 0.1, 0.2); tone(sfxGain, 'triangle', 660, t + 0.1, 0.15, 0.2); }
  };

  /* ---------- sequencer ---------- */

  function startTrack(name) {
    var track = TRACKS[name];
    var gain = ctx.createGain();
    gain.connect(musicGain);
    var stepSec = 60 / track.bpm / 2;
    var voices = track.voices.map(function (v) { return { v: v, notes: steps(v.pattern) }; });
    var drums = track.drums ? steps(track.drums) : null;
    var length = 0;
    voices.forEach(function (x) { length = Math.max(length, x.notes.length); });
    var step = 0;
    var next = ctx.currentTime + 0.05;
    var timer = null;

    function tick() {
      /* If the clock jumped (context was suspended, tab was hidden), skip the missed notes
         instead of playing them all at once. */
      if (next < ctx.currentTime - 0.05) { next = ctx.currentTime + 0.02; }
      while (next < ctx.currentTime + LOOKAHEAD_S) {
        if (!track.loop && step >= length) { window.clearInterval(timer); timer = null; return; }
        voices.forEach(function (x) {
          var n = x.notes[step % x.notes.length];
          if (n) { tone(gain, x.v.wave, freq(n), next, stepSec * x.v.len, x.v.vol); }
        });
        if (drums) {
          var d = drums[step % drums.length] || '';
          if (d.indexOf('k') !== -1) { kick(gain, next); }
          if (d.indexOf('s') !== -1) { snare(gain, next); }
          if (d.indexOf('h') !== -1) { hat(gain, next); }
        }
        step += 1;
        next += stepSec;
      }
    }

    timer = window.setInterval(tick, TICK_MS);
    tick();
    return {
      stop: function () {
        if (timer) { window.clearInterval(timer); timer = null; }
        var t = ctx.currentTime;
        gain.gain.setValueAtTime(gain.gain.value, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.2);
        window.setTimeout(function () { gain.disconnect(); }, 400);
      }
    };
  }

  function startFile(name) {
    var a = files[name];
    a.loop = !!TRACKS[name].loop;
    a.volume = cfg.musicVolume;
    a.muted = muted;
    a.currentTime = 0;
    var p = a.play();
    if (p && p.catch) { p.catch(noop); }
    return { stop: function () { a.pause(); }, element: a };
  }

  /* ---------- public: music ---------- */

  function ready() {
    return supported && unlocked && ctx;
  }

  function stopMusic() {
    if (player) { player.stop(); player = null; }
    current = null;
  }

  /* Switches to a track. A looping track already playing keeps going (levels 1 to 3 share
     one loop); a jingle restarts. null stops the music. */
  function music(name) {
    wanted = name;
    if (!ready()) { return; }
    if (name && name === current && TRACKS[name].loop) { return; }
    stopMusic();
    if (!name || !TRACKS[name]) { return; }
    current = name;
    player = files[name] ? startFile(name) : startTrack(name);
  }

  function onScreen(screen) {
    if (MENU_SCREENS[screen]) { music('title'); }
  }

  /* Lower the music while paused (cfg.duckWhilePaused), back to full on resume. */
  function duck(on) {
    if (!ready()) { return; }
    var level = on ? cfg.duckWhilePaused : 1;
    var t = ctx.currentTime;
    duckGain.gain.setValueAtTime(duckGain.gain.value, t);
    duckGain.gain.linearRampToValueAtTime(level, t + 0.15);
    if (player && player.element) { player.element.volume = cfg.musicVolume * level; }
  }

  /* ---------- public: effects ---------- */

  function play(name) {
    if (!ready() || !SFX[name]) { return; }
    SFX[name](ctx.currentTime);
  }

  /* ---------- mute ---------- */

  function storeMuted(value) {
    try { window.localStorage.setItem(cfg.storageKey, value ? 'off' : 'on'); } catch (e) { /* private mode */ }
  }

  function readMuted() {
    try { return window.localStorage.getItem(cfg.storageKey) === 'off'; } catch (e) { return false; }
  }

  function refreshLabel() {
    if (!button) { return; }
    button.setAttribute('aria-label', CB.t(muted ? 'common.soundUnmute' : 'common.soundMute'));
    button.classList.toggle('is-muted', muted);
  }

  function setMuted(value, announce) {
    muted = !!value;
    if (ctx) { master.gain.value = muted ? 0 : 1; }
    Object.keys(files).forEach(function (k) { files[k].muted = muted; });
    storeMuted(muted);
    refreshLabel();
    if (announce) { CB.screens.announce(CB.t(muted ? 'common.soundOff' : 'common.soundOn')); }
  }

  function toggle() {
    setMuted(!muted, true);
  }

  /* ---------- start-up ---------- */

  function stopListeningForGestures() {
    document.removeEventListener('pointerdown', unlock, true);
    document.removeEventListener('keydown', unlock, true);
  }

  /* User gestures: the first one creates the context (iOS needs this inside the gesture) and
     starts whatever track was asked for while locked. Later ones keep asking the context to
     run until the browser agrees (it may stay suspended if the first gesture did not count). */
  function unlock() {
    if (!supported) { return; }
    if (ctx) {
      if (ctx.state === 'running') { stopListeningForGestures(); return; }
      if (ctx.resume) { ctx.resume().catch(noop); }
      return;
    }
    ctx = new Ctx();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    duckGain = ctx.createGain();              // 1 normally, cfg.duckWhilePaused while paused
    duckGain.connect(master);
    musicGain = ctx.createGain();             // overall music level; tracks connect here
    musicGain.gain.value = cfg.musicVolume;
    musicGain.connect(duckGain);
    sfxGain = ctx.createGain();
    sfxGain.gain.value = cfg.sfxVolume;
    sfxGain.connect(master);
    if (ctx.resume) { ctx.resume().catch(noop); }
    unlocked = true;
    if (ctx.state === 'running') { stopListeningForGestures(); }
    if (wanted) { music(wanted); }
  }

  /* Optional files from Valeria: used only once they have fully loaded (see cfg.files). */
  function preloadFiles() {
    if (typeof window.Audio !== 'function' || !cfg.files) { return; }
    Object.keys(cfg.files).forEach(function (name) {
      var a = new window.Audio();
      a.preload = 'auto';
      a.addEventListener('canplaythrough', function () { files[name] = a; });
      a.addEventListener('error', noop);          // missing file: the synthesized track stays
      a.src = cfg.files[name];
    });
  }

  /* Silence while the tab is hidden; back when it shows (unless muted). */
  function onVisibility() {
    if (!ctx) { return; }
    if (document.hidden) {
      ctx.suspend();
      if (player && player.element) { player.element.pause(); }
    } else {
      ctx.resume().catch(noop);
      if (player && player.element) { var p = player.element.play(); if (p && p.catch) { p.catch(noop); } }
    }
  }

  function init() {
    muted = readMuted();
    button = document.getElementById('btn-sound');
    if (button) { button.addEventListener('click', toggle); }
    refreshLabel();
    if (!supported) { return; }
    document.addEventListener('pointerdown', unlock, true);
    document.addEventListener('keydown', unlock, true);
    document.addEventListener('visibilitychange', onVisibility);
    preloadFiles();
  }

  return {
    init: init,
    music: music,
    play: play,
    duck: duck,
    onScreen: onScreen,
    toggle: toggle,
    setMuted: setMuted,
    refreshLabel: refreshLabel,
    isMuted: function () { return muted; },
    isSupported: function () { return supported; },
    current: function () { return current; },
    tracks: TRACKS
  };
})();
