/* Cosmic Boing: screens, language and announcements.
   Screens are HTML <section class="screen" data-screen="name"> over the canvas.
   Only one is visible at a time. */

window.CB = window.CB || {};

CB.state = { screen: null, lang: CB.config.defaultLang };

/* CB.t('group.key') returns the text in the current language. */
CB.t = function (path) {
  var parts = path.split('.');
  var node = CB.strings[CB.state.lang];
  for (var i = 0; i < parts.length && node; i++) {
    node = node[parts[i]];
  }
  if (typeof node !== 'string') {
    console.warn('[Cosmic Boing] Missing string:', path, '(' + CB.state.lang + ')');
    return path;
  }
  return node;
};

CB.screens = (function () {
  var LANG_NAMES = { es: 'Español', en: 'English' };

  function applyStrings() {
    var nodes = document.querySelectorAll('[data-i18n]');
    var i;
    for (i = 0; i < nodes.length; i++) {
      nodes[i].textContent = CB.t(nodes[i].getAttribute('data-i18n'));
    }
    /* data-i18n-aria="group.key" sets aria-label instead of visible text. */
    var labelled = document.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < labelled.length; i++) {
      labelled[i].setAttribute('aria-label', CB.t(labelled[i].getAttribute('data-i18n-aria')));
    }
    /* The switch shows the language you would change TO, written in that language. */
    var other = CB.state.lang === 'es' ? 'en' : 'es';
    var label = document.getElementById('lang-label');
    label.textContent = LANG_NAMES[other];
    label.setAttribute('lang', other);
    if (CB.audio) { CB.audio.refreshLabel(); }     // its label depends on the mute state
  }

  function setLang(lang) {
    if (!CB.strings[lang]) { return; }
    CB.state.lang = lang;
    document.documentElement.lang = lang;
    applyStrings();
  }

  function toggleLang() {
    setLang(CB.state.lang === 'es' ? 'en' : 'es');
  }

  /* Shows one screen and hides the rest. Pass null to show none.
     Focus moves to the first button of the new screen, or to the screen itself
     when it has none (the game screen), so the keyboard never gets lost. */
  function show(name) {
    var all = document.querySelectorAll('.screen');
    var target = null;
    for (var i = 0; i < all.length; i++) {
      var match = all[i].getAttribute('data-screen') === name;
      all[i].hidden = !match;
      if (match) { target = all[i]; }
    }
    CB.state.screen = name;
    var stageEl = document.getElementById('stage');
    if (stageEl && stageEl.setAttribute) { stageEl.setAttribute('data-screen', name || ''); }   // css hooks per screen
    if (CB.audio) { CB.audio.onScreen(name); }     // menu screens share the title music
    if (target) {
      /* A screen with its own tabindex (the game area) takes focus itself: its buttons
         live in overlays that are hidden at this point. */
      if (target.hasAttribute('tabindex')) {
        target.focus({ preventScroll: true });
      } else {
        var first = target.querySelector('button');
        if (first) { first.focus({ preventScroll: true }); }   // never scroll the scaled stage
      }
    }
  }

  /* Puts keyboard focus back on the game area (after closing the pause overlay). */
  function focusGame() {
    var game = document.getElementById('screen-game');
    if (game) { game.focus({ preventScroll: true }); }
  }

  /* Text for screen readers: level changes, game over, win. */
  function announce(text) {
    var live = document.getElementById('live');
    live.textContent = '';
    window.setTimeout(function () { live.textContent = text; }, 50);
  }

  return {
    applyStrings: applyStrings,
    setLang: setLang,
    toggleLang: toggleLang,
    show: show,
    focusGame: focusGame,
    announce: announce
  };
})();
