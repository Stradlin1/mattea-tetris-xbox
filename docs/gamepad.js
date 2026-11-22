/* Mattea Tetris Xbox: Gamepad API adapter. Gameplay remains in the original Tetris bundle. */
(function () {
  'use strict';
  var held = Object.create(null);
  var enabled = typeof navigator.getGamepads === 'function';
  var status;
  var bindings = [
    { name: 'left', code: 65 },
    { name: 'right', code: 68 },
    { name: 'down', code: 83 },
    { name: 'rotate', code: 75 },
    { name: 'drop', code: 32 },
    { name: 'pause', code: 80 },
    { name: 'restart', code: 82 }
  ];
  var nextFrame = window.requestAnimationFrame ?
    window.requestAnimationFrame.bind(window) : function (fn) { return setTimeout(fn, 16); };

  function send(code, pressed) {
    var type = pressed ? 'keydown' : 'keyup';
    var event = new KeyboardEvent(type, { bubbles: true, cancelable: true, key: String.fromCharCode(code) });
    // keyCode is required by the original game's legacy keyboard controls.
    try {
      Object.defineProperty(event, 'keyCode', { configurable: true, get: function () { return code; } });
      Object.defineProperty(event, 'which', { configurable: true, get: function () { return code; } });
    } catch (e) {}
    document.dispatchEvent(event);
  }

  function pressed(pad, index) {
    return !!(pad.buttons[index] && pad.buttons[index].pressed);
  }

  function readPad(pad) {
    var x = pad.axes.length > 0 ? pad.axes[0] : 0;
    var y = pad.axes.length > 1 ? pad.axes[1] : 0;
    return {
      left: pressed(pad, 14) || x < -0.45,
      right: pressed(pad, 15) || x > 0.45,
      down: pressed(pad, 13) || y > 0.45,
      rotate: pressed(pad, 1) || pressed(pad, 2) || pressed(pad, 4) || pressed(pad, 5),
      drop: pressed(pad, 0),
      pause: pressed(pad, 9) || pressed(pad, 3),
      restart: pressed(pad, 8)
    };
  }

  function tick() {
    var pads = enabled ? navigator.getGamepads() : [];
    var pad = null;
    if (pads) {
      for (var i = 0; i < pads.length; i++) {
        if (pads[i] && pads[i].connected && pads[i].mapping === 'standard') {
          pad = pads[i];
          break;
        }
      }
    }
    var state = pad ? readPad(pad) : {};
    if (state.left && state.right) { state.left = false; state.right = false; }
    if (state.rotate && held.rotate) state.rotate = true;
    bindings.forEach(function (binding) {
      var on = !!state[binding.name];
      if (!!held[binding.name] !== on) {
        held[binding.name] = on;
        send(binding.code, on);
      }
    });
    if (status) {
      var label = pad ? '手柄已连接 · ' + pad.id : '未检测到手柄 · 键盘可用';
      if (status.textContent !== label) status.textContent = label;
    }
    nextFrame(tick);
  }

  function init() {
    status = document.createElement('div');
    status.id = 'mattea-gamepad-status';
    status.setAttribute('role', 'status');
    status.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:10001;max-width:55vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:6px 10px;border-radius:7px;background:#153c3b;color:#f2f7f5;font:12px/1.4 sans-serif;pointer-events:none';
    document.body.appendChild(status);
    tick();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
