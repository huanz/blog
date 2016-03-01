title: Google JavaScript 编码风格
date: 2014-03-23 20:57:06
tags: javascript
categories: technology
---

JavaScript 是一种客户端脚本语言, Google 的许多开源工程中都有用到它. 这份指南列出了编写 JavaScript 时需要遵守的规则.

<!-- more -->

**命名**

通常, 使用

	functionNamesLikeThis, 
	variableNamesLikeThis, 
	ClassNamesLikeThis, 
	EnumNamesLikeThis,
	methodNamesLikeThis, 
	SYMBOLIC_CONSTANTS_LIKE_THIS

*属性和方法*

- 文件或类中的 私有 属性, 变量和方法名应该以下划线 "_" 开头.
- 保护 属性, 变量和方法名不需要下划线开头, 和公共变量名一样.

*方法和函数参数*

可选参数以 opt_ 开头.

函数的参数个数不固定时, 应该添加最后一个参数 var_args 为参数的个数. 你也可以不设置 var_args而取代使用 arguments.

可选和可变参数应该在 @param 标记中说明清楚. 虽然这两个规定对编译器没有任何影响, 但还是请尽量遵守

*Getters 和 Setters*

Getters 和 setters 并不是必要的. 但只要使用它们了, 就请将 getters 命名成 getFoo() 形式, 将 setters 命名成 setFoo(value) 形式. (对于布尔类型的 getters, 使用 isFoo() 也可.)

*命名空间*

JavaScript 不支持包和命名空间.

不容易发现和调试全局命名的冲突, 多个系统集成时还可能因为命名冲突导致很严重的问题. 为了提高 JavaScript 代码复用率, 我们遵循下面的约定以避免冲突.

- 为全局代码使用命名空间

	在全局作用域上, 使用一个唯一的, 与工程/库相关的名字作为前缀标识. 比如, 你的工程是 "Project Sloth", 那么命名空间前缀可取为 sloth.*.
		
		var sloth = {};

		sloth.sleep = function() {
  			...
		};

	许多 JavaScript 库, 包括 [the Closure Library ](https://developers.google.com/closure/library/?csw=1)and [Dojo toolkit](http://dojotoolkit.org/) 为你提供了声明你自己的命名空间的函数. 比如:

		goog.provide('sloth');

		sloth.sleep = function() {
  			...
		};

- 明确命名空间所有权

	当选择了一个子命名空间, 请确保父命名空间的负责人知道你在用哪个子命名空间, 比如说, 你为工程 'sloths' 创建一个 'hats' 子命名空间, 那确保 Sloth 团队人员知道你在使用 sloth.hats.

- 外部代码和内部代码使用不同的命名空间

	"外部代码" 是指来自于你代码体系的外部, 可以独立编译. 内外部命名应该严格保持独立. 如果你使用了外部库, 他的所有对象都在 foo.hats.* 下, 那么你自己的代码不能在 foo.hats.*下命名, 因为很有可能其他团队也在其中命名.

		foo.require('foo.hats');

		/**
 		* WRONG -- Do NOT do this.
 		* @constructor
 		* @extend {foo.hats.RoundHat}
 		*/
		foo.hats.BowlerHat = function() {
		};

	如果你需要在外部命名空间中定义新的 API, 那么你应该直接导出一份外部库, 然后在这份代码中修改. 在你的内部代码中, 应该通过他们的内部名字来调用内部 API , 这样保持一致性可让编译器更好的优化你的代码.

		foo.provide('googleyhats.BowlerHat');

		foo.require('foo.hats');

		/**
 		* @constructor
 		* @extend {foo.hats.RoundHat}
 		*/
		googleyhats.BowlerHat = function() {
  			...
		};

		goog.exportSymbol('foo.hats.BowlerHat', googleyhats.BowlerHat);

- 重命名那些名字很长的变量, 提高可读性

	主要是为了提高可读性. 局部空间中的变量别名只需要取原名字的最后部分.

		/**
 		* @constructor
 		*/
		some.long.namespace.MyClass = function() {
		};

		/**
 		* @param {some.long.namespace.MyClass} a
 		*/
		some.long.namespace.MyClass.staticHelper = function(a) {
  			...
		};

		myapp.main = function() {
  			var MyClass = some.long.namespace.MyClass;
  			var staticHelper = some.long.namespace.MyClass.staticHelper;
  			staticHelper(new MyClass());
		};

	不要对命名空间创建别名.

		myapp.main = function() {
  			var namespace = some.long.namespace;
  			namespace.MyClass.staticHelper(new namespace.MyClass());
		};

	除非是枚举类型, 不然不要访问别名变量的属性.

		//right
		/** @enum {string} */
		some.long.namespace.Fruit = {
  			APPLE: 'a',
  			BANANA: 'b'
		};

		myapp.main = function() {
  			var Fruit = some.long.namespace.Fruit;
  			switch (fruit) {
    			case Fruit.APPLE:
      			...
    			case Fruit.BANANA:
      			...
  			}
		};

		//wrong
		myapp.main = function() {
  			var MyClass = some.long.namespace.MyClass;
  			MyClass.staticHelper(null);
		};

		不要在全局范围内创建别名, 而仅在函数块作用域中使用.
		
- 文件名

	文件名应该使用小写字符, 以避免在有些系统平台上不识别大小写的命名方式. 文件名以.js结尾, 不要包含除 - 和 _ 外的标点符号(使用 - 优于 _).

**自定义 toString() 方法**

应该总是成功调用且不要抛异常.



> 可自定义 toString() 方法, 但确保你的实现方法满足: (1) 总是成功 (2) 没有其他负面影响. 如果不满足这两个条件, 那么可能会导致严重的问题, 比如, 如果 toString() 调用了包含 assert 的函数, assert 输出导致失败的对象, 这在 toString() 也会被调用.

**延迟初始化**

可以



> 没必要在每次声明变量时就将其初始化.

**明确作用域**

任何时候都需要

> 任何时候都要明确作用域 - 提高可移植性和清晰度. 例如, 不要依赖于作用域链中的 window 对象. 可能在其他应用中, 你函数中的 window 不是指之前的那个窗口对象.

**代码格式化**

主要依照C++ 格式规范 ( [中文版](http://zh-google-styleguide.readthedocs.org/en/latest/google-cpp-styleguide/) ), 针对 JavaScript, 还有下面一些附加说明.

*大括号*

分号会被隐式插入到代码中, 所以你务必在同一行上插入大括号. 例如:

	if (something) {
  		// ...
	} else {
  		// ...
	}

*数组和对象的初始化*

如果初始值不是很长, 就保持写在单行上:

	var arr = [1, 2, 3];  // No space after [ or before ].
	var obj = {a: 1, b: 2, c: 3};  // No space after { or before }.

初始值占用多行时, 缩进2个空格.

	// Object initializer.
	var inset = {
  	  top: 10,
  	  right: 20,
  	  bottom: 15,
  	  left: 12
	};

	// Array initializer.
	this.rows_ = [
  	  '"Slartibartfast" <fjordmaster@magrathea.com>',
  	  '"Zaphod Beeblebrox" <theprez@universe.gov>',
  	  '"Ford Prefect" <ford@theguide.com>',
  	  '"Arthur Dent" <has.no.tea@gmail.com>',
  	  '"Marvin the Paranoid Android" <marv@googlemail.com>',
  	  'the.mice@magrathea.com'
	];

	// Used in a method call.
	goog.dom.createDom(goog.dom.TagName.DIV, {
  	  id: 'foo',
      className: 'some-css-class',
      style: 'display:none'
	}, 'Hello, world!');

比较长的标识符或者数值, 不要为了让代码好看些而手工对齐. 如:

	CORRECT_Object.prototype = {
  	  a: 0,
  	  b: 1,
  	  lengthyName: 2
	};

不要这样做:

	WRONG_Object.prototype = {
  	  a          : 0,
  	  b          : 1,
  	  lengthyName: 2
	};

*函数参数*

尽量让函数参数在同一行上. 如果一行超过 80 字符, 每个参数独占一行, 并以4个空格缩进, 或者与括号对齐, 以提高可读性. 尽可能不要让每行超过80个字符. 比如下面这样:

	// Four-space, wrap at 80.  Works with very long function names, survives
	// renaming without reindenting, low on space.
	goog.foo.bar.doThingThatIsVeryDifficultToExplain = function(
    	veryDescriptiveArgumentNumberOne,veryDescriptiveArgumentTwo,
    	tableModelEventHandlerProxy, artichokeDescriptorAdapterIterator) {
  			// ...
	};

	// Four-space, one argument per line.  Works with long function names,
	// survives renaming, and emphasizes each argument.
	goog.foo.bar.doThingThatIsVeryDifficultToExplain = function(
    	veryDescriptiveArgumentNumberOne,
    	veryDescriptiveArgumentTwo,
    	tableModelEventHandlerProxy,
    	artichokeDescriptorAdapterIterator) {
  			// ...
	};

	// Parenthesis-aligned indentation, wrap at 80.  Visually groups arguments,
	// low on space.
	function foo(veryDescriptiveArgumentNumberOne, veryDescriptiveArgumentTwo,
             tableModelEventHandlerProxy, artichokeDescriptorAdapterIterator) {
  		// ...
	}

	// Parenthesis-aligned, one argument per line.  Visually groups and
	// emphasizes each individual argument.
	function bar(veryDescriptiveArgumentNumberOne,
             veryDescriptiveArgumentTwo,
             tableModelEventHandlerProxy,
             artichokeDescriptorAdapterIterator) {
  		// ...
	}

*传递匿名函数*

如果参数中有匿名函数, 函数体从调用该函数的左边开始缩进2个空格, 而不是从 function 这个关键字开始. 这让匿名函数更加易读 (不要增加很多没必要的缩进让函数体显示在屏幕的右侧).

	var names = items.map(function(item) {
                        return item.name;
                      });

	prefix.something.reallyLongFunctionName('whatever', function(a1, a2) {
  		if (a1.equals(a2)) {
    		someOtherLongFunctionName(a1);
  		} else {
    		andNowForSomethingCompletelyDifferent(a2.parrot);
  		}
	});

*更多的缩进*

事实上, 除了 初始化数组和对象 , 和传递匿名函数外, 所有被拆开的多行文本要么选择与之前的表达式左对齐, 要么以4个(而不是2个)空格作为一缩进层次.

	someWonderfulHtml = '' +
                    getEvenMoreHtml(someReallyInterestingValues, moreValues,
                                    evenMoreParams, 'a duck', true, 72,
                                    slightlyMoreMonkeys(0xfff)) +
                    '';

	thisIsAVeryLongVariableName =
    hereIsAnEvenLongerOtherFunctionNameThatWillNotFitOnPrevLine();

	thisIsAVeryLongVariableName = 'expressionPartOne' + someMethodThatIsLong() +
    	thisIsAnEvenLongerOtherFunctionNameThatCannotBeIndentedMore();

	someValue = this.foo(
    	shortArg,
    	'Some really long string arg - this is a pretty common case, actually.',
    	shorty2,
    	this.bar());

	if (searchableCollection(allYourStuff).contains(theStuffYouWant) &&
    !ambientNotification.isActive() && (client.isAmbientSupported() ||
                                        client.alwaysTryAmbientAnyways()) {
  		ambientNotification.activate();
	}

*空行*

使用空行来划分一组逻辑上相关联的代码片段.

	doSomethingTo(x);
	doSomethingElseTo(x);
	andThen(x);

	nowDoSomethingWith(y);

	andNowWith(z);

*二元和三元操作符*

操作符始终跟随着前行, 这样就不用顾虑分号的隐式插入问题. 如果一行实在放不下, 还是按照上述的缩进风格来换行.

	var x = a ? b : c;  // All on one line if it will fit.

	// Indentation +4 is OK.
	var y = a ?
    	longButSimpleOperandB : longButSimpleOperandC;

	// Indenting to the line position of the first operand is also OK.
	var z = a ?
        	moreComplicatedB :
        	moreComplicatedC;

**括号**

只在需要的时候使用

不要滥用括号, 只在必要的时候使用它.

对于一元操作符(如delete, typeof 和 void ), 或是在某些关键词(如 return, throw, case, new )之后, 不要使用括号.

**字符串**

使用 ' 优于 "

单引号 (') 优于双引号 ("). 当你创建一个包含 HTML 代码的字符串时就知道它的好处了.

	var msg = 'This is some HTML';

**可见性 (私有域和保护域)**

推荐使用 JSDoc 中的两个标记: @private 和 @protected

JSDoc 的两个标记 @private 和 @protected 用来指明类, 函数, 属性的可见性域.

标记为 @private 的全局变量和函数, 表示它们只能在当前文件中访问.

标记为 @private 的构造器, 表示该类只能在当前文件或是其静态/普通成员中实例化; 私有构造器的公共静态属性在当前文件的任何地方都可访问, 通过 instanceof 操作符也可.

永远不要为 全局变量, 函数, 构造器加 @protected 标记.

	// File 1.
	// AA_PrivateClass_ and AA_init_ are accessible because they are global
	// and in the same file.

	/**
 	* @private
 	* @constructor
 	*/
	AA_PrivateClass_ = function() {
	};

	/** @private */
	function AA_init_() {
  		return new AA_PrivateClass_();
	}

	AA_init_();

标记为 @private 的属性, 在当前文件中可访问它; 如果是类属性私有, "拥有"该属性的类的所有静态/普通成员也可访问, 但它们不能被不同文件中的子类访问或覆盖.

标记为 @protected 的属性, 在当前文件中可访问它, 如果是类属性保护, 那么"拥有"该属性的类及其子类中的所有静态/普通成员也可访问.

> 注意: 这与 C++, Java 中的私有和保护不同, 它们是在当前文件中, 检查是否具有访问私有/保护属性的权限, 有权限即可访问, 而不是只能在同一个类或类层次上. 而 C++ 中的私有属性不能被子类覆盖. (C++/Java 中的私有/保护是指作用域上的可访问性, 在可访问性上的限制. JS 中是在限制在作用域上. PS: 可见性是与作用域对应)

	// File 1.

	/** @constructor */
  	AA_PublicClass = function() {
	};

	/** @private */
	AA_PublicClass.staticPrivateProp_ = 1;

	/** @private */
	AA_PublicClass.prototype.privateProp_ = 2;

	/** @protected */
	AA_PublicClass.staticProtectedProp = 31;

	/** @protected */
	AA_PublicClass.prototype.protectedProp = 4;

	// File 2.

	/**
 	* @return {number} The number of ducks we've arranged in a row.
 	*/
	AA_PublicClass.prototype.method = function() {
  		// Legal accesses of these two properties.
  		return this.privateProp_ + AA_PublicClass.staticPrivateProp_;
	};

	// File 3.

	/**
 	* @constructor
 	* @extends {AA_PublicClass}
 	*/
	AA_SubClass = function() {
  		// Legal access of a protected static property.
  		AA_PublicClass.staticProtectedProp = this.method();
	};
	goog.inherits(AA_SubClass, AA_PublicClass);

	/**
 	* @return {number} The number of ducks we've arranged in a row.
 	*/
	AA_SubClass.prototype.method = function() {
  		// Legal access of a protected instance property.
  		return this.protectedProp;
	};

**JavaScript 类型**

强烈建议你去使用编译器.

如果使用 JSDoc, 那么尽量具体地, 准确地根据它的规则来书写类型说明. 目前支持两种 [JS2](http://wiki.ecmascript.org/doku.php?id=spec:spec) 和 JS1.x 类型规范.

*JavaScript 类型语言*

JS2 提议中包含了一种描述 JavaScript 类型的规范语法, 这里我们在 JSDoc 中采用其来描述函数参数和返回值的类型.

JSDoc 的类型语言, 按照 JS2 规范, 也进行了适当改变, 但编译器仍然支持旧语法.

![Javascript类型语言](http://blog.u.qiniudn.com/uploads/javascript1.jpg)

*JavaScript中的类型*

![Javascript中的类型](http://blog.u.qiniudn.com/uploads/javascript2.jpg)
![Javascript中的类型](http://blog.u.qiniudn.com/uploads/javascript3.jpg)

*可空 vs. 可选 参数和属性*

JavaScript 是一种弱类型语言, 明白可选, 非空和未定义参数或属性之间的细微差别还是很重要的.

对象类型(引用类型)默认非空. 注意: 函数类型默认不能为空. 除了字符串, 整型, 布尔, undefined 和 null 外, 对象可以是任何类型.

	/**
 	* Some class, initialized with a value.
 	* @param {Object} value Some value.
 	* @constructor
 	*/
	function MyClass(value) {
  		/**
   		* Some value.
   		* @type {Object}
   		* @private
   		*/
  		this.myValue_ = value;
	}

告诉编译器 myValue_ 属性为一对象或 null. 如果 myValue_ 永远都不会为 null, 就应该如下声明:

	/**
 	* Some class, initialized with a non-null value.
 	* @param {!Object} value Some value.
 	* @constructor
 	*/
	function MyClass(value) {
  		/**
   		* Some value.
   		* @type {!Object}
   		* @private
   		*/
 	 	this.myValue_ = value;
	}

这样, 当编译器在代码中碰到 MyClass 为 null 时, 就会给出警告.

函数的可选参数可能在运行时没有定义, 所以如果他们又被赋给类属性, 需要声明成:

	/**
 	* Some class, initialized with an optional value.
 	* @param {Object=} opt_value Some value (optional).
 	* @constructor
 	*/
	function MyClass(opt_value) {
  		/**
   		* Some value.
   		* @type {Object|undefined}
   		* @private
   		*/
  		this.myValue_ = opt_value;
	}

这告诉编译器 myValue_ 可能是一个对象, 或 null, 或 undefined.

> 注意: 可选参数 opt_value 被声明成 {Object=}, 而不是 {Object|undefined}. 这是因为可选参数可能是 undefined. 虽然直接写 undefined 也并无害处, 但鉴于可阅读性还是写成上述的样子.

最后, 属性的非空和可选并不矛盾, 属性既可是非空, 也可是可选的. 下面的四种声明各不相同:

	/**
 	* Takes four arguments, two of which are nullable, and two of which are
 	* optional.
 	* @param {!Object} nonNull Mandatory (must not be undefined), must not be null.
 	* @param {Object} mayBeNull Mandatory (must not be undefined), may be null.
 	* @param {!Object=} opt_nonNull Optional (may be undefined), but if present,
 	*     must not be null!
 	* @param {Object=} opt_mayBeNull Optional (may be undefined), may be null.
 	*/
	function strangeButTrue(nonNull, mayBeNull, opt_nonNull, opt_mayBeNull) {
  		// ...
	};

**注释**

使用 JSDoc

我们使用 JSDoc 中的注释风格. 行内注释使用 // 变量 的形式. 另外, 我们也遵循 C++ 代码注释风格 . 这也就是说你需要:

- 版权和著作权的信息,
- 文件注释中应该写明该文件的基本信息(如, 这段代码的功能摘要, 如何使用, 与哪些东西相关), 来告诉那些不熟悉代码的读者.
- 类, 函数, 变量和必要的注释,
- 期望在哪些浏览器中执行,
- 正确的大小写, 标点和拼写.

为了避免出现句子片段, 请以合适的大/小写单词开头, 并以合适的标点符号结束这个句子.

现在假设维护这段代码的是一位初学者. 这可能正好是这样的!

目前很多编译器可从 JSDoc 中提取类型信息, 来对代码进行验证, 删除和压缩. 因此, 你很有必要去熟悉正确完整的 JSDoc .

*JSDoc 标记表*

![JSDoc标记表](http://blog.u.qiniudn.com/uploads/javascript4.jpg)
![JSDoc标记表](http://blog.u.qiniudn.com/uploads/javascript5.jpg)
![JSDoc标记表](http://blog.u.qiniudn.com/uploads/javascript6.jpg)
![JSDoc标记表](http://blog.u.qiniudn.com/uploads/javascript7.jpg)
![JSDoc标记表](http://blog.u.qiniudn.com/uploads/javascript8.jpg)
![JSDoc标记表](http://blog.u.qiniudn.com/uploads/javascript9.jpg)
![JSDoc标记表](http://blog.u.qiniudn.com/uploads/javascript10.jpg)
![JSDoc标记表](http://blog.u.qiniudn.com/uploads/javascript11.jpg)
![JSDoc标记表](http://blog.u.qiniudn.com/uploads/javascript12.jpg)

在第三方代码中, 你还会见到其他一些 JSDoc 标记. 这些标记在 JSDoc Toolkit Tag Reference 都有介绍到, 但在 Google 的代码中, 目前不推荐使用. 你可以认为这些是将来会用到的 "保留" 名. 它们包含:

- @augments
- @argument
- @borrows
- @class
- @constant
- @constructs
- @default
- @event
- @example
- @field
- @function
- @ignore
- @inner
- @link
- @memberOf
- @name
- @namespace
- @property
- @public
- @requires
- @returns
- @since
- @static
- @version

*JSDoc 中的 HTML*

类似于 JavaDoc, JSDoc 支持许多 HTML 标签, 如`<code>, <pre>, <tt>, <strong>, <ul>, <ol>, <li>, <a>`, 等等.

这就是说 JSDoc 不会完全依照纯文本中书写的格式. 所以, 不要在 JSDoc 中, 使用空白字符来做格式化:

	/**
 	* Computes weight based on three factors:
 	*   items sent
 	*   items received
 	*   last timestamp
 	*/

上面的注释, 出来的结果是:

Computes weight based on three factors: items sent items received items received

应该这样写:

	/**
 	* Computes weight based on three factors:
 	* <ul>
 	* <li>items sent
 	* <li>items received
 	* <li>last timestamp
 	* </ul>
 	*/

另外, 也不要包含任何 HTML 或类 HTML 标签, 除非你就想让它们解析成 HTML 标签.

	/**
 	* Changes <b> tags to <span> tags.
 	*/

出来的结果是:

Changes tags to tags.

另外, 也应该在源代码文件中让其他人更可读, 所以不要过于使用 HTML 标签:
	
	/**
 	* Changes &lt;b&gt; tags to &lt;span&gt; tags.
 	*/

上面的代码中, 其他人就很难知道你想干嘛, 直接改成下面的样子就清楚多了:

	/**
	* Changes 'b' tags to 'span' tags.
	*/

**编译**

推荐使用

建议您去使用 JS 编译器, 如 [Closure Compiler](https://developers.google.com/closure/compiler/).

**Tips and Tricks**

JavaScript 小技巧

*True 和 False 布尔表达式*

下面的布尔表达式都返回 false:

- null
- undefined
- '' 空字符串
- 0 数字0

但小心下面的, 可都返回 true:

- '0' 字符串0
- [] 空数组
- {} 空对象

下面段比较糟糕的代码:

	while (x != null) {

你可以直接写成下面的形式(只要你希望 x 不是 0 和空字符串, 和 false):

	while (x) {

如果你想检查字符串是否为 null 或空:

	if (y != null && y != '') {

但这样会更好:

	if (y) {

注意: 还有很多需要注意的地方, 如:

- Boolean('0') == true
- '0' != true
- 0 != null
- 0 == []
- 0 == false
- Boolean(null) == false
- null != true
- null != false
- Boolean(undefined) == false
- undefined != true
- undefined != false
- Boolean([]) == true
- [] != true
- [] == false
- Boolean({}) == true
- {} != true
- {} != false

*条件(三元)操作符 (?:)*

三元操作符用于替代下面的代码:

	if (val != 0) {
  		return foo();
	} else {
  		return bar();
	}

你可以写成:

	return val ? foo() : bar();

在生成 HTML 代码时也是很有用的:

	var html = '<input type="checkbox"' +
    	(isChecked ? ' checked' : '') +
    	(isEnabled ? '' : ' disabled') +
    	' name="foo">';

*&& 和 ||*

二元布尔操作符是可短路的, 只有在必要时才会计算到最后一项.

"||" 被称作为 'default' 操作符, 因为可以这样:

	/** @param {*=} opt_win */
	function foo(opt_win) {
  		var win;
  		if (opt_win) {
    		win = opt_win;
  		} else {
    		win = window;
  		}
  		// ...
	}

你可以使用它来简化上面的代码:

	/** @param {*=} opt_win */
	function foo(opt_win) {
  		var win = opt_win || window;
  		// ...
	}

"&&" 也可简短代码.比如:

	if (node) {
  		if (node.kids) {
    		if (node.kids[index]) {
      			foo(node.kids[index]);
    		}
  		}
	}

你可以像这样来使用:

	var kid = node && node.kids && node.kids[index];
	if (kid) {
  		foo(kid);
	}

不过这样就有点儿过头了:

	node && node.kids && node.kids[index] && foo(node.kids[index]);

*使用 join() 来创建字符串*

通常是这样使用的:

	function listHtml(items) {
  		var html = '<div class="foo">';
  		for (var i = 0; i < items.length; ++i) {
    		if (i > 0) {
      			html += ', ';
    		}
    		html += itemHtml(items[i]);
  		}
  		html += '</div>';
  		return html;
	}

但这样在 IE 下非常慢, 可以用下面的方式:

	function listHtml(items) {
  		var html = [];
  		for (var i = 0; i < items.length; ++i) {
    		html[i] = itemHtml(items[i]);
  		}
  		return '<div class="foo">' + html.join(', ') + '</div>';
	}

你也可以是用数组作为字符串构造器, 然后通过 myArray.join('') 转换成字符串. 不过由于赋值操作快于数组的 push(), 所以尽量使用赋值操作.

*遍历 Node List*

Node lists 是通过给节点迭代器加一个过滤器来实现的. 这表示获取他的属性, 如 length 的时间复杂度为 O(n), 通过 length 来遍历整个列表需要 O(n^2).

	var paragraphs = document.getElementsByTagName('p');
	for (var i = 0; i < paragraphs.length; i++) {
  		doSomething(paragraphs[i]);
	}

这样做会更好:

	var paragraphs = document.getElementsByTagName('p');
	for (var i = 0, paragraph; paragraph = paragraphs[i]; i++) {
  		doSomething(paragraph);
	}

这种方法对所有的 collections 和数组(只要数组不包含 falsy 值) 都适用.

在上面的例子中, 也可以通过 firstChild 和 nextSibling 来遍历孩子节点.

	var parentNode = document.getElementById('foo');
	for (var child = parentNode.firstChild; child; child = child.nextSibling) {
  		doSomething(child);
	}

**Parting Words**

保持一致性.

当你在编辑代码之前, 先花一些时间查看一下现有代码的风格. 如果他们给算术运算符添加了空格, 你也应该添加. 如果他们的注释使用一个个星号盒子, 那么也请你使用这种方式.

代码风格中一个关键点是整理一份常用词汇表, 开发者认同它并且遵循, 这样在代码中就能统一表述. 我们在这提出了一些全局上的风格规则, 但也要考虑自身情况形成自己的代码风格. 但如果你添加的代码和现有的代码有很大的区别, 这就让阅读者感到很不和谐. 所以, 避免这种情况的发生.


修订版 2.9


