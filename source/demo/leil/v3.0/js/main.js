$(document).ready(function(){
	new Slide({
		el: $('#page-main'),
		curClass: 'page-current',
		cur: 0,
		direction: 'up',
		repeat: true
	}).init();

	/*new Slide({
		el: $('#cg-hero'),
		curClass: 'slide-current',
		cur: 0,
		direction: 'random',
		repeat: true
	}).init();*/
	var first = true,
		screenCenter = $(document).height()/2;
	$('#j-preNext').css('top',screenCenter).next().css('top',screenCenter).next().css('top',screenCenter);
	
	$(document).on('touchstart',function(){
		if(first){
			document.getElementById('bjmusic').play();
			first = false;
		}
	});
	//weixin
	$('#share').on('touchstart',function(){
		$(this).removeClass('z-show');
	});
	/*$(window).on('load', function(){
		var $tmpSlide = $('#slide'),
			tmpHeight = $('#slide img:first-child').height();
		$tmpSlide.height(tmpHeight+1);
	});*/
	
	

	var $heroWrap = $('#cg-hero'),
		$heros = $heroWrap.children(),
		slideHero;

	var randHero = new RandHero($heros);

	$heroWrap.next('.link-hero').on('touchstart',function(){
		var start = randHero.initRand();
		if(slideHero){
			slideHero = null;
		}
		slideHero = new Slide({
			el: $('#slide'),
			curClass: 'slide-current',
			cur: start.heroIndex,
			direction: 'left',
			repeat: true
		}).init();
	});
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
	this.$sels.removeClass(this.curClass);
	this.originalClassList = this.$sels.eq(1).attr('class');
	this.$sels.eq(this.cur).addClass(this.curClass);
	if(this.shareTimer){
		clearTimeout(this.shareTimer);
		this.shareTimer = null;
	}
	return this;
};

Slide.prototype.init = function() {
	var _this = this;

	if(this.direction === 'up' || this.direction === 'down'){
		this.$el.swipe({
			swipeUp: swipeHandler,
			swipeDown: swipeHandler
		});
		this.$el.find('.link-trigger, .link-car').on('touchstart',function(){
			if(_this.isAnimating) return false;
			_this.direction = 'up';
			_this.slideNext('up');
		});
	}else if(this.direction === 'left' || this.direction === 'right'){
		this.$el.swipe({
			swipeLeft: swipeHandler,
			swipeRight: swipeHandler
		});
		$('#page-main').find('.link-pre').on('touchstart',function(){
			if(_this.isAnimating) return false;
			_this.direction = 'right';
			_this.slideNext('right');
		}).next().on('touchstart mousedown',function(){
			if(_this.isAnimating) return false;
			_this.direction = 'left';
			_this.slideNext('left');
		});
	}else{
		this.$el.next(".link-hero").on('touchstart',function(){
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
		if(_this.cur == 6 && direction === 'up' && !visible(_this.$el.find('.link-car'))) {
			alert("请先测试你的英雄");
			return false;
		}
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
	function visible(elem){
    	return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
  	};
	return this;
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
		random: ['page-flipOutLeft', 'page-flipInRight page-delay500']
	};

	var $next = this.$sels.eq(this.cur).addClass(this.curClass);
	this.fadeEffects($next);
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
	if(this.cur == (this.count-1)){
		this.shareTimer = setTimeout(function() {
			$('#share').addClass('z-show');
		}, 300);
	}
	return this;
};
Slide.prototype.fadeEffects = function($curPage){
	if((this.cur == 1||this.cur == 9)&&(this.direction === 'up' || this.direction === 'down')){
		var _this = this,
			$imgs = $curPage.children('img'),
			count = $imgs.length;
		for(var i =0;i<count;i++){
			if(i%2 == 0){
				$imgs.eq(i).addClass('fadeInLeft').one(_this.animEndNames, function() {
					$(this).off(_this.animEndNames).removeClass('fadeInLeft');
				});
			}else{
				$imgs.eq(i).addClass('fadeInRight').one(_this.animEndNames, function() {
					$(this).off(_this.animEndNames).removeClass('fadeInRight');
				});
			}
		}
	}
}

function RandHero(els){
	this.$sels = els;
	this.count = this.$sels.length;
	this.endNext = false;
	this.endPre = true;
	//0~count random
	this.startIndex = Math.ceil(Math.random()*this.count)-1;
	this.animEndNames = 'webkitAnimationEnd mozAnimationEnd oAnimationEnd MSAnimationEnd animationend';
	this.origClass = this.$sels.eq(1).attr('class');
	this.curClass = 'slide-current';
	//this.preClass = 'page-rotateFall page-ontop';
	//this.nextClass = 'page-scaleUp';
	this.preClass = 'page-flipOutLeft';
	this.nextClass = 'page-flipInRight page-delay500';
	this.flag = true;
	return this;
}
RandHero.prototype.initRand = function(){
	this.heroIndex = Math.ceil(Math.random()*this.count) -1;
	this.startRand();
	return this;
}
RandHero.prototype.startRand = function(){
	var _this = this,
		$next = this.$sels.eq(this.startIndex).addClass(this.curClass);
	
	if(this.$pre){
		this.$pre.addClass(this.preClass).one(_this.animEndNames, function(){
			_this.$pre.off(_this.animEndNames);
			_this.endPre = true;
			if(_this.endNext) {
				_this.resetRandHero($next);
			}
		});
	}
	$next.addClass(this.nextClass).one(_this.animEndNames, function(){
		$next.off(_this.animEndNames);
		_this.endNext = true;
		if(_this.endPre) {
			_this.resetRandHero($next);
		}
	});
}
RandHero.prototype.resetRandHero = function($next){
	this.endNext = false;
	this.endPre = false;
	if(this.$pre){
		this.$pre.attr('class', '');
	}
	$next.attr('class', this.curClass);
	this.$pre = $next;
	this.startIndex++;
	if(this.flag){
		if(this.startIndex == this.count){
			this.startIndex = 0;
			this.flag = false;
		}
		this.startRand();
	}else{
		if(this.heroIndex == (this.startIndex-1)){
			this.flag = true;
			$('#cg-hero').next().next().show();
			return this.heroIndex;
		}else{
			this.startRand();
		}
	}
}