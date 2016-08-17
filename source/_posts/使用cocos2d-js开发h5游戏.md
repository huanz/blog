title: 使用cocos2d-js开发h5游戏
date: 2014/12/16 14:09:19 
tags: [cocos2d-js, html5]
categories: technology
---

最近一段时间，折腾了一下cocos2d-js，走过，坑过，跨过了一部分，还在加班填剩下的部分。好在今天终于抽出了点时间，因此便想要总结一下。

<!-- more -->

开始之前你可以先用微信扫一扫玩下我们做的游戏：

![煤屎军团](http://7xp0ue.dl1.z0.glb.clouddn.com/2016-08-16_1471327305.png)

整个代码已经托管在github：[https://github.com/huanz/msjt](https://github.com/huanz/msjt)

## 如何学习 ##

如何开始学习cocos2d-js？我我觉得比较好的方式是：

1. 看测试例：[测试例](http://cocos2d-x.org/js-tests/)
2. 看Api文档：a.[在线API索引](http://www.cocos2d-x.org/reference/html5-js/V3.0/index.html) b.[下载版API索引](http://www.cocos2d-x.org/filedown/Cocos2d-JS-v3.2-RC0-API.zip)
3. 看源码

另外还有大神录制了进阶视频教程：[Cocos2d-JS进阶视频教程](http://cn.cocos2d-x.org/tutorial/lists?id=114)，里面关于自学的艺术还是讲的挺好的，在这里我就不累赘了。

## 如何开始 ##

如何开始很简单了，就两条：

1. 搭环境
2. 编码

如果你是做纯web的游戏，搭建环境很简单：

1. 下载引擎包
2. 下载[Python2.7.6](https://www.python.org/download/releases/2.7.6/)，[Ant](http://mirrors.cnnic.cn/apache//ant/binaries/apache-ant-1.9.4-bin.zip)，如果没有安装java，请去下载**[jdk](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)至少1.7的版本**
3. 配环境：无疑就是配置java环境、python环境、ant环境变量。基本上就是在系统环境变量path加入相关的bin目录地址。不会的自行google吧
4. 创建项目：`cocos new -l js ProjectName`
5. 开始编码：sublime、webstorm等等用你喜欢的开发工具吧。

官网也有相关文章：[用Cocos Console工作流开发网页/原生平台游戏（JSB开发环境简介）](http://cn.cocos2d-x.org/article/index?type=cocos2d-x&url=/doc/cocos-docs-master/manual/framework/cocos2d-js/2-working-environment-and-workflow/2-2-cross-native-browser-game-with-cocos-console/zh.md)


## 如何编码 ##

如何编码？如果团队协作，遵循团队的编码规范咯。这里我只是简单说一点点：

1. 关于`project.json`文件的配置信息

	这个其实在main.js里面有注释说明

    ```javascript
		debugMode： 0
		//0 不显示任何错误信息
		//1 显示cc.assert, cc.warn, cc.log
	
		showFPS : true
		//为真会在屏幕左下方显示游戏帧率

		id: gameCanvas
		//游戏画布的id

		renderMode： 0
		// 0 : 自动选择渲染引擎：webGl、canvas
		// 1 : canvas
		// 2 : WebGL（在webgl模式下drawNode会存在严重的锯齿）

		// modules ： 游戏引用的模块
		// 模块的名字可以在frameworks/cocos2d-html5/moduleConfig.json
		// 里面找到，所以后期在上线的时候可以选择自己用到的模块引入来减少js文件的大小
    ```
	
2. 关于CCBoot.js

	`CCBoot.js`是入口js文件，所以你很有必要认真看一看其中的代码，比如其中提供一些可用的工具：

    ```javascript
		//创建元素
		cc.newElement
		//监听事件
		cc._addEventListener
		//循环操作
		cc.each
		//继承
		cc.extend
		
		cc.isFunction
		cc.isNumber
		cc.isString
		cc.isArray
		cc.isUndefined
		cc.isObject
		...

		//原生的渲染引擎：CanvasRenderingContext2D/WebGLRenderingContext
		cc._renderContext

		//包裹游戏画布的外层div
		cc._gameDiv / cc.container
    ```

	比如一些你可能想要修改的东西：

	包裹游戏的外层div的id名字：
		
	```javascript	
	//大约CCBoot.js的1864行：
	localContainer.setAttribute('id', 'Cocos2dGameContainer');
	```

	初始加载的时候的画布颜色：

	```javascript
	//大约CCBoot.js的641行： 
	canvasNode.style.backgroundColor = "black";
	```

	在`frameworks/cocos2d-html5/core/platform/`目录下也有很多东西，主要是平台相关的东西。
	
	如简单操作dom的工具`miniFramework.js`里面的：

	```javascript
	cc.$
	```

	屏幕适配相关的东西'CCEGLView.js'里面的：

	```javascript
	cc.view.adjustViewPort
	cc.view.setDesignResolutionSize
	cc.view.resizeWithBrowserSize
	...
	```

	文件加载相关的CCLoader.js：

	cocos2d-js的文件加载是通过文件后缀的，如后缀名为`["png", "jpg", "bmp","jpeg","gif", "ico"]`的文件会通过`cc._imgLoader`来加载，理解了这里可以用于后期自定义文件加载插件。

还有一些编码上面的东西放在下面再说。

## 关于音频 ##

音频，在移动端上一直是个巨坑的问题。能自动播放，不能自动播放、不能循环播放、根本就不播放等等简直就是处处都是坑啊。

开始游戏中的音频用的是cocos里面的封装的音频函数，会对音频文件进行预加载、预处理。但是这里有个严重的问题，那就是加载的时候很容易卡在音频那里，而且循环播放也有问题。于是决定用会原生的audio标签。

    ```html
    <audio id="gameAudio" src="res/gameMusic.mp3" loop="loop"></audio>
    ```

看起来应该是不错的样子，但是当我们在iphone4s微信内置浏览器里面测试的时候发现这个audio标签居然占据页面空间（不是说加了controls这个属性才会占空间么，坑啊！），于是自然而然想到的解决方案就是none掉：

	```html
	<audio style="display:none" id="gameAudio" src="res/gameMusic.mp3" loop="loop"></audio>
	```

感觉好像轻易解决了这个问题，于是开始编写一堆音频处理的代码。编写完毕之后，拿起iphone试一试，我去啊iphone上音频不能循环播放了啊，能不能再坑点！这个问题困扰了好久不知道什么原因，拿着代码去找师傅去吧！师傅只有一句话：ios上面音频如果不显示或者在屏幕之外有可能就会出问题哦！终于把display：none去掉一切又好了。孩子你还是太年轻了啊！对于占据空间的问题我们现在只能把音频标签作为body最后一个child节点，依然没有很好的解决方案。

对于音频的自动播放，目前只发现在iphone6 plus是可以的（iphone 6没有所以没试过），所以只能通过用户触摸事件来加载。如果在HTML标记中使用了autoplay属性，将会忽略这个属性，并且不会在加载页面时播放此文件，对于 preload 属性，同样会忽略。唯一能解决的就是用户进入页面是，让用户触发 touch 事件，并且只能在touch事件的回调里面加载才有效。

```javascript
var $audio = document.getElementById('gameAudio');
// 用户点击屏幕的任何一个地方就去加载音频
document.addEventListener('touchstart', function(e){
	$audio.load();
},false);
	
// 在某个cc.MenuItemImage/cc.MenuItemSprite/onTouchBegan的回调里面执行播放操作
try{
	$audio.play();
}catch(e){}
```

音频的暂停：

```javascript
try{
    $audio.pause();
}catch(e){}
```

音频的停止：

```javascript
try{
    $audio.currentTime = 0;
    $audio.pause();
}catch(e){}
```

如果是多个音频文件，可以使用音频audio sprite，所有的音频综合到一个单音频流中，然后播放此流的各个部分。

```javascript
var audioData = {
    bg: {
        start: 0,
        length: 1
    },
    run: {
        start: 1.3,
        length: 1.5
    }
};
```
	
要播放bg这段声音：

```javascript
try{
	$audio.currentTime = audioData.bg.start;
	$audio.play();
}catch(e){}
```

当播放结束时：

```javascript
$audio.addEventListener('timeupdate', function(){
	if (this.currentTime >= audioData.bg.start + audioData.bg.length) {
        this.pause();
    }
}, false);
```

需要注意的是，更改 currentTime 并不是百分百正确的。假设 currentTime 设为 3.2，而实际得到的却是 3.4。每个 audio sprite 之间需要少量的空间，以避免寻找到另一个 sprite 的头部。


## 一些工具 ##

**精灵图制作：**[TexturePacker](https://www.codeandweb.com/texturepacker)

相当好用的精灵图制作工具，虽然收费，但是可以申请免费的密钥，具体申请地址自己查吧。

用它制作精灵图的时候注意一个地方就可以了：

![](http://blog.u.qiniudn.com/uploads/TexturePacke.png)

勾上这个Reduce border artifacts，它会让你的精灵图边缘没有锯齿，其它的配置地方我基本上都是默认的。

**位图字体制作：**[Bitmap Font Generator](http://www.angelcode.com/products/bmfont/)

位图字体其实是一张图片，然后记录每个文字的位置和大小，因此字体的大小在生成的时候已经定义了，所以在用的时候最好不要改变字体的大小，如果改变了大小会对图片进行缩放，可能会出现锯齿。

用[Bitmap Font Generator](http://www.angelcode.com/products/bmfont/)这个软件制作的字体会生成一个png文件和一个fnt文件。选择左上方的`Options->Font settings`：

![](http://blog.u.qiniudn.com/uploads/bmfont.png)

设置字体格式和字体大小。其它基本上都是默认设置就好了。

可以在主界面上面一个个点击选择需要制作的文字，也可以把要选择的字体放在一个txt文件里面（**txt文件编码为Utf-8**），然后选择菜单栏的`Edit->Select chars from file`来选择要制作的文字。

Bitmap Font Generator还支持从image文件生成字体纹理图,选择菜单栏的`Edit->Open Image Manager->Image->Import image`（注意路径里面不要有中文）

![](http://blog.u.qiniudn.com/uploads/bmfonti.png)

Id那里填写对应文字的ASCII码，如我上传的图片里面的文字是2，其对应的ASCII码是50。如果不知道某个文字的ASCII码，可以去这里查：[ASCII码对照表](http://ascii.911cha.com/)。


选择好之后点击菜单栏`Options->Export options`：

![](http://blog.u.qiniudn.com/uploads/bmfonte.png)

Padding那里设置每个文字的间距，如果你需要对文字有阴影什么的话，那你最好设置一下padding值，四个值分别是top、right、bottom、left的间距值。

Texture那里设置纹理图的大小，如果设置的太小，文字多的话他可能会生成多个纹理图，所以我建议设置宽高最好让文字能够放在一张图里面比较合适。

Bit depth设置色深，如果为了效果好点可以选择32，对效果要求没那么细腻，想要生成的文件小点可以选择8。

Presets那里设置生成的纹理图的样式，我一般选择是白色文字加上透明背景，即`White text with alpha`

Textures生成纹理图的格式，肯定选择png了。


**字体精简：**[FontCreator](http://www.high-logic.com/font-editor/fontcreator.html)

为什么需要加载字体？因为有时候页面上会有不同大小的特殊字体，用位图又比较麻烦，加载整个字体库又太大了，于是我找到了这个软件。

选择菜单栏`File->New Project`，填写你的字体名字和字体样式。然后选择菜单栏`File->Open`，打开你要精简的字体。（在新建项目的时候有一个Include outlines/Don'n include outlines的选项。如果选择Include outlines它会默认帮你添加一些字符）

![](http://blog.u.qiniudn.com/uploads/fontc.png)

如果是可以直接看得到的字符，我可以直接在原有的字体文件中选中这个字符，然后复制粘贴到我的项目里面对应的位置上去，如果不是的话，我们可以通过下面的方法添加进去。

ctrl+f键查找某个字符，如我们要添加的字是“我”，然后右键选择`Glyph Properties`

![](http://blog.u.qiniudn.com/uploads/fontc1.png?)

复制`Codepoints`里面的参数，然后选中自己的项目，选择菜单栏`Insert->Charaacters`，把刚才复制的Codepoints粘贴到对应的位置。

![](http://blog.u.qiniudn.com/uploads/fontc2.png)

这时你会发现在你项目字符的最后会添加一个灰色方块，回到原始字体那里，选中那个字直接复制粘贴到刚才添加的那个方块里面就可以了：

![](http://blog.u.qiniudn.com/uploads/fontc3.jpg)

在上面的图里面你可以看到有很多灰色的方块，看看里面显示的字符，如果你用不到你可以直接点Delete键把它删掉。

除了用这个软件外，最近发现一个工具也可以用来精简压缩字体，感兴趣的可以试试：[字蛛——中文字体自动化压缩工具](http://font-spider.org/)

**地图制作：**[Tiled Map Editor](http://www.mapeditor.org/)

这个其实在我们的项目中没有用到，所以在这里提一下而已，有用到的可以自己去琢磨一下。

## 项目发布 ##

项目发布意味着什么？简单来说就意味着资源压缩、代码合并。首先来说下资源压缩吧。


**让你爱恨交加的closure compiler**

不是说cocos2d-js么？怎么会扯到closure compiler。如果你想要发布你的cocos2d游戏，我觉得就不得不说说closure compiler这玩意，这也是为何安装jdk的时候要求要jdk7以上的版本了。

在cocos项目发布的时候，有一个命令是`cocos compile -p web -m release --advanced`，后面加了一个`advanced`的参数，这种模式下面使用的是closure compiler的高级js压缩模式，压缩比例惊人，同时会优化js的执行，因此压缩之后的js性能也会得到一定提升。但是想要用这个高级压缩模式可是有坑的，很可能你会发现你的代码经过这种压缩模式压缩之后就报错了。

所以你最好去[closure compiler官网](https://developers.google.com/closure/compiler/)（google出品，所以需要翻墙）看一看，这里我只提简单的几点。

需要保留变量名的，要么用`@expose`关键字申明，要么使用`[]`来引用，如：

```javascript
/** @expose */
window.MM;
/** @expose */
M.add;
/** @expose */
M.add.Pos;

// or
window['MM'];
MM['add'];
MM['add']['Pos'];
```

比如在ajax请求数据的时候的请求参数和响应参数，你要写成这样：

```javascript
// request data
// 加引号
{'name': 'dddd', 'id': '123'}

// response data
// 通过数组的方式取值
data['list'];
data['list']['userName']
```

记住，任何你需要让它在压缩之后能保持原样输出的你都应该这样写。如果要了解更多你可以去它官网看看，或者看一看cocos2d-js的源码，里面有很多应对closure compiler高级压缩模式的注解。

**plist文件合并**

一次请求是比较耗费资源的，所以我们把plist文件合并在一个文件里面来加载，同时也对plist进行了压缩，下面是加载解析合并后的plist文件的插件源码：

```javascript	
	/**
	 * 将plist合并成一个加载
	 */
	cc._pjsonLoader = {
	    KEY : {
	        frames : 0,
	        rect : 0, size : 1, offset : 2, rotated : 3, aliases : 4,
	        meta : 1,
	        image : 0
	    },
	    _parse : function(data){
	        var KEY = this.KEY;
	        var frames = {}, meta = data[KEY.meta] ? {image : data[KEY.meta][KEY.image]} : {};
	        var tempFrames = data[KEY.frames];
	        for (var frameName in tempFrames) {
	            var f = tempFrames[frameName];
	            var rect = f[KEY.rect];
	            var size = f[KEY.size];
	            var offset = f[KEY.offset];
	            frames[frameName] = {
	                rect : {x : rect[0], y : rect[1], width : rect[2], height : rect[3]},
	                size : {width : size[0], height : size[1]},
	                offset : {x : offset[0], y : offset[1]},
	                rotated : f[KEY.rotated],
	                aliases : f[KEY.aliases]
	            }
	        }
	        return {_inited : true, frames : frames, meta : meta};
	    },
	    load : function(realUrl, url, res, cb){
	        var self = this, locLoader = cc.loader, cache = locLoader.cache;
	        locLoader.loadJson(realUrl, function(err, pkg){
	            if(err) return cb(err);
	            var dir = cc.path.dirname(url);
	            for (var key in pkg) {
	                var filePath = cc.path.join(dir, key);
	                cache[filePath] = self._parse(pkg[key]);
	            }
	            cb(null, true);
	        });
	    }
	};
```
	//注册这个插件，前面说过cocos文件加载是通过文件后缀名来判断使用哪个加载器来加载的，所以这里会加载后缀名为.pjson的文件

```javascript
cc.loader.register(["pjson"], cc._pjsonLoader);
```

那么如何来生成这个`.pjson`文件呢？下面是我用[nodejs](http://nodejs.org/)写的一个脚本，可以读取目录下面所有的`.plist`文件，然后生成一个`.pjson`文件：

```javascript
	//pjson.js
	var fs = require('fs');
	var plist = require('plist');
	var pjson = {};
	
	//var src = "res/*.plist";
	//node pjson
	fs.readdir('./res', function(err, files) {
	    if (err) {
	        throw err;
	    }
	    for (var i = files.length - 1; i >= 0; i--) {
	    	var file = files[i],
	    		ext = file.split('.')[1];
	    	if(ext === 'plist'){
	    		pjson[file] = [];
	    		pjson[file][0] = {};
	    		var data = fs.readFileSync('./res/'+file, 'UTF-8');
				var frames = plist.parse(data.toString()).frames;
				var fileName = Object.keys(frames);
				for(var j=0; j< fileName.length; j++){
					var dat = pjson[file][0][fileName[j]] = [];
					var frame = frames[fileName[j]];
					dat[0] = frame.frame.replace(/{|}/g, '').split(',');
					dat[1] = frame.sourceSize.replace(/{|}/g, '').split(',');
					dat[2] = frame.offset.replace(/{|}/g, '').split(',');
	                if(frame.rotated)  dat[3] = 1;
				}
	    	}
	    };
	    fs.writeFile('./res/plists.pjson', JSON.stringify(pjson), function (err) {
	  		if (err) throw err;
	  		console.log('done!');
		});
	});
```

所以你需要在nodejs命令行里面运行：

```bash
// 第一次运行请先安装依赖包
npm install plist
	
// 生成pjson文件
node pjson.js
```

那么如何使用这个文件呢？很简单，你只需要在`resource.js`的`g_resources`数组里面删除`plist`相关的，然后添加这个`plists.pjson`的路径就可以了，其它不用作任何改动。


**图片资源压缩**

关于图片和其他静态资源，我用了一个前端自动化任务工具`gulp`，不懂的可以看我上篇博文：[Gulp上手](http://w3cboy.com/post/2014/10/getting-started-with-gulp/)，下面是我针对项目配置的`gulp`任务`gulpfile.js`：

```javascript
	var gulp = require('gulp'),
	    imagemin = require('gulp-imagemin'),
	    pngquant = require('imagemin-pngquant'),
	    cache = require('gulp-cache'),
	    autoprefixer = require('gulp-autoprefixer'),
	    minifycss = require('gulp-minify-css'),
	    rev = require('gulp-rev'),
	    revReplace = require('gulp-rev-replace'),
	    useref = require('gulp-useref');

	var basePath = 'publish/html5/';

	gulp.task('image', function () {
	    return gulp.src(basePath+'res/**/*.png')
	        .pipe(cache(imagemin({
	            optimizationLevel: 7,
	            use: [pngquant({ quality: '60-80', speed: 1 })]
	        })))
	        .pipe(gulp.dest(basePath+'res'));
	});
	
	gulp.task('style', function () {
	    return gulp.src('css/**/*.css')
	        .pipe(autoprefixer('Android', 'BlackBerry', 'iOS', 'OperaMobile', 'ChromeAndroid', 'FirefoxAndroid', 'ExplorerMobile'))
	        .pipe(minifycss())
	        .pipe(gulp.dest(basePath+'css'));
	});
	
	gulp.task('static', function () {
	    var userefAssets = useref.assets();
	    return gulp.src(basePath+'index.html')
	        .pipe(userefAssets)
	        .pipe(rev()) 
	        .pipe(userefAssets.restore())
	        .pipe(useref())
	        .pipe(revReplace())
	        .pipe(gulp.dest(basePath));
	});
	
	gulp.task('default', ['image', 'style', 'static']);
```

因为其中用到了对每次生成的js、css文件进行md5命名和合并操作，所以你需要在你的html文件里面作如下配置：

```html
	<!-- build:css css/main.css -->
    <link rel="stylesheet" href="css/a.css">
	<link rel="stylesheet" href="css/b.css">
    <!-- endbuild -->

	<!-- build:js game.js -->
	<script src="frameworks/cocos2d-html5/CCBoot.js"></script>
	<script src="main.js"></script>
	<!-- endbuild -->
```

**整个项目发布**

接着我写了一个整个项目的发布脚本`build.js`：

```javascript
	var exec = require('child_process').exec;
	
	var buildProcess = exec('cocos compile -p web -m release --advanced', {});
	buildProcess.on('close', function () {
		console.log('start gulp task');
		var nextProcess = exec('gulp default', {});
		nextProcess.on('close', function () {
			console.log('gulp task end');
		});
		nextProcess.stdout.setEncoding('utf-8');
		nextProcess.stdout.on('data', function (data) {
		    console.log(data);
		});
		nextProcess.stderr.setEncoding('utf-8');
		nextProcess.stderr.on('data', function (data) {
		    throw new Error(data);
		});
	});
	buildProcess.stdout.setEncoding('utf-8');
	buildProcess.stdout.on('data', function (data) {
	    console.log(data);
	});
	buildProcess.stderr.setEncoding('utf-8');
	buildProcess.stderr.on('data', function (data) {
	    throw new Error(data);
	});
```

所以每次项目发布的时候，你只需要打开nodejs命令行，然后执行一下一个命令就完事：

```bash
node build.js
```

## 一些可能对你有用的代码 ##

**ajax简单封装**

```javascript
	Utils.ArrayProto = Array.prototype;
	Utils.slice = Utils.ArrayProto.slice;
	
	Utils.decode = decodeURIComponent;
	Utils.encode = encodeURIComponent;

	Utils.defaults = function(obj){
	    cc.each(Utils.slice.call(arguments, 1), function(o){
	        for(var k in o){
	            if (obj[k] == null) obj[k] = o[k];
	        }    
	    });
	    return obj;
	};

	Utils.formData = function(o) {
	    var kvps = [], regEx = /%20/g;
	    for (var k in o) kvps.push(Utils.encode(k).replace(regEx, "+") + "=" + Utils.encode(o[k].toString()).replace(regEx, "+"));
	    return kvps.join('&');
	};
	
	Utils.ajax = function(o){
	    var xhr = cc.loader.getXMLHttpRequest();
	    o = Utils.defaults(o, {type: "GET", data: null, dataType: 'json', progress: null, contentType: "application/x-www-form-urlencoded"});
	    //ajax进度的
		//if(o.progress) Utils.Progress.start(o.progress);
	    xhr.onreadystatechange = function() {
	        if (xhr.readyState == 4){
	            if (xhr.status < 300){
	                var res;
	                if(o.dataType == 'json'){
	                    res = window.JSON ? window.JSON.parse(xhr.responseText): eval(xhr.responseText);
	                }else{
	                    res = xhr.responseText;
	                }
	                if(!!res) o.success(res);
					////ajax进度的
	                //if(o.progress) Utils.Progress.done();
	            }else{
	                if(o.error) o.error(xhr, xhr.status, xhr.statusText); 
	            }
	        }
	    };
	    //是否需要带cookie的跨域
		//if("withCredentials" in xhr) xhr.withCredentials = true;
	    var url = o.url, data = null;
	    var isPost = o.type == "POST" || o.type == "PUT";
	    if( o.data && typeof o.data == 'object' ){
	        data = Utils.formData(o.data);
	    }
	    if (!isPost && data) {
	        url += "?" + data;
	        data = null;
	    }
	    xhr.open(o.type, url, true);
	    if (isPost) {
	        xhr.setRequestHeader("Content-Type", o.contentType);
	    }
	    xhr.send(data);
	    return xhr;
	};
	
	Utils.get = function(url, data, success){
	    if(cc.isFunction(data)){
	        success = data;
	        data = null;
	    }
	    Utils.ajax({url: url, type: "GET", data: data, success: success});
	};
	
	Utils.post = function(url, data, success){
	    if(cc.isFunction(data)){
	        success = data;
	        data = null;
	    }
	    Utils.ajax({url: url, type: "POST", data: data, success: success});
	};
```

用法和jquery的ajax用法类似

**LoaderScene重定义**

下面是我的loaderScene的一部分代码：

```javascript
	var LoaderScene = cc.Scene.extend({
	    _interval : null,
	    _label : null,
	    _className:"LoaderScene",
	    numberSprites: [],
	
	    init : function(){
	        var self = this;
	
	        // bg
	        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(216, 216, 216));
	        bgLayer.setPosition(cc.visibleRect.bottomLeft);
	        self.addChild(bgLayer, 0);
	
	        //you codes
	        
	        return true;
	    },
	    onEnter: function () {
	        cc.Node.prototype.onEnter.call(this);
	        var loader = (this.loadType == 'resource') ? this._startLoading : this._startAjax;
	        this.schedule(loader, 0.3);
	    },
	    onExit: function () {
	        cc.Node.prototype.onExit.call(this);
	        //you codes
	    },
	
	    initWithResources: function (resources, cb) {
	        if(cc.isString(resources))
	            resources = [resources];
	        this.resources = resources || [];
	        this.cb = cb;
	        this.loadType = 'resource';
	    },
	    _startLoading: function () {
	        var self = this;
	        self.unschedule(self._startLoading);
	        var res = self.resources;
	        cc.loader.load(res, self._loadProgress.bind(self), function () {
	            if (self.cb) self.cb();
	        });
	    },
	    initAjax: function(ajaxSetting){
	    	this.ajaxSetting = ajaxSetting;
	    	this.loadType = 'ajax';
	    },
	    _startAjax: function(){
	    	var self = this,
	    		preNum = 0;
	        self.unschedule(self._startAjax);
	        if(!this.ajaxSetting.progress){
	        	this.ajaxSetting.progress = function(n){
	        		n = n.toFixed(2);
	        		if(preNum === n) return;
	        		preNum = n;
	        		self._loadProgress(null, 1, n);
	        	};
	        }
	        Utils.ajax(this.ajaxSetting);
	    },
	    _loadProgress: function(result, count, loadedCount){
	    	var percent = (loadedCount / count * 100) | 0;
	        percent = Math.min(percent, 100);
	        console.log(percent);
	    }
	});
	
	LoaderScene.preload = function(resources, cb){
	    var _cc = cc;
	    if(!_cc.loaderScene) {
	        _cc.loaderScene = new LoaderScene();
	        _cc.loaderScene.init();
	    }
	    _cc.loaderScene.initWithResources(resources, cb);
	    cc.director.runScene(_cc.loaderScene);
	    return _cc.loaderScene;
	};
	
	LoaderScene.ajaxLoad = function(ajaxSetting){
	    var _cc = cc;
	    if(!_cc.loaderScene) {
	        _cc.loaderScene = new LoaderScene();
	        _cc.loaderScene.init();
	    }
	    _cc.loaderScene.initAjax(ajaxSetting);
	    cc.director.runScene(_cc.loaderScene);
	    return _cc.loaderScene;
	};
```

如果是普通的资源加载调用`LoaderScene.preload`,如果是ajax加载定调用`LoaderScene.ajaxLoad`,配合上面的ajax封装来用：

```javascript
	LoaderScene.preload(g_resources, function () {
		console.log('loaded！！！');
	});

	LoaderScene.ajaxLoad({
		url: 'test.json',
		data: {'name': 'ddd'}
		success: function(data){
			console.log(data);
		},
		error: function(xhr, status, msg){
			
		}
	});
```

其中有个显示ajax加载百分比的方法，需要用到一个生成加载百分比的方法，同时要把ajax封装里面的`if(o.progress)`的注释打开：

```javascript
	Utils.noop = function(){};
	
	Utils.clamp = function(n, min, max) {
	    if (n < min) return min;
	    if (n > max) return max;
	    return n;
	};

	Utils.Progress = {};
	//设置最小值、更新频率和速度
	Utils.Progress.settings = {
	    minimum: 0.1,
	    trickle: true,
	    trickleRate: 0.3,
	    trickleSpeed: 100
	};
	
	Utils.Progress.status = null;
	
	Utils.Progress.set = function(n) {
	    var progress = Utils.Progress;
	    n = Utils.clamp (n, progress.settings.minimum, 1);
	    progress.status = n;
	    progress.cb(progress.status);
	    return this;
	};
	
	Utils.Progress.inc = function(amount){
	    var progress = Utils.Progress,
	        n = progress.status;
	    if (!n) {
	        return progress.start();
	    }else{
	        amount = (1 - n) * Utils.clamp(Math.random() * n, 0.1, 0.95);
	        n = Utils.clamp(n + amount, 0, 0.994);
	        return progress.set(n);
	    }
	};
	
	Utils.Progress.trickle = function() {
	    var progress = Utils.Progress;
	    return progress.inc(Math.random() * progress.settings.trickleRate);
	};
	
	Utils.Progress.start = function(cb) {
	    var progress = Utils.Progress;
	    progress.cb = cb || Utils.noop;
	    if (!progress.status) progress.set(0);
	
	    var timer = function(){
	        if (progress.status === 1) {
	            clearTimeout(timer);
	            timer = null;
	            return;
	        }
	        progress.trickle();
	        work();
	    };
	
	    var work = function() {
	      setTimeout(timer, progress.settings.trickleSpeed);
	    };
	    if (progress.settings.trickle) work();
	    return this;
	};
	
	Utils.Progress.done = function() {
	    var progress = Utils.Progress;
	    return progress.inc(0.3 + 0.5 * Math.random()).set(1);
	};
```

**LoaderLayer的定义**

LoaderLayer是在加载的时候在当前场景上面添加一个遮罩层，这里主要是ajax加载的，代码如下：

```javascript
	Config.winSize = cc.size(720, 1134);
	Config.w =  Config.winSize.width;
	Config.h =  Config.winSize.height;
	Config.w_2 = Config.w / 2;
	Config.h_2 = Config.h / 2;

	var LoaderLayer = cc.LayerColor.extend({
		count: 0,
	    ctor:function () {
	        this._super(cc.color(0, 0, 0, 160));
	        var draw = new cc.DrawNode();
	        draw.x = Config.w_2 - 50;
	        draw.y = 260;
	
	        for(var i=0; i<3; i++){
	            draw.drawRect(cc.p(40*i, 0), cc.p(40*i+20, 20), cc.color(181, 181, 181), 1, cc.color(181, 181, 181));
	        }
	        var draw2 = this.draw = new cc.DrawNode();
	        draw2.x = Config.w_2 - 50;
	        draw2.y = 260;
	        draw2.drawRect(cc.p(0, 0), cc.p(20, 20), cc.color(239, 178, 82), 1, cc.color(239, 178, 82));
	        this.addChild(draw);
	        this.addChild(draw2);
	        this.schedule(this.updateLoad, 0.2);
	        return true;
	    },
	    updateLoad: function(){
	    	var draw = this.draw;
	    	draw.clear();
	    	if(this.count >3){
	    		this.count = 0;
	    	}
	    	for(var i=0; i< this.count; i++){
	    		draw.drawRect(cc.p(40*i, 0), cc.p(40*i+20, 20), cc.color(239, 178, 82), 1, cc.color(239, 178, 82));
	    	}
	    	this.count++;
	    },
	    onRemove: function(){
			var parent = this.parent;
	        cc.eventManager.resumeTarget(parent,true);
			parent.resume();
			parent.removeChild(this, true);
	    }
	});

	LoaderLayer.preload = function(url, data, cb, parent){
		var loader = cc.LoaderLayer;
	    if(!loader) {
	        loader = new LoaderLayer();
	    }
		//parent.pause();
	    cc.eventManager.pauseTarget(parent,true);
	    parent.addChild(loader, 99);
	   	Utils.ajax({
	   		url: url,
	   		type: "POST",
	   		data: data,
	   		success: function(data){
	   			loader.onRemove();
	   			cb(data);
	   		},
	   		error: function(xhr, status, msg){
	   			loader.onRemove();
	   			alert(msg);
	   		}
	   	});
	};
```

使用也很简单：

```javascript
// 这里默认使用了ajax的post方法,parent一般都是this。
LoaderLayer.preload(url, data, cb, parent);
```

**H5离线缓存**

HTML5离线存储Application Cache可以让用户在离线状态下浏览网站内容，缓存之后的内容不会再次从服务器获取，除非缓存文件改变了。如何使用呢？这需要打开你的html文件在里面：

```html
<!DOCTYPE html>
<html lang="en" manifest="manifest.appcache">
<head>
...
```

接着在html文件的同级目录下面新建`manifest.appcache`，并加入如下内容：

```
// manifest.appcache
CACHE MANIFEST
#version 1.0
CACHE:
	css/main.css
	img/test.png

NETWORK:
	*
```

关于manifest.appcache文件，基本格式为三段： CACHE， NETWORK，与 FALLBACK，其中NETWORK和FALLBACK为可选项，而第一行CACHE MANIFEST为固定格式，必须写在前面。

CACHE是必须参数，标识出哪些文件需要缓存，可以是相对路径也可以是绝对路径

NETWORK是可选参数，这一部分是要绕过缓存直接读取的文件，可以使用通配符＊，也就是说除了上面的cache文件，剩下的文件每次都要重新拉取。

FALLBACK也是可选参数，指定了一个后备页面，当资源无法访问时，浏览器会使用该页面。该段落的每条记录都列出两个 URI—第一个表示资源，第二个表示后备页面。两个 URI 都必须使用相对路径并且与清单文件同源。可以使用通配符。

有了上面两个文件之后还要配置服务器的mime.types类型，找大盘apache的mime.types文件，添加

```
text/cache-manifest .appcache
```

上面文件配置完成之后，application cache就可以运行了。

更新缓存的方式有三种：

- 更新manifest文件

可以修改一下manifest文件，把version改为1.1，然后刷新页面。

- 通过javascript操作

js添加一个监听事件：

```javascript
window.applicationCache.addEventListener('updateready', function(){
    console.log('updateready!');
    window.applicationCache.swapCache();
});
```

- 清除浏览器缓存

站点离线存储的容量限制是5M；如果manifest文件，或者内部列举的某一个文件不能正常下载，整个更新过程将视为失败，浏览器继续全部使用老的缓存。



	



 