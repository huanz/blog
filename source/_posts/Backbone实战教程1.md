title: Backbone实战教程（一）
date: 2014-03-18 22:17:46
tags: [backbone, javascript]
categories: technology
---
Backbone是一个前端 JS 代码 MVC 框架，但它并不是严格意义上的Model, View, Controller（这一点我将在实例中解答）。它不可取代 Jquery，不可取代现有的 template 库。而是和这些结合起来构建复杂的 web 前端交互应用。


<!-- more -->


**Backbone：**


1. 强制依赖于Underscore.js，所以引入backbone.js之前必须先引入Underscore.js。Underscore.js 是一个实用型工具库；
2. 非强制依赖于 jQuery/Zepto；
3. 根据模型的变更自动更新应用程序的 HTML，有助于代码维护；
4. 促进客户端模板使用，避免了在 JavaScript 中嵌入 HTML 代码。

接下来的教程中我将用backbone实现一个简单的通讯录应用，具体的页面效果我已做好：
[Backbone通讯录教程页面](http://w3cboy.com/demo/backbone/v0.5/ "backbone通讯录教程页面")


**通讯录功能分析：**

1. 通讯录页面可添加、修改、删除联系人（批量删除）、搜索联系人
2. 联系人修改后点击保存统一提交到服务器
3. 右上方的实时显示联系人个数

**页面MVC划分：**

1. 页面所用的views、models、collections统一放在命名空间contact下面，即：

    ```javascript
    var Contact = {
    	Models: {},
    	Collections: {},
    	Views: {}
    };
    ```

2. 页面两个view(mainview,memberview),一个collection用来存放联系人集合，一个model用来存放联系人模型，即：

		```javascript
		Contact.Models.Member
		Contact.Collections.Member
		Contact.Views.Member
		Contact.Views.Main
		```
		
3. 教程开始数据直接用浏览器的localstorage来存放联系人，由于低版本的浏览器不支持localstorage，所以这里我用[backbone.localStorage.js](https://github.com/jeromegn/Backbone.localStorage)。后期将会用node.js来作后端支持，所以也将会有node.js的教程，同时会用到[sea.js](http://seajs.org/docs/)来动态加载js库。

**今天的教程到此为止，大家敬请期待！**

