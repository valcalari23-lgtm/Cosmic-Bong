/* Cosmic Boing: the HUD (stage 2). HTML over the canvas, inside #screen-game.
   Reference: docs/reference/00-gameplay-mockup.png
     - white bar, top left        -> progress toward the level's target score
                                     (PROVISIONAL meaning, open question 4; CB.config.hud.barShows)
     - "400 pts", top centre      -> score
     - "Nivel 01", top right      -> level, two digits
   Floating "+50" / "-50" labels appear over the impact point (CB.hud.popup). */

window.CB = window.CB || {};

CB.hud = (function () {
  var cfg = CB.config.hud;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var bar, fill, scoreEl, levelEl, timeEl, timeBox, popups, banner, pauseBox;

  function init() {
    bar = document.getElementById('hud-bar');
    fill = document.getElementById('hud-bar-fill');
    scoreEl = document.getElementById('hud-score');
    levelEl = document.getElementById('hud-level');
    timeEl = document.getElementById('hud-time');
    timeBox = document.getElementById('hud-time-box');
    popups = document.getElementById('popups');
    banner = document.getElementById('level-banner');
    pauseBox = document.getElementById('pause-overlay');
  }

  /* Big centred text over the game (level change, provisional transition). */
  function showBanner(text) {
    banner.textContent = text;
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  /* Pause overlay: dims the scene, focuses the resume button. */
  function showPause() {
    pauseBox.hidden = false;
    var btn = pauseBox.querySelector('button');
    if (btn) { btn.focus(); }
  }

  function hidePause() {
    pauseBox.hidden = true;
  }

  function twoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /* Level timer as m:ss. PROVISIONAL placement (question 5): under the bar, top left.
     Turns red for the last seconds (CB.config.hud.warnAtMs). */
  function updateTime(seconds) {
    var s = Math.max(0, Math.ceil(seconds));
    timeEl.textContent = Math.floor(s / 60) + ':' + twoDigits(s % 60);
    timeBox.classList.toggle('hud-time-low', seconds > 0 && seconds <= cfg.warnAtMs / 1000);
  }

  /* Redraws the numbers. target = points needed to clear the level (bar is full at target).
     In the boss level the bar is driven by setBar(hits, lives) instead. */
  function update(score, level, target) {
    scoreEl.textContent = String(score);
    levelEl.textContent = twoDigits(level);
    if (typeof target === 'number') { setBar(Math.max(0, score), target); }
  }

  /* The "cosmic bar": value out of max. Levels 1-3: score / target. Level 4: boss hits / lives. */
  function setBar(value, max) {
    var ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
    fill.style.width = (ratio * 100).toFixed(1) + '%';
    bar.setAttribute('aria-valuenow', String(value));
    bar.setAttribute('aria-valuemax', String(max));
  }

  /* A row of indicators: the first `on` of `total` are lit. null hides the row. */
  function setRow(id, on, total, onClass, offClass, label, glyph) {
    var box = document.getElementById(id);
    if (on === null) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    while (box.children.length < total) {
      var i = document.createElement('i');
      if (glyph) { i.textContent = glyph; }
      box.appendChild(i);
    }
    for (var k = 0; k < box.children.length; k++) {
      box.children[k].className = k < on ? onClass : offClass;
    }
    box.setAttribute('aria-label', label);
  }

  /* Boss lives: ten pips under the level label (level 4). null hides it (levels 1-3). */
  function setBossLives(livesLeft, total) {
    setRow('hud-boss', livesLeft, total, 'pip pip-on', 'pip', livesLeft === null ? '' : CB.t('boss.lives').replace('{n}', livesLeft));
  }

  /* Player lives (meteor shower mode): hearts under the bar. null hides them (mission). */
  function setLives(livesLeft, total) {
    setRow('hud-lives', livesLeft, total, 'life life-on', 'life', livesLeft === null ? '' : CB.t('hud.lives').replace('{n}', livesLeft), '\u2665');
  }

  /* The clock only belongs to the mission (the meteor shower has no timer). */
  function showTimer(on) {
    timeBox.hidden = !on;
  }

  /* Floating label at stage coordinates (x, y). kind: 'good' (green) or 'bad' (red).
     withClock adds the green clock icon (the star's reward in the instructions screen).
     The element removes itself; with reduced motion it only fades, without rising. */
  function popup(x, y, text, kind, withClock) {
    var el = document.createElement('span');
    el.className = 'popup popup-' + kind + (reducedMotion.matches ? ' popup-still' : '');
    if (withClock) {
      var icon = document.createElement('img');
      icon.src = CB.assets.manifest.iconTime;
      icon.alt = '';
      icon.className = 'popup-icon';
      el.appendChild(icon);
      el.appendChild(document.createTextNode(text));
    } else {
      el.textContent = text;
    }
    el.style.left = Math.round(x) + 'px';
    el.style.top = Math.round(y + cfg.popup.offsetY) + 'px';
    el.setAttribute('aria-hidden', 'true');     // the score itself is announced via the live region
    popups.appendChild(el);
    window.setTimeout(function () {
      if (el.parentNode) { el.parentNode.removeChild(el); }
    }, cfg.popup.durationMs);
  }

  function clearPopups() {
    while (popups.firstChild) { popups.removeChild(popups.firstChild); }
  }

  return {
    init: init,
    update: update,
    setBar: setBar,
    setBossLives: setBossLives,
    setLives: setLives,
    showTimer: showTimer,
    updateTime: updateTime,
    popup: popup,
    clearPopups: clearPopups,
    showBanner: showBanner,
    hideBanner: hideBanner,
    showPause: showPause,
    hidePause: hidePause
  };
})();
