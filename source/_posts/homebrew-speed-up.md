title: Homebrew国内加速
date: 2017-03-06 11:10:58
tags: mac
categories: technology
---

Mac搭配homebrew简直舒爽啊，然而homebrew托管在github，对国内用户来说不仅频频被墙，而且速度也不理想。今天笔者就告诉大家国内用户顺畅访问homebrew的方法。

<!-- more -->

## 中科大的镜像

中科大镜像比较稳定，而且速度不错。官方网站：[http://mirrors.ustc.edu.cn/](http://mirrors.ustc.edu.cn/)。搜索`brew`，然后点击`Help`即可查看用法：

**替换Homebrew默认源**

```bash
# 替换brew.git:
cd "$(brew --repo)"
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git

# 替换homebrew-core.git:
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git

brew update
```

**替换Homebrew Bottles源**

对于bash用户：

```bash
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile
```

对于zsh用户：

```bash
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.zshrc
source ~/.zshrc
```

## 清华大学镜像

也是比较靠谱的开源镜像。官方网站：[https://mirror.tuna.tsinghua.edu.cn/help/homebrew/](https://mirror.tuna.tsinghua.edu.cn/help/homebrew/)。

**替换Homebrew默认源**

```bash
# 替换brew.git:
cd "$(brew --repo)"
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git

# 替换homebrew-core.git:
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git

brew update
```

**使用homebrew-science或者homebrew-python**

```bash
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-science"
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-science.git

cd "$(brew --repo)/Library/Taps/homebrew/homebrew-python"
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-python.git

brew update
```

**替换Homebrew Bottles源**

对于bash用户：

```bash
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile
```

对于zsh用户：

```bash
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles' >> ~/.zshrc
source ~/.zshrc
```

## 其它镜像

### 搬[http://ban.ninja/](http://ban.ninja/)

此为Homebrew Bottles源，及下载二进制文件地址：

bash用户：

```bash
echo 'export HOMEBREW_BOTTLE_DOMAIN=http://7xkcej.dl1.z0.glb.clouddn.com' >> ~/.bash_profile
source ~/.bash_profile
```

对于zsh用户：

```bash
echo 'export HOMEBREW_BOTTLE_DOMAIN=http://7xkcej.dl1.z0.glb.clouddn.com' >> ~/.zshrc
source ~/.zshrc
```

### coding [homebrew](https://coding.net/u/homebrew/p/homebrew/git)

只有Homebrew源，没有二进制文件源。

```bash
cd "$(brew --repo)"
git remote set-url origin https://git.coding.net/homebrew/homebrew.git

brew update
```

## 重置Homebrew默认源

```bash
# 重置brew.git:
cd "$(brew --repo)"
git remote set-url origin https://github.com/Homebrew/brew.git

# 重置homebrew-core.git:
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://github.com/Homebrew/homebrew-core.git

brew update
```

## 其它加速方法

除了通过替换源加速之外，如果你有自己的代理，也可以通过代理加速。

如socks代理配置：

```bash
vi ~/.curlrc

# 改成自己的代理端口
socks5=127.0.0.1:1080
```

或者通过`proxychains`：

```bash
brew install proxychains-ng
```

然后在`/usr/local/etc/proxychains.conf`配置代理信息，即在 [ProxyList] 下面（也就是末尾）加入代理类型，代理地址和端口，如：

```bash
socks5  127.0.0.1 1080
```

配置好之后就可以在需要使用代理的命令前加`proxychians`来加速：

```
proxychians brew update
proxychians brew install ...
```




