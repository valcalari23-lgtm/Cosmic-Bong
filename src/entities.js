/* Cosmic Boing: things that appear on the stage.
   Stage 1: meteorites and explosions. Stage 3: trap tanks and stars.
   Sprites come from assets/sprites/ as-is. Sizes are in CB.config.entities.

   An object is { kind, x, y, age, lifetime, vx, vy }.
   kind: 'meteorite' (+50), 'trap' (-50), 'star' (extra time).
   x, y is the centre of the BODY you have to hit (rock, tank, star): the sprite may
   also contain a trail, which is not a target. CB.config.entities[kind].center says
   where the body sits inside the sprite. */

window.CB = window.CB || {};

CB.entities = (function () {
  var W = CB.config.stage.width;
  var H = CB.config.stage.height;
  var cfg = CB.config.entities;
  var motion = CB.config.movement;    // PROVISIONAL: speed, lifetime, drift direction, fade, margins
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Sprite image key and fallback width/height ratio per kind (ratio of the SVG files). */
  var SPRITES = {
    meteorite: { asset: 'meteorite', ratio: 220 / 285 },
    trap:      { asset: 'trapTank',  ratio: 121 / 279 },
    star:      { asset: 'star',      ratio: 292 / 277 },
    boss:      { asset: 'boss',      ratio: 237 / 315 }
  };

  /* ---------- Objects (meteorite, trap, star) ---------- */

  /* All three kinds share one speed and direction (the original used one shared velEne).
     The trails in the sprites point up-right, so bodies drift down-left along them. */
  /* opts.fromTop (meteor shower mode): the object enters above the stage and falls, roughly
     straight down, and lives until it leaves the stage. Otherwise (mission) it appears inside
     the stage and drifts down-left for movement.lifetimeMs. */
  function spawn(kind, speed, opts) {
    opts = opts || {};
    var margin = motion.spawnMargin;
    var v = typeof speed === 'number' ? speed : motion.speedPxPerSec;   // CB.levels.speed(level)
    var x = margin.left + Math.random() * (W - margin.left - margin.right);
    var y, angle, lifetime;
    if (opts.fromTop) {
      var spread = (typeof opts.spreadDeg === 'number' ? opts.spreadDeg : CB.config.survival.fallAngleSpreadDeg || 0) * Math.PI / 180;
      angle = Math.PI / 2 + (Math.random() * 2 - 1) * spread;
      y = -cfg[kind].size / 2;
      lifetime = 60;
    } else {
      angle = motion.driftAngleDeg * Math.PI / 180;
      y = margin.top + Math.random() * (H - margin.top - margin.bottom);
      lifetime = motion.lifetimeMs / 1000;
    }
    return {
      kind: kind,
      x: x,
      y: y,
      vx: Math.cos(angle) * v,
      vy: Math.sin(angle) * v,
      age: 0,
      lifetime: lifetime
    };
  }

  /* Returns false when the object should be removed: after its lifetime (PROVISIONAL),
     or as soon as it has drifted fully off the stage, since nothing off-screen can be shot.
     Object motion is gameplay, so it stays on under prefers-reduced-motion; only the
     decorative animations (twinkle, popups, explosion scaling, shot pulse) are stilled. */
  function update(o, dt) {
    o.age += dt;
    o.x += o.vx * dt;
    o.y += o.vy * dt;
    var pad = cfg[o.kind].size;
    var offStage = o.x < -pad || o.x > W + pad || o.y < -pad || o.y > H + pad;
    return o.age < o.lifetime && !offStage;
  }

  /* Drawn size of a sprite: `size` is its height, width follows the file's own ratio. */
  function spriteBox(img, size, fallbackRatio) {
    var ratio = (img && img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : fallbackRatio;
    return { w: size * ratio, h: size };
  }

  function draw(ctx, o) {
    var sprite = SPRITES[o.kind];
    var k = cfg[o.kind];
    var img = CB.assets.get(sprite.asset);
    var box = spriteBox(img, k.size, sprite.ratio);
    /* Fade out over the last part of its life so it never just pops away. */
    var left = o.lifetime - o.age;
    var alpha = Math.min(1, left / (motion.fadeOutMs / 1000));
    if (typeof o.alpha === 'number') { alpha = o.alpha; }      // boss: dims briefly after a hit
    /* Sprite top-left from the body centre. */
    var sx = o.x - box.w * k.center.x;
    var sy = o.y - box.h * k.center.y;

    ctx.save();
    ctx.globalAlpha = alpha;
    if (img && img.complete && img.naturalWidth) {
      ctx.drawImage(img, sx, sy, box.w, box.h);
    } else {
      placeholder(ctx, sx, sy, box.w, box.h, o.kind);
    }
    ctx.restore();
  }

  /* Does a shot at (px, py) hit this object?
     VERIFIED rule from the original code: hit when the shot is closer than
     CB.config.hit.radiusPx to the object's position (here, the body centre). */
  function hitBy(o, px, py) {
    var dx = px - o.x;
    var dy = py - o.y;
    var r = CB.config.hit.radiusPx;
    return dx * dx + dy * dy < r * r;
  }

  /* ---------- Boss (level 4) ----------
     VERIFIED: 10 lives. PROVISIONAL (question 9): patrols left-right along one line
     near the top, bouncing at the ends, and dims for a moment when hit. */

  function spawnBoss(speed) {
    var b = CB.config.boss;
    return {
      kind: 'boss',
      x: (b.patrol.minX + b.patrol.maxX) / 2,
      y: b.patrol.y,
      dir: 1,
      speed: speed * b.speedFactor,
      lives: b.lives,
      flash: 0,                 // seconds left of the post-hit dim
      alpha: 1,
      age: 0,
      lifetime: Infinity
    };
  }

  function updateBoss(boss, dt) {
    var b = CB.config.boss;
    boss.age += dt;
    boss.x += boss.dir * boss.speed * dt;
    if (boss.x > b.patrol.maxX) { boss.x = b.patrol.maxX; boss.dir = -1; }
    if (boss.x < b.patrol.minX) { boss.x = b.patrol.minX; boss.dir = 1; }
    if (boss.flash > 0) { boss.flash -= dt; }
    boss.alpha = boss.flash > 0 ? 0.45 : 1;
  }

  function bossHitBy(boss, px, py) {
    var dx = px - boss.x;
    var dy = py - boss.y;
    var r = CB.config.boss.hitRadiusPx;
    return dx * dx + dy * dy < r * r;
  }

  /* One hit: a life less and a brief dim. Returns the lives left. */
  function hitBoss(boss) {
    boss.lives -= 1;
    boss.flash = CB.config.boss.flashMs / 1000;
    return boss.lives;
  }

  /* ---------- Explosion ---------- */

  function spawnExplosion(x, y) {
    return { kind: 'explosion', x: x, y: y, age: 0, lifetime: cfg.explosion.durationMs / 1000 };
  }

  function updateExplosion(e, dt) {
    e.age += dt;
    return e.age < e.lifetime;
  }

  function drawExplosion(ctx, e) {
    var img = CB.assets.get('explosion');
    var t = e.age / e.lifetime;          // 0 -> 1
    var size = cfg.explosion.size;
    var scale = reducedMotion.matches ? 1 : (cfg.explosion.scaleFrom + (cfg.explosion.scaleTo - cfg.explosion.scaleFrom) * t);
    var alpha = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
    var w = size * scale;

    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    if (img && img.complete && img.naturalWidth) {
      ctx.drawImage(img, e.x - w / 2, e.y - w / 2, w, w);
    } else {
      placeholder(ctx, e.x - w / 2, e.y - w / 2, w, w, 'explosion');
    }
    ctx.restore();
  }

  /* ---------- Hero (static, drawn each frame) ---------- */

  /* centerX defaults to the fixed position of the mission; the space run moves the hero.
     alpha < 1 draws the hero faded (blinking after a hit). */
  function drawHero(ctx, centerX, alpha) {
    var img = CB.assets.get('heroBack');
    var h = cfg.hero;
    var cx = typeof centerX === 'number' ? centerX : h.centerX;
    var x = cx - h.width / 2;
    var y = H - h.height + h.bottomOverflow;
    if (typeof alpha === 'number' && alpha < 1) { ctx.save(); ctx.globalAlpha = Math.max(0, alpha); }
    if (img && img.complete && img.naturalWidth) {
      ctx.drawImage(img, x, y, h.width, h.height);
    } else {
      placeholder(ctx, x, y, h.width, h.height, 'hero-back');
    }
    if (typeof alpha === 'number' && alpha < 1) { ctx.restore(); }
  }

  /* Space run: does the object's body touch the hero standing at heroX? */
  function touchesHero(o, heroX) {
    var r = CB.config.run.hitRadiusPx;
    var dx = o.x - heroX;
    var dy = o.y - (H - CB.config.run.heroCenterYOffset);
    return dx * dx + dy * dy < r * r;
  }

  /* ---------- Crosshair and aim line ---------- */

  function drawAimLine(ctx, from, to, pulse) {
    ctx.save();
    ctx.strokeStyle = CB.config.colors.bad;
    ctx.lineWidth = pulse ? cfg.aimLine.widthOnShot : cfg.aimLine.width;
    ctx.lineCap = 'round';
    ctx.setLineDash(cfg.aimLine.dash);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawCrosshair(ctx, at) {
    var img = CB.assets.get('crosshair');
    var size = cfg.crosshair.size;
    if (img && img.complete && img.naturalWidth) {
      ctx.drawImage(img, at.x - size / 2, at.y - size / 2, size, size);
    } else {
      ctx.save();
      ctx.strokeStyle = CB.config.colors.bad;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(at.x, at.y, size / 2 - 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* Obvious stand-in for a missing image, as CLAUDE.md asks. */
  function placeholder(ctx, x, y, w, h, name) {
    ctx.save();
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#ff00ff';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(name, x + w / 2, y + h / 2);
    ctx.restore();
  }

  return {
    spawn: spawn,
    update: update,
    draw: draw,
    hitBy: hitBy,
    spawnBoss: spawnBoss,
    updateBoss: updateBoss,
    bossHitBy: bossHitBy,
    hitBoss: hitBoss,
    spawnExplosion: spawnExplosion,
    updateExplosion: updateExplosion,
    drawExplosion: drawExplosion,
    drawHero: drawHero,
    touchesHero: touchesHero,
    drawAimLine: drawAimLine,
    drawCrosshair: drawCrosshair
  };
})();
