(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.fireflies = factory();
    }
}(this, function ()
{
  var fireflies = function(opts)
  {
    var _instance = this;

    var _canvas = opts.canvas;
    _canvas.width = _canvas.clientWidth;
    _canvas.height = _canvas.clientHeight;

    var _ctx = _canvas.getContext("2d");

    var DAMP = opts.damp || 0.98;

    var _pop = opts.population || 10;

    var _foci = opts.foci || [];

    var _bound = opts.bound || 25;

    var _minR = opts.minRadius || 2;

    var _maxR = opts.maxRadius || 7;

    var _minO = typeof opts.minOpacity != "undefined" ? opts.minOpacity : 0.3;

    var _maxO = opts.maxOpacity || 1;

    var _color = opts.color || "#ffffff";
    _color = hexToRgb(_color);
    if(_color === null)
    {
      throw "Invaid color: " + opts.color;
    }
    _color = "rgba(" + _color.r + "," + _color.g + "," + _color.b + ",";

    var _paused = false;

    var _fireflies = [];

    var _gradient;

    for(var i = 0; i < _pop; ++i)
    {
      var firefly =
      {
        x: _bound + Math.random() * (_canvas.width - (_bound * 2)),
        y: _bound + Math.random() * (_canvas.height - (_bound * 2)),
        vx: Math.random() - 0.5,
        vy: Math.random() - 0.5,
        re_boundx: false,
        re_boundy: false,
        radius: _minR + (Math.random() * (_maxR - _minR)),
        opacity: _minO + (Math.random() * (_maxO - _minO)),
        opacityD: randomOpacityDelta()
      };

      _fireflies.push(firefly);
    }

    _instance.render = function()
    {
      _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

      for(var i = 0; i < _fireflies.length; ++i)
      {
        var firefly = _fireflies[i];

        if(!firefly.re_boundx)
        {
        	if(Math.random() > 98)
          {
            firefly.vx = Math.random() - 0.5;
          }
          else
          {
            firefly.vx += (Math.random() * 0.5 - 0.25);
          }
        }

        if(!firefly.re_boundy)
        {
        	if(Math.random() > 98)
          {
            firefly.vy = Math.random() - 0.5;
          }
          else
          {
            firefly.vy += (Math.random() * 0.5 - 0.25);
          }
        }

        if(!firefly.re_boundx)
        {
          firefly.vx *= (Math.random() * 0.11 + 0.9);
        }

        if(!firefly.re_boundy)
        {
          firefly.vy *= (Math.random() * 0.11 + 0.9);
        }

        var re_bound = (Math.random() * 20) + 5;

        if
        (
          !firefly.re_boundx
          &&
          (
            firefly.x < re_bound || firefly.x > _canvas.width - re_bound
          )
        )
        {
          firefly.re_boundx = true;
          firefly.vx = Math.random() * 0.5 * (firefly.x < re_bound ? 1 : -1);
        }

        if
        (
          firefly.x > _bound
          &&
          firefly.x < _canvas.width - _bound && firefly.re_boundx
        )
        {
          firefly.re_boundx = false;
        }

        if
        (
          !firefly.re_boundy
          &&
          (
            firefly.y < re_bound || firefly.y > _canvas.height - re_bound
          )
        )
        {
          firefly.re_boundy = true;
          firefly.vy = Math.random() * 0.5 * (firefly.y < re_bound ? 1 : -1);
        }

        if
        (
          firefly.y > _bound
          &&
          firefly.y < _canvas.height - _bound && firefly.re_boundy
        )
        {
          firefly.re_boundy = false;
        }

      	firefly.x += firefly.vx;
      	firefly.y += firefly.vy;

        if(_foci.length > 0)
        {
          var tfocus = _foci[Math.round(Math.random() * (_foci.length - 1))];
          var focus = {x:tfocus.x, y:tfocus.y};
          var vfx = focus.x - firefly.x;
          var vfy = focus.y - firefly.y;
          vfx *= tfocus.gravity;
          vfy *= tfocus.gravity;
          firefly.x += vfx;
          firefly.y += vfy;
        }

        _ctx.beginPath();
        _ctx.arc(firefly.x,firefly.y,firefly.radius,0,2*Math.PI);
        _ctx.closePath();

        firefly.opacity += firefly.opacityD;
        if(firefly.opacity < 0)
        {
          firefly.opacity = 0;
          firefly.opacityD = randomOpacityDelta();
        }
        else if(firefly.opacity > 1)
        {
          firefly.opacity = 1;
          firefly.opacityD = randomOpacityDelta() * -1;
        }

        _gradient = _ctx.createRadialGradient
        (
          firefly.x,
          firefly.y,
          0,
          firefly.x,
          firefly.y,
          firefly.radius * firefly.opacity
        );

        _gradient.addColorStop(0.0, _color + 0.6 + ")");
    		_gradient.addColorStop(0.3, _color + 0.3 +")");
    		_gradient.addColorStop(1.0, _color + "0)");
    		_ctx.fillStyle = _gradient;
    		_ctx.fill();
      }

      if(opts.autoRender && !_paused)
      {
        requestAnimationFrame(_instance.render);
      }
    }

    if(opts.autoRender)
    {
      requestAnimationFrame(_instance.render);
    }
  }

  function randomOpacityDelta()
  {
    return 0.001 + (Math.random() * 0.029);
  }

  // credit: http://stackoverflow.com/a/5624139/771466
  function hexToRgb(hex)
  {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b)
    {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

  return fireflies;
}));