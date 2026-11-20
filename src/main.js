/* Cosmic Boing: start-up.
   Flow: title -> instructions -> controls -> game (levels 1-3, boss) -> Game Over / win -> restart. */

window.CB = window.CB || {};

(function () {
  function isLanguageKey(event) {
    return CB.config.input.keys.language.indexOf(event.code) !== -1;
  }
  function isSoundKey(event) {
    return CB.config.input.keys.sound.indexOf(event.code) !== -1;
  }

  /* Dashed slots show a file name until their image loads; then the frame disappears. */
  function watchAssetSlots() {
    var imgs = document.querySelectorAll('.asset-slot img');
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        function mark() { img.parentNode.classList.add('has-image'); }
        if (img.complete && img.naturalWidth) { mark(); } else { img.addEventListener('load', mark); }
      })(imgs[i]);
    }
  }

  function startDebugOverlay() {
    var box = document.getElementById('debug');
    box.hidden = false;
    CB.stage.onFrame(function () {
      box.textContent =
        'fps    ' + Math.round(CB.stage.getFps()) + '\n' +
        'screen ' + CB.state.screen + '  state ' + CB.game.getState() + '  mode ' + CB.game.getMode() + '\n' +
        'lang   ' + CB.state.lang + '\n' +
        'aim    ' + Math.round(CB.input.aim.x) + ', ' + Math.round(CB.input.aim.y) + (CB.input.isTilting() ? '  (tilt)' : '') + '\n' +
        'rocks  ' + CB.game.count() + '\n' +
        'shots  ' + CB.game.stats.shots + '  hits ' + CB.game.stats.hits + '\n' +
        'score  ' + CB.game.getScore() + '  level ' + CB.game.getLevel() + '  time ' + CB.game.getTimeLeft().toFixed(1) + '\n' +
        'missing assets ' + CB.assets.missing.length + '\n' +
        'music  ' + (CB.audio.current() || '-') + (CB.audio.isMuted() ? '  (muted)' : '') + '\n' +
        (CB.game.getBoss() ? 'boss   ' + CB.game.getBoss().lives + ' lives\n' : '') +
        (CB.game.getMode() !== 'mission' ? 'lives  ' + CB.game.getLives() + '  wave ' + CB.game.getWave() + '  tanks ' + CB.game.getTanks() + '  heroX ' + Math.round(CB.game.getHeroX()) + '\n' : '') +
        'N: skip level';
    });
    document.addEventListener('keydown', function (event) {
      if (event.code === CB.config.debug.skipLevelKey && !event.repeat) { CB.game.debugSkipLevel(); }
    });
  }

  function init() {
    CB.stage.init();
    CB.game.init();
    CB.audio.init();
    CB.screens.setLang(CB.config.defaultLang);
    watchAssetSlots();

    /* Every button click makes a sound; the two corner switches have a lighter one. */
    document.addEventListener('click', function (event) {
      var btn = event.target.closest ? event.target.closest('button') : null;
      if (!btn) { return; }
      CB.audio.play(btn.classList.contains('corner-btn') ? 'uiToggle' : 'uiPress');
    });
    document.getElementById('btn-lang').addEventListener('click', CB.screens.toggleLang);
    document.addEventListener('keydown', function (event) {
      if (event.repeat) { return; }
      if (isLanguageKey(event)) { CB.screens.toggleLang(); }
      if (isSoundKey(event)) { CB.audio.toggle(); }
    });

    /* Flow: title -> instructions -> controls -> game (question 11: screens as in Figma).
       The title offers two modes (stage 10); both go through the same instructions and controls. */
    function toInstructions(mode) {
      return function () {
        CB.game.setMode(mode);
        CB.screens.show('instructions');
        CB.screens.announce(CB.t('instructions.title') + (mode === 'survival' ? '. ' + CB.t('title.survival') : ''));
      };
    }
    document.getElementById('btn-start').addEventListener('click', toInstructions('mission'));
    document.getElementById('btn-survival').addEventListener('click', toInstructions('survival'));
    document.getElementById('btn-run').addEventListener('click', toInstructions('run'));
    document.getElementById('btn-instructions-next').addEventListener('click', function () {
      CB.screens.show('controls');
      CB.screens.announce(CB.t('controls.title'));
    });
    document.getElementById('btn-controls-next').addEventListener('click', function () {
      CB.screens.show('ready');
      CB.screens.announce(CB.t('ready.title') + '. ' + CB.t('common.press') + ' ' + CB.t('title.toStart'));
    });
    document.getElementById('btn-ready-start').addEventListener('click', function () {
      CB.input.requestTilt();      // iOS asks for gyroscope permission here, inside the tap
      CB.game.start();
    });
    /* Touch devices get the phone hint on the controls screen. */
    if ('ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0) {
      document.documentElement.classList.add('is-touch');
    }
    /* Restarting after Game Over or a win goes straight back into the game (same mode).
       The last win screen also offers the meteor shower. */
    document.getElementById('btn-restart').addEventListener('click', CB.game.start);
    document.getElementById('btn-play-again').addEventListener('click', function () { CB.game.setMode('mission'); CB.game.start(); });
    /* Exit (Valeria, 2026-11-20): from the pause dialog, Game Over or the last win screen, back to the start. */
    document.getElementById('btn-exit').addEventListener('click', CB.game.exit);
    document.getElementById('btn-home-gameover').addEventListener('click', CB.game.exit);
    document.getElementById('btn-home-win').addEventListener('click', CB.game.exit);
    document.getElementById('btn-resume').addEventListener('click', CB.game.resume);

    CB.assets.load(function () {
      /* Win screen 1: use Valeria's full artwork when it loaded; otherwise the dashed slots stay. */
      var art = CB.assets.get('bgWinHeading');
      if (art && art.complete && art.naturalWidth) {
        var bg = document.querySelector('.win1-bg');
        bg.src = art.src;
        bg.hidden = false;
        document.getElementById('screen-win1').classList.add('has-art');
      }
      CB.screens.show('title');
      if (CB.config.debug.enabled) { startDebugOverlay(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
