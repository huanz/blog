title: iTerm2使用rz、sz远程上传或下载文件
date: 2016-02-03 22:48:17
tags: mac
categories: technology

---

在日常开发中，我们经常需要上传文件到服务器或者从服务器下载文件。在Windows下SecureCRT为我们提供了很方便的上传下载工具sz与rz，但是mac下一般都是通过scp命令来完成的，虽然也很方便，但是有些场景下是不能使用的，比如目前公司登录服务器需要经过跳板机。本篇我们就介绍一下如何在mac下使用rz、sz上传下载文件。

<!-- more -->

## scp

先介绍下如何使用scp命令。

**上传**

```bash
scp -r local_folder remote_username@remote_ip:remote_folder
```

或者

```bash
scp -r local_folder remote_ip:remote_folder
```

**下载**

下载和上传对应，只需要修改后两个参数顺序即可，即调整源文件和目标文件顺序。

```bash
scp -r remote_username@remote_ip:remote_folder local_folder 
```

> 几个可能用到的参数：
> 
> -v 和大多数linux命令中的-v意思一样,用来显示进度。可以用来查看连接、认证、或是配置错误。
> 
> -r 递归处理，将指定目录下的文档和子目录一并处理
> 
> -C 使能压缩选项
> 
> -P 选择端口。注意-p已经被rcp使用
> 
> -4 强行使用IPV4地址
> 
> -6 强行使用IPV6地址

## 配置rz、sz

在此之前你必须要安装iTerm2，然后：

```bash
brew install lrzsz
```

下载iterm2-zmodem：

```bash
cd /usr/local/bin
sudo wget https://raw.github.com/mmastrac/iterm2-zmodem/master/iterm2-send-zmodem.sh
sudo wget https://raw.github.com/mmastrac/iterm2-zmodem/master/iterm2-recv-zmodem.sh
sudo chmod 777 /usr/local/bin/iterm2-*
```

打开Item2，点击`preferences → profiles`，选择某个`profile`，如Default，之后继续选择`advanced → triggers`，添加编辑添加如下triggers：

Regular Expression | Action | Parameters
----|------|----
rz waiting to receive.\*\*B0100| Run Silent Coprocess | /usr/local/bin/iterm2-send-zmodem.sh
\*\*B00000000000000 | Run Silent Coprocess | /usr/local/bin/iterm2-recv-zmodem.sh

也可以去这里查看：[https://github.com/mmastrac/iterm2-zmodem](https://github.com/mmastrac/iterm2-zmodem)






	

	
