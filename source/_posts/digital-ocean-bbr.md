title: Digital Ocean开启TCP-BBR拥塞控制算法
date: 2017-08-29 10:47:23
tags: vps
categories: technology
---

这个新的TCP拥塞控制算法——BBR已经火了一段时间了，优势可以参见 [Linux Kernel 4.9 中的 BBR 算法与之前的 TCP 拥塞控制相比有什么优势？](https://www.zhihu.com/question/53559433)，里面说的已经非常全面了。在Digital Ocean的CentOS7系统的VPS上开启BBR记录如下。

<!-- more -->

## 2018-03-17

最近发现有别人写好的一键安装脚本可以一键安装`bbr`，并且有`bbr魔改`，据说效果更好。

一键安装脚本：[Linux-NetSpeed](https://github.com/chiakge/Linux-NetSpeed)

关于速度的测试文章：[[小实验] 锐速&BBR究竟哪家强？个人PC有必要上锐速吗？](https://lolico.moe/gotagota/compare-serverspeeder-and-bbr.html)


## 更新内核

先更新系统

```shell
$ yum update -y
```

安装内核，目前CentOS已经可以通过elrepo源来更新内核，目前最新内核版本为：`4.12.9`

```shell
$ rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
$ rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-3.el7.elrepo.noarch.rpm
$ yum --enablerepo=elrepo-kernel install kernel-ml -y
```

查看内核是否安装成功

```shell
$ awk -F\' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg
```

出现类似返回

```
0 : CentOS Linux 7 Rescue f16713269c69461db4addeffb3a94dc9 (4.12.9-1.el7.elrepo.x86_64)
1 : CentOS Linux (4.12.9-1.el7.elrepo.x86_64) 7 (Core)
2 : CentOS Linux (3.10.0-514.21.1.el7.x86_64) 7 (Core)
3 : CentOS Linux (0-rescue-de820036e9b44905be9e94bc0f95cdc7) 7 (Core)
```

把 CentOS Linux (4.12.9-1.el7.elrepo.x86_64) 设置成默认内核

```shell
# grub2-set-default 1 也可以
$ grub2-set-default 0
```

一般情况下，这里就应该重启系统使使grub生效了，但由于Digital Ocean的限制，DO的用户要先在DO的后台把内核切换到GrubLoader v0.2（相当于自定义吧），然后再重启系统

![](https://ws4.sinaimg.cn/large/006tKfTcly1fj0nhzsxfaj31kc0m0wj7.jpg)

```shell
# 在Digital Ocean后台将Kernel更换为GrubLoader v0.2
$ reboot
```

查看内核是否更换成功

```shell
$ uname -r
```

## 开启BBR

编辑`/etc/sysctl.conf`，加入如下内容

```
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
```

保存生效

```shell
$ sysctl -p
```

查看当前内核TCP设置

```shell
$ sysctl net.ipv4.tcp_available_congestion_control
$ sysctl net.ipv4.tcp_congestion_control
```

如果结果都有`bbr`，则说明内核已开启BBR算法，执行：

```shell
$ lsmod | grep bbr
```

显示`tcp_bbr`说明BBR已正常启动

至于用了BBR之后到底速度有多少改进呢，我个人其实并没有感觉到有特别显著的效果（网上传言的效果简直夸张）。而且Google的测试报告也并没有说适用于所有情况，所谓BBR代替CUBIC成为TCP默认的拥塞控制算法，大概还相当遥远吧。