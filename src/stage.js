/* Cosmic Boing: the stage.
   - Scales the fixed 1920 x 1080 stage to fit the window (letterboxed, 16:9).
   - Draws the space background: Valeria's image (assets/backgrounds/space.*),
     with a code-drawn fallback (near-black, purple and green clouds, cream stars)
     that also covers the first frames before the image loads.
   - Runs the animation loop. Game code hooks in with CB.stage.onFrame(fn). */

window.CB = window.CB || {};

CB.stage = (function () {
  var W = CB.config.stage.width;
  var H = CB.config.stage.height;

  var stageEl, canvas, ctx;
  var backdrop;            // offscreen canvas: background + clouds, drawn once
  var stars = [];
  var frameCallbacks = [];
  var lastTime = 0;
  var scale = 1;
  var fps = 0;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Small seeded random so the sky looks the same on every load. */
  function seeded(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function cloud(c, x, y, radius, rgb, alpha) {
    var g = c.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, 'rgba(' + rgb + ',' + alpha + ')');
    g.addColorStop(1, 'rgba(' + rgb + ',0)');
    c.fillStyle = g;
    c.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function buildBackdrop() {
    backdrop = document.createElement('canvas');
    backdrop.width = W;
    backdrop.height = H;
    var c = backdrop.getContext('2d');

    c.fillStyle = '#020103';
    c.fillRect(0, 0, W, H);

    var purple = '58,6,64';
    var green = '44,62,6';
    cloud(c, 1750, 120, 620, purple, 0.55);
    cloud(c, 1500, 720, 560, purple, 0.35);
    cloud(c, 700, 880, 520, purple, 0.28);
    cloud(c, 60, 520, 520, green, 0.6);
    cloud(c, 820, 60, 480, green, 0.45);
    cloud(c, 1180, 1040, 460, green, 0.5);
    cloud(c, 1880, 640, 300, green, 0.35);
  }

  function buildStars() {
    var rand = seeded(2023);
    stars = [];
    for (var i = 0; i < 46; i++) {
      stars.push({
        x: rand() * W,
        y: rand() * H,
        r: 6 + rand() * 16,
        base: 0.35 + rand() * 0.5,
        speed: 0.4 + rand() * 0.9,
        phase: rand() * Math.PI * 2
      });
    }
  }

  /* Valeria's background image (assets/backgrounds/space.*) when loaded; until then,
     or if the file is missing, the sky drawn by code below. */
  function drawBackground(timeSec) {
    var bg = CB.assets.get('bgSpace');
    if (bg && bg.complete && bg.naturalWidth) {
      ctx.drawImage(bg, 0, 0, W, H);
      return;
    }
    ctx.drawImage(backdrop, 0, 0);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var twinkle = reducedMotion.matches ? 0 : Math.sin(timeSec * s.speed + s.phase) * 0.18;
      var a = Math.max(0, Math.min(1, s.base + twinkle));
      var g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
      g.addColorStop(0, 'rgba(255,240,200,' + a + ')');
      g.addColorStop(0.25, 'rgba(255,230,170,' + a * 0.5 + ')');
      g.addColorStop(1, 'rgba(255,230,170,0)');
      ctx.fillStyle = g;
      ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
    }
  }

  function fit() {
    scale = Math.min(window.innerWidth / W, window.innerHeight / H);
    var left = (window.innerWidth - W * scale) / 2;
    var top = (window.innerHeight - H * scale) / 2;
    stageEl.style.transform = 'translate(' + left + 'px,' + top + 'px) scale(' + scale + ')';
  }

  function frame(now) {
    /* Ask for the next frame first: an error in one callback must not freeze the game. */
    window.requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - lastTime) / 1000 || 0);   // seconds, capped
    lastTime = now;
    if (dt > 0) { fps = fps * 0.9 + (1 / dt) * 0.1; }

    drawBackground(now / 1000);
    for (var i = 0; i < frameCallbacks.length; i++) {
      frameCallbacks[i](dt, ctx);
    }
  }

  function init() {
    stageEl = document.getElementById('stage');
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    buildBackdrop();
    buildStars();
    fit();
    window.addEventListener('resize', fit);
    window.requestAnimationFrame(frame);
  }

  /* Register a function called every frame, after the background is drawn:
     fn(dtSeconds, ctx). Draw gameplay here in stage 1 and later. */
  function onFrame(fn) {
    frameCallbacks.push(fn);
  }

  /* Converts a mouse event into stage coordinates (0..1920, 0..1080). */
  function toStagePoint(event) {
    var rect = stageEl.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / scale,
      y: (event.clientY - rect.top) / scale
    };
  }

  return {
    init: init,
    onFrame: onFrame,
    toStagePoint: toStagePoint,
    getFps: function () { return fps; },
    width: W,
    height: H
  };
})();
