title: 免费翻墙镜像和工具
date: 2014-08-03 17:13:02
tags: 翻墙
categories: technology

---

最近国内屏蔽相当严重，作为一个程序猿的我，都不得不离开谷歌的怀抱暂时投入百度，无奈百度出来的全是推广广告，这让我感到无比的蛋疼与心碎啊，还好最近发现了一些免费的翻墙镜像，现在共享给大家。


<!-- more -->

## updated 2017-12-20

### ios翻墙

ios翻墙一直是个坑啊，之前只能走vpn，或者配代理，ios版的shadowsocks也是个很鸡肋的存在，直到一款神器`surge`出现，才打破了这种局面。

![surge](https://chuantu.biz/t6/181/1513749950x-1404758256.png)

surge的优点主要是：

1. 他能接管全局所有的通信流量。
2. 耗电量低，常年开着也不会影响手机待机。

**其实surge的本质是网络调试工具，只不过在天朝的特殊环境下，硬生生变成了一个翻墙工具。**

好东西当然是要钱的啦。去[appstore](https://itunes.apple.com/us/app/surge-web-developer-tool-proxy/id1040100637?mt=8)上看下，这软件售价`￥328`，真心贵啊。不过作者开发也挺辛苦的，尽量去买正版吧。

surge的配置比较麻烦，安装完成后启动点击左上角的图标去到`Switch Configuration`页面，然后选择`Download Configuration From URL`即可通过网址下载别人弄好的配置文件。可以搜索一下`surge配置`即可搜到一堆别人的配置。这里附上我配置好的surge配置文件：可翻墙、屏蔽广告。

#### 中国移动用户surge配置

	http://surge.noonme.com/CMCC.conf

#### 中国联通用户surge配置

	http://surge.noonme.com/ChinaUnicom.conf

#### 中国电信用户surge配置

	http://surge.noonme.com/ChinaNet.conf

最后附上翻墙hosts：[hosts](https://raw.githubusercontent.com/huanz/surge-hosts/master/hosts)

使用过程中你可能有时用`wifi`，有时用蜂窝，网络类型可能会发生变化，所以建议你把三个配置都下载下来，根据不同网络切换使用不同配置。

如果你不知道自己的网络类型，可以打开这里：[http://surge.noonme.com/](http://surge.noonme.com/)，会显示你的网络类型，同时相关的配置文件也罗列出来了方便拷贝使用。

整个项目源代码托管在github：[https://github.com/huanz/surge-hosts](https://github.com/huanz/surge-hosts)，可自动更新，如果你发现你的surge配置无法使用了，你可以去这里看看项目的最后更新时间，删掉你之前的配置，然后通过上面的链接下载最新的配置文件。

#### iOS其它翻墙工具

iOS除了surge之外，最近也出了一些其它的翻墙工具，如：`Shadowrocket`、`Wingy`、`土豆丝（Potatso）`、`Alice`、`Shadowing`等。

### lantern

最新推荐一款翻墙利器：[lantern（蓝灯）](https://getlantern.org/)。速度还不错，支持`windows`、`mac`、`android`、`ubuntu`。

蓝灯github下载链接：[蓝灯[Lantern]最新版本下载](https://github.com/getlantern/lantern/releases/tag/latest)

如果github无法打开，也可以使用我提供的下载链接（`4.4.1`）：

链接: [https://pan.baidu.com/s/1hrYlxA0](https://pan.baidu.com/s/1hrYlxA0) 密码: azxy


### 翻墙DNS

#### [https://pdomo.me/](https://pdomo.me/)

干净,自由,无劫持

主：`101.132.183.99`

辅：`193.112.15.186`


#### Freenom World: [http://www.freenom.world/zh/index.html](http://www.freenom.world/zh/index.html)

Freenom World是快速且保护隐私的DNS服务器

```
80.80.80.80
80.80.81.81
```

#### [puredns](https://puredns.cn/)

```
123.207.137.88
```

### google镜像

- [http://www.gufenso.cn/](http://www.gufenso.cn/)
- [http://www.gfsoso.me/](http://www.gfsoso.me/)
- [https://g.segmentfualt.com/](https://g.segmentfualt.com/)
- [http://gufenso.coderschool.cn/](http://gufenso.coderschool.cn/)
- [https://quick.likeso.ml/](https://quick.likeso.ml/)
- [https://guge.today/](https://guge.today/)
- [http://www.dirmor.top/](http://www.dirmor.top/)
- [http://ac.scmor.com/](http://ac.scmor.com/)
- [https://gg.bdao.top/](https://gg.bdao.top/)
- [https://hp.myway.com/myway/index.html](https://hp.myway.com/myway/index.html)
- [https://xue.glgoo.net/](https://xue.glgoo.net/)
- [https://xues.glgoo.com/](https://xues.glgoo.com/)
- [hhttps://busca.uol.com.br/](https://busca.uol.com.br/)
- [http://bird.so/](http://bird.so/)
- [https://g.nuist.top/scholar](https://g.nuist.top/scholar)
- [https://g.nuist.top/](https://g.nuist.top/)
- [https://g.codery.ga/](https://g.codery.ga/)
- [https://h.ggkai.men/extdomains/scholar.google.com/](https://h.ggkai.men/extdomains/scholar.google.com/)
- [https://c3.zgdhhjha.com/scholar](https://c3.zgdhhjha.com/scholar)
- [https://a.glgooo.top/scholar/](https://a.glgooo.top/scholar/)
- [https://google.uulucky.com/](https://google.uulucky.com/)
- [https://xs.bban.top/scholar/](https://xs.bban.top/scholar/)
- [https://ge.sxisa.org/](https://ge.sxisa.org/)

### 在线代理站点

- [https://nl.hideproxy.me/](https://nl.hideproxy.me/)
- [https://be.unblockit.co/](https://be.unblockit.co/)
- [https://www.zalmos.com/](https://www.zalmos.com/)

> zalmos 的使用需要配合hosts，在你的 hosts 文件增加如下内容

```
195.154.46.4 www.zalmos.com
195.154.46.8 proxy.zalmos.com
```

---

### 可用翻墙工具：

- fanqiang: [https://github.com/bannedbook/fanqiang/wiki](https://github.com/bannedbook/fanqiang/wiki)
- XX-Net: [https://github.com/XX-net/XX-Net](https://github.com/XX-net/XX-Net)

### 免费翻墙帐号分享

- [Shadowsocks免费账号分享](https://doub.bid/sszhfx/)
- [https://get.freess.today/](https://get.freess.today/)

### Shadowscoks翻墙软件下载

- Mac Shadowsocks-X-NG 1.7.0 链接: [https://pan.baidu.com/s/1pKXrjGB](https://pan.baidu.com/s/1pKXrjGB) 密码: 8vee
- Windows Shadowsocks 4.0.7 链接: [https://pan.baidu.com/s/1pL0xsOb](https://pan.baidu.com/s/1pL0xsOb) 密码: vrj4
- Android Shadowsocks 4.3.3 链接: [https://pan.baidu.com/s/1sluT7zB](https://pan.baidu.com/s/1sluT7zB) 密码: eb9k
- iOS surge 2.6.2 链接: [https://pan.baidu.com/s/1gf0DCH1](https://pan.baidu.com/s/1gf0DCH1) 密码: dgfi
- iOS wingy 1.1.1 链接: [https://pan.baidu.com/s/1cEvcCI](https://pan.baidu.com/s/1cEvcCI) 密码: zw1n
- iOS shadowsocket 2.1.1 链接: [https://pan.baidu.com/s/1kUJmi03](https://pan.baidu.com/s/1kUJmi03) 密码: c9tm

### 翻墙集合

- [new-pac](https://github.com/Alvin9999/new-pac/wiki)
