(function($){
  var _elementStyle = document.createElement('div').style;
  var _vendor = (function () {
    var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
      transform,
      i = 0,
      l = vendors.length;

    for ( ; i < l; i++ ) {
      transform = vendors[i] + 'ransform';
      if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
    }

    return false;
  })();

  function _prefixStyle (style) {
    if ( _vendor === false ) return false;
    if ( _vendor === '' ) return style;
    return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
  }


  var defaults = {
    pageContainer: ".page",
    easing: "ease",
    animationTime: 1000,
    pagination: true,
    keyboard: true,
    beforeMove: function(){},
    afterMove: function(){},
    loop: false
	};

  var $doc = $(document),
      _transform = _prefixStyle('transform'),
      hasTransform = _transform in _elementStyle,
      _transition = _prefixStyle('transition');

  $.fn.pageScroll = function(options){
    var settings = $.extend({}, defaults, options),
        $el = $(this),
        $pages = $el.find(settings.pageContainer),
        lastIndex = $pages.length-1,
        topPos = 0,
        leftPos = 0,
        current = 0,
        lastAnimation = 0,
        quietPeriod = 500,
        paginationList = "";

    function transformPage(position, index) {
      var attrs = null;
    	if(hasTransform){
        attrs = {};
        attrs[_transform] = "translate3d(0, " + position + "%, 0)";
        attrs[_transition] = "all " + settings.animationTime + "ms " + settings.easing;
        $el.css(attrs);
        $el.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
          settings.afterMove(index, $pages.eq(index));
        });
    	}else{
        attrs = {
          top: $el.height()/100*position+'px'
        };
        $el.animate(attrs, settings.animationTime, function(){
          settings.afterMove(index, $pages.eq(index));
        });
    	}
    }

    function handlerMove(preIndex, nowIndex){
      settings.beforeMove(preIndex, $pages.eq(preIndex));
      $pages.eq(preIndex).removeClass("active");
      if(settings.pagination){
        $pageList.eq(preIndex).removeClass("active");
        $pageList.eq(nowIndex).addClass("active");
      }
      $pages.eq(nowIndex).addClass("active");
      transformPage(-100*nowIndex, nowIndex);
      current = nowIndex;
    }

    function moveDown() {
      var toPage = current+1;
      if(toPage > lastIndex){
        if(!settings.loop) return;
        toPage = 0;
      }
      handlerMove(current, toPage);
    }

    function moveUp() {
      var toPage = current-1;
      if(toPage < 0){
        if(!settings.loop) return;
        toPage = lastIndex;
      }
      handlerMove(current, toPage);
    }

    function moveTo(pageIndex) {
      if(pageIndex < 0 || pageIndex > lastIndex) return;
      handlerMove(current, pageIndex);
    }

    function init_scroll(e, delta) {
      if(Math.abs(delta) < 10) return;
      var timeNow = new Date().getTime();
      if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
        e.preventDefault();
        return;
      }
      delta < 0 ? moveDown() : moveUp();
      lastAnimation = timeNow;
    }

    $pages.each(function(index){
      var $this = $(this);
      $this.css({
        position: 'absolute',
        top: topPos + '%'
      });
      topPos = topPos + 100;
      if(settings.pagination) {
        paginationList += '<a data-index="'+index+'" href="javascript:;"></a>';
      }
    });
    $pages.show().eq(current).addClass('active');
    settings.afterMove(current, $pages.eq(current));
    if(settings.pagination){
      var $pagination = $el.find('.page-pagination');
      if (!$pagination.length){
        $pagination = $('<div class="page-pagination"></div>').html(paginationList);
        $('body').prepend($pagination);
      }
      var $pageList = $pagination.find('a');
      $pageList.eq(current).addClass('active');
      $pageList.on('click', function(){
        var $this = $(this);
        if($this.hasClass('active')) return;
        moveTo($this.data('index'));
      });
    }

    //mouse scroll
    $doc.on('mousewheel DOMMouseScroll MozMousePixelScroll', function(e) {
      e.preventDefault();
      var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
      if(!$("body").hasClass("disable-page-scroll")) init_scroll(e, delta);
    });

    //touch swipe
    $el.on('touchstart', function(e){
      if($("body").hasClass("disable-page-scroll")) return false;
      var touches = e.originalEvent.touches;
      if (touches && touches.length) {
        var startY = touches[0].pageY;
        $doc.on('touchmove.page-scroll', function(ev){
          var touches2 = ev.originalEvent.touches;
          ev.preventDefault();
          if (touches2 && touches2.length) {
            var deltaY = touches2[0].pageY - startY;
            if (Math.abs(deltaY) >= 50) {
              init_scroll(ev, deltaY);
              $doc.off('.page-scroll .page-scroll-end');
            }
          }
        });
        $doc.on('touchend.page-scroll-end', function(){
          $doc.off('.page-scroll .page-scroll-end');
        });
      }
    });

    if(settings.keyboard) {
      $doc.on('keydown', function(e){
        var tag = e.target.tagName.toLowerCase();
        if(tag === 'input' || tag === 'textarea' || $("body").hasClass("disable-page-scroll")){
          return;
        }
        switch(e.which) {
          case 38:
            moveUp();
          break;
          case 40:
            moveDown();
          break;
          case 32:
            moveDown();
          break;
          case 33:
            moveUp();
          break;
          case 34:
            moveDown();
          break;
          case 36:
            moveTo(0);
          break;
          case 35:
            moveTo(lastIndex);
          break;
          default: return;
        }
      });
    }
    return false;
  }
})(window.jQuery);
