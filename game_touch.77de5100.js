// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/model/game.model.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var direction;

(function (direction) {
  direction[direction["clockwise"] = -1] = "clockwise";
  direction[direction["\u0441\u0421lockwise"] = 1] = "\u0441\u0421lockwise";
})(direction = exports.direction || (exports.direction = {}));
},{}],"src/helpers/radiant-transformer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.getRadians = function (degrees) {
  return Math.PI / 180 * degrees;
};
},{}],"src/helpers/randomizer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.randomIntegerInRange = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};
},{}],"src/game/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var game_model_1 = require("../model/game.model");

var radiant_transformer_1 = require("../helpers/radiant-transformer");

var randomizer_1 = require("../helpers/randomizer");

var clockwise = game_model_1.direction.clockwise,
    сСlockwise = game_model_1.direction.сСlockwise;
var _a = document.body.getClientRects()[0],
    width = _a.width,
    height = _a.height;
var canvasSize = width > height ? height : width;
var canvasMiddlePosition = canvasSize / 2;
var radius = canvasMiddlePosition * 0.9;
var innerRadius = radius / 3;
var minimumEnemyOffset = 20;
var canvasMiddlePoint = {
  x: canvasMiddlePosition,
  y: canvasMiddlePosition
};
var x = canvasMiddlePoint.x,
    y = canvasMiddlePoint.y;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.canvas.width = canvasSize;
ctx.canvas.height = canvasSize;
ctx.canvas.style.backgroundColor = 'white';

var setStaticFigures = function setStaticFigures(canvasCtx) {
  canvasCtx.beginPath();
  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = 'black';
  canvasCtx.lineJoin = 'bevel';
  canvasCtx.arc(x, y, radius, 0, radiant_transformer_1.getRadians(360));
  canvasCtx.stroke();
  canvasCtx.beginPath();
  canvasCtx.arc(x, y, innerRadius, 0, radiant_transformer_1.getRadians(360));
  canvasCtx.stroke();
};

var angle = 179;
var pointerDirection = clockwise;

var setDocumentListener = function setDocumentListener(listener) {
  document.addEventListener('click', listener);
  document.addEventListener('keydown', listener);
};

var drowPointer = function drowPointer(angle, canvasCtx, usedColor, isForClear) {
  var angleRad = radiant_transformer_1.getRadians(angle);
  var xPosition = radius * Math.sin(angleRad) + x;
  var yPosition = radius * Math.cos(angleRad) + y;
  canvasCtx.beginPath();
  canvasCtx.lineWidth = isForClear ? 4 + 2 : 4;
  canvasCtx.lineJoin = 'round';
  canvasCtx.strokeStyle = usedColor;
  canvasCtx.moveTo(x, y);
  canvasCtx.lineTo(xPosition, yPosition);
  canvasCtx.stroke();
};

var cleanUpPreviosPointer = function cleanUpPreviosPointer(canvasCtx) {
  canvasCtx.lineWidth = 4 + 2;
  canvasCtx.strokeStyle = 'white';
  canvasCtx.stroke();
};

var getUpdatedAngle = function getUpdatedAngle(updatedAngle, direction) {
  return direction === clockwise ? updatedAngle <= 0 ? 360 : updatedAngle : updatedAngle >= 360 ? 0 : updatedAngle;
};

var performPointerItaration = function performPointerItaration(canvasCtx) {
  cleanUpPreviosPointer(canvasCtx);
  setStaticFigures(canvasCtx);
  drowPointer(angle - pointerDirection, canvasCtx, 'white', true);
  drowPointer(angle, canvasCtx, 'blue', false);
  angle = getUpdatedAngle(angle + pointerDirection, pointerDirection);
};

var calclulateEnemy = function calclulateEnemy(angle) {
  var minEnemyPosition = Math.abs(angle % 360) + minimumEnemyOffset;
  var maxEnemyPosition = minEnemyPosition + 360 - minimumEnemyOffset;
  var middlePointAngle = randomizer_1.randomIntegerInRange(minimumEnemyOffset, maxEnemyPosition) % 360;
  var distanceFromMiddlePoint = randomizer_1.randomIntegerInRange(innerRadius, radius * 0.9);
  var enemyRadius = randomizer_1.randomIntegerInRange(innerRadius * 0.1, innerRadius * 0.4);
  var angleRad = radiant_transformer_1.getRadians(middlePointAngle);
  var xPosition = distanceFromMiddlePoint * Math.sin(angleRad) + x;
  var yPosition = distanceFromMiddlePoint * Math.cos(angleRad) + y;
  var angleOffset = Math.atan(enemyRadius / distanceFromMiddlePoint) * 180 / Math.PI;
  var min = middlePointAngle - angleOffset;
  var max = middlePointAngle + angleOffset;
  return {
    xPosition: xPosition,
    yPosition: yPosition,
    enemyRadius: enemyRadius,
    middlePointAngle: middlePointAngle,
    enemyAngleRange: [min, max]
  };
};

var enemyCoords;

var drowEnemy = function drowEnemy(angle, canvasCtx) {
  if (!enemyCoords) {
    enemyCoords = calclulateEnemy(angle);
  }

  var xPosition = enemyCoords.xPosition,
      yPosition = enemyCoords.yPosition,
      enemyRadius = enemyCoords.enemyRadius;
  canvasCtx.beginPath();
  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = 'red';
  canvasCtx.arc(xPosition, yPosition, enemyRadius, 0, radiant_transformer_1.getRadians(360));
  canvasCtx.stroke();
};

var startGame = function startGame() {
  setInterval(function () {
    performPointerItaration(ctx);
    drowEnemy(angle, ctx);
  }, 10);
};

var updateEnemyStatus = function updateEnemyStatus() {
  if (!enemyCoords) {
    return;
  }

  var _a = enemyCoords.enemyAngleRange,
      min = _a[0],
      max = _a[1];
  var validatedAngle = angle === 360 ? 0 : angle;
  var isEnemyInRange = validatedAngle > min && validatedAngle < max;
  console.log(min, validatedAngle, max);

  if (isEnemyInRange) {
    enemyCoords = null;
  }
};

var changePointerDirection = function changePointerDirection() {
  pointerDirection = pointerDirection === clockwise ? сСlockwise : clockwise;
  updateEnemyStatus();
};

var isGameStarted = false;

var addListenerToStartGame = function addListenerToStartGame(listener) {
  var button = document.getElementById('button');
  button.addEventListener('keydown', function (event) {
    return event.preventDefault();
  });
  button.addEventListener('click', function () {
    if (!isGameStarted) {
      isGameStarted = true;
      listener();
      document.body.focus();
    }
  });
};

setDocumentListener(changePointerDirection);
addListenerToStartGame(startGame);
},{"../model/game.model":"src/model/game.model.ts","../helpers/radiant-transformer":"src/helpers/radiant-transformer.ts","../helpers/randomizer":"src/helpers/randomizer.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./src/game/");
},{"./src/game/":"src/game/index.ts"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49602" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/game_touch.77de5100.js.map