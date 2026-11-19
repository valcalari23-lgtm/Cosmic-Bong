/* Cosmic Boing: start-up.
   Flow: title -> instructions -> controls -> game (levels 1-3, boss) -> Game Over / win -> restart. */

window.CB = window.CB || {};

(function () {
  function isLanguageKey(event) {
    return CB.config.input.keys.language.indexOf(event.code) !== -1;
  }

  function startDebugOverlay() {
    var box = document.getElementById('debug');
    box.hidden = false;
    CB.stage.onFrame(function () {
      box.textContent =
        'fps    ' + Math.round(CB.stage.getFps()) + '\n' +
        'screen ' + CB.state.screen + '  state ' + CB.game.getState() + '\n' +
        'lang   ' + CB.state.lang + '\n' +
        'aim    ' + Math.round(CB.input.aim.x) + ', ' + Math.round(CB.input.aim.y) + (CB.input.isTilting() ? '  (tilt)' : '') + '\n' +
        'rocks  ' + CB.game.count() + '\n' +
        'shots  ' + CB.game.stats.shots + '  hits ' + CB.game.stats.hits + '\n' +
        'score  ' + CB.game.getScore() + '  level ' + CB.game.getLevel() + '  time ' + CB.game.getTimeLeft().toFixed(1) + '\n' +
        'missing assets ' + CB.assets.missing.length + '\n' +
        (CB.game.getBoss() ? 'boss   ' + CB.game.getBoss().lives + ' lives\n' : '') +
        'N: skip level';
    });
    document.addEventListener('keydown', function (event) {
      if (event.code === CB.config.debug.skipLevelKey && !event.repeat) { CB.game.debugSkipLevel(); }
    });
  }

  function init() {
    CB.stage.init();
    CB.game.init();
    CB.screens.setLang(CB.config.defaultLang);

    document.getElementById('btn-lang').addEventListener('click', CB.screens.toggleLang);
    document.addEventListener('keydown', function (event) {
      if (isLanguageKey(event) && !event.repeat) { CB.screens.toggleLang(); }
    });

    /* Flow: title -> instructions -> controls -> game (question 11: screens as in Figma). */
    document.getElementById('btn-start').addEventListener('click', function () {
      CB.screens.show('instructions');
      CB.screens.announce(CB.t('instructions.title'));
    });
    document.getElementById('btn-instructions-next').addEventListener('click', function () {
      CB.screens.show('controls');
      CB.screens.announce(CB.t('controls.title'));
    });
    document.getElementById('btn-controls-start').addEventListener('click', function () {
      CB.input.requestTilt();      // iOS asks for gyroscope permission here, inside the tap
      CB.game.start();
    });
    /* Touch devices get the phone hint on the controls screen. */
    if ('ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0) {
      document.documentElement.classList.add('is-touch');
    }
    /* Restarting after Game Over or a win goes straight back into the game. */
    document.getElementById('btn-restart').addEventListener('click', CB.game.start);
    document.getElementById('btn-play-again').addEventListener('click', CB.game.start);
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
