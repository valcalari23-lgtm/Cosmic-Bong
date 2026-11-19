/* Cosmic Boing: aiming and shooting input.
   ADAPTATION: the original aimed with the phone's gyroscope and shot by tapping.
   Here:
     - mouse: the crosshair follows the pointer; left click shoots
     - keyboard: arrow keys / WASD move the crosshair; Space or Enter shoots
     - phone (stage 8, faithful to the original): tilting the phone aims, tapping
       the screen shoots. Tilt aiming switches on by itself when the device delivers
       orientation data; the hold at the start of each game is the centre.
   Keys: CB.config.input.keys. Tilt tuning: CB.config.tilt.

   CB.input.aim      -> { x, y } crosshair position in stage coordinates, always inside the stage
   CB.input.onShoot  -> register fn() called once per shot
   CB.input.onPause  -> register fn() called when a pause key is pressed
   CB.input.update   -> call every frame with dt (seconds) to apply keyboard aiming
   CB.input.enable / disable -> only listen while the game screen is active
   CB.input.requestTilt -> ask iOS for orientation permission (call from a click handler) */

window.CB = window.CB || {};

CB.input = (function () {
  var W = CB.config.stage.width;
  var H = CB.config.stage.height;
  var keys = CB.config.input.keys;
  var speed = CB.config.input.keyboardAimSpeedPxPerSec;
  var tiltCfg = CB.config.tilt;

  var aim = { x: W / 2, y: H / 2 };
  var held = { up: false, down: false, left: false, right: false };
  var shootHandlers = [];
  var pauseHandlers = [];
  var enabled = false;
  var stageEl;
  var tilt = { active: false, center: null };

  function clamp() {
    aim.x = Math.max(0, Math.min(W, aim.x));
    aim.y = Math.max(0, Math.min(H, aim.y));
  }

  function directionOf(code) {
    for (var name in held) {
      if (keys[name].indexOf(code) !== -1) { return name; }
    }
    return null;
  }

  function fireShot() {
    for (var i = 0; i < shootHandlers.length; i++) { shootHandlers[i](); }
  }

  function firePause() {
    for (var i = 0; i < pauseHandlers.length; i++) { pauseHandlers[i](); }
  }

  /* ---------- pointer (mouse and touch) ---------- */

  function aimAt(event) {
    var p = CB.stage.toStagePoint(event);
    aim.x = p.x;
    aim.y = p.y;
    clamp();
  }

  function onPointerMove(event) {
    if (!enabled) { return; }
    if (event.pointerType === 'touch') { return; }     // fingers do not drag the crosshair
    aimAt(event);
  }

  function onPointerDown(event) {
    if (!enabled) { return; }
    /* Clicks and taps on real buttons (language switch, resume) are not shots. */
    if (event.target && event.target.closest && event.target.closest('button')) { return; }
    if (event.pointerType === 'touch') {
      /* Tap = shoot. Without tilt data (a tablet on a table), the tap also aims. */
      if (!tilt.active) { aimAt(event); }
      if (event.preventDefault) { event.preventDefault(); }
      fireShot();
      return;
    }
    if (event.button !== 0) { return; }
    aimAt(event);
    fireShot();
  }

  /* ---------- tilt (phone gyroscope) ---------- */

  /* Angle of the screen rotation, so tilting "right" is right in landscape too. */
  function screenAngle() {
    if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number') {
      return window.screen.orientation.angle;
    }
    return typeof window.orientation === 'number' ? window.orientation : 0;
  }

  function onOrientation(event) {
    if (!enabled) { return; }
    if (event.beta === null || event.beta === undefined || event.gamma === null || event.gamma === undefined) { return; }
    if (!tilt.center) {
      tilt.center = { beta: event.beta, gamma: event.gamma };   // the hold at game start is the centre
      tilt.active = true;
      return;
    }
    var db = event.beta - tilt.center.beta;      // front/back
    var dg = event.gamma - tilt.center.gamma;    // left/right
    var angle = screenAngle();
    var dx, dy;
    if (angle === 90) { dx = db; dy = -dg; }
    else if (angle === -90 || angle === 270) { dx = -db; dy = dg; }
    else { dx = dg; dy = db; }
    var tx = W / 2 + (dx / tiltCfg.rangeDeg) * (W / 2);
    var ty = H / 2 + (dy / tiltCfg.rangeDeg) * (H / 2);
    aim.x += (tx - aim.x) * tiltCfg.smoothing;
    aim.y += (ty - aim.y) * tiltCfg.smoothing;
    clamp();
  }

  /* iOS 13+ only delivers orientation events after an explicit permission request,
     which must come from a user gesture. Harmless elsewhere. */
  function requestTilt() {
    var DOE = window.DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === 'function') {
      DOE.requestPermission().catch(function () { /* denied: mouse/touch keep working */ });
    }
  }

  /* ---------- keyboard ---------- */

  function onKeyDown(event) {
    /* Pause keys work even while aiming is disabled (that is how you resume). */
    if (keys.pause.indexOf(event.code) !== -1) {
      event.preventDefault();
      if (!event.repeat) { firePause(); }
      return;
    }
    if (!enabled) { return; }
    /* With a real button focused (language switch, resume), Space and Enter belong to it. */
    if (event.target && event.target.tagName === 'BUTTON') { return; }
    var dir = directionOf(event.code);
    if (dir) {
      held[dir] = true;
      event.preventDefault();
      return;
    }
    if (keys.shoot.indexOf(event.code) !== -1) {
      event.preventDefault();
      if (!event.repeat) { fireShot(); }
    }
  }

  function onKeyUp(event) {
    var dir = directionOf(event.code);
    if (dir) { held[dir] = false; }
  }

  function releaseAll() {
    for (var name in held) { held[name] = false; }
  }

  /* Keyboard aiming: moves the crosshair while a direction key is held. */
  function update(dt) {
    if (!enabled) { return; }
    var dx = (held.right ? 1 : 0) - (held.left ? 1 : 0);
    var dy = (held.down ? 1 : 0) - (held.up ? 1 : 0);
    if (dx === 0 && dy === 0) { return; }
    var len = Math.sqrt(dx * dx + dy * dy);   // diagonals are not faster
    aim.x += (dx / len) * speed * dt;
    aim.y += (dy / len) * speed * dt;
    clamp();
  }

  /* ---------- lifecycle ---------- */

  function init() {
    stageEl = document.getElementById('stage');
    stageEl.addEventListener('pointermove', onPointerMove);
    stageEl.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('deviceorientation', onOrientation);
    window.addEventListener('blur', releaseAll);
  }

  function enable() {
    enabled = true;
    tilt.center = null;             // recalibrate: however the phone is held now is "centre"
    tilt.active = false;
    stageEl.classList.add('playing');
  }

  function disable() {
    enabled = false;
    releaseAll();
    stageEl.classList.remove('playing');
  }

  function onShoot(fn) {
    shootHandlers.push(fn);
  }

  function onPause(fn) {
    pauseHandlers.push(fn);
  }

  function resetAim() {
    aim.x = W / 2;
    aim.y = H / 2;
  }

  return {
    aim: aim,
    init: init,
    enable: enable,
    disable: disable,
    update: update,
    onShoot: onShoot,
    onPause: onPause,
    requestTilt: requestTilt,
    resetAim: resetAim,
    isTilting: function () { return tilt.active; },
    isKeyboardAiming: function () { return held.up || held.down || held.left || held.right; }
  };
})();
