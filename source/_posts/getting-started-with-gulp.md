title: Gulp上手
date: 2014/10/22 11:10:56  
tags: [gulp,javascript]
categories: technology
---

是时候抛弃繁重的Grunt了。Gulp是一个直观的、配置的、基于流的任务发布系统，而且它更高效。

<!-- more -->

![gulp](http://blog.u.qiniudn.com/uploads%2Fgulp-2x.png)

为什么我会感兴趣呢？好问题。Gulp通过配置写代码不仅使得它编写任务简单，而且更加方便阅读和维护。

Gulp运用node.js的流，这使得它构建任务很快，因为没有磁盘文件的读写操作，如果你想了解更多关于流的知识，你可以看看[这个](https://github.com/substack/stream-handbook)。Gulp允许你输入源文件，然后在一系列的管道插件中处理，最后输出，不像Grunt你需要为每个插件配置输入和输出。下面就让我们通过一个sass编译的例子来看看Gulp和Grunt的差异吧。

**Grunt:**

```javascript
sass: {
  dist: {
    options: {
      style: 'expanded'
    },
    files: {
      'dist/assets/css/main.css': 'src/styles/main.scss',
    }
  }
},

autoprefixer: {
  dist: {
    options: {
      browsers: [
        'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
      ]
    },
    src: 'dist/assets/css/main.css',
    dest: 'dist/assets/css/main.css'
  }
},

grunt.registerTask('styles', ['sass', 'autoprefixer']);
```

Grunt要求每个插件配置要相互独立、要分别为每个插件配置输入源和输出路径。如，我们在sass插件里面配置了一个输入文件，然后保存输出。接着我们需要配置Autoprefixer的输入为Sass的输出，然后再输出了一个文件。让我们来看看Gulp是怎么做的：

**Gulp:**

```javascript
gulp.task('sass', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({ style: 'compressed' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/assets/css'))
});
```

在Gulp中我们只配置一次输入文件，然后依次通过Sass插件处理，再传给`Autoprefixer`插件处理，然后我们得到输出文件。整个过程没有读取和写入不必要的文件，效率大大提高。

因此，你感兴趣了么？让我们从安装Gulp，创建基本的任务配置文件`gulpfile`开始吧。

**安装gulp**

在我们开始配置任务之前，我们先要安装gulp:

```bash
npm install gulp -g
```

这样gulp就以全局的方式安装了，你可以在任何node命令行里面调用`gulp CLI`。然后我们需要在本地的某个项目里面使用`gulp`。使用`cd`命令进入到项目目录，运行下面的命令（先确保项目目录存在`package.json`文件）：

```bash
npm install gulp --save-dev
```

这会把gulp安装到本地项目，并且把依赖的包写入到`package.json`文件的`devDependencies`里面

**安装gulp插件**

我们将会安装下列插件来开始我们的任务：

- Sass 编译 ([gulp-ruby-sass](https://github.com/sindresorhus/gulp-ruby-sass))
- 添加浏览器前缀Autoprefixer([gulp-autoprefixer](https://github.com/Metrime/gulp-autoprefixer))
- CSS压缩（[gulp-minify-css](https://github.com/jonathanepollack/gulp-minify-css)）
- JS语法检查 ([gulp-jshint](https://github.com/wearefractal/gulp-jshint))
- 文件合并 ([gulp-concat](https://github.com/wearefractal/gulp-concat))
- JS压Uglify ([gulp-uglify](https://github.com/terinjokes/gulp-uglify))
- 图片压缩([gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin))
- LiveReload ([gulp-livereload](https://github.com/vohof/gulp-livereload))
- 图片缓存，只压缩修改过的图片([gulp-cache](https://github.com/jgable/gulp-cache/))
- 修改提醒([gulp-notify](https://github.com/mikaelbr/gulp-notify))
- 文件清理 ([del](https://www.npmjs.org/package/del))

运行下面的命令安装这些插件：

```bash
npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
```

这将会安装所有的依赖插件，并写入到package.json的devDependencies里面。所有的gulp插件列表可以[在这里](http://gratimax.net/search-gulp-plugins/)看到。

**加载插件**

我们需要创建一个`gulpfile.js`，然后使用这些插件：

```javascript
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');
```

我们也可以像grunt那样自动加载插件：[auto load](https://github.com/jackfranklin/gulp-load-plugins)

**创建任务**

*编译sass、加前缀、压缩*

```javascript
gulp.task('styles', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: '样式任务完成' }));
});
```

> sass({ style: 'expanded' }：编译后保留原格式


```javascript
gulp.task('styles', function() { ... )};
```

`gulp.task`API是用来创建任务的。然后通过命令`gulp styles`运行这个任务。

	
```javascript
return gulp.src('src/styles/main.scss')
```

`gulp.src`API用来配置输入的源文件。也可以用模式匹配，如`/**/*.scss`匹配所有文件夹下面后缀为`.scss`的文件作为输入。通过返回流使得它是异步的，确保在提醒任务完成的时候任务是完成了的。

```javascript
.pipe(sass({ style: 'expanded' }))
```

通过`.pipe()`把源文件流入一个插件的管道中。然后我们可以去插件的官网看看这个插件的详细用法。

```javascript
.pipe(gulp.dest('dist/assets/css'));
```

`gulp.dest`API是用来告知输出文件的路径的。一个任务可以有多个输出，如一个用来输出原来的版本（即源文件），一个输出处理后的版本（即输出文件）。你可以在上面的`styles`任务中看到。

建议去看[gulp api文档](https://github.com/gulpjs/gulp/blob/master/docs/API.md)，这样会更加清楚。

**js语法检查、合并和压缩任务**

```javascript
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
```

这里用的`JSHin`t插件，我们使用了默认的`JSHint Reporter`，可能适用于大多数人，想了解更多可以去[jshint官网](http://www.jshint.com/docs/reporters/)看

**图片压缩任务**

```javascript
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});
```

这里我们只用了`imagemin`插件，但是可以做的更好，我们可以缓存修改过的图片，或者只对修改过的图片进行再次的压缩操作，因此我们可以使用[gulp-cahce](https://github.com/jgable/gulp-cache)插件，因此我们需要将这行代码：

```javascript
.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
```

改成：

```javascript
.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
```

此时，只有新的图片或者改变过的图片才会被压缩。

**文件清理**

在再次发布之前，我们最好把目标文件的文件先清理掉，然后重新构建：

```javascript
gulp.task('clean', function(cb) {
	    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
	});
```

**默认任务**

我们可以通过`$ gulp`启动默认任务，然后在默认任务中调用其他任务：

```javascript
gulp.task('default', ['clean'], function() {
	gulp.start('styles', 'scripts', 'images');
});
```


看到`gulp.task`里面的数组了吧？这里定义了任务的依赖，也就是说`default`任务依赖`clean`任务。在这个例子中，执行`gulp.start`之前会先运行`clean`任务。Gulp里面的任务同时进行，没有明确的顺序哪个先完成，所以我们要确保`clean`任务执行完之后再执行`gulp.start`里面的任务。

> 虽然不建议在执行依赖任务数组的时候使用`gulp.start`，但是在这里我们没有办法确保`clean`任务执行完毕后再执行其它任务，因此这里使用`gulp.start`貌似是最好的选择。


**Watch任务**

当文件发生变化的时候，我们可能需要重新执行任务，因此我们需要配置一个监听文件变化的任务：

```javascript
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

});
```

我们通过`gulp.watch`API来监听文件的变化，然后执行相关的依赖任务。现在我们可以执行`$ gulp watch`命令来执行我们的`watch`任务，监听`.scss`、`.js`或者图片文件的变化执行相应的任务。

**LiveReload任务**

当我们代码修改的时候，Gulp也可以主动帮我们刷新页面，此时我们需要配置`LiveReload`服务，并修改我们的`watch`任务：

```javascript
gulp.task('watch', function() {

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});
```

要让这个任务生效，我们还需要安装并开启浏览器LiveReload插件，我们也可以[手动添加代码片段](http://feedback.livereload.com/knowledgebase/articles/86180-how-do-i-add-the-script-tag-manually-)。

**整合这些任务**

把上面的这些任务综合起来，就构成了一个完整的`gulpfile`:

```javascript
// gulpfile.js
// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');
 
// Styles
gulp.task('styles', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});
 
// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
 
// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});
 
// Clean
gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});
 
// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});
 
// Watch
gulp.task('watch', function() {
 
  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);
 
  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);
 
  // Watch image files
  gulp.watch('src/images/**/*', ['images']);
 
  // Create LiveReload server
  livereload.listen();
 
  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);
 
});
```

如有任何问题，可以在下面评论。













