// Self-hosted BGM for Mattea Tetris.
// The audio element has no native controls: the player never traps game keyboard input.
// Browsers may block audible autoplay until the first user gesture.
(function () {
  'use strict';

  var SOURCE = 'https://stradlin1.github.io/mattea-tetris/BGM_320kbps.mp3';
  var PLAYER_ID = 'mattea-bgm-player';
  var DEFAULT_VOLUME = 0.42;

  function init() {
    ['mattea-bgm-control', 'mattea-bgm-local', 'mattea-bgm-single', PLAYER_ID].forEach(function (id) {
      var old = document.getElementById(id);
      if (old && old.parentNode) old.parentNode.removeChild(old);
    });

    var audio = document.createElement('audio');
    audio.id = 'mattea-bgm-audio';
    audio.src = SOURCE;
    audio.loop = true;
    audio.autoplay = true;
    audio.controls = false;
    audio.preload = 'auto';
    audio.volume = DEFAULT_VOLUME;
    audio.style.display = 'none';

    var panel = document.createElement('aside');
    panel.id = PLAYER_ID;
    panel.setAttribute('aria-label', 'Background music controls');
    panel.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:10000;display:flex;align-items:center;gap:7px;flex-wrap:wrap;max-width:calc(100vw - 24px);padding:8px 10px;border:1px solid #60b6a3;border-radius:10px;background:#132e31;color:#f4f7f5;box-shadow:0 4px 16px #0003;font:12px/1.4 system-ui,sans-serif;';

    function makeButton(label, title) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.title = title;
      button.style.cssText = 'border:1px solid #7fbcad;border-radius:6px;background:#24474a;color:#f4f7f5;padding:5px 9px;cursor:pointer;font:600 12px system-ui,sans-serif;';
      return button;
    }

    var toggle = makeButton('♫ BGM', 'Play or pause background music');
    toggle.setAttribute('aria-label', 'Play or pause background music');
    var quieter = makeButton('−', 'Decrease BGM volume');
    quieter.setAttribute('aria-label', 'Decrease background music volume');
    var louder = makeButton('+', 'Increase BGM volume');
    louder.setAttribute('aria-label', 'Increase background music volume');

    var status = document.createElement('span');
    status.setAttribute('role', 'status');
    status.style.cssText = 'min-width:95px;font:11px/1.4 system-ui,sans-serif;color:#d5e9e4;white-space:nowrap;';

    var wanted = true;
    var blocked = false;
    var failed = false;

    function focusGame() {
      var game = document.getElementById('root');
      if (!game) return;
      if (!game.hasAttribute('tabindex')) game.setAttribute('tabindex', '-1');
      try { game.focus({ preventScroll: true }); }
      catch (error) { game.focus(); }
    }

    function updateUI() {
      var playing = !audio.paused && !failed;
      toggle.textContent = playing ? '♫ Pause BGM' : '♫ Play BGM';
      toggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
      if (failed) {
        toggle.disabled = true;
        status.textContent = '音频加载失败';
      } else if (playing) {
        status.textContent = '循环 · ' + Math.round(audio.volume * 100) + '%';
      } else if (wanted && blocked) {
        status.textContent = '按任意键启动';
      } else if (wanted) {
        status.textContent = '准备播放…';
      } else {
        status.textContent = '已暂停 · ' + Math.round(audio.volume * 100) + '%';
      }
    }

    function attemptPlay() {
      if (!wanted || failed) return;
      try {
        var promise = audio.play();
        if (promise && typeof promise.then === 'function') {
          promise.then(function () {
            blocked = false;
            updateUI();
          }).catch(function (error) {
            if (!wanted || failed) return;
            if (error && error.name === 'AbortError') return;
            blocked = true;
            updateUI();
          });
        }
      } catch (error) {
        blocked = true;
        updateUI();
      }
    }

    function onInteraction(event) {
      if (!wanted || failed || !audio.paused) return;
      // The player's buttons handle their own clicks. Do not pre-play on pointerdown:
      // it would make a subsequent click unexpectedly pause the just-started audio.
      if (panel.contains(event.target)) return;
      // Never preventDefault or stopPropagation: WASD and Space must reach the game.
      attemptPlay();
    }

    toggle.addEventListener('click', function () {
      if (audio.paused) {
        wanted = true;
        blocked = false;
        attemptPlay();
      } else {
        wanted = false;
        blocked = false;
        audio.pause();
      }
      updateUI();
      focusGame();
    });

    function volumeBy(change) {
      audio.volume = Math.max(0, Math.min(1, Math.round((audio.volume + change) * 100) / 100));
      if (wanted && audio.paused) attemptPlay();
      updateUI();
      focusGame();
    }

    quieter.addEventListener('click', function () { volumeBy(-0.1); });
    louder.addEventListener('click', function () { volumeBy(0.1); });

    audio.addEventListener('playing', function () {
      blocked = false;
      updateUI();
    });
    audio.addEventListener('pause', updateUI);
    audio.addEventListener('volumechange', updateUI);
    audio.addEventListener('error', function () {
      failed = true;
      updateUI();
    });

    panel.appendChild(toggle);
    panel.appendChild(quieter);
    panel.appendChild(louder);
    panel.appendChild(status);
    document.body.appendChild(audio);
    document.body.appendChild(panel);

    document.addEventListener('keydown', onInteraction, true);
    document.addEventListener('pointerdown', onInteraction, true);
    document.addEventListener('touchstart', onInteraction, true);
    updateUI();

    // Try audible autoplay immediately, without a click or opening any BGM panel.
    // If the browser rejects this, the first gameplay key/click retries playback.
    attemptPlay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
