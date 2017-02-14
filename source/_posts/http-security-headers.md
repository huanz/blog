title: 关于HTTP安全头你需要知道的一切[译]
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

### 如何使用？

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

HSTS通过[sslstrip](https://moxie.org/software/sslstrip/)削弱攻击。假设你正在使用一个敌对的网络，一个恶意攻击者控制了WiFi路由。攻击者可以禁用您和您浏览的网站之间的加密。即使你访问的网站只能通过HTTPS，攻击者可以中间人的HTTP流量，使它看起来像网站的作品在未加密的HTTP。不需要SSL证书，只需禁用加密。

回到HSTS。`Strict-Transport-Security`头通过让你的浏览器知道它必须始终让你的网站使用加密来解决这个问题。只要你的浏览器识别到HSTS头，并且该HSTS头没过期，那么它就不允许在未加密的情况下访问到该站点，如果通过HTTPS无法访问它就会报出错误。

### 我应该使用吗？

是的。你的应用只能通过HTTPS访问，对吧？通过普通HTTP浏览将重定向到安全的网站，对吧？(提示：使用 [letsencrypt](https://letsencrypt.org/) 如果你想避开商业认证机构的敲诈。)

HSTS头的一个缺点是它允许一种[巧妙的技术](http://www.radicalresearch.co.uk/lab/hstssupercookies)创建可以指纹你用户的超级Cookies。

作为一个网站的经营者，你可能已经有点追踪你的用户了，但是请尽量使用HSTS的好处，不要为了超级Cookies去使用HSTS。

### 如何使用？

有两种选择

- `includeSubDomains` - HSTS 应用到子域名
- `preload` - 谷歌提供让你的网站在浏览器访问硬编码到HTTPS的[服务](https://hstspreload.org/)。通过这种方式，用户甚至不用访问你的网站：浏览器已经知道了它们应该阻止未加密的连接。从那个名单上去掉比较困难，所以除非你的子域名能够永远支持HTTPS你才打开它。

|     平台     |                    用法                    |
| :--------: | :--------------------------------------: |
|  Rails 4   | `config.force_ssl = true`默认不包括子域名，要设置的话：` config.ssl_options = { hsts: { subdomains: true } }` |
|  Rails 5   |        `config.force_ssl = true`         |
|   Django   | `SECURE_HSTS_SECONDS = 31536000` `SECURE_HSTS_INCLUDE_SUBDOMAINS = True` |
| Express.js | 使用 [helmet](https://helmetjs.github.io/docs/hsts/) |
|     Go     | 使用 [unrolled/secure](https://github.com/unrolled/secure) |
|   Nginx    | ` add_header Strict-Transport-Security "max-age=31536000; includeSubdomains; ";` |
|   Apache   | ` Header always set Strict-Transport-Security "max-age=31536000; includeSubdomains;` |



###  我想了解更多

- [RFC 6797](https://tools.ietf.org/html/rfc6797)
- [Strict-Transport-Security](https://developer.mozilla.org/zh-CN/docs/Security/HTTP_Strict_Transport_Security)




## HTTP Public Key Pinning (HPKP)

```
Public-Key-Pins: pin-sha256=<base64==>; max-age=<expireTime>;
Public-Key-Pins: pin-sha256=<base64==>; max-age=<expireTime>; includeSubDomains
Public-Key-Pins: pin-sha256=<base64==>; max-age=<expireTime>; report-uri=<reportURI>
```



### 为什么？

上面描述的HSTS头旨在确保所有通过你的网站的连接都进行了加密。然而它并没有指定用什么key。

网络上的信任是建立在证书授权（CA）模型之上的。你的浏览器和操作系统载体的公共密钥的一些值得信赖的证书颁发机构，通常是专门的公司和/或国家。当一个CA认证机构给你的指定域名颁发一个证书意味着任何一个信任这个CA认证机构的将会自动信任你通过该证书加密的SSL流量。那些CA认证机构负责核实你确实拥有这个域名（可以是任何方面，从发送一封邮件，到要求你提供一个文件，调查你的公司）。

两个CA认证机构可以向同一个域名颁发证书给两个不同的人，浏览器会信任两者。这就造成了一个问题，特别是因为CA认证机构[可能或者已经](https://technet.microsoft.com/library/security/2524375)被攻破。这允许攻击者MiTM（中间人攻击，*Man-in-the-middle* attack缩写）任何他们想要的域名，尽管那个域名已经使用了SSL或者HSTS。

HPKP头试图缓解这种情况。HPKP头让你"固定（pin）"一个证书。当浏览器第一次识别到这个头的时候，它将会保存这个证书。对于每一个到达max-age的请求，浏览器都将会返回失败，除非有一个从服务器发送的证书链带有被固定住的指纹。

这意味着你可以固定住CA或中间证书的各个部分以免搬起石头砸自己的脚（稍后详述）。

和上面的HSTS类似，HPKP头也有一些隐私方面的影响。这些已经在[RFC](https://tools.ietf.org/html/rfc7469#section-5)指出了。

### 我应该使用吗？

也许不要。



HPKP是一把非常非常锋利的刀。设想一下：如果你固定错了一个证书，或者你丢失了你的钥匙，或者有些地方弄错了，你将会把你的用户锁在你的网站外。所有你能做的就是等待固定过期。

这篇[文章](https://blog.qualys.com/ssllabs/2016/09/06/is-http-public-key-pinning-dead)列出案例反对了这种观点，并包含一种有趣的方式让攻击者使用HPKP去持有受害人的赌金。

另一种方法是使用`Public-Key-Pins-Report-Only`头，这将只报告有些地方出错了而不会将任何一个人锁在门外。这可以至少让你知道你的用户正在被中间攻击人攻击使用假证书。

### 如何使用？

两种方式



- `includeSubDomains`：HPKP应用到子域名
- `report-uri`：不合法的尝试将会被报告到这里



你必须为你的要固定的密钥生成一个 base64 编码的指纹，并且你必须使用一个备用密钥。访问[这篇指南](https://developer.mozilla.org/en-US/docs/Web/HTTP/Public_Key_Pinning#Extracting_the_Base64_encoded_public_key_information)看看如何做。

|     平台     |                    用法                    |
| :--------: | :--------------------------------------: |
| Rails 4和5  | 使用  [secureheaders](https://github.com/twitter/secureheaders/blob/master/docs/HPKP.md) |
|   Django   |                 编写自定义中间件                 |
| Express.js | 使用 [helmet](https://helmetjs.github.io/docs/hsts/) |
|     Go     | 使用 [unrolled/secure](https://github.com/unrolled/secure) |
|   Nginx    | `add_header Public-Key-Pins 'pin-sha256="<primary>"; pin-sha256="<backup>"; max-age=5184000; includeSubDomains';` |
|   Apache   | ` Header always set Public-Key-Pins 'pin-sha256="<primary>"; pin-sha256="<backup>"; max-age=5184000; includeSubDomains';` |



### 我想了解更多

- [RFC 7469](https://tools.ietf.org/html/rfc7469)
- [HTTP Public Key Pinning (HPKP) - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Public_Key_Pinning)



## X-Frame-Options

```
X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN
X-Frame-Options: ALLOW-FROM https://example.com/
```



### 为什么？

Before we started giving dumb names to vulnerabilities, we used to give dumb names to hacking techniques. “Clickjacking” is one of those dumb names.

The idea goes like this: you create an invisible iframe, place it in focus and route user input into it. As an attacker, you can then trick people into playing a browser-based game while their clicks are being registered by a hidden iframe displaying twitter - forcing them to non-consensually retweet all of your tweets.

It sounds dumb, but it’s an effective attack.



### 我应该使用吗？

Yes. Your app is a beautiful snowflake. Do you really want some [genius](https://techcrunch.com/2015/04/08/annotate-this/) shoving it into an iframe so they can vandalize it?

### 如何使用？

`X-Frame-Options` has three modes, which are pretty self explanatory.

- `DENY` - No one can put this page in an iframe
- `SAMEORIGIN` - The page can only be displayed in an iframe by someone on the same origin.
- `ALLOW-FROM` - Specify a specific url that can put the page in an iframe

One thing to remember is that you can stack iframes as deep as you want, and in that case, the behavior of `SAMEORIGIN` and `ALLOW-FROM` isn’t [specified](https://tools.ietf.org/html/rfc7034#section-2.3.2.2). That is, if we have a triple-decker iframe sandwich and the innermost iframe has `SAMEORIGIN`, do we care about the origin of the iframe around it, or the topmost one on the page? ¯\_(ツ)_/¯.



|     平台     |                    用法                    |
| :--------: | :--------------------------------------: |
| Rails 4和5  | ` SAMEORIGIN`是默认设置的。设置` DENY`：` config.action_dispatch.default_headers['X-Frame-Options'] = "DENY"` |
|   Django   | `MIDDLEWARE = [ ... 'django.middleware.clickjacking.XFrameOptionsMiddleware', ... ]`This defaults to `SAMORIGIN`。设置 `DENY`: `X_FRAME_OPTIONS = 'DENY'` |
| Express.js | 使用 [helmet](https://helmetjs.github.io/docs/hsts/) |
|     Go     | 使用 [unrolled/secure](https://github.com/unrolled/secure) |
|   Nginx    |   `add_header X-Frame-Options "deny";`   |
|   Apache   | `Header always set X-Frame-Options "deny"` |



### 我想了解更多

- [RFC 7034](https://tools.ietf.org/html/rfc7034)
- [X-Frame-Options - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Frame-Options)



## X-Content-Type-Options

```
X-Content-Type-Options: nosniff;
```

### 为什么？

The problem this header solves is called “MIME sniffing”, which is actually a browser “feature”.

In theory, every time your server responds to a request it is supposed to set a `Content-Type` header in order to tell the browser if it’s getting some HTML, a cat gif, or a Flash cartoon from 2008. Unfortunately, the web has always been broken and has never really followed a spec for anything; back in the day lots of people didn’t bother to set the content type header properly.

As a result, browser vendors decided they should be really helpful and try to infer the content type by inspecting the content itself while completely ignore the content type header. If it looks like a gif, display a gif!, even though the content type is `text/html`. Likewise, if it looks like we got some HTML, we should render it as such even if the server said it’s a gif.

This is great, except when you’re running a photo-sharing site, and users can upload photos that look like HTML with javascript included, and suddenly you have a stored XSS attack on your hand.

The `X-Content-Type-Options` headers exist to tell the browser to shut up and set the damn content type to what I tell you, thank you.

### 我应该使用吗？

Yes, just make sure to set your content types correctly.

### 如何使用？

| 平台            | 用法                                       |
| ------------- | ---------------------------------------- |
| Rails 4 and 5 | 默认启用                                     |
| Django        | `SECURE_CONTENT_TYPE_NOSNIFF = True`     |
| Express.js    | 使用 [helmet](https://helmetjs.github.io/docs/dont-sniff-mimetype/) |
| Go            | 使用 [unrolled/secure](https://github.com/unrolled/secure) |
| Nginx         | `add_header X-Content-Type-Options nosniff;` |
| Apache        | `Header always set X-Content-Type-Options nosniff` |

### 我想了解更多

- [X-Content-Type-Options - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)

## Referrer-Policy

```
Referrer-Policy: "no-referrer" 
Referrer-Policy: "no-referrer-when-downgrade" 
Referrer-Policy: "origin" 
Referrer-Policy: "origin-when-cross-origin"
Referrer-Policy: "same-origin" 
Referrer-Policy: "strict-origin" 
Referrer-Policy: "strict-origin-when-cross-origin" 
Referrer-Policy: "unsafe-url"
```

### 为什么？

Ah, the `Referer` header. Great for analytics, bad for your users’ privacy. At some point the web got woke and decided that maybe it wasn’t a good idea to send it all the time. And while we’re at it, let’s spell “Referrer” correctly[4](https://blog.appcanary.com/2017/http-security-headers.html#fn4).

The `Referrer-Policy` header allows you to specify when the browser will set a `Referer`header.

### 我应该使用吗？

t’s up to you, but it’s probably a good idea. If you don’t care about your users’ privacy, think of it as a way to keep your sweet sweet analytics to yourself and out of your competitors’ grubby hands.

Set `Referrer-Policy: "no-referrer"`

### 如何使用？

| 平台            | 用法                                       |
| ------------- | ---------------------------------------- |
| Rails 4 and 5 | 使用 [secureheaders](https://github.com/twitter/secureheaders) |
| Django        | 编写自定义中间件                                 |
| Express.js    | 使用 [helmet](https://helmetjs.github.io/docs/referrer-policy/) |
| Go            | 编写自定义中间件                                 |
| Nginx         | `add_header Referrer-Policy "no-referrer";` |
| Apache        | `Header always set Referrer-Policy "no-referrer"` |

### 我想了解更多

- [Referrer Policy - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)



## Cookie Options

```
Set-Cookie: <key>=<value>; Expires=<expiryDate>; Secure; HttpOnly; SameSite=strict
```



### 为什么？

This isn’t a security header per se, but there are three different options for cookies that you should be aware of.

- Cookies marked as `Secure` will only be served over HTTPS. This prevents someone from reading the cookies in a MiTM attack where they can force the browser to visit a given page.
- `HttpOnly` is a misnomer, and has nothing to do with HTTPS (unlike `Secure` above). Cookies marked as `HttpOnly` can not be accessed from within javascript. So if there is an XSS flaw, the attacker can’t immediately steal the cookies.
- `SameSite` helps defend against Cross-Origin Request Forgery (CSRF) attacks. This is an attack where a different website the user may be visiting inadvertently tricks them into making a request against your site, i.e. by including an image to make a GET request, or using javascript to submit a form for a POST request. Generally, people defend against this using [CSRF tokens](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet). A cookie marked as `SameSite` won’t be sent to a different site.

It has two modes, lax and strict. Lax mode allows the cookie to be sent in a top-level context for GET requests (i.e. if you clicked a link). Strict doesn’t send any third-party cookies.

### 我应该使用吗？

You should absolutely set `Secure` and `HttpOnly`. Unfortunately, as of writing, SameSite cookies are [available](http://caniuse.com/#search=samesite) only in Chrome and Opera, so you may want to ignore them for now.

### 如何使用？

| 平台            | 用法                                       |
| ------------- | ---------------------------------------- |
| Rails 4 and 5 | Secure and HttpOnly 默认开启。对于SameSite使用 [secureheaders](https://github.com/twitter/secureheaders) |
| Django        | Session cookies are HttpOnly 默认开启。 设置安全： `SESSION_COOKIE_SECURE = True`。SameSite不确定。 |
| Express.js    | `cookie: { secure: true, httpOnly: true, sameSite: true }` |
| Go            | `http.Cookie{Name: "foo", Value: "bar", HttpOnly: true, Secure: true}` 对于SameSite, 看这个 [issue](https://github.com/golang/go/issues/15867). |
| Nginx         | 你可能不会在Nginx设置会话cookies                   |
| Apache        | 你可能不会在Apache设置会话cookies                  |

### 我想了解更多

- [Cookies - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)



