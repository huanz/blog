title: sublime text插件推荐
date: 2014-01-22 21:59:03
tags: [sublime,代码编辑器]
categories: technology
---
俗话说：磨刀不误砍柴工，作为程序员，代码编辑器就是我们的斧头，在写代码之前，配置好一个顺手的编辑器就是很重要的了。Sublime Text 是一把好斧头，而它丰富的插件就是磨刀石了。

本文将为你介绍最受欢迎的Sublime Text 插件，大部分插件来自于 Package Control 上的热门榜单。由于 Sublime Text 2 不再更新，Sublime Text 3 也已经稳定，所以替换了几个不支持 Sublime Text 3 的插件。

<!-- more -->

**插件安装**

安装插件的方法有两种，这里只说一种比较方便快捷的方法。

首先安装插件管理区，我们接下来就通过这个插件管理器很方便的安装和我管理插件。

打开控制台（菜单 `View -> Show Console` 或快捷键 `ctrl+`），将下列代码粘贴进去然后`enter`即可。

**sublime text 3:**

```python
import urllib.request,os,hashlib; h = '2915d1851351e5ee549c20394736b442' + '8bc59f460fa1548d1514676163dafc88'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

**sublime text 2:**

```python
import urllib2,os,hashlib; h = '2915d1851351e5ee549c20394736b442' + '8bc59f460fa1548d1514676163dafc88'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler()) ); by = urllib2.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); open( os.path.join( ipp, pf), 'wb' ).write(by) if dh == h else None; print('Error validating download (got %s instead of %s), please try manual install' % (dh, h) if dh != h else 'Please restart Sublime Text to finish installation')
```

安装完成后重新打开sublime在菜单的`Preferences`下会发现`Package Control`和`Package Settings`两个选项

----------

1. **[Emmet](https://sublime.wbond.net/packages/Emmet)**
    
    Emmet 是一个前端开发的利器，其前身是 Zen Coding。它让编写 HTML 代码变得简单。Emmet 的基本用法是：输入简写形式，然后按 `Tab` 键。

    比如，输入 `html:5`，然后按 `Tab` 键，就会产生如下的代码：
    
    ```html
	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>Document</title>
		</head>
		<body>
		</body>
	</html>
    ```

	更复杂的比如 `ul#nav>li.item$*4>a{Item $}`：
    
    ```html
	<ul id="nav">
		<li class="item1"><a href="">Item 1</a></li>
		<li class="item2"><a href="">Item 2</a></li>
		<li class="item3"><a href="">Item 3</a></li>
		<li class="item4"><a href="">Item 4</a></li>
	</ul>
	```
	
	关于 Emmet 的更多用法，请看[官方文档](http://docs.emmet.io/)，这份[速查表](http://docs.emmet.io/cheat-sheet/)可以帮你快速记忆简写形式。
2. **[SideBarEnhancements](https://sublime.wbond.net/packages/SideBarEnhancements)**

	SideBarEnhancements 是一款很实用的右键菜单增强插件，有以 diff 形式显示未保存的修改、在文件管理器中显示该文件、复制文件路径、在侧边栏中定位该文件等功能，也有基础的诸如新建文件/目录，编辑，打开/运行，显示，在选择中/上级目录/项目中查找，剪切，复制，粘贴，重命名，删除，刷新等常见功能。

	SideBarEnhancements 还有一个功能就是自定义打开文件的程序，在侧边栏中右键点击一个文件（夹），选择 `Open With -> Edit Applications` 就可以修改关联了，配置文件自带示例，可以很方便地套用。
3. **[Alignment](https://sublime.wbond.net/packages/Alignment)**

	Alignment 是一个代码格式化插件，它可以使多行代码中的等号对齐，也可以调整多行代码为一个缩进级别，默认快捷键是 `ctrl+alt+a`（Mac OS 上是 `cmd+ctrl+a`）。	
4. **[Bracket​Highlighter](https://sublime.wbond.net/packages/BracketHighlighter)**

	Bracket​Highlighter 是一个括号、引号、标签高亮插件，支持 `[]`、`()`、`{}`、`""`、`''` 和 `<tag></tag>` 等，比 Sublime Text 自带的高亮要明显得多。
5. **[SublimeLinter](https://sublime.wbond.net/packages/SublimeLinter)**

	SublimeLinter 是一个代码校验插件，它可以帮你找出错误或编写不规范的代码，支持 C/C++、CoffeeScript、CSS、Git Commit Messages、Haml、HTML、Java、JavaScript、Lua、Objective-J、Perl、PHP、Puppet、Python、Ruby 和 XML 语言。

	在使用 SublimeLinter 之前，你要安装相应的程序，详见[README](https://github.com/SublimeLinter/SublimeLinter/blob/sublime-text-3/README.md)。如果要校验 JavaScript 或 CSS，你还要安装 [Node.js](http://nodejs.org/)。

	SublimeLinter 默认以 background 模式运行，在用户输入的同时即时校验，如果你想要 Sublime Text 运行得更流畅，可以改为 load-save 模式或 save-only 模式，在读取和保存是校验或只在保存时校验。

	打开 SublimeLinter 的配置文件：菜单 `Preferences -> Package Settings -> SublimeLinter -> Settings - User`，加入 `"sublimelinter": "load-save"` 或 `"sublimelinter": "save-only"`
6. **[DocBlockr](https://sublime.wbond.net/packages/DocBlockr)**

	DocBlockr这个插件可以很好的生成js ,php 等语言函数注释,只需要在函数上面输入/** ,然后按tab 就会自动生成注释
7. **[SublimeCodeIntel](https://sublime.wbond.net/packages/SublimeCodeIntel)**

	Sublime​Code​Intel 是一个代码提示、补全插件，支持 JavaScript、Mason、XBL、XUL、RHTML、SCSS、Python、HTML、Ruby、Python3、XML、Sass、XSLT、Django、HTML5、Perl、CSS、Twig、Less、Smarty、Node.js、Tcl、TemplateToolkit 和 PHP 等语言，是 Sublime Text 自带代码提示功能的很好扩展。它还有一个功能就是跳转到变量、函数定义的地方，十分方便。

	使用 Sublime​Code​Intel 之前你需要安装相应程序并把路径写入 `~/.codeintel/config` 或 `project_root/.codeintel/config` 中，ReadMe 中有详细的 [说明](https://github.com/SublimeCodeIntel/SublimeCodeIntel/blob/development/README.rst#configuring)，不再赘述。

	十分不建议把 Sublime​Code​Intel 与其他单个语言的扩展 package 一同使用，虽然很多语言扩展 package 比 Sublime​Code​Intel 的代码提示功能要完善。如果需要一同使用，请在用户配置文件（菜单 `Preferences -> Package Settings -> Sublime​Code​Intel -> Settings - User` 中加入下面的内容，并去掉要禁用的语言。

	```json
	"codeintel_enabled_languages":
	[
		"JavaScript", "Mason", "XBL", "XUL", "RHTML", "SCSS", "Python", "HTML",
		"Ruby", "Python3", "XML", "Sass", "XSLT", "Django", "HTML5", "Perl", "CSS",
		"Twig", "Less", "Smarty", "Node.js", "Tcl", "TemplateToolkit", "PHP"
	],
	"codeintel_live_enabled_languages":
	[
		"JavaScript", "Mason", "XBL", "XUL", "RHTML", "SCSS", "Python", "HTML",
		"Ruby", "Python3", "XML", "Sass", "XSLT", "Django", "HTML5", "Perl", "CSS",
		"Twig", "Less", "Smarty", "Node.js", "Tcl", "TemplateToolkit", "PHP"
	]
	```

8. **[Theme – Soda](https://sublime.wbond.net/packages/Theme%20-%20Soda)**

	Soda Theme 是最受欢迎的 Sublime Text 主题。

	安装后你还需要在你的配置文件（菜单 `Preferences -> Settings - User`）中加入 `"theme": "Soda Light.sublime-theme"` 或 `"theme": "Soda Dark.sublime-theme"`。要达到图中的效果，你还需要下载与之搭配的 color scheme。
	
	如果你喜欢 Soda Dark 和 Monokai，我建议你使用 [Monokai Extended](https://sublime.wbond.net/packages/Monokai%20Extended)。这个 color scheme 是 Monokai Soda 的增强，如果再配合 [Markdown Extended](https://sublime.wbond.net/packages/Markdown%20Extended)，将大大改善 Markdown 的语法高亮。
9. **[Git](https://github.com/kemayo/sublime-text-2-git)**

	Git 插件集成了 git 的常用功能，使用之前需要安装 git 并写入环境变量中。
10. **[ConvertToUTF8](https://sublime.wbond.net/packages/ConvertToUTF8)**

	将其他编码转换成UTF8编码，解决windows下很多文件乱码问题

**还有其他一些插件，像sass、less、sftp、JsFormat等可以根据需要自己安装**