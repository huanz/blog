title: Backbone实战教程（三）
date: 2014-05-14 21:21:21
tags: [backbone, javascript]
categories: technology
toc: true
---
前面的教程中我已经用Backbone做了一个简单的通讯录案例，隔了这么久也不想继续去解读那个例子的源代码了，所以这个教程就直接进入Backbone的源码解读部分了，希望看过此教程后大家会对Backbone更加熟悉。


<!-- more -->


Backbone官网也有简单的英文文档对源代码介绍，地址在这里：[BACKBONE.JS](http://backbonejs.org/docs/backbone.html "backbone")

## 框架入口 ##

```javascript
(function(root, factory) {
	...
}(this, function(root, Backbone, _, $) {
	var previousBackbone = root.Backbone;
	...
	return Backbone;
}));
```

将上面的代码继续简化将变成：

```javascript
(
	function(root, factory){
		...
	}(this, function(...){})
);
```

到这里大家应该能够清晰的看出来了：

首先用括号括起来定义一个作用域，在这个作用域里面有个立即执行的函数

```javascript	
(function(root, factory)(this, function(){}));
```

接收两个参数`root`和`factory`，其中`root`是传过去的`this`，`this`一般是`window`对象（在node.js里面是global对象），`factory`是传过去的函数

将这两个对象传过去后我们可以这样来简化代码：

```javascript
function(window, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
			window.Backbone = factory(window, exports, _, $);
		}
	}
	...
}
```

这段代码是检测是否是通过AMD加载器加载的（如requirejs,seajs,...），如果是的话，加载underscore，jquery，exports，并在factory函数中传入这些变量，将factory的返回值赋值给window.Backbone，再简化一下的话是：

```javascript
window.Backbone = function(window, exports, _, $){
	var previousBackbone = root.Backbone;
	
	var array = [];
	...
	return Backbone;
}
```

继续向下

```javascript
else if (typeof exports !== 'undefined') {
 	var _ = require('underscore');
	factory(root, exports, _);
}
```

检测遵循CommonJS规范的，如在Node.js加载不需要jquery。

最后就是普通浏览器里面直接链接了。


## 初始化 ##

```javascript
Backbone.emulateHTTP = false;
```

对于不支持REST方式的浏览器, 可以设置

```javascript
Backbone.emulateHTTP = true;
```

与服务器请求将以POST方式发送, 并在数据中加入_method参数标识操作名称, 同时也将发送X-HTTP-Method-Override头信息

```javascript
Backbone.emulateJSON = false;
```

对于不支持application/json编码的浏览器, 可以设置

```javascript
Backbone.emulateJSON = true;
```

将请求类型设置为application/x-www-form-urlencoded, 并将数据放置在model参数中实现兼容。

今天到此，下次继续吧~~~




	