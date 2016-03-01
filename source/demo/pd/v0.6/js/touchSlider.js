;(function($){
    //干掉页面bounce效果
    $(document).on('touchmove',function(e){
        e.preventDefault();
    });
    $.fn.touchSlider = function(option){
        var opts = $.extend({}, $.fn.touchSlider.defaults, option), //配置选项
            $slider = this,
            $items = $slider.find(opts.itemSelector),    //获取子元素数组
            sliderStylePosition = $slider.css('position'),
            sliderHeight = $slider.height(),
            sliderWidth = $slider.width(),
            step = 0,
            curItemIndex = 0,
            oldPosition = 0,
            backMove = false,
            forwardMove = false,
            backFirst = false,
            forwardLast = false,
            isAnimate = false,
            isDirectionV = (opts.direction == 'v'),
            distance = isDirectionV ? sliderHeight : sliderWidth;
        //初始化
        $slider.css({'background-color':'#000'})
        sliderStylePosition == 'absolute' || sliderStylePosition == 'fixed' || ($slider.css({'position':'relative'}));  //设置slider容器的position值
        $items.each(function(i,o){
            $items.eq(i).css({
                'position':'absolute',
                'top': isDirectionV ? sliderHeight+'px' : 0,
                'left': isDirectionV ? 0 : sliderWidth +'px',
                'z-index': '500'
            });
        }); //遍历子元素设置样式
        $items.eq(0).css(isDirectionV ? 'top' : 'left', 0); //重置第一个子元素的样式
        opts.onMoveEnd(0);
        //事件注册
        $slider.on('touchstart',function(e){
            var touch = e.touches[0];
            oldPosition = isDirectionV ? touch.clientY : touch.clientX;
            step = 0;
            backMove = false;
            forwardMove = false;
            backFirst = false;
            forwardLast = false;
        }).on('touchmove',function(e){
            var touch = e.touches[0],
                curPosition = isDirectionV ? touch.clientY : touch.clientX,
                gap = curPosition - oldPosition,
                moveItemIndex=0,
                newPosition = 0;
            step += gap;
            //向上/左正向滑
            if(gap<0 && !isAnimate){
                forwardLast = curItemIndex == $items.length-1 && !backMove ? true : false;
                if(backMove){//先向下/右逆向滑，过程中不放手再向上/左正向滑
                    newPosition = -distance+step;
                    moveItemIndex = curItemIndex==0 ? curItemIndex : curItemIndex-1;
                    moveItem(moveItemIndex, newPosition);
                }else if(curItemIndex!==$items.length-1 && !backFirst){
                    newPosition = distance+step;
                    moveItemIndex = curItemIndex+1;
                    moveItem(moveItemIndex, newPosition);
                    forwardMove = true;
                }
            }
            //向下/右逆向滑
            if(gap>0 && !isAnimate){
                backFirst = curItemIndex == 0 && !forwardMove ? true : false;
                if(forwardMove){//先向上/左正向滑，过程中不放手再向下/右逆向滑
                    newPosition = distance+step;
                    moveItemIndex = curItemIndex==$items.length-1 ? curItemIndex : curItemIndex+1;
                    moveItem(moveItemIndex, newPosition);
                }else if(curItemIndex!==0 && !forwardLast){
                    newPosition = -distance+step;
                    moveItemIndex = curItemIndex-1;
                    backMove = true; 
                    moveItem(moveItemIndex, newPosition);
                }
            }
            //更新坐标
            oldPosition = curPosition;
        }).on('touchend',function(e){
            if(forwardMove){
                animateItem(1);
            }
            if(backMove){
                animateItem(-1);
            }
        });
        
        //放手后自动滑向目标位置， flag控制滑动方向
        function animateItem(flag){
            isAnimate = true;
            var percent = Math.abs(step)/distance,
                animTarget = percent>opts.slidePercent ? '0px' : distance*flag+'px',
                animProperty = isDirectionV ? {'top': animTarget} : {'left': animTarget},
                oldTarget = -distance*flag+'px',
                oldProperty = isDirectionV ? {'top': oldTarget} : {'left': oldTarget};
            $items.eq(curItemIndex+flag).animate(animProperty,250,'ease-in',function(){
                if(percent>opts.slidePercent){
                    $items.eq(curItemIndex).css(isDirectionV ? 'top' : 'left',oldTarget).css('opacity','');
                    $items.eq(curItemIndex+flag).css({'transition':'','z-index':500});
                    curItemIndex += flag;
                    opts.onMoveEnd(curItemIndex);
                }else{
                    $items.eq(curItemIndex).css('opacity','');
                }
                isAnimate = false;
            });
        }

        //设置随手被拖动的坐标
        function moveItem(moveItemIndex, newPosition){ 
            $items.eq(curItemIndex).css('opacity',1-Math.abs(step)/distance);
            $items.eq(moveItemIndex).css(isDirectionV ? 'top' : 'left',newPosition+'px').css({'z-index':1000});
        }

        $.fn.resetSlider = function(){
            curItemIndex = 0;
        }

        //链式返回
        return this;
    };
    $.fn.touchSlider.defaults = {
        direction: 'h', //'h' 纵向,'v' 横向
        slidePercent: 0.3,  //拖动超过多少百分比后才翻页
        itemSelector: 'div', //子元素选择器
        onMoveEnd: function(index){ //滑动结束后事件
            //console.log(index);
        }
    };
})(Zepto);