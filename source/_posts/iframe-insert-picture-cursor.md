title: iframe从光标处插入图片
date: 2015-06-11 10:17:12
tags: javascript
categories: technology
---

最近改了一个很久之前的编辑器的bug：ie浏览器不能在光标处插入图片，记录在此。

<!-- more -->

编辑器很古老，代码混乱，是通过开启`iframe`的`document.designMode='on'`来实现编辑的。


首先需要在`iframe`加载之后开启`designMode`，后监听`mouseup`和`keyup`事件来记录光标位置(切记要在`designMode`开启之后监听，不然ie上面是监听不到的)
	
```javascript
var addEvent = (function(){
	if(document.addEventListener){
		return function(type, el, fn){
			el.addEventListener(type, fn, false);
		}
	}else if(document.attachEvent){
		return function(type, el, fn){
			el.attachEvent('on' + type, fn);
		}
	}else{
		return function(type, el, fn) {
        	el['on' + type] = fn;
        }
	}
})();
	
var iframeNode = window.frames['editIframe'];
	
addEvent(iframeNode, 'load', function(){
	var iframeDoc = iframeNode.contentDocument || iframeNode.document;
		
	iframeDoc.designMode='on';

	addEvent(iframeDoc, 'mouseup', function(){
    	saveSelection();
    });
    addEvent(iframeDoc, 'keyup', function(){
        saveSelection();
    });
    	
    //获取和记录光标
    var currentRange, supportRange = typeof document.createRange === 'function';
    	
    function getCurrentRange() {
    	var selection, range;
    	if(supportRange){
    	   selection = iframeDoc.getSelection();
        	if (selection.getRangeAt && selection.rangeCount) {
            	range = iframeDoc.getSelection().getRangeAt(0);
        	}
    	}else{
        	range = iframeDoc.selection.createRange();
    	}
    	return range;
	}
		
	function saveSelection() {
    	currentRange = getCurrentRange();
	}
    	
    function restoreSelection() {
        if(!currentRange){
		      return;
		  }
		  var selection, range;
		  iframeDoc.body.focus();
		  if(supportRange){
		      selection = iframeDoc.getSelection();
		      selection.removeAllRanges();
		      selection.addRange(currentRange);
		  }else{
		      currentRange.select();
		  }
	}
		
	//插入图片
	function insertImg(html){
	   restoreSelection();
		iframeDoc.execCommand('insertImage', false, html);
		saveSelection();
	}	
});
```
	
> 相关资料
> 
* [编辑器从光标处插入图片(失去焦点后仍然可以在原位置插入)](http://www.cnblogs.com/TheViper/p/4303158.html)
* 但是后来发现其中的`setEndPoint`方法在ie8报参数无效的错误，但是貌似如果编辑器对象是`input`的话好像就不会报错，后来就找到了这篇博文：[TextRange对象的setEndPoint方法和compareEndPoints方法](http://www.cnblogs.com/opencoder/articles/1459010.html)
* Web Api 接口Range(W3C)：[https://developer.mozilla.org/zh-CN/docs/Web/API/Range](https://developer.mozilla.org/zh-CN/docs/Web/API/Range)
* Traversal and Range(IE)：[https://msdn.microsoft.com/zh-cn/library/ms536745(v=vs.85).aspx](https://msdn.microsoft.com/zh-cn/library/ms536745(v=vs.85).aspx)



		

	
	
	