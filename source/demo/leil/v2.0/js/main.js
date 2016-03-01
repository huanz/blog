$(document).ready(function(){
	new Slide({
		el: $('#page-main'),
		curClass: 'page-current',
		cur: 0,
		direction: 'up',
		repeat: true
	}).init();

	new Slide({
		el: $('#slide'),
		curClass: 'slide-current',
		cur: 0,
		direction: 'left',
		repeat: true
	}).init();

	new Slide({
		el: $('#cg-hero'),
		curClass: 'slide-current',
		cur: 0,
		direction: 'random',
		repeat: true
	}).init();
	var screenCenter = $(document).height()/2;
	$('#j-preNext').css('top',screenCenter).next().css('top',screenCenter).next().css('top',screenCenter);
	/*$(window).on('load', function(){
		var $tmpSlide = $('#slide'),
			tmpHeight = $('#slide img:first-child').height();
		$tmpSlide.height(tmpHeight+1);
	});*/
});

function Slide(obj){
	this.$el = obj.el;
	this.$sels = this.$el.children();
	this.count = this.$sels.length;
	this.cur = obj.cur || 0;
	this.curClass = obj.curClass;
	this.repeat = obj.repeat || false;
	this.isAnimating = false;
	this.endCurr = false,
	this.endNext = false,
	this.animEndNames = 'webkitAnimationEnd mozAnimationEnd oAnimationEnd MSAnimationEnd animationend';
	this.direction = obj.direction;
	this.originalClassList = this.$sels.eq(1).attr('class');
	return this;
};

Slide.prototype.init = function() {
	var _this = this;

	if(this.direction === 'up' || this.direction === 'down'){
		this.$el.swipe({
			swipeUp: swipeHandler,
			swipeDown: swipeHandler
		});
		this.$el.find('.link-trigger, .link-car').on('touchstart mousedown',function(){
			if(_this.isAnimating) return false;
			_this.direction = 'up';
			_this.slideNext('up');
		});
	}else if(this.direction === 'left' || this.direction === 'right'){
		this.$el.swipe({
			swipeLeft: swipeHandler,
			swipeRight: swipeHandler
		});
		$('#page-main').find('.link-pre').on('touchstart mousedown',function(){
			if(_this.isAnimating) return false;
			_this.direction = 'right';
			_this.slideNext('right');
		}).next().on('touchstart mousedown',function(){
			if(_this.isAnimating) return false;
			_this.direction = 'left';
			_this.slideNext('left');
		});
	}else{
		this.$el.next(".link-hero").on('touchstart mousedown',function(){
			if(_this.isAnimating) return false;
			if(_this.cur == 0){
				$(this).next(".link-car").show();
			}
			_this.direction = 'random';
			_this.slideNext('random');
		});
	}

	function swipeHandler(event, direction, distance, duration, fingerCount){
		/*event.stopImmediatePropagation();*/
		if(_this.isAnimating) return false;
		if(!_this.repeat){
			if(direction === 'down' || direction === 'right'){
				if(_this.cur == 0) return false;
			}else{
				if(_this.cur == _this.count - 1) return false;
			}			
		}
		_this.direction = direction;
		_this.slideNext(direction);
	};
};

Slide.prototype.slideNext = function(direction) {
	this.isAnimating = true;

	var _this = this,
		$current = this.$sels.eq(this.cur);

	if(this.repeat){
		if(direction === 'down' || direction === 'right'){
			if(this.cur == 0){
				this.cur = this.count - 1;
			}else{
				this.cur--;
			}
		}else{
			if(this.cur == this.count - 1){
				this.cur = 0;
			}else{
				this.cur++;
			}
		}
	}else{
		if(direction === 'down' || direction === 'right'){
			this.cur--;
		}else{
			this.cur++;
		}
	}

	// 0:outClass,1:inClass
	var aniClass = {
		left: ['page-cubeLeftOut page-ontop','page-cubeLeftIn'],
		right: ['page-cubeRightOut page-ontop','page-cubeRightIn'],
		up: ['page-moveToTop page-ontop','page-scaleUp'],
		down: ['page-moveToBottom page-ontop','page-scaleUp'],
		random: ['page-rotateFall page-ontop', 'page-scaleUp']
	};

	var $next = this.$sels.eq(this.cur).addClass(this.curClass);

	$current.addClass(aniClass[direction][0]).one(_this.animEndNames, function() {
		$current.off(_this.animEndNames);
		_this.endCurr = true;
		if(_this.endNext) {
			_this.onEndAnimation($current, $next);
		}
	});

	$next.addClass(aniClass[direction][1]).one(_this.animEndNames, function() {
		$next.off(_this.animEndNames);
		_this.endNext = true;
		if(_this.endCurr) {
			_this.onEndAnimation($current, $next);
		}
	});

};

Slide.prototype.onEndAnimation = function($curr, $next){
	this.endCurr = false;
	this.endNext = false;
	this.resetPage($curr, $next);
	this.isAnimating = false;
};

Slide.prototype.resetPage = function($out, $in) {
	$out.attr('class', this.originalClassList);
	$in.attr('class', this.originalClassList+' '+this.curClass);
};