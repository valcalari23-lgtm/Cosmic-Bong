/* Cosmic Boing: music and sound effects.

   The original game had no audio (docs/03-assets.md), so everything here is new (ADAPTATION).
   Since 2026-11-20 the game ships public-domain (CC0) music and effects in assets/audio
   (CB.config.audio.files and .sfx; credits in assets/audio/CREDITOS.md). They play through
   <audio> elements, which work from file:// without fetch. If a file is missing, fails to load
   or the browser cannot play its format, the synthesized version below takes its place, so no
   event is ever silent (same fallback idea as the images).

   Browsers only start sound after a user gesture, so unlock() runs on the first click or key.
   Without Web Audio (very old browser, the test harness) every function is a harmless no-op.

   Tracks: 'title' (menus), 'play' (levels 1-3), 'boss' (level 4), 'win' and 'over' (once).
   Effects: see SFX below (names shared with CB.config.audio.sfx). */

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
  var sfxFiles = {};       // effect name -> HTMLAudioElement that finished loading (cloned to play)
  var button = null;

  var MENU_SCREENS = { title: true, instructions: true, controls: true, ready: true };
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
     Style (Valeria, 2026-11-20): classic arcade space shooter. Pulse-wave leads, a driving bass
     in octaves, a straight kick-snare beat; minor keys for the action, a bright fanfare to win.
     Each voice loops on its own length, so a 4-bar bass line fits under an 8-bar melody.
     division = steps per beat (2 = eighths, 4 = sixteenths). len = note length in steps.
     Drums: k = kick, s = snare, h = hi-hat (letters can combine). */

  var TRACKS = {
    /* Menus: arcade "attract mode". A minor, octave bass, square lead. Am - F - C - G. */
    title: {
      bpm: 150,
      division: 2,
      loop: true,
      voices: [
        { wave: 'square', vol: 0.13, len: 0.9, pattern:
          'A4 . A4 . C5 . E5 . | D5 . C5 . B4 . . . | A4 . A4 . C5 . E5 . | G5 . E5 . D5 . . . | ' +
          'A4 . A4 . C5 . E5 . | D5 . C5 . B4 . . . | C5 . B4 . A4 . G4 . | A4 . . . . . . .' },
        { wave: 'square', vol: 0.11, len: 0.8, pattern:
          'A2 A3 A2 A3 A2 A3 A2 A3 | F2 F3 F2 F3 F2 F3 F2 F3 | C3 C4 C3 C4 C3 C4 C3 C4 | G2 G3 G2 G3 G2 G3 G2 G3' }
      ],
      drums: 'k h s h k h s h'
    },
    /* Levels 1-3: fast, driving sixteenth-note bass. E minor. Em - C - D - B. */
    play: {
      bpm: 170,
      division: 4,
      loop: true,
      voices: [
        { wave: 'square', vol: 0.12, len: 1.6, pattern:
          'E5 . . . G5 . . . B5 . . . G5 . E5 . | C5 . . . E5 . . . G5 . . . E5 . . . | ' +
          'D5 . . . F#5 . . . A5 . . . F#5 . D5 . | B4 . . . D#5 . . . F#5 . . . . . . . | ' +
          'E5 . E5 . G5 . B5 . E6 . . . B5 . G5 . | C6 . . . B5 . . . G5 . . . E5 . . . | ' +
          'D5 . F#5 . A5 . D6 . A5 . F#5 . D5 . . . | B4 . . . D#5 . . . F#5 . . . B5 . . .' },
        { wave: 'sawtooth', vol: 0.1, len: 0.7, pattern:
          'E2 E2 E3 E2 E2 E3 E2 E2 E2 E2 E3 E2 E2 E3 E2 E2 | C2 C2 C3 C2 C2 C3 C2 C2 C2 C2 C3 C2 C2 C3 C2 C2 | ' +
          'D2 D2 D3 D2 D2 D3 D2 D2 D2 D2 D3 D2 D2 D3 D2 D2 | B1 B1 B2 B1 B1 B2 B1 B1 B1 B1 B2 B1 B1 B2 B1 B1' }
      ],
      drums: 'k . h . s . h . k . h . s . h h'
    },
    /* Boss: faster, menacing, chromatic bass. D minor. */
    boss: {
      bpm: 180,
      division: 4,
      loop: true,
      voices: [
        { wave: 'square', vol: 0.13, len: 1.2, pattern:
          'D5 . . . . . F5 . . . E5 . . . D5 . | Bb4 . . . A4 . . . G#4 . . . A4 . . . | ' +
          'D5 . . . . . F5 . . . G5 . . . A5 . | Bb5 . . . A5 . . . G#5 . A5 . . . . .' },
        { wave: 'sawtooth', vol: 0.12, len: 0.7, pattern:
          'D2 D2 D3 D2 D2 D2 D3 D2 D2 D2 D3 D2 Eb2 Eb2 D2 D2 | Bb1 Bb1 Bb2 Bb1 Bb1 Bb1 Bb2 Bb1 A1 A1 A2 A1 A1 A1 A2 A1' }
      ],
      drums: 'k . h h s . h . k . k . s . h h'
    },
    /* "Heading to Earth": stage-clear fanfare, played once. */
    win: {
      bpm: 140,
      division: 2,
      loop: false,
      voices: [
        { wave: 'square', vol: 0.14, len: 1.3, pattern: 'C5 . E5 . G5 . C6 . | E6 . . . D6 . C6 . | D6 . E6 . G6 . . . | G6 . . . . . . .' },
        { wave: 'triangle', vol: 0.3, len: 1.3, pattern: 'C5 . E5 . G5 . C6 . | E6 . . . D6 . C6 . | D6 . E6 . G6 . . . | G6 . . . . . . .' },
        { wave: 'square', vol: 0.07, len: 3.5, pattern: 'C4 . . . E4 . . . | G4 . . . C5 . . . | D4 . . . F4 . . . | G4 . . . . . . .' }
      ],
      drums: 'k . s . k . s .'
    },
    /* Game Over: the classic "wah wah wah" walk down, played once. */
    over: {
      bpm: 90,
      division: 2,
      loop: false,
      voices: [
        { wave: 'square', vol: 0.14, len: 1.8, pattern: 'E4 . Eb4 . D4 . Db4 . | C4 . . . . . . .' },
        { wave: 'sawtooth', vol: 0.08, len: 1.8, pattern: 'E3 . Eb3 . D3 . Db3 . | C3 . . . . . . .' },
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

  function noise(dest, t, dur, vol, filterType, filterHz, sweepToHz) {
    if (!noiseBuffer) {
      noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var data = noiseBuffer.getChannelData(0);
      for (var i = 0; i < data.length; i++) { data[i] = Math.random() * 2 - 1; }
    }
    var src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    var filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterHz, t);
    if (sweepToHz) { filter.frequency.exponentialRampToValueAtTime(sweepToHz, t + dur); }
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

  /* Arcade vocabulary: laser "pew", filtered-noise explosions, an alarm for the boss,
     a rising arpeggio for the power-up, a buzzer for the trap. */
  var SFX = {
    shoot: function (t) {
      tone(sfxGain, 'square', 1600, t, 0.1, 0.24, 120);          // laser: fast sweep down
      tone(sfxGain, 'sawtooth', 800, t, 0.07, 0.08, 100);
    },
    hitMeteorite: function (t) {
      noise(sfxGain, t, 0.45, 0.7, 'lowpass', 3000, 200);        // explosion: noise closing down
      tone(sfxGain, 'sine', 120, t, 0.35, 0.6, 30);              // thump
    },
    hitTrap: function (t) {
      tone(sfxGain, 'sawtooth', 200, t, 0.35, 0.14);             // buzzer: two detuned saws
      tone(sfxGain, 'sawtooth', 211, t, 0.35, 0.14);
      tone(sfxGain, 'square', 150, t + 0.02, 0.3, 0.1, 90);
    },
    star: function (t) {
      ['C6', 'E6', 'G6', 'C7', 'E7', 'G7'].forEach(function (n, i) { tone(sfxGain, 'square', freq(n), t + i * 0.05, 0.14, 0.14); });
    },
    bossHit: function (t) {
      noise(sfxGain, t, 0.5, 0.8, 'lowpass', 1800, 120);
      tone(sfxGain, 'square', 160, t, 0.4, 0.3, 40);
    },
    bossArrives: function (t) {                                  // alarm siren, twice
      tone(sfxGain, 'sawtooth', 300, t, 0.4, 0.2, 600);
      tone(sfxGain, 'sawtooth', 600, t + 0.4, 0.4, 0.2, 300);
      tone(sfxGain, 'sawtooth', 300, t + 0.8, 0.4, 0.2, 600);
      tone(sfxGain, 'sawtooth', 600, t + 1.2, 0.4, 0.2, 300);
    },
    levelUp: function (t) {                                      // stage clear arpeggio
      ['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C7'].forEach(function (n, i) { tone(sfxGain, 'square', freq(n), t + i * 0.06, 0.22, 0.16); });
      tone(sfxGain, 'square', freq('C7'), t + 0.45, 0.5, 0.14);
      tone(sfxGain, 'square', freq('E6'), t + 0.45, 0.5, 0.08);
    },
    warning: function (t) {                                      // three alarm beeps
      tone(sfxGain, 'square', 1200, t, 0.08, 0.2);
      tone(sfxGain, 'square', 1200, t + 0.18, 0.08, 0.2);
      tone(sfxGain, 'square', 1200, t + 0.36, 0.08, 0.2);
    },
    pause: function (t)  { tone(sfxGain, 'triangle', 660, t, 0.1, 0.2); tone(sfxGain, 'triangle', 440, t + 0.1, 0.15, 0.2); },
    resume: function (t) { tone(sfxGain, 'triangle', 440, t, 0.1, 0.2); tone(sfxGain, 'triangle', 660, t + 0.1, 0.15, 0.2); }
  };

  /* ---------- sequencer ---------- */

  function startTrack(name) {
    var track = TRACKS[name];
    var gain = ctx.createGain();
    gain.connect(musicGain);
    var stepSec = 60 / track.bpm / (track.division || 2);
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

  /* Plays one effect: the CC0 file when it loaded (cloned so quick repeats overlap), otherwise
     the synthesized version. repeat/everyMs in the config play short loops a few times. */
  function play(name) {
    if (!ready()) { return; }
    var def = cfg.sfx && cfg.sfx[name];
    var src = sfxFiles[name];
    if (src && def) {
      if (muted) { return; }
      var times = def.repeat || 1;
      for (var i = 0; i < times; i++) {
        (function (delay) {
          window.setTimeout(function () {
            if (muted) { return; }
            var a = src.cloneNode();
            a.volume = Math.min(1, cfg.sfxVolume * (def.gain || 1));
            var p = a.play();
            if (p && p.catch) { p.catch(noop); }
          }, delay);
        })(i * (def.everyMs || 500));
      }
      return;
    }
    if (SFX[name]) { SFX[name](ctx.currentTime); }
  }

  /* Asks the browser to fetch the music that is not preloaded (called when a game starts). */
  function warm() {
    Object.keys(files).forEach(function (name) {
      var a = files[name];
      if (a.preload !== 'auto') { a.preload = 'auto'; a.load(); }
    });
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

  /* The audio files (cfg.files, cfg.sfx): each is used only once the browser confirms it can play
     it. A missing file, a load error or an unsupported format leaves the synthesized fallback. */
  function mimeOf(path) {
    var ext = (path.split('.').pop() || '').toLowerCase();
    return { mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav', m4a: 'audio/mp4' }[ext] || '';
  }

  function canPlay(probe, path) {
    var mime = mimeOf(path);
    return !mime || !probe.canPlayType || probe.canPlayType(mime) !== '';
  }

  function preloadFiles() {
    if (typeof window.Audio !== 'function') { return; }
    var probe = new window.Audio();
    var first = cfg.preloadFirst || [];
    Object.keys(cfg.files || {}).forEach(function (name) {
      if (!canPlay(probe, cfg.files[name])) { return; }
      var a = new window.Audio();
      a.preload = first.indexOf(name) !== -1 ? 'auto' : 'metadata';
      a.addEventListener('canplay', function () { files[name] = a; });
      a.addEventListener('error', noop);          // missing file: the synthesized track stays
      a.src = cfg.files[name];
    });
    Object.keys(cfg.sfx || {}).forEach(function (name) {
      var def = cfg.sfx[name];
      if (!def.file || !canPlay(probe, def.file)) { return; }
      var a = new window.Audio();
      a.preload = 'auto';
      a.addEventListener('canplaythrough', function () { sfxFiles[name] = a; });
      a.addEventListener('error', noop);
      a.src = def.file;
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
    warm: warm,
    duck: duck,
    onScreen: onScreen,
    toggle: toggle,
    setMuted: setMuted,
    refreshLabel: refreshLabel,
    isMuted: function () { return muted; },
    isSupported: function () { return supported; },
    current: function () { return current; },
    /* Which real files are ready (the rest fall back to synthesis). For the debug overlay and tests. */
    loaded: function () { return { music: Object.keys(files), sfx: Object.keys(sfxFiles) }; },
    tracks: TRACKS
  };
})();
