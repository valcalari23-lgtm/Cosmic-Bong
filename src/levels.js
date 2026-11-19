/* Cosmic Boing: levels (stage 4).
   VERIFIED: three normal levels (code: if (nivel <= 3)), then the boss level (Figma).
   PROVISIONAL: the target score of each level (levels[i].targetScore, question 1),
   whether the shared speed grows per level (movement.speedGrowthPerLevel, question 8). */

window.CB = window.CB || {};

CB.levels = (function () {
  var cfg = CB.config;

  /* Points needed to clear a normal level (1-based). */
  function target(level) {
    var def = cfg.levels[level - 1];
    return def ? def.targetScore : 0;
  }

  /* Shared object speed for a level: base speed, times the growth factor per level. */
  function speed(level) {
    return cfg.movement.speedPxPerSec * Math.pow(cfg.movement.speedGrowthPerLevel, level - 1);
  }

  function isLastNormal(level) {
    return level >= cfg.normalLevels;
  }

  return {
    normalCount: cfg.normalLevels,
    target: target,
    speed: speed,
    isLastNormal: isLastNormal
  };
})();
