title: 使用Helium找出页面上无用的CSS样式
date: 2014-04-19 00:28:02
tags: css
categories: technology
---

我最无法忍受的一个事情就是多余的代码。不论是页面中的CSS还是JavaScript，还是浮肿的HTML代码或没有优化的图片，这是我们的懒惰和错误让成千上万的访问用户受连累。有一个非常棒的工具，叫做[Helium](https://github.com/geuis/helium-css)，它能帮助程序员找出样式表中无用的或有问题的样式规则。让我们来看看是如何使用它!

<!-- more -->

第一步是把这个脚本嵌入到你的页面中，在脚本加载后初始化它：

```html
<script type="text/javascript" src="path/to/helium.js"></script>

<script type="text/javascript">
    window.addEventListener('load', function(){
		helium.init();
	}, false);
</script>
```

当这个页面加载完成后，你就能看到一个文本框，在这个文本框里输入你要测试的页面的url。这些页面会被抓取，分析，并生成一份报告，里面详细的列出无用的样式规则、有问题的样式选择器、以及需要手工测试的伪元素选择器。详细请看[官方文档](https://github.com/geuis/helium-css)。

Helium是一个出色的帮你找到无用CSS样式的好工具。程序员可以根据Helium提供的信息，删除无用的CSS样式。十分适合程序员快速的对他们的CSS代码进行优化。事实上，我还没发现有比这个更简单更实用的工具。你也试试吧！