title: javascript的一点东东
date: 2014/8/19 21:43:14 
tags: javascript
categories: technology
---

昨晚在某群看到有人出了一道题，感觉挺有意思。然后便想着结合最近自己看到的一些关于js的东东，整理出一篇文章来。


<!-- more -->

首先说下题目吧：

要求实现函数`add(2)(4)...`，add函数可以后面接n个括号，然后函数返回这些传参的和，要考虑扩展性。

先来看一个不那么靠谱的：

```javascript
var add = function(x){
	return function(y){
		return function(z){
			return x+y+z;
		};
	};
};

add(3)(2)(2); //7
```

这样的实现只能计算3个数字的和，而题目要求是n个呢？怎么办？循环吗？怎么循环？

**arguments.callee**

聪明的同学此时可能会相到函数*自调用*。

先来看个栗子：

```javascript
function factorial(n){
	return !(n > 1) ? 1 : arguments.callee(n - 1) * n;
}

factorial(3)  //6  返回3的阶乘
```

> `arguments.callee`：指向当前正在执行的函数
> `arguments.caller`：指向调用当前正在执行的函数的函数,请使用arguments.callee.caller代替

看到这里你是不是觉得信心满满了呢？其实如果只是到这里你可能还是不知道该怎么做。没关系，先一起来看看别人的代码吧。

```javascript
function add(x){
	var callee = arguments.callee;
	callee.val = (callee.val || 0) + x;
	callee.toString = function(){
		return this.val;
	}
	return callee;
}

add(3)(4)(3)(5)   //15
add(1)(3)  //4
```

哈哈，是不是就这样实现了呢？

到这里是不是就很完美了呢？但是有些同学可能会说`arguments.callee`在严格模式下不能使用的呢？ok,那我们就继续来修改一下吧。

**闭包**

```javascript
function add(x){
	var sum = x;
  	var tmp = function(y) {
        sum = sum + y;
        return tmp;
  	};
  	tmp.toString =function(){
        return sum;
 	};
  	return tmp;
}

add(3)(4)(3)(5)   //15
add(1)(3)  //4
```

**toString**

接着看看关于toString的东东，试试返回值是什么呢?

```javascript
10.toString.length
10['toString'].length
10 .toString()
10..toString()
```

**函数声明与变量声明**

再来看看函数声明与变量声明

```javascript
// a的值？
(function a () {
		return 2;
	}
	var a;
	console.log(a);
)(window); // => function a() { return 2; }

(function(){
	a = function() { return 1; };
	function a () {
    	return 2;
	}
	var a;
	return a;
})(window);  // => function () { return 1; }
```

弄清楚上面的问题，要理解清楚函数声明提升和变量提升。来说说js的运行机制：

1. 读入第一个代码段（js执行引擎并非一行一行地执行程序，而是一段一段地分析执行的）
2. 做语法分析，有错则报语法错误（比如括号不匹配等），并跳转到6
3. 对函数声明（FunctionDeclaration，也就是 funcion fname(args){code}）做“预解析”（永远不会报错的，因为只解析正确的声明）
4. 对变量声明（用var声明的）做“预解析”，如果此时function是作为一个变量，整个声明语句是一个表达式（FunctionExpresion）。这是因为处理变量声明仅仅是标记了这个变量名，而不执行表达式。也就是说在代码开始运行之前，变量声明的是一个变量了（它的值当然是undefined),而要等代码运行到的时候才执行
5. 执行代码段，有错则报错（比如变量未定义）
6. 如果还有下一个代码段，则读入下一个代码段，重复2
7. 结束


**通过字符串来创建DOM节点**

在当前页面中新增了一个div元素。使用jquery，这个只需要一行代码就搞定了：
	
```javascript
var test = $('<div>Test</div>');

$('body').append(test);
```

如果不用jquery呢？

```javascript
function toDom(str) {
	var temp = document.createElement('div');
	temp.innerHTML = str;
	return temp.childNodes[0];
}

var test = toDom('<div>Test</div>');
document.querySelector('body').appendChild(test);
```

我们定义了一个自己的工具方法toDom，这个方法做了如下事情：首先创建一个临时div元素，然后设定它的innerTHML属性，然后返回该DIV元素的第一个节点。然而下面的代码会获得不同的结果：

```javascript
var tableRow = $('<tr><td>Simple text</td></tr>');
$('body').append(tableRow);

var tableRow = toDom('<tr><td>Simple text</td></tr>');
document.querySelector('body').appendChild(tableRow);
```

从这个页面的表面上看，没有什么不同。但是我们通过chrome的开发工具查看生成的HTML标记的话，会得到一个有趣的结果，创建了一个文本元素。

貌似我们的toDom 只创建了一个文本节点而不是tr标签。但是jquery却不知何故可以正常运行。问题的原因是在浏览器端是通过解析器来解析含有HTML元素的字符串的。解析器会忽略掉那些放错上下文位置的标记，因此我们只获得了文本节点。row标签没有包含在正确的table标签中，这对浏览器的解析器来说就是不合法的。

jquery通过创建正确的上下文后然后做些转换，可以成功的解决这个问题。如果我们深入到源码中可以看到下面的一个映射：

```javascript
var wrapMap = {
	option: [1, '<select multiple="multiple">', '</select>'],
	legend: [1, '<fieldset>', '</fieldset>'],
	area: [1, '<map>', '</map>'],
	param: [1, '<object>', '</object>'],
	thead: [1, '<table>', '</table>'],
	tr: [2, '<table><tbody>', '</tbody></table>'],
	col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
	td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
	_default: [1, '<div>', '</div>']
};
wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;
```

任何一个需要特殊处理的元素都对应到一个数组中，目的就是为了构建一个正确的DOM节点。例如，对于tr元素，我们要创建一个带有tbody的table中，需要包裹两层。

虽然有了map，但是我们还是得先去查找到字符串中的结束标签是啥。下面的代码可以从`<tr><td>Simple text</td></tr>`抽取出tr标签。

```javascript
var match = /<\s*\w.*?>/g.exec(str);
var tag = match[0].replace(/</g, '').replace(/>/g, '');
```

剩下来要做的就是找到属性上下文，然后返回DOM元素。下面是toDom方法的最终版本：

```javascript
function toDom(str) {
	var wrapMap = {
		option: [1, '<select multiple="multiple">', '</select>'],
		legend: [1, '<fieldset>', '</fieldset>'],
		area: [1, '<map>', '</map>'],
		param: [1, '<object>', '</object>'],
		thead: [1, '<table>', '</table>'],
		tr: [2, '<table><tbody>', '</tbody></table>'],
		col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
		td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
		_default: [1, '<div>', '</div>']
	};
	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	var element = document.createElement('div');
	var match = /<\s*\w.*?>/g.exec(str);

	if(match != null) {
		var tag = match[0].replace(/</g, '').replace(/>/g, '');
		var map = wrapMap[tag] || wrapMap._default, element;
		str = map[1] + str + map[2];
		element.innerHTML = str;
		// Descend through wrappers to the right content
		var j = map[0]+1;
		while(j--) {
			element = element.lastChild;
		}
	} else {
		// if only text is passed
		element.innerHTML = str;
		element = element.lastChild;
	}
	return element;
}
```

注意下，我们有个判断 match != null条件用于判断string中是否有tag标签，如果没有我们只是简单的返回文本节点。这里我们传入了正确的标签，所以浏览器能够创建一个正常的DOM节点了。在代码的最后部分可以看到，通过使用一个while循环，我们一直深入到我们想要的那个tag节点后返回给了调用者。

**计算属性**

计算属性非常有趣。计算属性就是用一个函数来充当属性,让我们来看下一个简单例子：

```javascript
var User = {
	firstName: 'John',
	lastName: 'Bukas',
	name: function() {
		// getter + setter
	}
};
```

我们想要实现调用的效果如下：

```javascript
console.log(User.name); // John Bukas
User.name = 'John Dony';
console.log(User.firstName); // John
console.log(User.lastName); // Dony
console.log(User.name); // John Dony
```

**Object.defineProperty**

JS值有个内置的特性可以帮助我们实现我们的想法。接着看下面的代码：

```javascript
var User = {
	firstName: 'John',
	lastName: 'Bukas'
};
Object.defineProperty(User, "name", {
	get: function() { 
		return this.firstName + ' ' + this.lastName;
	},
	set: function(value) { 
		var parts = value.toString().split(/ /);
		this.firstName = parts[0];
		this.lastName = parts[1] ? parts[1] : this.lastName;
	}
});
```

`Object.defineProperty`方法接受一个上下文、属性名称以及get/set方法。我们要做的就是实现里面的两个方法，仅此而已。我们将运行上面的代码并且能够获得到期望的结果。

`Object.defineProperty`确实是我们需要的，但是我们不想强制每个开发者每次都重写这个方法。我们只需要一个定义类的方法，在这里，我们会写一个使用函数Computize用来把对象中的函数中传递的名称转换成对象中属性的名称。我们想使用set来设定名称，同时使用get来获取名称。我们先在函数的原型中增加我们的逻辑代码：

```javascript
Function.prototype.computed = function() {
	return { computed: true, func: this };
};
```

一旦我们增加了上面的代码，我们就会为每个函数增加了一个`.computed()`方法了。

```javascript
name: function() {
	...
}.computed()
```

结果就是name属性不在是函数了，而是一个拥有computed为true的属性和一个func属性的对象。真正的魔法发生在自定义辅助方法的实现上，它贯穿于整个对象的属性上。我们会在计算属性上使用`Object.defineProperty`：

```javascript
var Computize = function(obj) {
	for(var prop in obj) {
		if(typeof obj[prop] == 'object' && obj[prop].computed === true) {
			var func = obj[prop].func;
			delete obj[prop];
			Object.defineProperty(obj, prop, {
				get: func,
				set: func
			});
		}
	}
	return obj;
}
```

注意我们删除了原生的属性名称。在一些浏览器中`Object.defineProperty`只运行于还没有存在的属性上。

下面是一个使用`.computed()`方法最终版本的User对象。

```javascript
var User = Computize({
  firstName: 'John',
  lastName: 'Bukas',
  name: function() {
    if(arguments.length > 0) {
      var parts = arguments[0].toString().split(/ /);
      this.firstName = parts[0];
      this.lastName = parts[1] ? parts[1] : this.lastName;
    }
    return this.firstName + ' ' + this.lastName;
  }.computed()
});
```

在这个返回全名的函数中可以观察到firstName和lastName的变化。在这里判断是否判断了参数，如果传了参数则把他们分设到firstName和lastName中。












	
	








