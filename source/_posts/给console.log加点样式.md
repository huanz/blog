title: 给console.log加点样式
date: 2014-09-21 15:34:43
tags: javascript
categories: technology
---

Console.log是前端开发中最简单、最强大的工具。然而它并不是我们想象的那么简单。在平常的开发过程中，你可能只会用它来在控制台里面简单的打印一点信息而已，但是你却不知道它还可以给你打印的信息定义样式。

<!-- more -->

如我们想打印一条错误信息，并且让它显眼一些，我们可以这样：

```javascript
console.error("%c\nid is undefined", "font-size:20pt")
```

![](http://blog.u.qiniudn.com/uploads%2Fconsole1.png)

你还可以给你的log信息加一些阴影或渐变：

```javascript
console.log("%c有阴影的log", "text-shadow: 1px 1px 1px grey")

console.log('%c彩色文字啊 ', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');
```

![](http://blog.u.qiniudn.com/uploads%2Fconsole2.png?)

你还可以只让一部分信息应用样式：

```javascript
console.log("部分加粗：%c加粗", "font-weight:bold")
```

![](http://blog.u.qiniudn.com/uploads%2Fconsole3.png)

每遇到一个`%c`都会重置样式：

```javascript
console.log("%c样式一%c样式二%c样式三", "color:red","","color:orange;font-weight:bold")
```

![](http://blog.u.qiniudn.com/uploads%2Fconsole4.png)
	

使用图片：

```javascript
console.log("%c ", "background: url(http://blog.u.qiniudn.com/images/sponsor120.jpg) no-repeat center;padding-left:120px;padding-bottom: 200px;")
```

![](http://blog.u.qiniudn.com/uploads%2Fconsole5.png)

网上还有人专门写了一个[console.graph](https://github.com/zackbloom/console.graph)

![](http://blog.u.qiniudn.com/uploads%2Fconsole6.png)

更奇妙的是你还可以在console里面绘制canvas图形。


**addition**

上面代码的%s表示字符串的占位符，其他占位符还有:

> `%d`, `%i` 整数
> 
> `%f` 浮点数
> 
> `%o` 对象的链接
> 
> `%c` CSS格式字符串







	







