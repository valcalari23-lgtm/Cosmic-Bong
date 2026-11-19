/* Cosmic Boing: aiming and shooting input (stage 1).
   ADAPTATION: the original aimed with the phone's gyroscope and shot by tapping.
   Here the crosshair follows the mouse, or moves with the arrow keys / WASD,
   and a shot is a left click, Space or Enter. Keys: CB.config.input.keys.

   CB.input.aim      -> { x, y } crosshair position in stage coordinates, always inside the stage
   CB.input.onShoot  -> register fn() called once per shot
   CB.input.update   -> call every frame with dt (seconds) to apply keyboard aiming
   CB.input.enable / disable -> only listen while the game screen is active */

window.CB = window.CB || {};

CB.input = (function () {
  var W = CB.config.stage.width;
  var H = CB.config.stage.height;
  var keys = CB.config.input.keys;
  var speed = CB.config.input.keyboardAimSpeedPxPerSec;

  var aim = { x: W / 2, y: H / 2 };
  var held = { up: false, down: false, left: false, right: false };
  var shootHandlers = [];
  var pauseHandlers = [];
  var enabled = false;
  var stageEl;

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

  function onMouseMove(event) {
    if (!enabled) { return; }
    var p = CB.stage.toStagePoint(event);
    aim.x = p.x;
    aim.y = p.y;
    clamp();
  }

  function onMouseDown(event) {
    if (!enabled || event.button !== 0) { return; }
    /* Clicks on real buttons (language switch) are not shots. */
    if (event.target.closest('button')) { return; }
    onMouseMove(event);
    fireShot();
  }

  function firePause() {
    for (var i = 0; i < pauseHandlers.length; i++) { pauseHandlers[i](); }
  }

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

  function init() {
    stageEl = document.getElementById('stage');
    stageEl.addEventListener('mousemove', onMouseMove);
    stageEl.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', releaseAll);
  }

  function enable() {
    enabled = true;
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
    resetAim: resetAim,
    isKeyboardAiming: function () { return held.up || held.down || held.left || held.right; }
  };
})();
