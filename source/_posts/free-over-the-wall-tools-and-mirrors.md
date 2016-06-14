title: 免费翻墙镜像和工具
date: 2014-08-03 17:13:02
tags: 翻墙
categories: technology

---

最近国内屏蔽相当严重，作为一个程序猿的我，都不得不离开谷歌的怀抱暂时投入百度，无奈百度出来的全是推广广告，这让我感到无比的蛋疼与心碎啊，还好最近发现了一些免费的翻墙镜像，现在共享给大家。


<!-- more -->

## updated 2016-06-13

### ios翻墙

ios翻墙一直是个坑啊，之前只能走vpn，或者配代理，ios版的shadowsocks也是个很鸡肋的存在，直到一款神器`surge`出现，才打破了这种局面。

![surge](http://a3.mzstatic.com/us/r30/Purple18/v4/a0/a1/4e/a0a14ead-2467-9aa6-f108-50ca6ec1a652/icon175x175.png)

surge的优点主要是：

1. 他能接管全局所有的通信流量。
2. 耗电量低，常年开着也不会影响手机待机。

**其实surge的本质是网络调试工具，只不过在天朝的特殊环境下，硬生生变成了一个翻墙工具。**

好东西当然是要钱的啦。去[appstore](https://itunes.apple.com/us/app/surge-web-developer-tool-proxy/id1040100637?mt=8)上看下，这软件售价`￥648`，真心贵啊。不过作者开发也挺辛苦的，尽量去买正版吧。

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

- [http://www.wen.lu/](http://www.wen.lu/)
- [https://g2.wen.lu/](https://g2.wen.lu/)
- [http://gc.ihuan.me/](http://gc.ihuan.me/)
- [http://ggss.cf/](http://ggss.cf/)
- [http://hao.cytbj.com/](http://hao.cytbj.com/)
- [http://jgoproxy.tk/](http://jgoproxy.tk/)
- [http://s.8090st.com/](http://s.8090st.com/)
- [https://www.wacao.org/](https://www.wacao.org/)
- [http://www.g363.com/](http://www.g363.com/)
- [http://g.helloit.info/](http://g.helloit.info/)
- [https://g.jikewenku.cn/](https://g.jikewenku.cn/)
- [https://www.guge.xxx/](https://www.guge.xxx/)
- [https://g.libnull.com/](https://g.libnull.com/)
- [http://ssdao.cdjltz.com/](http://ssdao.cdjltz.com/)
- [https://global.gogfw.com/](https://global.gogfw.com/)
- [https://www.onk6.com/](https://www.onk6.com/)
- [http://www.hntvchina.com/](http://www.hntvchina.com/)
- [https://g.zrj766.com/](https://g.zrj766.com/)
- [https://g.alexyang.me/](https://g.alexyang.me/)
- [https://ggso.in/](https://ggso.in/)
- [http://www.bjgong.tk/](http://www.bjgong.tk/)
- [http://gc.ihuan.me/](http://gc.ihuan.me/)


---

### 可用翻墙工具：

- XX-Net: [https://github.com/XX-net/XX-Net](https://github.com/XX-net/XX-Net)
- 萤火虫FireFly Proxy: [https://github.com/yinghuocho/firefly-proxy](https://github.com/yinghuocho/firefly-proxy)
