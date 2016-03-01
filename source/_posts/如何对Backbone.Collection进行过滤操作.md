title: 如何对Backbone.Collection进行过滤操作
date: 2014-09-14 16:17:18
tags: backbone
categories: technology
---

首先我想说的是这篇文章的题目起的很怪，因为我不知道起个什么名字比较好。渲染列表是我们应用中最常见的操作了吧，在运用Backbone的应用中，我们一般会把列表作为一个Collcetion，然后指定一个View去显示这个Collection，很方便。但当你需要对一个集合进行过滤操作，只显示Collection中符合条件的那部分呢？


<!-- more -->


渲染一个内存中存在的Collection毫无疑问很简单，因为Backbone提供了一些操作的方法。但是当对一个Collection进行过滤操作之后，渲染过滤之后的结果你就会遇到一些意想不到的困难。本文将会寻找简单的代码来解决这个问题。

**基本的过滤操作**

Backbone.Collection有一些方法来实现过滤和搜索。其中大多数都是继承自Underscore.js，但有些不是。然而不管它们从哪里来，大部分的这些方法都有一个共同点：返回Collection中的**Models数组**。

例如`where`方法，当调用这个方法的时候会返回具有你指定的属性值的Model数组。

```javascript
	var testCollection = new Backbone.Collection([
		{name: "joy", age: 21},
		{name: "jack", age: 20},
		{name: "pater", age: 32},
		{name: "daivd", age: 22},
		{name: "gina", age: 21}
	]);

	var results = testCollection.where({
		age : 21
	});
```


`results`将会是一个数组，里面有所有`{age: 21}`的`model`，我们在`console`里面看一下：

![](http://ww4.sinaimg.cn/mw690/8b30c2fbgw1ekc42yiskyj20f40bf3zc.jpg)

**通过视图控制过滤**

显示过滤列表是相当容易的。唯一的问题是过滤操作之后返回的并不是一个Collection，而是一个Model数组。这往往会大吃一惊，捉鸡啊。怎么处理这个数组呢？如何让一个Backbone.View显示它呢？此外，当你需要显示这个过滤操作之后的数组的View已经指向了一个原始的Backbone.Collection的时候会让这个问题变得更加棘手。

你可能会说，这很容易啊，来看看下面的操作：

```javascript
	var FilteredView = Backbone.View.extend({

		events: {
			"click #run": "runFilter"
		},

		runFilter: function(e){
			e.preventDefault();

			this.filter = {
				// ... get the filter info from the DOM
			};

			this.render();
		},

		render: function(){
			var html = [],
				template = _.template($("tmpl-demo").html());

 
			var filteredList = this.collection.where(this.filter);

    		_.each(filteredList, function(item){
      			html.push(template(item.toJSON());
    		});

    
    		this.$el.html(html);

    		return this;
		}  
	});
```


在一定程度上看起来都不错。代码很短，很容易理解，也解决了问题。

但是上面的代码只符合一些简单的场景，如果你正在处理简单的情况，可能这样没有做错什么。但有存在潜伏的缺陷，当你继续需要使用过滤操作的时候，你会发现上面的代码之后没发进行进一步的过滤操作了。

怎么解决这个问题呢？让我们回到原点，我们可以对Backbone.Collection进行各种过滤操作，对，你是不是想到了什么呢？所以我们要让过滤操作之后返回的不是一个数组，而是一个Backbone.Collection对象。但是怎么实现呢？

**自过滤反模式**

如果你试图在原有Collection的基础上进行过滤之后再更新这个Collection，你最终会步入糟糕的境地，甚至比在View里面进行过滤操作更糟糕。

不过，还是来看看如何实现上面这种方式吧：
	
```javascript
    var testCollection = Backbone.Collection.extend({
		customFilter: function(filters){
    		var results = this.where(filters);
    		this.reset(results);
		}
	});
	
	var testCollection = new Backbone.Collection([
		{name: "joy", age: 21},
		{name: "jack", age: 20},
		{name: "pater", age: 32},
		{name: "daivd", age: 22},
		{name: "gina", age: 21}
	]);

	// filter the collection
	testCollection.customFiler({
		age : 21
	});
```

一旦你通过自定义方法过滤Collection，Collection中便只有两个符合条件的项。这似乎是理想的结果，如果你想使用一个新的过滤器，它将只会在上次的结果中进行进一步的过滤，因为之前的Collection已经被更新了，这在大多数时候并不是我们想要的结果。

**创建过滤后的Collection**

如果你想用Backbone.Collection处理过滤的数组，你必须将数组转变成Backbone.Collection。这会出现两个Collection：原始的Collection和过滤之后的Collection，当你有了有了过滤后的Collection后，你就可以使用 Backbone.View来直接渲染了。

```javascript
	var results = testCollection.where({
		age: 21
	});

	var filteredCollection = new Backbone.Collection(results);
```

是的，就是这么简单。很欢乐吧，但还是可以变得更加方便。

**返回同种Collection**

你可能想从自定义Backbone.Collection返回从一个过滤后的同类型的一个实例。

```javascript
	var testCollection = Backbone.Collection.extend({

		customFilter: function(filters){
    		var results = this.where(filters);
    		return new testCollection(results);
		}

	});


	var filteredCollection = testCollection.customFilter({
		age: 21
	});
```

**更新过滤操作**

当过滤条件改变的时候，你需要更新Collection，重新渲染。最好的操作方式是只实例化一个过滤后的Collection，当这个Collection改变的时候渲染对应的`filterView`。

```javascript
	var FilteredView = Backbone.View.extend({
		initialize: function(){
			this.listenTo(this.collection, "reset", this.render, this);
		} 
	});

	var filteredCollection = new Backbone.Collection();
	var filteredView = new FilteredView({
		collection: filteredCollection
	});

	$("#run").click(function(e){
		var filter = {
    		// ...  new filters
		};
		var results = myCollection.where(filter);

		filteredCollection.reset(results);
	});
```

**Addition**

加一点underscore的东西。

underscore的`invoke`方法是个很好用的方法，来看个栗子：

```javascript
	var demoCollection = Backbone.Collection.extend({
        model: demoModel,
        selected : function() {
            return this.filter(function(itm) {
                return itm.get('selected');
            });
        }
    });

	var selected = demoCollection.selected();
```


上文中我已经讲了如何把`filter`之后的返回数组变成Backbone.Collection的实例，但是很明显，这里返回的是数组。

下面的情况一般发生在批量操作的时候，如批量删除，我们要把所选的批量删除掉，我们可能需要访问一个api，然后把id传过去。

如果`selected`返回的是Backbone.Collection实例对象，我们可以直接使用`pluck`方法：
	
```javascript
var ids= selected.pluck('id');
// 返回id的数组
```

如果像上面`selected`只是Model数组呢？如何取到id的数组呢？

你可能通过`each`循环：

```javascript
var ids = [];
_.each(selected, function(itm){
	ids.push(itm.get('id'));
});
```

如果你想返回的不只是id的数组的话，`each`方法其实很适合，如果就想返回一项的数组的话，其实还有更简单的方法。

如果你有去看看Backbone的源码中的`pluck`方法，你会发现这方法其实调用的是underscore的`invoke`方法，因此，so easy:

```javascript
ids = _.invoke(selected, 'get', 'id');
```

那你要从Collection批量删除的话，你也可以直接：

```javascript
_.invoke(selected, 'destroy');

// http://underscorejs.org/#invoke
_.invoke(list, methodName, *arguments)
```

因此后面的参数也可以传多个，但是返回的是一个数组。

其实再看看underscore的源码的话，`invoke`方法内部调用的`_.map`，所以也可以用`map`方法去实现咯。



	

	
	
	

	





