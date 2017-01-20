title: [译]关于HTTP安全头你需要知道的一切
date: 2017-01-20 14:56:30
tags: http
categories: technology
---

28年前，一些物理学家需要一种方法来轻松分享实验数据，因此网络诞生了。这通常被认为是一个好举措。不辛的是所有物理学家触碰的是——从三角学到强大的核力——最终成为武器，HTTP协议也是如此。

<!-- more -->

原文链接：[https://blog.appcanary.com/2017/http-security-headers.html](https://blog.appcanary.com/2017/http-security-headers.html)


任何可以被攻击的都必须得到捍卫，而且通常所有的安全功能就是在一个螺丝钉上亡羊补牢...事情变得有点复杂。

本文解释了什么是安全头以及如何在`Rails`, `Django`, `Express.js`, `Go`, `Nginx`, 和 `Apache`设置这些安全头。

请注意，有些头部最好配置在你的HTTP服务端，然而有些头部最好设置在你的应用层。在这里请自由选择。你可以通过 Mozilla’s [Observatory](https://observatory.mozilla.org/analyze.html?host=w3cboy.com) 看看你配置的怎么样。

## HTTP Security Headers

- [X-XSS-Protection](#x-xss-protection)
- [Content Security Policy](#content-security-policy)
- [HTTP Strict Transport Security (HSTS)](#http-strict-transport-security-hsts)
- [HTTP Public Key Pinning (HPKP)](#http-public-key-pinning-hpkp)
- [X-Frame-Options](#x-frame-options)
- [X-Content-Type-Options](#x-content-type-options)
- [Referrer-Policy](#referrer-policy)
- [Cookie Options](#cookie-options)



## X-XSS-Protection

```
X-XSS-Protection: 0;
X-XSS-Protection: 1;
X-XSS-Protection: 1; mode=block
```

### 为什么？

跨站脚本，同常简称为XSS，是一种攻击者让网页加载一些恶意JavaScript的攻击方式。`X-XSS-Protection`是 Chrome 和 IE 浏览器的一个属性，用来抵御 “反射型” XSS攻击——攻击者发送恶意的有效载荷作为请求的一部分。



`X-XSS-Protection: 0` 关闭XSS保护。

`X-XSS-Protection: 1`  过滤请求里面的所有外部脚本，但是仍然会渲染页面。

`X-XSS-Protection: 1; mode=block` 当触发的时候，将会阻断整个页面的渲染。



### 我应该使用吗？

是的。设置`X-XSS-Protection: 1; mode=block` 这种 “过滤恶意脚本” 是有问题的；为什么请看[这里](http://blog.innerht.ml/the-misunderstood-x-xss-protection/)。

### 如何使用？

|      平台       |                    用法                    |
| :-----------: | :--------------------------------------: |
| Rails 4 and 5 |                   默认开启                   |
|    Django     |    `SECURE_BROWSER_XSS_FILTER = True`    |
|  Express.js   | 用 [helmet](https://helmetjs.github.io/docs/xss-filter/) |
|      Go       | 用 [unrolled/secure](https://github.com/unrolled/secure) |
|     Nginx     | ` add_header X-XSS-Protection "1; mode=block";` |
|    Apache     | ` Header always set X-XSS-Protection "1; mode=block"` |



### 我想了解更多

[X-XSS-Protection - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)



## Content Security Policy

```
Content-Security-Policy: <policy>
```



### 为什么？

Content Security Policy 可以被认为是上面header里更高版本的`X-XSS-Protection`。`X-XSS-Protection` 只会阻止来自请求中的脚本，但是并不会阻止涉及存储恶意脚本在你的服务器或者加载带有恶意脚本外部资源的XSS攻击。

CSP 给你一种语言去定义浏览器可以从哪些地方加载资源。你可以为脚本、图片、字体、样式表等设置细粒度的白名单源。你也可以将任何加载的内容与哈希或签名进行比较。

### 我应该使用吗？

是的。它虽然不会防止所有的XSS攻击，但是会显著缓解它们带来的影响，而且是深度防御的一个重要方面。如果你是个勇敢的读者，并且走在了前面，检查了[appcanary.com](https://appcanary.com/)的响应头，你会发现我们还没有设置 CSP。我们正在使用的一些Rails的开发插件阻碍了我们来设置CSP以至于会造成真正的安全影响。我们正在解决这个问题，并在下次连载写出来。

### 如何使用

书写CSP策略是具有挑战的。去[这里](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy__by_cnvoid)看可以使用的所有指令列表。从[这里](https://csp.withgoogle.com/docs/adopting-csp.html)开始是个不错的选择。



|      平台       |                    用法                    |
| :-----------: | :--------------------------------------: |
| Rails 4 and 5 | 使用 [secureheaders](https://github.com/twitter/secureheaders) |
|    Django     | 使用  [django-csp](https://github.com/mozilla/django-csp) |
|  Express.js   | 使用  [helmet/csp](https://github.com/helmetjs/csp) |
|      Go       | 使用  [unrolled/secure](https://github.com/unrolled/secure) |
|     Nginx     | ` add_header Content-Security-Policy "<policy>";` |
|    Apache     | ` Header always set Content-Security-Policy "<policy>"` |



### 我想了解更多

- [Content-Security-Policy - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy)
- [CSP Quick Reference Guide](https://content-security-policy.com/)
- [Google’s CSP Guide](https://csp.withgoogle.com/docs/index.html)

## HTTP Strict Transport Security (HSTS)

```
Strict-Transport-Security: max-age=<expire-time>
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
Strict-Transport-Security: max-age=<expire-time>; preload
```

### 为什么？

当我们想安全地与人沟通，我们面临两个问题。第一个问题是隐私，我们想确保我们发送的消息只能由收件人读取，没有其他人。另一个问题是认证：我们如何知道收件人就是他们说的他们是谁？

HTTPS通过加密解决了第一个问题，但它在认证上有一些重大的问题（稍后会有更多说明，如 [Public Key Pinning](#http-public-key-pinning-hpkp)）。HSTS头解决元问题：你如何知道与你对话的人实际上支持加密？

HSTS通过[sslstrip](https://moxie.org/software/sslstrip/)减轻攻击。假设你正在使用一个敌对的网络，一个恶意攻击者控制了WiFi路由。攻击者可以禁用您和您浏览的网站之间的加密。即使你访问的网站只能通过HTTPS，攻击者可以中间人的HTTP流量，使它看起来像网站的作品在未加密的HTTP。不需要SSL证书，只需禁用加密。