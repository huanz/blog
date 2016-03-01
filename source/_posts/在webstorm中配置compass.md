title: 在webstorm中配置compass
date: 2014-03-19 21:00:33
tags: [webstorm, compass]
categories: technology
---

WebStorm是功能强大的前端开发专用IDE，拥有即时编辑（chrome）、自动完成、debugger、Emmet、HTML5 支持、JSLint、Less、Sass支持、CoffeeScript支持、Node.JS、单元测试、集成git和svn版本控制等特性，被广大中国JS开发者誉为“Web前端开发神器”、“最强大的HTML5编辑器”、“最智能的JavaSscript IDE”等。Compasss是一个优秀的Sass框架，毫不夸张地说，学会了Compass，你的CSS开发效率会上一个台阶。本文将教你把两款神器结合，让你的前端开发更上一层楼。

<!-- more -->

## compass介绍 ##

compass的安装我就不说了，不会的看这里：[compass-style install](http://compass-style.org/install/),装好之后我们来用compass创建一个项目，打开命令行窗口，执行如下命令：

    compass create <your project name>
	
执行完后将会看到compass已经为我们创建好了一个项目目录，开起来是这样的：
	
> .sass-cache（此目录linux将会默认隐藏，sass缓存目录）
> 
> sass（此目录存放sass源文件）
> 
> stylesheets（此目录是生成的css文件目录）
> 
> config.rb（ruby配置文件）

接下来重点看一下`config.rb`，代码是这样的：

```ruby
# Require any additional compass plugins here.
# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "stylesheets"
sass_dir = "sass"
images_dir = "images"
javascripts_dir = "javascripts"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
```

文件的顶部可以用来加载compass插件，如想加入[foundation](http://foundation.zurb.com/)，则加入如下代码：
	
```ruby
require "zurb-foundation"
```

然后运行命令`compass install foundation`即安装foundation

或者直接运行命令：

```bash
compass install zurb-foundation/project-name
```

也可以在创建项目的时候运用以下命令创建一个compass-foundation项目：
	
```bash
gem install ZURB-foundation
compass create <project-name> -r zurb-foundation --using foundation --force
```

http_path即服务器根目录，css_dir、sass_dir、images_dir、javascripts_dir为相应的css、sass、images、js文件目录，配置之后在sass中图片的路径就可以直接用`image-url（image name）`引用

output_style为编译的css文件类型：


> `:expanded`模式表示编译后保留原格式；
> 
> `:nested`模式表示有缩进，较好阅读；
> 
> `:compact`模式表示简洁格式，编译出来的css文件大小比上面两个还小；
> 
> `:compressed`模式表示压缩过的CSS，生产环境下用。
> 
> `relative_assets`：是否启用相对路径
> 
> `line_comments`：是否使用css注释
> 
> `preferred_syntax = :sass`：Sass有两种语法格式：sass和scss，compass默认是scss语法（.scss），开启此配置将会使用sass语法（.sass）。

> 最后一个配置是sass与scss的转换

更多的相关配置信息请看官网：[compass configuration-reference](http://compass-style.org/help/tutorials/configuration-reference/)

scss文件的编译在项目根目录运行命令：

```bash
compass watch
```

当scss源文件发生改变后，compass将自动编译生css文件

接下来将在webstorm中配置compass开发环境

## 在WebStorm中配置compass ##


1. 首先用webstorm打开创建的compass项目，然后依次选择：

    ```
	File->Settings->Compass Support
	```

	勾上Enable Compass support，WebStorm会自动映射ruby compass目录和项目配置文件config.rb

2. 继续在此窗口选择`File Watchers`选项，然后点击右边的加号按钮，选择`compass scss`（如果你是sass语法的话选择`compass sass`）

3. 在Program里面选择ruby安装路径的bin下面的compass.bat，Arguments目录填入`compile $UnixSeparators($FilePath$)$`，Working directory填入`$ProjectFileDir$`，Output paths to refresh填入`$FileNameWithoutAllExtensions$.css`或者留空，保存之后就配置完成了。我的设置看起来是这样的：

	![](http://blog.u.qiniudn.com/3tb_140319234813m7or512293.jpg)

	如果你的项目不是在根目录的话，Working directory配置为`$UnixSeparators($FileParentDir$)$`，或者就直接把Working directory配置为`$UnixSeparators($FileParentDir$)$`吧。
	>Tip： Arguments那里配置用compile命令，以划线开始的scss文件也会被编译，为了避免这个问题，我暂时的解决方案是Arguments那里直接填入watch，但是每次代码修改保存的时候会在下面出现命令行窗口有点略不爽。

	>上面的Immediate file synchronization可以勾上，这样代码修改编译后会自动同步css文件，不勾的话需要手动同步代码才能看到最新编译的css文件。
	
	下面是我的配置：
	
	![](http://blog.u.qiniudn.com/uploads%2Fwebstorm_comnpass.png)
	

4. 但是在项目中会发现不支持compass语法高亮，解决方法是：

    ```
    File->Settings->Directories
    ```

	选择右边的Add Content Root，加入compass样式目录，如我的是(不要直接拷贝我的地址，因为你的ruby版本和compass版本可能和我不一样，因此路径也会不一样)：

	```
	D:/Ruby200-x64/lib/ruby/gems/2.0.0/gems/compass-0.12.2/frameworks/compass/stylesheets
	```

	然后选择上方的Mark as `Resource Root`

	这样之后@import就不会报错了，附上我的：

	![](http://blog.u.qiniudn.com/T0%5DEK$90_CTLQCPW%60%7BADFHY.jpg)

**tip**

配置webstorm的`File Watchers`之后对于配置比较低的电脑来说，可能会比较卡，在webstorm右下角的状态栏有一个类似戴帽子的人头的东西，可以把代码高亮等级调低一点，save mode也可以勾上等：

![](http://blog.u.qiniudn.com/uploads%2Fwebstorm.jpg)
	





