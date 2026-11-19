/* Cosmic Boing: image list and preloader.
   Inventory, sizes and Figma node IDs: docs/03-assets.md */

window.CB = window.CB || {};

CB.assets = (function () {
  var manifest = {
    heroBack: 'assets/sprites/hero-back.png',
    heroFront: 'assets/sprites/hero-front.svg',
    heroTitle: 'assets/sprites/hero-title.png',
    heroHome: 'assets/sprites/hero-home.png',
    meteorite: 'assets/sprites/meteorite.svg',
    trapTank: 'assets/sprites/trap-tank.svg',
    star: 'assets/sprites/powerup-star.svg',
    boss: 'assets/sprites/boss.svg',
    explosion: 'assets/sprites/explosion.png',
    crosshair: 'assets/ui/crosshair.png',
    logo: 'assets/ui/logo.png',
    panel: 'assets/ui/panel.png',
    iconTap: 'assets/ui/icon-tap.png',
    iconTime: 'assets/ui/icon-time.png',
    /* Space background from Valeria (2026-11-18). If she adds the original PNG as space.png it is used first. */
    bgSpace: ['assets/backgrounds/space.png', 'assets/backgrounds/space.webp'],
    /* Full "heading to Earth" screen from Valeria (2026-11-19). PNG first if she adds it. The file has
       the Spanish title baked in, so the HTML heading sits on a plate over it (see css). */
    bgWinHeading: ['assets/backgrounds/win-heading.png', 'assets/backgrounds/win-heading.webp'],
    bgHome: 'assets/backgrounds/home.png',
    glassOverlay: 'assets/backgrounds/game-over-glass-overlay.png'
  };

  var images = {};
  var missing = [];

  /* Loads every image, then calls done(). A missing file never blocks the game:
     it is listed in CB.assets.missing and logged, so it can be added to
     "Pendientes" in docs/03-assets.md. */
  function load(done) {
    var keys = Object.keys(manifest);
    var left = keys.length;

    function settle() {
      left -= 1;
      if (left === 0) {
        if (missing.length) {
          console.warn('[Cosmic Boing] Missing assets:', missing.join(', '));
        }
        done();
      }
    }

    /* A manifest entry is a path, or a list of paths tried in order (first that loads wins). */
    keys.forEach(function (key) {
      var candidates = [].concat(manifest[key]);
      var img = new Image();
      var at = 0;
      img.onload = settle;
      img.onerror = function () {
        at += 1;
        if (at < candidates.length) { img.src = candidates[at]; return; }
        missing.push(candidates[0]);
        settle();
      };
      img.src = candidates[0];
      images[key] = img;
    });
  }

  function get(key) {
    return images[key];
  }

  return { manifest: manifest, missing: missing, load: load, get: get };
})();
