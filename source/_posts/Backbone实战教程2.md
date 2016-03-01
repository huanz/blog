title: Backbone实战教程（二）
date: 2014-03-22 21:49:18
tags: [backbone, javascript]
categories: technology
---

在[Backbone实战教程（一）](http://w3cboy.com/post/2014/03/Backbone%E5%AE%9E%E6%88%98%E6%95%99%E7%A8%8B1/)中我们已经写好了基本页面文件、功能需求以及整体框架。今天我们就正式进入js代码的实现部分。

<!-- more -->

首先附上Backbone和Underscore官方文档地址，这里才是最佳的学习地方：

Backbone:[http://backbonejs.org/](http://backbonejs.org/)

Underscore:[http://underscorejs.org/](http://underscorejs.org/)

整个实例我已经做好，大家可以在这里看：

[Backbone通讯录实例v1.0](http://w3cboy.com/demo/backbone/v1.0/)

![Backbone通讯录实例图片](http://blog.u.qiniudn.com/D%5DK6BHQDN2KNFG.jpg)

1. 定义项目的命名空间
	
	```javascript
	var Contact = {
		Models: {},
		Collections: {},
		Views: {}
	};
	```
2. Backbone模型（model）初探
		
	首先定义弹窗模型（主要是页面所用的弹窗部分，如添加，修改联系人等），因为页面很多地方都要用到弹窗，而所有这些弹窗都有很多共性，所以我们把弹窗定义为一个模型，方便管理。

	```javascript
	Contact.Models.Dialog = Backbone.Model.extend({
		defaults:{
    		dialogId: '',
    		title: '',
    		html: '',
    		btnvalue: ''
		}
	});
	```
	
	定义一个模型只需要继承Backbone的Model，这样我们的模型就有了一些方法与属性，如get,set,destory等方法，我们也可以重写这些方法，也可以定义一些自己的方法用来操作Model。

	defaults：定义模型的默认属性和这些属性的默认值，也可不定义
	
	Bacbkone并不是严格的MVC，所以即使我们这样定义了一个Dialog的模型，在后期使用的时候，我们可以在此模型中随便放对象进去，如：
		
	```javascript
	var tmpDialog = new Contact.Models.Dialog({
		aaa : 'ssss',
		bb: 'xxx'
	});
	```
	此时tmpDialog里面的属性是这样的，我们可以用`model.attributes `来查看model的所有属性：

	```javascript
	alert(JSON.stringify(tmpDialog.attributes));
	```

	此时我们可以看到属性有：
		
	```javascript
	{
		aaa : 'ssss',
		bb: 'xxx',
		dialogId: '',
     	title: '',
     	html: '',
     	btnvalue: ''		
	}
	```
	除了这几个属性之外，Backbone还会自动为每个model分配一个唯一id，可以通过model.id得到它的值。

	当我们new一个Backbone对象的时候，会自动调用constructor / initialize方法，我们可以重写此方法来实现一些效果。

	我们也可以继承自己的Model（或View或collection），如我们现在需要一个特殊的弹窗，除了以上的几个属性之外，它还有特殊的属性和方法，如：
		
	```javascript
	Contact.Models.SpecialDialog = Contact.Models.Dialog.extend({
		defaults: {
			sepcolum: 'xxx'
		},
		sepMethod: function(){
			//you codes
		}
	});
	```

	此时我们的SpecialDialog既有了Dialog的所有属性和方法，又有了自己特殊的属性和方法。

	Backbone为我们提供的很多脚手架，关于Model的更多属性和方法请查看Backbone的官方文档。

	下面附上联系人模型的代码：
	
	```javascript
	Contact.Models.Member = Backbone.Model.extend({
		defaults:{
    		name: '',
    		mobile: '',
    		email: '',
    		selected: false
		},
		//切换选中
		toggle: function(){
    		this.set({
        		selected: !this.get('selected')
    		});
		}
	});
	```

3. Backbone模型（collection）初探

	collection，顾名思义集合的意思。Backbone中的collection就用来存放model的集合，或者说相当于数据库中的一张表，model里面定义了这张表的字段。上代码：
	
	```javascript
	Contact.Collections.Member = Backbone.Collection.extend({
		model: Contact.Models.Member,
		localStorage: new Backbone.LocalStorage("w3cboy-contact"),
		// 获取已选model
		selected : function() {
    		return this.filter(function(itm) {
        		return itm.get('selected');
    		});
		},
		// 根据关键词搜索
		serachByKeyWord:function(keyword){
    		var pattern = new RegExp($.trim(keyword).toLocaleLowerCase());
    		return this.filter(function(itm){
        		var name = itm.get('name').toLocaleLowerCase(),
            		mobile = itm.get('mobile');
        		return pattern.test(name) || pattern.test(mobile);
    		});
		}
	});
	```

	model:定义了此collection对应的model

	toSJON方法将collection中的model对象json字符串输出
	
	向collection中添加model有两种方法：
	
	1. 创建的时候添加
	
		```javascript
		var member = new Contact.Collections.Member([{name: '',mobile:'',email:''}, model2, ...]);
		``` 

	2. 创建完成后添加
			
		```javascript
		// 多个添加
		member.add([model1, model2, ...]);
		// 单个添加
		member.add({name: '',mobile:'',email:''});
		```
	
	我们添加的时候传入的都是一个个对象而并不是一个个Model，大家不用担心，collection会自动转成对应的model。

	filter方法是underscore的方法，此方法传入一个list，和断言（谓词）通俗的说就是判断过滤条件，返回符合条件的属性

	除此之外还有set,get,remove等和underscore提供的一些方法，对应用法大家仔细看backbone官方文档和underscore官方文档。
	
4. Backbone模型（view）初探

	按照前面的比喻，View就是数据库里面的一条记录的样式了（切记是一条记录，很多新手在这里容易搞错）。

	老规矩，先上代码：

    ```javascript
    Contact.Views.Member = Backbone.View.extend({
    	tagName: 'tr',
		template: _.template($("#tmp-memberlist").html()),
		events:{
    		'click input': 'toggleSelect',
    		'click .contact-edit':'editMember',
    		'click .contact-del':'deleteMember'
		},
		initialize:function(opts){
    		this.mainView = opts.mainView;
    		this.listenTo(this.model,'change',this.render);
    		this.listenTo(this.model, 'destroy', this.remove);
		},
		render:function(){
    		this.$el.html(this.template(this.model.toJSON()));
    		return this;
		},
		//切换选中样式
		toggleSelect:function(){
    		this.model.toggle();
    		this.mainView.chooseStatus();
		},
		//编辑联系人
		editMember:function(){
    		var _this = this;
    		var item = {
        		dialogId: 'editDialog',
        		title: '修改联系人',
        		html: _.template($("#tmp-member").html(), this.model.toJSON()),
        		btnvalue: '修改'
    		};
    		_this.mainView.dialog.model = new Contact.Models.Dialog(item);
    		_this.mainView.dialog.render();
    		$("#subBtn").unbind();
    		$("#subBtn").bind("click",function(){
        		var $name = $("#inputName"),
           			$mobile = $("#inputMobile");

        		var name = $.trim($name.val()),
            		mobile = $.trim($mobile.val()),
            		email = $.trim($("#inputEmail").val());

        		if(!name){
            		$name.focus();
            		return false;
        		}
        		if(!mobile){
            		$mobile.focus();
            		return false;
        		}
        		_this.model.set({
            		name: name,
            		mobile: mobile,
            		email: email
        		});
        		$("#editDialog").modal('hide');
    		});
		},
		//移除联系人
		deleteMember:function(){
    		this.model.destroy();
    		// 联系人个数
    		this.mainView.totalMembers();
    		this.mainView.chooseStatus();
		}
	});
	```

	相比前面的，View里面的代码就相对复杂一些了。

	el:定义用什么DOM节点元素来包裹一个model，默认使用div包裹，是通过tagName，className，id,属性特性这些创建的,如:
	
	```javascript	
	tagName: 'li',
	id: 'list',
	className: 'list'
	```

	那么生成的dom节点将是这样的：

	```html
	<li id="list" class="list">...</li>
	```

	也可以直接定义el：
	
	```javascript	
	el: 'li'
	```

	此时el里面只能填html标签名，如果下面还定义tagName，id,className这些将不会生效。

	events：即事件，贯穿整个model collection view以及router，只是在前面的model collection中没有用到，所以放在这里一起讲。如果你引入了其它的库，也可以用其它库提供的事件方法。

今天先到这里吧，早点睡觉~~~~