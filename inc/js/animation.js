$(document).ready(function() {
  $('<a>').attr('class', 'playpause pause').appendTo('body').click(function() {
    if ($(this).hasClass('pause')) {
      $(this).text('play').toggleClass('play').toggleClass('pause');
      $('*').stop();
    }
    else {
      $(this).text('pause').toggleClass('play').toggleClass('pause');
      start_animation();
    }
  }).text('pause');


  start_animation();
});

function start_animation() {
  $('.cloud').loop('left', screen.availWidth, -200, 'px', 60000, 'linear');

  $('#wavesback').css('left', 0).css('top', 0);
  $('#wavesfront').css('left', 55).css('top', 20);

  $('.wave')
    .loop('left', 55, 0, 'px', 1500, 'sin', 'oscillate')
    .loop('top', 20, 0, 'px', 1500, 'cos', 'oscillate');

  $('#boat').loop('top', 0, 20, 'px', 1000, 'cos', 'oscillate');
  $('#boat').loop('left', -300, screen.availWidth, 'px', 40000, 'linear');
}

jQuery.fn.extend({
  loop: function(property, from, to, unit, speed, easing, loop) {
    var prop = {};
    prop[property] = to;

    // Set a call back for looping.
    switch (loop) {
      case 'oscillate':
        var callback = function(elem) {
          var elem = $(this);
          elem.loop(property, to, from, unit, speed, easing, loop);
        };
      break;
      default:
        var callback = function(elem) {
          var elem = $(this);
          elem.css(property, from + unit);
          elem.loop(property, from, to, unit, speed, easing, loop);
        };
      break;
    }

    var optall = jQuery.speed(speed, easing, callback);
    return this.each(function(){
      var opt = jQuery.extend({}, optall), p,
        hidden = this.nodeType == 1 && jQuery(this).is(":hidden"),
        self = this;
  
      if ( property == "hide" && hidden || property == "show" && !hidden )
        return opt.complete.call(this);

      if ( ( property == "height" || property == "width" ) && this.style ) {
        // Store display property
        opt.display = jQuery.css(this, "display");
        // Make sure that nothing sneaks out
        opt.overflow = this.style.overflow;
      }
      if ( opt.overflow != null )
        this.style.overflow = "hidden";

      opt.curAnim = jQuery.extend({}, prop);

      var e = new jQuery.fx( self, opt, property );

      var start = e.cur(true) || 0, end = to;

      // We need to compute starting value
      if ( unit != "px" ) {
        self.style[ property ] = (end || 1) + unit;
        start = ((end || 1) / e.cur(true)) * start;
        self.style[ property ] = start + unit;
      }

      // Adjust the duration so it takes into accoutn the start and end loop points.
      var progress = ((to - from) / (end - start));
      e.options.duration /= progress;
      e.custom( start, end, unit );

      // For JS strict compliance
      return true;
    });
  },
  looping: {
    infinite: function() {
      var elem = $(this);
      elem.css(property, from + unit);
      elem.loop(property, from, to, unit, speed, easing, loop);
    },
    oscillate: function() {
      var elem = $(this);
      elem.loop(property, to, from, unit, speed, easing, loop);
    }
  }
});

jQuery.extend(jQuery.easing, {
  sin: function( p, n, firstNum, diff, duration ) {
    return ((-Math.sin(p*Math.PI)/2) + 0.5) * diff + firstNum;
  },
  cos: function( p, n, firstNum, diff, duration ) {
    return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
  }
});
