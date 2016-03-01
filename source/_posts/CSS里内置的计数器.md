title: CSS里内置的计数器
date: 2014-04-19 00:33:16
tags: css
categories: technology
---

计数器(counter)，“老一辈”程序员估计对这个东西印象深刻，早期的网站页面上经常会有这个东西，如今这种特征都变成了笑话。CSS里自己实现了一种计数器，很简单，很直接。使用CSS计数器，你可以实现简单的纯CSS的计数功能，并能将其显示到页面上。下面我们简单的看一下CSS计数器是如何使用的！

<!-- more -->

## 初始化CSS计数器 ##

为了好理解，我们使用`<OL>` 和 `<LI>` 元素来做演示。首先我们要重置计数器，让它归零，并给它指定一个名称：

```css
ol.slides {
	counter-reset: slideNum;
}
```

这个计数器叫slideNum，下面的例子都都要使用它。

## CSS计数器的自增 ##

为了是计数器能够自增，我们需要使用counter-increment，并把计数器的名称跟到后面：

```css
ol.slides > li {
	counter-increment: slideNum;
}
```

这样，在CSS选择器下，每遇到一个符合条件`li`元素，counter-increment就会被调用一次，计数就是增加1。需要注意的是，这里的CSS选择器里使用了>符号，这样是为了滤掉有可能多重嵌套的li元素。否者你的计数值就会不是你想要的。

## 使用计数值 ##

如果只计数而无法显示，那这个计数器也没多大用处，所以就有了`counter()`命令来输出计数器里的值，可以用在content属性里：

```css
ol.slides li:after {
	content: "[" counter(slideNum) "]";
}
```

有趣的是，这个counter()命令还可以接受第二个参数，当作同时计算多个元素时数据的分隔符：

```css
<!-- 假设有这样的HTML: -->
<ol class="toc lazy ">
	<li>Intro</li>
	<li>Topic
		<ol>
			<li>Subtopic</li>
			<li>Subtopic</li>
			<li>Subtopic</li>
		</ol>
	</li>
	<li>Topic
		<ol>
			<li>Subtopic</li>
			<li>Subtopic</li>
			<li>Subtopic</li>
		</ol>
	</li>
	<li>Closing</li>		
</ol>

ol.toc, ol.toc ol {
	counter-reset: toc;
}
ol li {
	counter-increment: toc;
}
.toc li:before {
	content: "(Item " counters(toc, ".") ")";
}

<!-- 会输出下面的结果 -->

<ol class="toc lazy ">
	<li>(Item 1)Intro</li>
	<li>(Item 2)Topic
		<ol>
			<li>(Item 2.1)Subtopic</li>
			<li>(Item 2.2)Subtopic</li>
			<li>(Item 2.3)Subtopic</li>
		</ol>
	</li>
	<li>(Item 3)Topic
		<ol>
			<li>(Item 3.1)Subtopic</li>
			<li>(Item 3.2)Subtopic</li>
			<li>(Item 3.3)Subtopic</li>
		</ol>
	</li>
	<li>(Item 4)Closing</li>		
</ol>
```

你可以发现，当需要显示这种联级嵌套序号时，这种技术是非常的有用的。很像微软WORD里面文档的多重序号。

大多时候，CSS计数器都是配合`:after`和`:before`伪元素使用，我曾看到过有人在幻灯片、视频页面和文档里用过CSS计数器。相信你会找到其它可以使用它的地方。