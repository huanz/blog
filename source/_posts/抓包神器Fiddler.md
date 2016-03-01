title: 抓包神器Fiddler
date: 2015/3/7 15:49:27 
tags: 网络
categories: technology
---

Fiddler是一款免费且功能强大的数据包抓取软件，它能够记录所有客户端和服务器间的HTTP(S)请求，允许你监视，设置断点，甚至修改输入输出数据，Fiddler包含了一个强大的基于事件脚本的子系统，并且能够使用.net框架语言扩展。所以无论你是从事什么开发，哪种语言，只要你想了解HTTP，这个工具就值得你去了解，而且更重要的一点，这个工具是免费的。

<!-- more -->

![image](http://blog.u.qiniudn.com/uploads/fiddler.png)

首先给出官网的下载链接：

[Fiddler下载](http://www.telerik.com/download/fiddler)

Fiddler目前没有Mac版，因此在Mac上用了**Charles**，但是这个软件貌似无法查看到WebView里面的请求，所以我Parallels Desktop装了一个Windows的虚拟机，然后设置虚拟机网络连接类型为桥接网络即可。

![image](http://blog.u.qiniudn.com/uploads/fiddler0.png)

## 查看请求

启动Fiddler客户端就可以查看到本地的网络请求了(如果浏览器配置了代理，如chrome代理插件SwitchyOmega/Switchy，请选择使用系统代理模式)：

![image](http://blog.u.qiniudn.com/uploads/fiddler1.png)

上图中我用浏览器打开百度首页，即可以在Fiddler中看到所有的网络请求情况。

## 修改请求

依次选择菜单栏：Rules-> Automatic Breakpoint ->Before Requests，如下图：

![image](http://blog.u.qiniudn.com/uploads/fiddler2.png)

此时我们再在浏览器打开一个请求，它会自动中断请求：

![image](http://blog.u.qiniudn.com/uploads/fiddler3.png)

当我们点击**Run to Completion**的时候它才会真正的把请求发送出去，那么我们就可以在真正发送请求之前改掉请求数据。

接着我们来试试在登录知乎的时候修改一下登录数据（知乎是明文密码登录。。。，估计大批网站都是明文登录，所以如果在网络传输过程中被劫持，后果你懂的。。。）


![image](http://blog.u.qiniudn.com/uploads/fiddler4.png)

可以看到输入的用户名已经被我在发送请求之前改掉了（还可以看到我输入的那一串密码123456，衰。。。），修改完毕点一下**Run to Completion**这个请求就完美的发送出去了。

哈哈，学会了这招，赶紧做点什么去吧。。。

如果你不想每次请求之前都中断，那你可以：Rules-> Automatic Breakpoint ->Disabled。

## 发起请求

发起请求只需要选择右边的：**Composer**，可以设置请求类型、请求头部和请求参数等等，这里我就不细说了。

## 查看响应

查看响应你只需要选中一条请求，然后选择：Inspectors，上面是请求相关的，下面就是响应相关的。

## 修改响应

修改响应可以像修改请求类似：Rules-> Automatic Breakpoint ->After Reponses，这时会中断响应，然后从**Run to Completion**旁边的**Choose Response...**选择响应文件即可。

也可以在**AutoResponsder**添加匹配规则，支持正则的哦，然后勾选上**Enable automatic responses**和**Unmated requests passthrough**，这样匹配到相应的Url规则便会自动修改响应，没有匹配到就直接跳过。如图我给知乎换了个logo。

![image](http://blog.u.qiniudn.com/uploads/fiddler5.png)

## 远程代理

远程代理可以用来代理查看其它设备的网络请求。开启方法很简单，选择菜单栏：Tools-> Fiddler Optios，然后选择Connections:

![image](http://blog.u.qiniudn.com/uploads/fiddler6.png)

勾选上**Allow remote computers connect**，并记下监听端口：8888，获取Fiddler所在机器的IP，我的是：10.15.1.21。

然后打开手机或者其它移动设备，并确保手机和Fiddler所在机器在同一局域网内，点击你手机所连接的Wifi，在代理那里选择**手动**，并填入主机名：10.15.1.21，端口：8888：

![image](http://blog.u.qiniudn.com/uploads/fiddler7.png)

使用完后记得把代理取消掉，不然你可能连接这个wifi就无法上网咯。