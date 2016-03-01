title: 微信WebView下载应用解决方案
date: 2015-06-17 21:44:23
tags: javascript
categories: technology
---

众所周知，微信会屏蔽掉直接的app下载链接，那么有没有办法可以让用户能够在微信里面点一个链接或者识别二维码下载应用呢？答案是肯定的。

<!-- more -->

## 原始方案

其实之前发现可以通过腾讯的应用宝让用户能够在微信`webview`里面下载应用，具体的做法就是：

1. 将你的应用上传到应用宝：[应用宝微下载](http://wiki.open.qq.com/index.php?title=mobile/%E5%BA%94%E7%94%A8%E5%AE%9D%E5%BE%AE%E4%B8%8B%E8%BD%BD)
2. 在手机端打开应用宝，找到你的应用，然后点击右上角的分享就可以看到地址了，如：
	
	![image](http://blog.u.qiniudn.com/uploads/weix-app-down.png)
	
	
上面复制出来的链接就可以作为下载链接，不过只能是安卓，如果ios话直接AppStore的链接了，因此还要作客户端类型的判断来使用不同的url。

而且上面这种方案还有一个问题就是要多一步，不能直接进行下载操作。

## 进一步方案

打开应用宝的官网，发现其官网也有应用的下载链接，既然是腾讯的东西，肯定不会屏蔽下载链接的，果然如此，程序员就是程序员，打开右键查看源代码`ctrl+f`搜索`appId`，果然搜索到了下载链接：

![image](http://blog.u.qiniudn.com/uploads/weixin-down-st.png)

于是可以直接点击下载了，省去了一步，但是任然没有解决`ios`和`andriod`需要分别处理的问题。

## 终极方案

如果你有尝试通过PC端浏览器打开**原始方案**里面的链接的话，它会跳转到QQ空间的应用中心里面，其中有一个二维码，解析其内容或者用非微信QQ的二维码扫描工具扫描：

![image](http://blog.u.qiniudn.com/uploads/weinxin-down-all.png)

解析出来的url是这样的：
	
```
http://fusion.qq.com/app_download?appid=100723839&platform=qzone&via=QZ.MOBILEDETAIL.QRCODE&u=123456
```
	
通过这个url就可以直接下载应用了，它会自动判断是安卓还是ios分别跳转到不同的下载链接，当然前提是你需要在腾讯应用中心里面填写IOS的信息。




