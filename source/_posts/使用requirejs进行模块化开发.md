title: 使用requirejs进行模块化开发
date: 2014/9/26 20:53:02  
tags: javascript
categories: technology
---

在之前的项目中一直用的是seajs，感觉seajs是挺好用的，但是有个问题就是把现有的js框架打包成seajs模块略麻烦，官方文档里面也没有对这一块作详细的介绍，虽然有spm build，但还是觉得不太方便。因此便在新的项目中用了requirejs。

<!-- more -->

![requirejs](http://blog.u.qiniudn.com/uploads%2Frequirejs.png)

用requirejs其实还有另一个原因就是项目中用到了百度的图表库[echarts](http://echarts.baidu.com/ "echarts")，根据其官方文档的描述是不建议使用基于CMD规范的seajs来加载的，因为echarts是基于AMD模块化的，虽然网上有人改了可以用seajs加载，但是我最后还是选择用requirejs来加载，同时也是想尝试一下requirejs。

**自定义构建echarts**

`echarts`的构建是用的`r.js`，因此我在这里先讲一下。

自定义构建`echarts`还必须下载`zrender`，下载完成之后，把`echarts`的目录和`zrender`目录放在同级目录下，然后进入`echarts`的`build`目录进行自定义`build`（需要node.js环境），下面是我的build命令：

```bash
node build.js optimize=true exclude=force,scatter,k,radar,chord,gauge,funnel,map  output=echarts1.js
```

上面命令的意思是排除`exclude`的之后的那些模块，因为我只用到了`echarts`的折线图、柱状图和饼状图。

执行完成之后就可以在build目录看到刚才合并的`echarts1.js`

**requirejs模块加载配置**

`requirejs`引入主模块的方法是通过在script标签里面添加`data-main`属性，如我的引入代码：

```html
<script data-main="js/main" src="js/lib/requirejs/require.js"></script>
```

`main.js`是程序的入口js文件，然后我们在`main.js`里面进行模块的加载配置：

```javascript
	requirejs.config({
		//开发专用，阻止浏览器缓存
		urlArgs: "v=" + Date.now(),
		//js文件的目录，相对于引入main.js的那个文件的目录
		baseUrl: 'js',
		//对于默认不兼容AMD规范的模块通过shim来配置
		//deps数组，表明该模块的依赖性，
		//exports值，表明这个模块外部调用时的名称
		//下面代码里面包含了如何加载库和插件
		shim: {
        	'backbone': {
           	 	deps: ['underscore', 'jquery'],
            	exports: 'Backbone'
        	},
        	'underscore': {
            	exports: '_'
        	},
        	'backbone.localStorage': {
      			deps: ['backbone'],
      			exports: 'Backbone'
    		},
			'bootstrap.modal': {
            	deps: ['jquery'],
            	exports: 'jQuery.fn.modal'
        	}
		},
		//模块的加载路径（不要加.js后缀，因为默认就是加载js，加了会报错）
		//路径是相对于上面的baseUrl
		paths: {
			jquery: 'lib/jquery/jquery-1.11.1.min',
			underscore: 'lib/underscore/underscore-min',
			...
			text: 'lib/requirejs/plugins/text',
			echarts:'lib/echarts/echarts',
        	'echarts/chart/bar' : 'lib/echarts/echarts',
			config: 'modules/common/config'
		}	
	});

	//下面开始加载执行
	require(['backbone', 'modules/app'], function (Backbone, AppRouter) {
		new AppRouter();
    	Backbone.history.start();
	});
```


**requirejs模块定义与加载**

`requirejs`定义一个模块相当简单，下面是一个简单的例子:

```javascript
    define(['backbone'], function(Backbone){
		var AppRouter = Backbone.Router.extend({
			...
		});

		//导出对象
		return AppRouter;
	});
```

我们也可以动态加载模块：

```javascript
	define(['backbone'], function(Backbone){
		var AppRouter = Backbone.Router.extend({
			...
			index： function(){
				require(['echarts', 'echarts/chart/bar'], function(ec){
					...
				});
			}
		});

		//导出对象
		return AppRouter;
	});
```

如果你已经用习惯了`seajs`的模块加载方法的话，你也可以像`seajs`里面那样去加载模块：

```javascript
    define(function (require) {
    	var $ = require('jquery');

    	return function () {
    	    ...
    	};
	});
```

或者`CommonJS`的方式也ok:
	
```javascript
	define(function(require, exports, module) {
		...
	});
```

`requirejs`提供一个加载文本的插件`text.js`，细心的话你可能已经看到我在`requirejs.config`里面已经配置了，使用也很简单：

```javascript
    // 注意这里自定义模块的加载路径
	// 可以写相对路径，那就是相对于当前js文件的路径
	// 也可以写绝对路径，就是相对于baseUrl的路径
	define(['backbone','text!../tmpl/index.html'], function(Backbone, html){
		
	});
```

**requirejs构建工具r.js**

当项目上线的时候，我们可能需要对模块代码进行压缩合并的操作，这时我们就会用到`requirejs`的构建工具`r.js`。首先我们在项目根目录创建一个`build`的文件夹和`dist`的文件夹，分别用来存放模块合并相关配置和合并后的代码的文件目录，在`build`目录里面存放`r.js`，并新建一个压缩合并的配置文件`config.js`,下面是`config.js`的配置示例：

```javascript
	//config.js
	{
		//requirejs.cofig文件的路径,它会自动读取main.js里面的配置信息
    	mainConfigFile : "../js/main.js",
    	baseUrl: '../js',
    	name: "main",
		//输出文件的路径和名称
    	out: "../dist/js/main.js",
		//默认情况写r.js会把相关的依赖文件拷贝到输出目录里面去
		//设置为true之后r.js就不会进行这一操作
    	removeCombined: true,
		//findNestedDependencies设置为true表示将所有相关的依赖模块也合并进来，默认为false只会对main.js进行压缩合并的操作
    	findNestedDependencies: true
	}
```javascript

然后在命令行执行：

```bash
	node r.js -o config.js
```

执行完成之后便会在`dist/js/`目录下面生成一个合并后的`main.js`

你会发现这个`main.js`可能会非常大，而在实际项目中，像通用的一些jquery、backbone等有时候我们可能没有必要把它压缩进来，我们只需要压缩自己写的一些代码，于是我们再次开始配置我们的`config.js`：

```javascript
	{
    	mainConfigFile : "../js/main.js",
    	baseUrl: "../js",
    	removeCombined: true,
    	findNestedDependencies: true,
    	dir: "../dist/js",
    	modules: [{
			name: "main",
            exclude: [
                "backbone",
				"underscore",
                "jquery",
                "text",
				...
            ]
        }]
	}
```

再次运行压缩合并命令将会发现在`exclude`数组里面的项不会被合并。

然而我觉得更好的做法是把通用的一些库，如jquery,bacnbone等合并到一个文件里面，我们自己的代码合并到了一个文件，因此，我们重新进行配置。

首先我们新建一个js文件，这个js文件啥也不用做，就是为了引用所有通用的库，这样方便我们进行排除，如下：

```javascript
	//libs.js
	
	define([
		"jquery",
		"underscore",
    	"backbone",
    	...
    	"text"
	], function() {});
```

然后我们的`config.js`变成了这样：

```javascript
	{
    	mainConfigFile : "../js/main.js",
    	baseUrl: "../js",
    	removeCombined: true,
    	findNestedDependencies: true,
    	dir: "../dist/js",
    	modules: [
        	{
           	 name: "main",
            	exclude: [
                	"libs"
            	]
        	},
       		{
           		name: "libs"
       	 	}
    	]
	}
```

现在，我们的`build`操作终于完美了。

但是，如果我们的js直接通过cdn引用的呢？如果我们直接运行上面的压缩配置，`r.js`将会报错。因此，对于从cdn引入的js，我们作如下配置：

```javascript
	requirejs.config({
		paths: {
			//如果cdn挂点，通过本地加载jquery
        	jquery: ['http://cdn.staticfile.org/jquery/1.11.1/jquery.min.js', 'lib/jquery/jquery-1.11.1.min'],
        	underscore: 'lib/underscore/underscore-min',
        	...
        	text: 'lib/requirejs/plugins/text',
        	echarts:'lib/echarts/echarts',
        	'echarts/chart/bar' : 'lib/echarts/echarts',
        	config: 'modules/common/config'
    	}  
	});

	//修改config.js
	{
    	mainConfigFile : "../js/main.js",
    	baseUrl: "../js",
    	removeCombined: true,
    	findNestedDependencies: true,
    	dir: "../dist/js",
    	modules: [
        	{
           	 name: "main",
            	exclude: [
                	"libs"
            	]
        	},
       		{
           		name: "libs"
       	 	}
    	],
    	paths: {
        	jquery: "empty:"
    	}
	}
```

我们再次运行合并的操作`node r.js -o config.js`会发现此时`r.js`没有把`jquery`合并进来，因为它是通过cdn加载的。

**css的压缩合并配置**

虽然我的项目中没有用到，但在这里还是说一下吧。

项目中可能引用了多个css文件，如：

```html
<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
```

如果我们只想引用一个css文件，我们可以这样：

```css
@import url('/css/bootstrap.css');
/* style.css content here…. */
```

然后在压缩合并的时候进行配置：

```javascript
	//config.js
	{
		mainConfigFile : "../js/main.js",
		appDir: "../",
    	baseUrl: "js",
    	removeCombined: true,
    	findNestedDependencies: true,
    	dir: "../dist",
		optimizeCss: "standard",
    	modules: [
        	{
           	 name: "main",
            	exclude: [
                	"libs"
            	]
        	},
       		{
           		name: "libs"
       	 	}
    	],
    	paths: {
        	jquery: "empty:"
    	}，
		//匹配到的文件或者目录不会被拷贝到dist目录
		fileExclusionRegExp: /(^\.|build|dist|sass|config.rb)/,
		generateSourceMaps: true
	}
```

> `appDir`：项目根目录
> 
> `optimizeCss` ：css压缩规则，有四种，分别是：`none` 、`standard` 、`standard.keeplines`、`standard.keepComments`、`standard.keepComments.keeplines`。具体意思我就不一一解释了。
> 
> `generateSourceMaps`：生成map文件，把压缩过的js与未压缩的作映射





	







