document.addEventListener('DOMContentLoaded', function () {
  const myDate = new Date("2023-01-28T01:20:00");
  let rootTime = document.querySelector("time");
  let music = ["DongThoai", "Perfect"];
  function olock() {
    let today = new Date(),
      hour = (Math.floor(Math.floor((today - myDate) / 1000) / 60 / 60)) % 24,
      minute = (Math.floor(Math.floor((today - myDate) / 1000) / 60)) % 60,
      second = Math.floor((today - myDate) / 1000) % 60;
    rootTime.textContent = `${(hour > 9) ? hour : "0" + hour}:${(minute > 9) ? minute : "0" + minute}:${(second > 9) ? second : "0" + second}`;
  } olock();
  setInterval(function () { olock() }, 1000);
  //document.querySelector("#anniversary").textContent = `From ${(myDate.getDate()>9)?myDate.getDate():"0"+myDate.getDate()}-${(myDate.getMonth()>8)?(myDate.getMonth()+1):"0"+(myDate.getMonth()+1)}-${myDate.getFullYear()}`;
  document.querySelector("#days span").textContent = Math.floor(Math.floor((new Date() - myDate) / 1000) / 60 / 60 / 24);
  document.querySelector("audio").setAttribute("src", `music/${music[Math.floor(Math.random() * music.length)]}.mp3`);
  //document.querySelector("audio").setAttribute("src", "music/DongThoai.mp3");

  document.querySelector("#heart").addEventListener("click", function (e) {
    document.querySelector("#question-modal").style.display = "block";
    document.querySelector("#password").focus();
  });
}, false);
/* Modal */
document.querySelectorAll(".close").forEach(element => {
  element.addEventListener("click", function (e) {
    e.target.parentElement.style.display = "none";
  });
});
document.querySelector("#question-modal").addEventListener("keyup", function (e) {
  if (e.keyCode == 13) {
    document.querySelector("#ok-button").click();
  }
});
document.querySelector("#ok-button").addEventListener("click", function (e) {
  let password = document.querySelector("#password");
  password.disabled = true;
  if (cyrb53(password.value) == '7118931869916667') {
    e.target.parentElement.parentElement.style.display = "none";
    document.querySelector("#message-modal").style.display = "block";
  }
  else {
    password.disabled = false;
    password.focus();
  }
});

const cyrb53 = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
/* */
(function () { var b = 0; var c = ["ms", "moz", "webkit", "o"]; for (var a = 0; a < c.length && !window.requestAnimationFrame; ++a) { window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"]; window.cancelAnimationFrame = window[c[a] + "CancelAnimationFrame"] || window[c[a] + "CancelRequestAnimationFrame"] } if (!window.requestAnimationFrame) { window.requestAnimationFrame = function (h, e) { var d = new Date().getTime(); var f = Math.max(0, 16 - (d - b)); var g = window.setTimeout(function () { h(d + f) }, f); b = d + f; return g } } if (!window.cancelAnimationFrame) { window.cancelAnimationFrame = function (d) { clearTimeout(d) } } }());

/*
* Point class
*/
var Point = (function () {
  function Point(x, y) {
    this.x = (typeof x !== 'undefined') ? x : 0;
    this.y = (typeof y !== 'undefined') ? y : 0;
  }
  Point.prototype.clone = function () {
    return new Point(this.x, this.y);
  };
  Point.prototype.length = function (length) {
    if (typeof length == 'undefined')
      return Math.sqrt(this.x * this.x + this.y * this.y);
    this.normalize();
    this.x *= length;
    this.y *= length;
    return this;
  };
  Point.prototype.normalize = function () {
    var length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
  };
  return Point;
})();

/*
* Particle class
*/
var Particle = (function () {
  function Particle(settings) {
    this.position = new Point();
    this.velocity = new Point();
    this.acceleration = new Point();
    this.age = 0;
    this.settings = settings;
  }
  Particle.prototype.initialize = function (x, y, dx, dy) {
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = dx;
    this.velocity.y = dy;
    this.acceleration.x = dx * this.settings.particles.effect;
    this.acceleration.y = dy * this.settings.particles.effect;
    this.age = 0;
  };
  Particle.prototype.update = function (deltaTime) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;
    this.age += deltaTime;
  };
  Particle.prototype.draw = function (context, image) {
    function ease(t) {
      return (--t) * t * t + 1;
    }
    var size = image.width * ease(this.age / this.settings.particles.duration);
    context.globalAlpha = 1 - this.age / this.settings.particles.duration;
    context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
  };
  return Particle;
})();

/*
* ParticlePool class
*/
var ParticlePool = (function () {
  var particles,
    firstActive = 0,
    firstFree = 0,
    duration;

  function ParticlePool(settings) {
    // create and populate particle pool
    particles = new Array(settings.particles.length);
    duration = settings.particles.duration;
    for (var i = 0; i < particles.length; i++)
      particles[i] = new Particle(settings);
  }
  
  ParticlePool.prototype.add = function (x, y, dx, dy) {
    particles[firstFree].initialize(x, y, dx, dy);

    // handle circular queue
    firstFree++;
    if (firstFree == particles.length) firstFree = 0;
    if (firstActive == firstFree) firstActive++;
    if (firstActive == particles.length) firstActive = 0;
  };

  ParticlePool.prototype.update = function (deltaTime) {
    var i;
    // update active particles
    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++)
        particles[i].update(deltaTime);
    }
    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].update(deltaTime);
      for (i = 0; i < firstFree; i++)
        particles[i].update(deltaTime);
    }
    // remove inactive particles
    while (particles[firstActive].age >= duration && firstActive != firstFree) {
      firstActive++;
      if (firstActive == particles.length) firstActive = 0;
    }
  };

  ParticlePool.prototype.draw = function (context, image) {
    // draw active particles
    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++)
        particles[i].draw(context, image);
    }
    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].draw(context, image);
      for (i = 0; i < firstFree; i++)
        particles[i].draw(context, image);
    }
  };

  return ParticlePool;
})();
function HuyVuAnimate(canvas, settings) {
  var context = canvas.getContext('2d'),
    particles = new ParticlePool(settings),
    particleRate = settings.particles.length / settings.particles.duration, // particles/sec
    time;

  // get point on heart with -PI <= t <= PI
  function pointOnHeart(t) {
    return new Point(
      160 * Math.pow(Math.sin(t), 3),
      130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
    );
  }

  // creating the particle image using a dummy canvas
  var image = (function () {
    var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
    canvas.width = settings.particles.size;
    canvas.height = settings.particles.size;
    // helper function to create the path
    function to(t) {
      var point = pointOnHeart(t);
      point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350;
      point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350;
      return point;
    }
    // create the path
    context.beginPath();
    var t = -Math.PI;
    var point = to(t);
    context.moveTo(point.x, point.y);
    while (t < Math.PI) {
      t += 0.01; // baby steps!
      point = to(t);
      context.lineTo(point.x, point.y);
    }
    context.closePath();
    // create the fill
    context.fillStyle = '#ea80b0';
    context.fill();
    // create the image
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
  })();

  // render that thing!
  function render() {
    // next animation frame
    requestAnimationFrame(render);

    // update time
    var newTime = new Date().getTime() / 1000,
      deltaTime = newTime - (time || newTime);
    time = newTime;

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // create new particles
    var amount = particleRate * deltaTime;
    for (var i = 0; i < amount; i++) {
      var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
      var dir = pos.clone().length(settings.particles.velocity);
      particles.add(canvas.width / 2 + pos.x / 2, canvas.height / 2 - pos.y / 2, dir.x, -dir.y);
    }

    // update and draw particles
    particles.update(deltaTime);
    particles.draw(context, image);
  }

  // handle (re-)sizing of the canvas
  function onResize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  window.onresize = onResize;

  // delay rendering bootstrap
  setTimeout(function () {
    onResize();
    render();
  }, 10);
};
//
var Particle = (function () {
  function Particle(settings) {
    this.position = new Point();
    this.velocity = new Point();
    this.acceleration = new Point();
    this.age = 0;
    this.settings = settings;
  }
  Particle.prototype.initialize = function (x, y, dx, dy) {
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = dx;
    this.velocity.y = dy;
    this.acceleration.x = dx * this.settings.particles.effect;
    this.acceleration.y = dy * this.settings.particles.effect;
    this.age = 0;
  };
  Particle.prototype.update = function (deltaTime) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;
    this.age += deltaTime;
  };
  Particle.prototype.draw = function (context, image) {
    function ease(t) {
      return (--t) * t * t + 1;
    }
    var size = image.width * ease(this.age / this.settings.particles.duration);
    context.globalAlpha = 1 - this.age / this.settings.particles.duration;
    context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
  };
  return Particle;
})();
var ParticlePool1 = (function () {
  var particles,
    firstActive = 0,
    firstFree = 0,
    duration;

  function ParticlePool1(settings) {
    // create and populate particle pool
    particles = new Array(settings.particles.length);
    duration = settings.particles.duration;
    for (var i = 0; i < particles.length; i++)
      particles[i] = new Particle(settings);
  }
  
  ParticlePool1.prototype.add = function (x, y, dx, dy) {
    particles[firstFree].initialize(x, y, dx, dy);

    // handle circular queue
    firstFree++;
    if (firstFree == particles.length) firstFree = 0;
    if (firstActive == firstFree) firstActive++;
    if (firstActive == particles.length) firstActive = 0;
  };

  ParticlePool1.prototype.update = function (deltaTime) {
    var i;
    // update active particles
    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++)
        particles[i].update(deltaTime);
    }
    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].update(deltaTime);
      for (i = 0; i < firstFree; i++)
        particles[i].update(deltaTime);
    }
    // remove inactive particles
    while (particles[firstActive].age >= duration && firstActive != firstFree) {
      firstActive++;
      if (firstActive == particles.length) firstActive = 0;
    }
  };

  ParticlePool1.prototype.draw = function (context, image) {
    // draw active particles
    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++)
        particles[i].draw(context, image);
    }
    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].draw(context, image);
      for (i = 0; i < firstFree; i++)
        particles[i].draw(context, image);
    }
  };

  return ParticlePool1;
})();
function HuyVuAnimate(canvas, settings) {
  var context = canvas.getContext('2d'),
    particles = new ParticlePool(settings),
    particleRate = settings.particles.length / settings.particles.duration, // particles/sec
    time;

  // get point on heart with -PI <= t <= PI
  function pointOnHeart(t) {
    return new Point(
      160 * Math.pow(Math.sin(t), 3),
      130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
    );
  }

  // creating the particle image using a dummy canvas
  var image = (function () {
    var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
    canvas.width = settings.particles.size;
    canvas.height = settings.particles.size;
    // helper function to create the path
    function to(t) {
      var point = pointOnHeart(t);
      point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350;
      point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350;
      return point;
    }
    // create the path
    context.beginPath();
    var t = -Math.PI;
    var point = to(t);
    context.moveTo(point.x, point.y);
    while (t < Math.PI) {
      t += 0.01; // baby steps!
      point = to(t);
      context.lineTo(point.x, point.y);
    }
    context.closePath();
    // create the fill
    context.fillStyle = '#ea80b0';
    context.fill();
    // create the image
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
  })();

  // render that thing!
  function render() {
    // next animation frame
    requestAnimationFrame(render);

    // update time
    var newTime = new Date().getTime() / 1000,
      deltaTime = newTime - (time || newTime);
    time = newTime;

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // create new particles
    var amount = particleRate * deltaTime;
    for (var i = 0; i < amount; i++) {
      var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
      var dir = pos.clone().length(settings.particles.velocity);
      particles.add(canvas.width / 2 + pos.x / 2, canvas.height / 2 - pos.y / 2, dir.x, -dir.y);
    }

    // update and draw particles
    particles.update(deltaTime);
    particles.draw(context, image);
  }

  // handle (re-)sizing of the canvas
  function onResize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  window.onresize = onResize;

  // delay rendering bootstrap
  setTimeout(function () {
    onResize();
    render();
  }, 10);
};
function PhuongOanhAnimate(canvas, settings) {
  var context = canvas.getContext('2d'),
    particles = new ParticlePool1(settings),
    particleRate = settings.particles.length / settings.particles.duration, // particles/sec
    time;

  // get point on heart with -PI <= t <= PI
  function pointOnHeart(t) {
    return new Point(
      160 * Math.pow(Math.sin(t), 3),
      130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
    );
  }

  // creating the particle image using a dummy canvas
  var image = (function () {
    var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
    canvas.width = settings.particles.size;
    canvas.height = settings.particles.size;
    // helper function to create the path
    function to(t) {
      var point = pointOnHeart(t);
      point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350;
      point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350;
      return point;
    }
    // create the path
    context.beginPath();
    var t = -Math.PI;
    var point = to(t);
    context.moveTo(point.x, point.y);
    while (t < Math.PI) {
      t += 0.01; // baby steps!
      point = to(t);
      context.lineTo(point.x, point.y);
    }
    context.closePath();
    // create the fill
    context.fillStyle = '#ea80b0';
    context.fill();
    // create the image
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
  })();

  // render that thing!
  function render() {
    // next animation frame
    requestAnimationFrame(render);

    // update time
    var newTime = new Date().getTime() / 1000,
      deltaTime = newTime - (time || newTime);
    time = newTime;

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // create new particles
    var amount = particleRate * deltaTime;
    for (var i = 0; i < amount; i++) {
      var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
      var dir = pos.clone().length(settings.particles.velocity);
      particles.add(canvas.width / 2 + pos.x / 2, canvas.height / 2 - pos.y / 2, dir.x, -dir.y);
    }

    // update and draw particles
    particles.update(deltaTime);
    particles.draw(context, image);
  }

  // handle (re-)sizing of the canvas
  function onResize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  window.onresize = onResize;

  // delay rendering bootstrap
  setTimeout(function () {
    onResize();
    render();
  }, 10);
};
//
/* HuyVu animation */
var settings = {
  particles: {
    length: 100, // maximum amount of particles
    duration: 1, // particle duration in sec
    velocity: 80, // particle velocity in pixels/sec
    effect: -0.75, // play with this for a nice effect
    size: 12, // particle size in pixels
  },
};
HuyVuAnimate(document.getElementById("huy-vu-animation"), settings);
PhuongOanhAnimate(document.getElementById("phuong-oanh-animation"), settings);