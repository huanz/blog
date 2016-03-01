title: ajax跨域问题解决方案
date: 2015/1/13 11:54:21 
tags: javascript
categories: technology
---

ajax跨域一直是个巨坑的问题。特别是在项目开发过程中，前后端接口调试的时候，一个跨域的问题可能会折腾后端很久，今天就来简单讲讲如何解决这个跨域。

<!-- more -->

## 通过chrome启动参数 ##

这是最近发现的一种方法，方便快捷有效：在chrome启动里面加参数。

右键点击chrome快捷方式，在目标那一栏的最后添加`--disable-web-security`：

![](http://blog.u.qiniudn.com/uploads/chromeajax.png)

如果你是MAC系统的话，你可以在你的home目录下新建一个`chrome.sh`:

```bash
#!/bin/sh
open -a "Google Chrome" --args --disable-web-security
```

并且赋予可执行权限：
	
```bash
$ sudo chmod +x chrome.sh
```

需要跨域的时候就执行这个sh来启动chrome。

通过这个快捷方式来启动chrome成功之后，在上方会有一个黄条提示：

> 您使用的是不受支持的命令行标记：--disable-web-security。稳定性和安全性会有所下降。

表明你已经成功启动了。这样启动的ajax请求都可以跨域。

**在以这种方式启动前，请先关闭chrome，不然无法以这种方式启动**

这是最简单的方式，只限调试使用。

## 通过设置Response header ##

通过这种方式需要服务端在响应头部设置允许跨域。这是H5引入的规范，所以不是所有的浏览器都支持的。

```
Access-Control-Allow-Origin: <origin> | *
```

如：
	
```java
// java
Response.AddHeader("Access-Control-Allow-Origin", "http://w3cboy.com");
```

```php
// php
header("Access-Control-Allow-Origin: http://w3cboy.com");
```

允许所有可以用通配符`*`，但是这样的话跨域请求不能带cookie（`withCredentials `）

有时候需要设置多个域名，所以可以通过服务端来判断加不同的origin：

```php
// php
if( preg_match("/http:\/\/(.*?)\.w3cboy.com/", $_SERVER['HTTP_ORIGIN'], $matches )) {
    $theMatch = $matches[0];
    header('Access-Control-Allow-Origin: ' . $theMatch);
}
```

当然也可以在服务器里面设置。

关于跨域资源共享（Cross-Origin Resource Sharing）的这种方式，还有更多的设置项，可以去[W3C](http://www.w3.org/TR/cors/)看。


## JSONP ##

jsonp是通过js的方式来实现跨域数据共享的，因为请求js文件是没有跨域限制的，所以服务端把数据封装成一个js对象返回，请求的时候需要告知一个函数名，一般是放在请求的callback这个参数里面，如通过jquery的ajax，dataType设置为jsonp的话会发现请求会自动加一个callback参数，如`&callback=?`，那么服务端返回的是：

```javascript
?({a:11, b: "www"});
```

那么在客户端的话是这样的：

```javascript
function ?(data){
	console.log(data);
}
```

到这里你也许明白了jsonp的优缺点：能兼容低版本浏览器，但是由于通过get方式请求，所以承载信息量有限。

## document.domain+iframe ##

对于主域相同而子域不同的情况，可以通过设置`document.domain`的办法来解决。

具体的做法是可以在`http://www.w3cboy.com/a.html`和`http://github.w3cboy.com/b.html`两个文件中分别加上`document.domain = 'w3cboy.com'`。

后通过a.html文件中创建一个iframe,去控制iframe的`contentDocument`,这样两个js文件之间就可以交互了。

```javascript
//http://www.w3cboy.com/a.html

document.domain = 'w3cboy.com';

var ifr = document.createElement('iframe');
ifr.src = 'http://github.w3cboy.com/b.html';
ifr.style.display = 'none';
document.body.appendChild(ifr);
ifr.onload = function(){
    var x = ifr.contentDocument;
    console.log(x.body.nodeValue);
};


//http://github.w3cboy.com/b.html
document.domain = 'w3cboy.com';
```

## 其它方案 ##

其它方案还有服务代理（在web服务器上封装第三方服务，然后给自己同源的web页面调用），HTML5的`postMessage`等。








	







