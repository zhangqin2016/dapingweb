+!~-(function(PIXI, window, document, undefined) {
  var isCanvasSupported = function() {
  };
  var setupRAF = function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  };
  if (isCanvasSupported()) {
    setupRAF();
  } /* Second plugin */
  var w, h, renderer, stage, waveGraphics, partGraphics, waveTexture, partTexture, waveCount, partCount, waves, parts;

  function init() {
    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight / 2, {
      backgroundColor: '0x' + tinycolor('hsl(200, 50%, 10%)').toHex()
    });
    stage = new PIXI.Container();
    waveCount = 2000;
    partCount = 1000;
    waves = [];
    parts = [];
    var v =  renderer.view;
    v.style = "position: fixed; top: 0px; left: 0px; z-index: -99; opacity: 1;";
    document.body.appendChild(v);
    reset();
    for (var i = 0; i < 300; i++) {
      step();
    }
    loop();
  }

  function reset() {
    w = window.innerWidth;
    h = window.innerHeight;
    renderer.resize(w, h);
    waveGraphics = null;
    waveTexture = null;
    partGraphics = null;
    partTexture = null;
    waveGraphics = new PIXI.Graphics();
    waveGraphics.cacheAsBitmap = true;
    waveGraphics.beginFill('0x' + tinycolor('hsl(200, 74%, 40%)').toHex(), 0.15);
    waveGraphics.drawCircle(0, 0, 20);
    waveGraphics.endFill();
    waveTexture = waveGraphics.generateTexture();
    partGraphics = new PIXI.Graphics();
    partGraphics.cacheAsBitmap = true;
    partGraphics.beginFill('0x' + tinycolor('hsl(200, 70%, 40%)').toHex(), 0.2);
    partGraphics.drawCircle(0, 0, 15);
    partGraphics.endFill();
    partTexture = partGraphics.generateTexture();
  }

  function step() {
    if (waves.length < waveCount) {
      for (var i = 0; i < 10; i++) {
        var wave = new PIXI.Sprite(waveTexture),
          scale = 0.2 + Math.random() * 0.8;
        wave.position.x = w / 2;
        wave.position.y = h / 2;
        wave.anchor.x = 0.5;
        wave.anchor.y = 0.5;
        wave.scale.x = scale * 10;
        wave.scale.y = scale * 0.5;
        wave.blendMode = PIXI.BLEND_MODES.SCREEN;
        waves.push({
          sprite: wave,
          x: wave.position.x,
          y: wave.position.y,
          vx: 0,
          vy: 0,
          angle: Math.PI / 2 + Math.random() * Math.PI + Math.PI * 1.5,
          speed: 0.01 + Math.random() / 10
        });
        stage.addChild(wave);
      }
    }
    for (var i = 0, length = waves.length; i < length; i++) {
      var wave = waves[i];
      wave.sprite.position.x = wave.x;
      wave.sprite.position.y = wave.y;
      wave.vx = Math.cos(wave.angle) * wave.speed;
      wave.vy = Math.sin(wave.angle) * wave.speed;
      wave.x += wave.vx;
      wave.y += wave.vy;
      wave.speed *= 1.01;
      if (wave.x > w + 200 || wave.x < -200 || wave.y > h + 200) {
        wave.x = w / 2;
        wave.y = h / 2;
        wave.speed = 0.01 + Math.random() / 10;
      }
    }
    if (parts.length < partCount) {
      var part = new PIXI.Sprite(partTexture),
        scale = 0.2 + Math.random() * 0.8,
        type = Math.random() > 0.5 ? 1 : 0;
      part.position.x = w / 2 + Math.random() * 380 - 190;
      part.position.y = h / 2 + 0;
      part.anchor.x = 0.5;
      part.anchor.y = 0.5;
      part.scale.x = type ? scale : scale * 0.5;
      part.scale.y = type ? scale : scale * 15;
      part.blendMode = PIXI.BLEND_MODES.SCREEN;
      parts.push({
        sprite: part,
        ox: part.position.x,
        oy: part.position.y,
        x: part.position.x,
        y: part.position.y,
        vx: 0,
        vy: 0,
        angle: (-Math.PI * 0.5) + (w / 2 - part.position.x) / 750,
        speed: 0.0001 + Math.random() / 50
      });
      stage.addChild(part);
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      var part = parts[i];
      part.sprite.position.x = part.x;
      part.sprite.position.y = part.y;
      part.vx = Math.cos(part.angle) * part.speed;
      part.vy = Math.sin(part.angle) * part.speed;
      part.x += part.vx;
      part.y += part.vy;
      part.speed *= 1.01;
      if (part.x > w + 50 || part.x < -50 || part.y < -50) {
        part.x = part.ox;
        part.y = part.oy;
        part.speed = 0.01 + Math.random() / 50;
      }
    }
    renderer.render(stage);
  }

  function loop() {
    step();
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', reset);
  init();
})(PIXI, this, document);