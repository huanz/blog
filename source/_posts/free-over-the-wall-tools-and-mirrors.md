title: 免费翻墙镜像和工具
date: 2014-08-03 17:13:02
tags: 翻墙
categories: technology

---

最近国内屏蔽相当严重，作为一个程序猿的我，都不得不离开谷歌的怀抱暂时投入百度，无奈百度出来的全是推广广告，这让我感到无比的蛋疼与心碎啊，还好最近发现了一些免费的翻墙镜像，现在共享给大家。


<!-- more -->

## updated 2016-05-02

### ios翻墙

ios翻墙一直是个坑啊，之前只能走vpn，或者配代理，ios版的shadowsocks也是个很鸡肋的存在，直到一款神器`surge`出现，才打破了这种局面。

surge的优点主要是：

1. 他能接管全局所有的通信流量。
2. 耗电量低，常年开着也不会影响手机待机。

**其实surge的本质是网络调试工具，只不过在天朝的特殊环境下，硬生生变成了一个翻墙工具。**

好东西当然是要钱的啦。去[appstore](https://itunes.apple.com/us/app/surge-web-developer-tool-proxy/id1040100637?mt=8)上看下，这软件售价`$99.99`，真心贵啊。不过作者开发也挺辛苦的，尽量去买正版吧。

这里我说下免费安装的方法：同步推。

surge的配置比较麻烦，安装完成后启动点击左上角的图标去到`Switch Configuration`页面，然后选择`Download Configuration From URL`即可通过网址下载别人弄好的配置文件。可以搜索一下`surge配置`即可搜到一堆别人的配置。这里附上我配置好的surge配置文件：可翻墙、屏蔽广告。

#### 中国移动用户surge配置

	http://surge.w3cboy.com/CMCC.conf

#### 中国联通用户surge配置

	http://surge.w3cboy.com/ChinaUnicom.conf

#### 中国电信用户surge配置

	http://surge.w3cboy.com/ChinaNet.conf

最后附上翻墙hosts：[hosts](https://raw.githubusercontent.com/huanz/surge-hosts/master/hosts)

使用过程中你可能有时用`wifi`，有时用蜂窝，网络类型可能会发生变化，所以建议你把三个配置都下载下来，根据不同网络切换使用不同配置。

如果你不知道自己的网络类型，可以打开这里：[http://surge.w3cboy.com/](http://surge.w3cboy.com/)，会显示你的网络类型，同时相关的配置文件也罗列出来了方便拷贝使用。

整个项目源代码托管在github：[https://github.com/huanz/surge-hosts](https://github.com/huanz/surge-hosts)，可自动更新，如果你发现你的surge配置无法使用了，你可以去这里看看项目的最后更新时间，删掉你之前的配置，然后通过上面的链接下载最新的配置文件。

### lantern

最新推荐一款翻墙利器：[lantern（蓝灯）](https://getlantern.org/)。速度还不错，支持`windows`、`mac`、`android`、`ubuntu`。

蓝灯github下载链接：[蓝灯[Lantern]最新版本下载](https://github.com/getlantern/lantern/releases/tag/latest)

### google镜像

- [http://wen.lu/](http://wen.lu/)
- [http://g.jiasubao.co/](http://g.jiasubao.co/)
- [http://gc.ihuan.me/](http://gc.ihuan.me/)
- [http://ggss.cf/](http://ggss.cf/)
- [http://google.casejs.com/](http://google.casejs.com/)
- [http://hao.cytbj.com/](http://hao.cytbj.com/)
- [http://rose.jgoproxy.tk/](http://rose.jgoproxy.tk/)
- [http://s.8090st.com/](http://s.8090st.com/)
- [http://soguge.com/](http://soguge.com/)
- [http://www.wen.lu/](http://www.wen.lu/)
- [http://www.zzq2.com/](http://www.zzq2.com/)
- [https://g2.wen.lu/](https://g2.wen.lu/)
- [https://gg.kfd.me/](https://gg.kfd.me/)
- [https://ggg.eeload.com/](https://ggg.eeload.com/)
- [https://go.cccyun.cn/](https://go.cccyun.cn/)
- [https://jisuobuyu.com/](https://jisuobuyu.com/)
- [https://www.iamgg.pw/](https://www.iamgg.pw/)
- [https://www.onenew.net/](https://www.onenew.net/)


---

updated 2015-05-22

下面的很多都不能用了，因此放出最新的可用翻墙工具：

- goagent: [https://github.com/goagent/goagent](https://github.com/goagent/goagent)
- Goagent免配置包: 百度网盘下载[http://pan.baidu.com/s/1pJ9Ms6R](http://pan.baidu.com/s/1pJ9Ms6R) 密码: `a8pq`
- 时空隧道(chrome插件): [http://sksd.ga:8080/invi/XoOKBE](http://sksd.ga:8080/invi/XoOKBE) 邀请码：`XoOKBE`（每天2小时，目前可以免费无限续时）
- HelloDNS(可翻墙DNS)：联通 `123.56.46.123` 电信 `121.40.144.82`
- 免费的vpn: [http://www.i-vpn.net/free-vpn/](http://www.i-vpn.net/free-vpn/)
- 萤火虫FireFly Proxy: [https://github.com/yinghuocho/firefly-proxy](https://github.com/yinghuocho/firefly-proxy)
- Host: [2015.04.25](http://blog.u.qiniudn.com/hosts/hosts.txt)
- HelloDNS(可翻墙DNS)：联通 `123.56.46.123` 电信 `121.40.144.82`
- 免费的vpn: [http://www.i-vpn.net/free-vpn/](http://www.i-vpn.net/free-vpn/)
- 萤火虫FireFly Proxy: [https://github.com/yinghuocho/firefly-proxy](https://github.com/yinghuocho/firefly-proxy)
- Google全球缓存IP：[http://googless.sinaapp.com/index.php](http://googless.sinaapp.com/index.php)


---


请将此页加为书签。若镜像被封锁，请访问本页面获取最新镜像。


- Google 搜索：[http://chetxia.co](http://chetxia.co)
- Google 搜索：[http://luxtarget.co](http://luxtarget.co)
- Google 搜索：[http://1kapp.co](http://1kapp.co)
- Google 搜索：[http://sinaapp.co](http://sinaapp.co)
- Google 搜索：[https://s3-us-west-2.amazonaws.com/google2/index.html](https://s3-us-west-2.amazonaws.com/google2/index.html)
- Google 搜索：[https://s3-us-west-1.amazonaws.com/google3/index.html](https://s3-us-west-1.amazonaws.com/google3/index.html)
- Google 搜索：[https://s3-eu-west-1.amazonaws.com/google4/index.html](https://s3-eu-west-1.amazonaws.com/google4/index.html)
- Google 搜索：[https://s3-ap-northeast-1.amazonaws.com/google5/index.html](https://s3-ap-northeast-1.amazonaws.com/google5/index.html)
- Google 搜索：[https://s3-ap-southeast-2.amazonaws.com/google6/index.html](https://s3-ap-southeast-2.amazonaws.com/google6/index.html)
- Google 搜索：[https://s3-sa-east-1.amazonaws.com/google7/index.html](https://s3-sa-east-1.amazonaws.com/google7/index.html)
- Google 搜索：[https://s3-ap-southeast-1.amazonaws.com/google.cn/index.html](https://s3-ap-southeast-1.amazonaws.com/google.cn/index.html)
- Google 搜索：[https://s3.amazonaws.com/google./index.html](https://s3.amazonaws.com/google./index.html)
- 自由微博：[https://s3-ap-southeast-1.amazonaws.com/freeweibo2/index.html](https://s3-ap-southeast-1.amazonaws.com/freeweibo2/index.html)
- 自由微博：[https://s3.amazonaws.com/freeweibo./index.html](https://s3.amazonaws.com/freeweibo./index.html)
- 中国数字时代：[https://s3-ap-southeast-1.amazonaws.com/cdtimes2/index.html](https://s3-ap-southeast-1.amazonaws.com/cdtimes2/index.html)
- 中国数字时代：[https://s3.amazonaws.com/cdtimes./index.html](https://s3.amazonaws.com/cdtimes./index.html)
- 泡泡（未经审查的网络报道）：[https://s3-ap-southeast-1.amazonaws.com/pao-pao2/index.html](https://s3-ap-southeast-1.amazonaws.com/pao-pao2/index.html)
- 泡泡（未经审查的网络报道）：[https://s3.amazonaws.com/pao-pao/index.html](https://s3.amazonaws.com/pao-pao/index.html)
- 蓝灯(Lantern)以及自由微博和GreatFire.org官方中文论坛：[https://lanternforum.greatfire.org](https://lanternforum.greatfire.org)


**下面是一些翻墙工具**

- goagent：链接: [http://share.weiyun.com/0b351ee419e33a04bfbaf62cb9ad5732](http://share.weiyun.com/0b351ee419e33a04bfbaf62cb9ad5732)

![](http://ww4.sinaimg.cn/small/8b30c2fbgw1eizme8mq8kj20a607kjsu.jpg)

- goagent+:[http://share.weiyun.com/9862e0f79dae361ecddf02e8f5315d54](http://share.weiyun.com/9862e0f79dae361ecddf02e8f5315d54)

![](http://ww4.sinaimg.cn/small/8b30c2fbgw1eizmj06z9kj20am07n40h.jpg)

- 集成goagent的一键翻墙工具greatagent：[https://github.com/greatagent/greatagent/wiki](https://github.com/greatagent/greatagent/wiki)

- mac下的gui翻墙工具：[https://github.com/ohdarling/GoAgentX](https://github.com/ohdarling/GoAgentX)

- hosts：[https://git.oschina.net/kawaiiushio/misc/raw/master/hosts/pc/hosts](https://git.oschina.net/kawaiiushio/misc/raw/master/hosts/pc/hosts)

- 又一个hosts:[http://alsohosts.herokuapp.com/](http://alsohosts.herokuapp.com/)


- 优酷去广告扩展 for Chrome/Chromium：[Adkill and Media Download](https://chrome.google.com/webstore/detail/adkill-and-media-download/lcibdonokophlabplhpmmmjjbgohgcok)