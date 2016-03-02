;(function ( $ ) {
  var _prefix = (function(){
    var style = document.createElement('div').style,
        vendor = ['webkit', 'khtml', 'moz', 'ms', 'o'],
        i = 0;
    while (i < vendor.length) {
      if (typeof style[vendor[i] + 'Transition'] === 'string') {
        return vendor[i];
      }
      i++;
    }
    return '';
  })();

  function _prefixStyle(style){
    return '-'+_prefix+'-'+style;
  }

  var Aduration = _prefixStyle("animation-duration"),
      Aiteration = _prefixStyle("animation-iteration-count"),
      Atiming = _prefixStyle("animation-timing-function"),
      Transition = _prefixStyle("transition"),
      Transform = _prefixStyle("transform"),
      Filter = _prefixStyle("filter");
  
  function animo( element, options, callback, other_cb ) {
    
    // Default configuration
    var defaults = {
    	duration: 1,
    	animation: null,
    	iterate: 1,
    	timing: "ease-out",
      keep: false
    };

    // Cache the element
    this.element = $(element);

    this.bare = element;

    // For stacking of animations
    this.queue = [];

    // Hacky
    this.listening = false;

    // Figure out where the callback is
    var cb = ($.isFunction(callback) ? callback : other_cb);

    // Options can sometimes be a command
    switch(options) {

      case "blur":

      	defaults = {
      		amount: 3,
      		duration: 0.5,
      		focusAfter: null
      	};

      	this.options = $.extend( defaults, callback );

  	    this._blur(cb);

        break;

      case "focus":

  	  	this._focus();

        break;

      case "rotate":

        defaults = {
          degrees: 15,
          duration: 0.5
        };

        this.options = $.extend( defaults, callback );

        this._rotate(cb);

        break;

      case "cleanse":

        this.cleanse();

        break;

      default:

	    this.options = $.extend( defaults, options );

	    this.init(cb);
  	
      break;
    }
  }

  animo.prototype = {

    // A standard CSS animation
    init: function(callback) {
      
      var $me = this,
          options = $me.options;

      //$.isArray(options.animation) ? $me.queue.concat(options.animation) : $me.queue.push(options.animation);
      //$me.queue[$.isArray(options.animation)?'concat':'push'](options.animation);
      $me.queue = $.isArray(options.animation) ? options.animation : [options.animation];
	    $me.cleanse();

	    $me.animate(callback);
      
    },

    // The actual adding of the class and listening for completion
    animate: function(callback) {
      var el = this.element,
          options = this.options,
          queue = this.queue,
          css = {};
    	el.addClass('animated '+queue[0]);

      el.data("animo", queue[0]);
      
      css[Aduration] = options.duration+"s";
      css[Aiteration] = options.iterate;
      css[Atiming] = options.timing;
      el.css(css);

      var $me = this, _cb = callback;

      if(queue.length>1) {
        _cb = null;
      }

      // Listen for the end of the animation
      this._end("AnimationEnd", function() {

        // If there are more, clean it up and move on
        if(el.hasClass(queue[0])) {

          if(!options.keep) {
            $me.cleanse();
          }

          queue.shift();

          if(queue.length) {

            $me.animate(callback);
          }
        }
      }, _cb);
    },

    cleanse: function() {
      var el = this.element,
          css = {};
    	el.removeClass('animated '+this.queue[0]+' '+el.data("animo"));
      css[Aduration] = "";
      css[Aiteration] = "";
      css[Atiming] = "";
      css[Transition] = "";
      css[Transform] = "";
      css[Filter] = "";
      el.css(css);
    },

    _blur: function(callback) {
      var el = this.element,
          options = this.options,
          css = {};
      if(el.is("img")) {

      	var svg_id = "svg_" + (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);
      	var filter_id = "filter_" + (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);

      	$('body').append('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="'+svg_id+'" style="height:0;position:absolute;top:-1000px;"><filter id="'+filter_id+'"><feGaussianBlur stdDeviation="'+options.amount+'" /></filter></svg>');

        css[Filter] = "blur("+options.amount+"px) url(#"+filter_id+")";
        
        el.data("svgid", svg_id);
      
      } else {

        css["text-shadow"] = "0 0 "+options.amount+"px "+el.css('color');
        css["color"] = "transparent";

      }

      css[Transition] = options.duration+"s all linear";
      el.css(css);

      this._end("TransitionEnd", null, callback);

      var $me = this;

      if(options.focusAfter) {

        var focus_wait = setTimeout(function() {

          $me._focus();

          focus_wait = clearTimeout(focus_wait);

        }, (options.focusAfter*1000));
      }

    },

    _focus: function() {
      var el = this.element,
          css = {};

      if(el.is("img")) {
        css[Filter] = "";
        css[Transition] = "";
        el.css(css);
        $('#'+el.data('svgid')).remove();

      } else {
        css[Transition] = "";
        el.css(css);
      }

      el.css({
        "text-shadow": "",
        "color": ""
      });

    },

    _rotate: function(callback) {
      var el = this.element,
          options = this.options,
          css = {};

      css[Transition] = "all "+options.duration+"s linear";
      css[Transform] = "rotate("+options.degrees+"deg)";
      el.css(css);

      this._end("TransitionEnd", null, callback);

    },

    _end: function(type, todo, callback) {

      var $me = this,
          el = this.element;

      var binding = type.toLowerCase()+" webkit"+type+" o"+type+" MS"+type;

      el.on(binding, function() {
        
        el.off(binding);

        if($.isFunction(todo)) {

          todo();
        }

        if($.isFunction(callback)) {

          callback($me);
        }
      });
    }
  };

  $.fn.animo = function ( options, callback, other_cb ) {
    
    return this.each(function() {
			
			new animo( this, options, callback, other_cb );

		});

  };

})( window.jQuery || window.Zepto);
