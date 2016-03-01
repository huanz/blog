title: CSS居中
date: 2015/3/8 20:51:56  
tags: css
categories: technology
---

对于已知宽高的元素，无论垂直、水平居中相对来说都是比较容易的，因此主要是谈谈对于未知宽高的元素的水平垂直居中问题。

<!-- more -->

![](http://blog.u.qiniudn.com/uploads/center.jpg)

## transform ##

利用css3的transform实现对于未知宽高的元素的水平/垂直居中是很容易的

```css
// 水平/垂直居中
// css
html,body,.container{
	width: 100%;
	height: 100%;
}
.container{
	position: relative;
	background: #aaa;
}
.center{
	position: absolute;
	left: 50%;
	top: 50%;
	-webkit-transform: translate3d(-50%, -50%, 0);
	-moz-transform: translate3d(-50%, -50%, 0);
	-ms-transform: translate3d(-50%, -50%, 0);
	transform: translate3d(-50%, -50%, 0);
	background: #000;
	color: #fff;
}
```

```html
// html
<body>
	<div class="container">
		<div class="center">我居中<br/>我居中<br/>我居中<br/>我居中</div>
	</div>
</body>
```

## flexbox ##

```css
// css
html,body,.container{
	width: 100%;
	height: 100%;
}
.container{
	display: -webkit-box;   /* OLD: Safari,  iOS, Android browser, older WebKit browsers.  */
   	display: -moz-box;      /* OLD: Firefox (buggy) */
   	display: -ms-flexbox;   /* MID: IE 10 */
   	display: -webkit-flex;  /* NEW, Chrome 21–28, Safari 6.1+ */
   	display: flex;          /* NEW: IE11, Chrome 29+, Opera 12.1+, Firefox 22+ */

   	-webkit-box-align: center;
   	-moz-box-align: center; /* OLD… */
   	-ms-flex-align: center; /* You know the drill now… */
   	-webkit-align-items: center;
   	align-items: center;

   	-webkit-box-pack: center; -moz-box-pack: center;
   	-ms-flex-pack: center;
   	-webkit-justify-content: center;
   	justify-content: center;
}
.center{
	display: -webkit-box;
	display: -moz-box;
   	display: -ms-flexbox;
   	display: -webkit-flex;
   	display: flex;

   	-webkit-box-align: center;
   	-moz-box-align: center;
   	-ms-flex-align: center;
   	-webkit-align-items: center;
   	align-items: center;
}
```

```html
// html
<div class="container">
	<div class="center">我居中<br/>我居中<br/>我居中<br/>我居中</div>
</div>
```

想要查看flexbox的兼容性，请去这里：[Flexible Box Layout Module](http://caniuse.com/flexbox)

## table ##

```css
// css
html,body,.center{
	width: 100%;
	height: 100%;
}
.center td{
	vertical-align: middle;
	text-align: center;
}
```

```html
// html
<table class="center">
	<tbody><tr>
		<td>我居中<br/>我居中<br/>我居中<br/>我居中</td>
	</tr></tbody>
</table>
```

## table-cell ##

既然table能实现，自然也就会想到将`display`设置为`table`来实现。当然，该方案是有局限性的，因为IE8以下的浏览器不支持display的table系value，所以你只能在IE8及以上浏览器以及非IE浏览器下才能看到效果。

```css
// CSS
html,body,.container{
	width: 100%;
	height: 100%;
}
.container{
	display: table;
	text-align: center;
}
.center{
	display: table-cell;
	vertical-align: middle;
}
```

```html
// html
<div class="container">
	<div class="center">我居中<br/>我居中<br/>我居中<br/>我居中</div>
</div>
```

## inline-block ##

```css
// css
html,body,.container{
	width: 100%;
	height: 100%;
}
.container{
	text-align: center;
	font-size: 0;
}
.container:after,.container span{
	display:inline-block;
	*display:inline;
	*zoom:1;
	width:0;
	height:100%;
	vertical-align:middle;
}
.container:after{
	content:"";
}
.center{
	display:inline-block;
	*display:inline;
	*zoom:1;
	vertical-align:middle;
	font-size:16px;
}
```

```html
// html
<div class="container">
	<div class="center">我居中<br/>我居中<br/>我居中<br/>我居中</div>
	<!--[if lt IE 8]><span></span><![endif]-->
</div>
```

因为使用`inline-block`会有间隙，所以这里设置父级`font-size：0`来消除间隙。由于ie8以下浏览器不支持伪对象`::after`，于是我们通过IE条件注释为IE8以下浏览器新增一个额外元素`span`，其作用等同`inline-block`中的`::after`。

