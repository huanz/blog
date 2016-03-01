title: 如何使用js捕获css3动画
date: 2014-03-25 20:53:53
tags: css3
categories: technology
---

css3动画功能强大，但是不像js，没有逐帧控制，但是可以通过js事件来确定任何动画的状态。

<!-- more -->


下面是一段css3动画代码：
    
```css
#anim.enable{
	-webkit-animation: flash 1s ease 3;
	-moz-animation: flash 1s ease 3;
	-ms-animation: flash 1s ease 3;
	-o-animation: flash 1s ease 3;
	animation: flash 1s ease 3;
}

/* animation */
@-webkit-keyframes flash {
	50% { opacity: 0; }
}

@-moz-keyframes flash {
	50% { opacity: 0; }
}

@-ms-keyframes flash {
	50% { opacity: 0; }
}

@-o-keyframes flash {
	50% { opacity: 0; }
}

@keyframes flash {
	50% { opacity: 0; }
}
```

上面动画的效果是：当id为anim的元素加上enable的class的时候，执行动画flash 3 次，每次执行事件是1s。

当触发动画的时候，有三种类型的事件触发：

**animationstart**

```javascript
var anim = document.getElementById("anim");
anim.addEventListener("animationstart", AnimationListener, false);
```

动画第一次开始的时候触发animationstart事件。

**animationiteration**
    
```javascript
anim.addEventListener("animationiteration", AnimationListener, false);
```

除了首次开始动画外，其它每次开始动画迭代都触发animationiteration事件。

**animationend**

```javascript
anim.addEventListener("animationend", AnimationListener, false);
```

动画结束的时候触发animationend事件。

## 浏览器的支持情况 ##

> W3c标准：animationstart  animationiteration animationend
> 
> Webkit：webkitAnimationStart webkitAnimationIteration webkitAnimationEnd
> 
> Firefox：animationstart animationiteration animationend
>
> Opera：animationstart animationiteration animationend
> 
> IE10：MSAnimationStart MSAnimationIteration MSAnimationEnd

下面是一段兼容性的监听css3动画的js代码：

```javascript
var pfx = ["webkit", "moz", "MS", "o", ""];
function PrefixedEvent(element, type, callback) {
	for (var p = 0; p < pfx.length; p++) {
		if (!pfx[p]) type = type.toLowerCase();
		element.addEventListener(pfx[p]+type, callback, false);
	}
}

// animation listener events
PrefixedEvent(anim, "AnimationStart", AnimationListener);
PrefixedEvent(anim, "AnimationIteration", AnimationListener);
PrefixedEvent(anim, "AnimationEnd", AnimationListener);
```

我们也可以用jquery提供的one方法来监听动画，如下面是动画结束的时候移除动画代码：
	
```javascript
$('#anim').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
    $(this).removeClass('enable');
});
```

**事件对象**

在上面的代码中,动画事件触发的时候将会调用动画监听函数。一个事件对象作为一个参数传递。在标准的属性和方法中,它还提供了:
> **animationName**：css3动画的名称（如上面例子中的名称：flash）
> **elapsedTime**：动画开始以来的执行事件（以秒为单位）

我们可以检测动画的结束，如：

```javascript
if (e.animationName == "flash" && e.type.toLowerCase().indexOf("animationend") >= 0) {
	...
}
```

代码中我们可以在动画执行结束后删除相应的class或应用新的动画等

但是如果我们想改变CSS animation(动画)执行过程中的动画，还需要一点技巧！


以下来着:[http://css-tricks.com/controlling-css-animations-transitions-javascript/](http://css-tricks.com/controlling-css-animations-transitions-javascript/)


**animation-play-state属性**

当你想在动画执行过程中暂停，并且接下来让动画接着执行。这时CSS的animation-play-state属性是非常有用的。你可以可以通过JavaScript像这样更改CSS(注意你的前缀)：

```javascript
element.style.webkitAnimationPlayState = "paused";
element.style.webkitAnimationPlayState = "running";
```

然而当使用animation-play-state让CSS 动画暂停时，动画中的元素变形也会以相同的方式被阻止。你不能使这种变形暂停在某个状态，使它变形，使它恢复，更不用期望它能从新的变形状态中恢复到流畅运行。为了实现这些控制，我们需要做一些更复杂的工作。

**获取当前keyvalue的百分比**

不幸的是，在这个阶段没有办法获得当前CSS动画关键帧的“完成百分比”。最好的获取近似值的方法是使用setInterval 函数在动画过程中迭代100次。它的本质是：动画持续的时间(单位是毫秒)/100。例如，如果动画时长4秒，则得到的setInterval的执行时间是每40毫秒(4000 / 100)。
 
这种做法很不理想，因为函数实际运行频率要远少于每40毫秒。我发现将它设为39毫秒更准确。但这个也不是好实现，因为它依赖于浏览器，并非所有浏览器下都能得到很完美效果。

**获取当前动画的CSS属性值**

你可以用document.styleSheets来获取与页面关联的样式表的集合，然后通过for循环取得具体的样式表。以下是如何使用JavaScript来找到一个特定动画值的CSSKeyFrameRules对象：

```javascript
function findKeyframesRule(rule){
	var ss = document.styleSheets;
	for(var i = 0;i < ss.length;++i){
		for(var j = 0;j<ss[i].cssRules.length;++j){
			if(ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
				return ss[i].cssRules[j];
			}
		}
	}
	return null;
}
```

我们一旦调用上面的函数(例如 var keyframes= findKeyframesRule(anim))，就可以通过keyframes.cssRules.length获得该对象的动画长度(这个动画中关键帧的总数量)。然后使用JavaScript的.map方法把获得到的每个关键帧值上的“%”过滤掉，这样JavaScript就可以把这些值作为数字使用。

```javascript
// Makes an array of the current percent values
// in the animation
var keyframeString = [];
for(var i = 0; i < length; i ++){
	keyframeString.push(keyframes[i].keyText);
}
// Removes all the % values from the array so
// the getClosest function can perform calculations
var keys = keyframeString.map(function(str) {
		return str.replace('%', '');
	});
```

这里keys是一个包含所有动画关键帧数值的数组。

**改变实际的动画（终于！）**

在循环动画演示过程中，我们需要两个变量：一个用来跟踪从最近的起始位置开始移动了多少度，另一个用来跟踪从原来的起始位置开始移动了多少度。我们可以使用setInterval函数(在环形移动度数时消耗的时间)改变第一个变量。然后我们可以使用下面的代码，当单击该按钮时更新第二个变量。

```javascript
totalCurrentPercent += currentPercent;
// Since it's in percent it shouldn't ever be over 100
if (totalCurrentPercent > 100) {
	totalCurrentPercent -= 100;
}
```

然后我们可以使用以下函数，在之前我们获得的关键帧数组里，找出与当前总百分比值最接近的关键帧值。

```javascript
function getClosest(keyframe) {
	// curr stands for current keyframe
	var curr = keyframe[0];
	var diff = Math.abs (totalCurrentPercent - curr);
	for (var val = 0, j = keyframe.length; val < j; val++) {
		var newdiff = Math.abs(totalCurrentPercent - keyframe[val]);
		// If the difference between the current percent and the iterated
		// keyframe is smaller, take the new difference and keyframe
		if (newdiff < diff) {
			diff = newdiff;
			curr = keyframe[val];
		}
	}
	return curr;
}
```

要获得新动画第一关键帧的位置值，我们可以使用JavaScript的.IndexOf方法。然后我们根据这个值，删除原来的关键帧定义，重新定义该关键帧。

```javascript
for (var i = 0, j = keyframeString.length; i < j; i ++) {
	keyframes.deleteRule(keyframeString[i]);
}
```

接下来，我们需要把圆的度数值转换成相应的百分比值。我们可以通过第一关键帧的位置值与3.6简单的相乘得到(因为10 0 * 3.6 = 360)。

最后，我们基于上面获得变量创建新的规则。每个规则之间有45度的差值，是因为我们在绕圈过程中拥有八个不同的关键帧，360(一个圆的度数)除以8是45。

```javascript
// Prefix here as needed
keyframes.insertRule("0% {
	-webkit-transform: translate(100px,100px) rotate(" + (multiplier + 0) + "deg)
	translate(-100px,-100px) rotate(" + (multiplier + 0) + "deg);
	background-color:red;
}");
keyframes.insertRule("13% {
	-webkit-transform: translate(100px,100px) rotate(" + (multiplier + 45) + "deg)
	translate(-100px,-100px) rotate(" + (multiplier + 45) + "deg);
}");

...continued...
```

然后我们通过setInterval重置当前百分比值来使它可以再次运行。注意上面使用的是WebKit前缀，为了使它兼容更多的浏览器，我们需要做一些UA的嗅探来确定采用哪个前缀：

```javascript
var browserPrefix;
navigator.sayswho= (function(){
	var N = navigator.appName, ua = navigator.userAgent, tem;
	var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if(M && (tem = ua.match(/version\/([\.\d]+)/i))!= null) M[2] = tem[1];
	M = M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
	M = M[0];
	if(M == "Chrome") { browserPrefix = "webkit"; }
	if(M == "Firefox") { browserPrefix = "moz"; }
	if(M == "Safari") { browserPrefix = "webkit"; }
	if(M == "MSIE") { browserPrefix = "ms"; }
})();
```

如果你想进一步研究，可以访问Russell Uresti在[StackOverflow上的帖子](http://stackoverflow.com/questions/10342494/set-webkit-keyframes-values-using-javascript-variable)和[相应的案例](http://jsfiddle.net/russelluresti/RHhBz/2/)。

**Animations(动画)转成Transitions(过渡)** 

正如我们所看到的，使用JavaScript可以很方便的操作CSS transitions(过渡)。如果使用CSS animations(动画)最终没能得到想要的结果，你可以试着把它变成css transitions(过渡)来实现。从CSS代码来看他们大约有相同的代码量，但使用transiton可以更容易地设置和编辑。
 
将CSS animations(动画)转换成CSS transitions(过渡)的最大问题是，当我们把animation-iteration转换成与之等效的transition命令时，Transitons(过渡)没有直接等效命令。
 
关于我们的旋转演示，有一个小技巧就是用x来分别乘以transition-duration和rotation(译者：分别包括X轴和Y轴的旋转值)。然后你需要使用样式类来触发这个动画，因为如果你在元素上直接改变这些属性，将不会有过渡效果。你需要给元素添加类名来触发过渡(模拟动画)。
 
在我们的例子中，我们在页面加载时实现：

执行效果：[http://cdpn.io/IdlHx](http://cdpn.io/IdlHx)

**利用CSS矩阵**

你也通过CSSMatrix来操作CSS animations(动画)。比如：

```javascript
var translated3D = new WebKitCSSMatrix(window.getComputedStyle(elem, null).webkitTransform);
```

但是这个过程可能有些混乱，尤其对于那些刚刚开始使用CSS animations(动画)的。

**重置CSS animations(动画)**

实现这个技巧的方法可以从[CSS Tricks](http://css-tricks.com/restart-css-animation/)找到。

下面是几个例子：

![css3动画实例](http://blog.u.qiniudn.com/uploads/css31.jpg)

[http://jsfiddle.net/vals/BseLV/](http://jsfiddle.net/vals/BseLV/)

[http://jsfiddle.net/russelluresti/RHhBz/2/](http://jsfiddle.net/russelluresti/RHhBz/2/)

**CSS Transition中的事件**

当CSS Transition完成时触发一个事件，在符合标准的浏览器下，这个事件是 transitionend, 在 WebKit 下是 webkitTransitionEnd，详见下面的浏览器兼容性。 transitionend 事件提供两个属性:

> **propertyName**：字符串，指示已完成过渡的属性。
> **elapsedTime**：浮点数，指示当触发这个事件时过渡已运行的时间（秒）。这个值不受 transition-delay 影响。

> Note: 如果取消了过渡则不会触发 transitionend 事件，因为在过渡完成前动画的属性值改变了。

**浏览器兼容性**

> Chrome:webkitTransitionEnd
> 
> Opera:10.5->oTransitionEnd,12->otransitionend,12.10->transitionend
> 
> Safari:webkitTransitionEnd
> 
> Android: webkitTransitionEnd
> 
> Opera Mobile:10->oTransitionEnd,12->otransitionend,12.10->transitionend
> 	
> Safari Mobile:webkitTransitionEnd














