title: 用css美化鼠标选中文字
date: 2014-04-18 23:16:52
tags: css
categories: technology
---

有时我们看到别人的网站上鼠标选中文字的样式和默认的样式不一样，有没有觉得很棒很酷？ok今天我就教大家轻易实现这种效果。

<!-- more -->

Windows自身提供的是一种很难看的墨绿色的颜色，而苹果电脑上提供的是浅绿色。火狐浏览器，IE9，Opera和谷歌浏览器允许我们自定义被选择文字的颜色。改变就在下一刻开始。

```css
/* webkit, opera, IE9 */
::selection { background:lightblue; }
/* mozilla firefox */
::-moz-selection { background:lightblue; }
```

-moz-属性前缀是个火狐浏览器用的，而基本的::selection选择器是给谷歌浏览器用的。跟其它CSS选择器的用法一样，你可以嵌套使用，在不同的地方显示不同的颜色：

```css/* webkit, opera, IE9 */
div.highlightBlue::selection { background:lightblue; }
/* mozilla firefox */
div.highlightBlue::-moz-selection { background:lightblue; }

/* webkit, opera, IE9 */
div.highlightPink::selection { background:pink; }
/* mozilla firefox */
div.highlightPink::-moz-selection { background:pink; }
```

到此完了，是不是so easy~~