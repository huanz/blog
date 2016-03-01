title: webapp开发经验总结
date: 2014-07-06 14:05:15
tags: webapp
categories: technology

---

webapp开发的大趋势之下，本人收集整理了一写关于webapp开发的经验，欢迎大家补充指正。

<!-- more -->

## 关于link ##

```html
<link rel="apple-touch-startup-image" href="images/start.jpg"/>
```

表示在点击主屏幕中生成的快捷图标后，网站在加载过程中，显示的图片。这个功能用户体验很好。避免加载时的白屏，减少用户等待网站加载过程的烦闷。缺陷是目前只支持竖屏浏览模式，横屏浏览时不支持。

```html
<link rel="apple-touch-icon" href="images/iphone.png" />
<link rel="apple-touch-icon" sizes="72x72" href="images/ipad.png" />
<link rel="apple-touch-icon" sizes="114x114" href="images/iphone4.png" />
```

这三项是针对不同版本自定义的不同的主屏幕图标。当然不定义也可以，点击主屏幕时，会以当前屏幕截图作为图标的。而其中`apple-touch-icon`表示的该图标是自动加高光的图标按钮。与之相对应的是`apple-touch-icon-precomposed`。按原设计不加高光效果的图标。可根据实际项目情况，选择使用。

也可以通过media来控制加载不同的画面：

```html
// iPhone
<link href="apple-touch-startup-image-320x460.png" media="(device-width: 320px)" rel="apple-touch-startup-image" />

// iPhone Retina
<link href="apple-touch-startup-image-640x920.png" media="(device-width: 320px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />

// iPhone 5
<link rel="apple-touch-startup-image" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" href="apple-touch-startup-image-640x1096.png">

// iPad portrait
<link href="apple-touch-startup-image-768x1004.png" media="(device-width: 768px) and (orientation: portrait)" rel="apple-touch-startup-image" />

// iPad landscape
<link href="apple-touch-startup-image-748x1024.png" media="(device-width: 768px) and (orientation: landscape)" rel="apple-touch-startup-image" />

// iPad Retina portrait
<link href="apple-touch-startup-image-1536x2008.png" media="(device-width: 1536px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />

// iPad Retina landscape
<link href="apple-touch-startup-image-1496x2048.png"media="(device-width: 1536px)  and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)"rel="apple-touch-startup-image" />
```

## 关于媒体查询 ##

```html
<link rel="stylesheet" media="screen and (orientation:portrait) and (min-width:960px)" href="style.css" />
```

常用设备类型：

- all：所有设备 
- screen：电脑显示器
- handheld：便携设备
- print：打印用纸或者打印预览图
- projection：各种摄影设备
- tv：电视类型的设备

常用设备特性：

- width：视口宽度
- height：视口高度
- device-width：设备屏幕的宽度
- device-height：设备屏幕的高度
- orientation：检测屏幕处于横屏还是竖屏，portrait|landscape
- aspect-ratio：基于视口的宽高比例
- device-aspect-ratio：基于设备屏幕的宽高比
- color：颜色的位数，如min-color：32 匹配设备是否有32位或以上的颜色
- color-index：设备的颜色索引表中的颜色数
- monochrome：检测单色振缓冲区中每像素使用的位数。为非负数，如monochrome：3
- resolution：检测屏幕或打印机的分辨率，如min-resolution：300dpi(dpi后面会介绍)，也可以是每厘米像素点的度量值，如min-resolution：120dpcm
- scan：扫描方式，值为progressive（逐行扫描）、interlace（隔行扫描）
- grid：检测输出设备是网格设备还是位图设备

创建媒体查询时，上述特性（scan和grid不行）都可以加上min和max前缀创建媒体查询的范围。

dpi，所表示的是每英寸所拥有的像素（pixel）数目，数值越高，即代表显示屏能够以越高的密度显示图像。当达到人眼的极限分辨率时，乔帮主给它取了一个很高端的名字——Retina。从iphone4时代开始就已经是Retina屏了。安卓手机的屏幕尺寸和密度分别为：小、中、大、超大；ldpi（低）、mdpi（中）、hdpi（高）、xhdpi（超高）。目前安卓手机高分屏和超分屏已经是主流了。按照屏幕分辨率的划分：

```css
/*中分辨率屏幕*/
@media (-webkit-min-device-pixl-ratio: 1){
	//css代码
}

/*高分辨率屏幕*/
@media (-webkit-min-device-pixl-ratio: 1.5){
	//css代码
}

/*超高分辨率屏幕（传说中的Retina屏）*/
@media (-webkit-min-device-pixl-ratio: 2){
	//css代码
}
```

当然我们还可以用到之前提供的几个特性，如下：

```css
@media screen and (max-width: 768){
	//css代码
}
```

## 关于meta ##

```html
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui" />
```

上面代码表示宽度为设备的宽度，默认不缩放，不允许用户缩放（即禁止缩放），在网页加载时隐藏地址栏与导航栏（ios7.1新增）。

```
width – // [pixel_value | device-height] viewport 的宽度，范围从 200 到 10,000，默认为 980 像素
height – // [pixel_value | device-width ] viewport 的高度，范围从 223 到 10,000 
initial-scale – // float_value，初始的缩放比例 （范围从 > 0 到 10）
minimum-scale – // float_value，允许用户缩放到的最小比例
maximum-scale – // float_value，允许用户缩放到的最大比例
user-scalable – // [yes | no] 用户是否可以手动缩放
target-densitydpi = [dpi_value | device-dpi | high-dpi | medium-dpi | low-dpi] 目标屏幕像素密度
```

*apple-mobile-web-app-capable*

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
```

是否启动webapp功能，会删除默认的苹果工具栏和菜单栏。

*apple-mobile-web-app-status-bar-style*
	
```html
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
```

当启动webapp功能时，显示手机信号、时间、电池的顶部导航栏的颜色。默认值为default（白色），可以定为black（黑色）和black-translucent（灰色半透明）。这个主要是根据实际的页面设计的主体色为搭配来进行设置。

*telephone & email*

```html
<meta name="format-detection" content="telphone=no, email=no" />
```

忽略电话号码识别和邮箱识别。

*其他meta*

```html
<!-- 启用360浏览器的极速模式(webkit) -->
<meta name="renderer" content="webkit">
<!-- 避免IE使用兼容模式 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
<meta name="HandheldFriendly" content="true">
<!-- 微软的老式浏览器 -->
<meta name="MobileOptimized" content="320">
<!-- uc强制竖屏 -->
<meta name="screen-orientation" content="portrait">
<!-- QQ强制竖屏 -->
<meta name="x5-orientation" content="portrait">
<!-- UC强制全屏 -->
<meta name="full-screen" content="yes">
<!-- QQ强制全屏 -->
<meta name="x5-fullscreen" content="true">
<!-- UC应用模式 -->
<meta name="browsermode" content="application">
<!-- QQ应用模式 -->
<meta name="x5-page-mode" content="app">
<!--这meta的作用就是删除默认的苹果工具栏和菜单栏-->
<meta name="apple-mobile-web-app-capable" content="yes">
<!--网站开启对web app程序的支持-->
<meta name="apple-touch-fullscreen" content="yes">
<!--手机号码不被显示为拨号链接-->
<meta name="format-detection" content="telephone=no">
<!--在web app应用下状态条（屏幕顶部条）的颜色-->
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<!-- windows phone 点击无高光 -->
<meta name="msapplication-tap-highlight" content="no">
<!--移动web页面是否自动探测电话号码-->
<meta http-equiv="x-rim-auto-match" content="none">
```

## 一些技巧 ##

- `-webkit-tap-highlight-color:rgba(255,255,255,0)`可以同时屏蔽ios和android下点击元素时出现的阴影。备注：transparent的属性值在android下无效。
- `-webkit-appearance:none`可以同时屏蔽输入框怪异的内阴影。
- `-webkit-transform:translate3d(0, 0, 0)`在ios下可以让动画更加流畅（这个属性会调用硬件加速模式），但是在android下不可乱用，很多见所未见的bug就是因为这个。
- `-webkit-background-size`可以做高清图标，不过一些低版本的android只能识别background-size，所以有必要两个都要写上；用这个属性的时候推荐用cover这个值，可以自动去匹配宽和高。
- `text-shadow`多用这个属性，可以美化文字效果。
- android、ios4及以下，固定宽/高块级元素的`overflow:scroll/auto`失效，属于浏览器的bug，可借助第三方工具实现。
- ios5+可以通过`scrollTo(0,0)`来自动隐藏浏览器地址栏。
- css3动画会影响你的自动聚焦，所以自动聚焦要在动画执行之前来做，或者直接舍弃。
- 当用iScroll时候，不能使用:focus{outline:0}伪类，否则滑动会卡。
- webkit在渲染页面时，会自动调整字体大小,比如横竖屏切换时。`-webkit-text-size-adjust:none`，但是如果设置为none,那么会导致页面的缩放功能不能用，最好办法是：`-webkit-text-size-adjust:100%`。
- 禁止用户选择页面文字：`-webkit-user-select: none`。
- 禁用链接弹出窗口：`-webkit-touch-callout:none`。

关于transition闪屏的解决方案：
	
```css
-webkit-transform-style: preserve-3d;
/*设置内嵌的元素在 3D 空间如何呈现：保留 3D*/
-webkit-backface-visibility:hidden;
/*（设置进行转换的元素的背面在面对用户时是否可见：隐藏）*/
```



