title: 配置你的Mac开发环境
date: 2015-07-12 23:44:23
tags: mac
categories: technology
---

`Mac`是目前大多数开发者们首选的开发机器，下面就让我们一起来配置你的Mac开发环境吧。

<!-- more -->

## Xcode

如果你使用`Mac`做开发，`Xcode`是必不可少的，不管你是不是做`ios/osx`开发，你可能都需要安装`Xcode`，因为它会提供一些基础的环境，如`svn`、`git`等，你只需要去`Mac App Store`安装就可以了。

## homebrew && homebrew-cask

`Mac`下面的应用安装体验其实是挺糟糕的，特别是在天朝，`App Store`的打开速度实在是慢，不过好在有人发明了一个叫`homebrew`的东西，通过简单的命令就可以安装好你想要的应用程序，十分方便，而且通过`homebrew`安装应用还有一些其他的好处，比如说权限问题，或者说应用程序的备份恢复，都会变得十分方便。安装`homebrew`也是需要先安装`Xcode`的的哦。

打开`homebrew`的官网[http://brew.sh/](http://brew.sh/)，我们会看到一条安装命令，通过这条命令我们就可以安装好`homebrew`了：

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
	
接下来我们就可以用命令来安装应用程序了，如：

```bash
brew install wget
```
	
但是还不够完美，因为`homebrew`本身可直接安装的应用程序不是很多，这时候我们就需要安装`homebrew-cask`h[ttp://caskroom.io/](http://caskroom.io/)来完善下：

```bash
brew install caskroom/cask/brew-cask
```
	
接下来我们就可以通过`brew cask`来安装更多的应用了：

```bash
brew cask install google-chrome
brew cask install qq
brew cask install alfred
brew cask install nodejs
...
```
	
`homebrew-cask`提供的应用程序很多，但是都是稳定版本的，如果想要安装测试版的应用，你还需要安装`homebrew-cask-versions`[https://github.com/caskroom/homebrew-versions](https://github.com/caskroom/homebrew-versions)：

```bash
brew tap caskroom/versions
```
	
安装完成之后，你就可以安装测试版本的应用了，如：

```bash
brew cask install google-chrome-canary
brew cask install sublime-text3
```
	
如果你不太清楚你的应用名字，可以搜索，如：

```bash
brew cask search baidu
```
	
或者你也可以去[http://caskroom.io/search](http://caskroom.io/search)搜索，或者去[https://github.com/caskroom/homebrew-cask/tree/master/Casks](https://github.com/caskroom/homebrew-cask/tree/master/Casks)这里查看。

还有其它可以使用的命令：

```bash
// 检测homebrew环境
brew doctor && brew cask doctor
// 更新 清理
brew update && brew upgrade brew-cask && brew cleanup && brew cask cleanup
// 拆卸
brew cask uninstall qq
```
	
详细的用法可以去这里：[https://github.com/caskroom/homebrew-cask/blob/master/USAGE.md](https://github.com/caskroom/homebrew-cask/blob/master/USAGE.md)

## iTerm2

系统自带的终端功能比较弱，因此我们安装功能更强大的`iterm2`来替代它，通过`brew-cask`安装：

```bash
brew cask install iterm2
```
	
你可以把`iTerm2`设置为默认终端：

```
（菜单栏）iTerm -> Make iTerm2 Default Term
```
	
然后可以去这里选择一套配色方案：[http://iterm2colorschemes.com/](http://iterm2colorschemes.com/)（你也可以自己定制配色方案），下载完成后依次选择：`iTerm->Preferences->Profiles->Colors`，然后选择下面的`Load Presets->Import`，选择下载好的`schemes`文件夹里面的`.itermcolors`后缀的文件导入主题即可选择使用。

`iTerm2`有一些常用的快捷键：

```
⌘ + n                   // 新建term窗口
⌘ + t                   // 新建标签页
⌘ + w                   // 关闭标签页或者窗口
⌘ + d / ⌘ + shift + d   // 分屏显示
⌘ + 数字 / ⌘ + <- / ->   // tab标签页之间切换
⌘ + ;                   // 自动补全
...
```
	
还可以自定义一些快捷键，在`iTerm->Preferences->Keys`里面设置，你可以通过快捷键来显示/隐藏`iTerm2`，还可以通过快捷键键入命令，如在`Global Shortcut Keys`里面增加一个自定义的快捷键，`Action`选择`Send Text`输入你想要通过快捷键输入的命令就可以了。

## Zsh

`zsh`是个什么东东呢，它与`bash`到底有什么区别？有人如是说：

> `zsh`是一种更强大的、被成为“终极”的`shell`，意思是`shell`能具备的功能它基本都提供了。`zsh`基本上是兼容`bash`，有些小细节不同，如果写脚本时需要注意。具体参见：[Zsh vs. Bash：不完全对比解析](http://www.soimort.org/posts/163/)。


`Mac`系统自带了`zsh`，一般不是最新版，所以我们通过`Homebrew`来安装最新的：

```bash
brew install zsh
```
	
可通过`zsh --version`命令查看`zsh`的版本。

我们需要把`bash`换成`zsh`：

* 在/etc/shells文件末尾添加：

```bash
/usr/local/bin/zsh
```

* 执行如下命令：

```bash
chsh -s /usr/local/bin/zsh
```
		
* 最后记得将`~/.bash_prorile`或者`~/.profile`等配置拷贝到`~/.zshrc`文件中。

`zsh`功能强大，配置项也很多，不过好在有一个[oh-my-zsh](http://ohmyz.sh/)的东东，它是一个开源的`zsh`配置管理框架，提供了大量实用的功能，主题等。通过如下命令安装：

```bash
curl -L https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh | sh
```
	
然后你就可以选择自己喜欢的[主题](https://github.com/robbyrussell/oh-my-zsh/wiki/Themes)。只需要修改`~/.zshrc`文件中的`ZSH_THEME`即可。

还可以为一些命令配置别名：

```bash
vim ~/.zshrc
```
	
然后加入别名：

```bash
alias subl="open -a ~/Applications/Sublime\\ Text\\ 3.app"
```
	
这样就可以通过命令`subl test.md`来打开文件了。

## tmux

首先`tmux`到底是个什么玩意？按照[tmux官网](http://tmux.github.io/)翻译过来：

> TMUX是终端复用器

简单来说就是一种管理窗口的程序，那么问题来了：为什么要用`tmux`，支持多标签？支持窗体内部Panel的分割？但是这些iTerm2都支持啊，那为何还要用`tmux`呢？看看下面的使用场景。

> 公司服务器上调试程序，开了一堆窗口。出去吃了个饭，发现`ssh`超时了，`broken pipe`。重头开始...FK！如果你之前使用了`tmux`就不会有这样的问题，`attach`就能找回原来打开的那些窗口。


首先安装`tmux`
	
```bash
brew install tmux
```
	
然后就可以在命令行操作`tmux`了：

```bash
tmux                           // 创建一个默认会话，默认会话名从0开始
tmux new-session -s test       // 创建一个名字叫test的会话
tmux new-session -s test -d    // 在后台创建test会话
tmux list-sessions / tmux ls   // 列出所有正在运行的会话
tmux a -t test                 // 进入test会话
tmux kill-session -t test      // 关闭test会话
tmux kill-server               // 关闭tmux服务，所有的会话将被关闭
```
	
下面是`tmux`的一些快捷键操作：

`Prefix-Command`前置操作：所有下面介绍的快捷键，都必须以前置操作开始。`tmux`默认的前置操作是`ctrl + b`。例如，我们想要新建一个窗体，就需要先在键盘上摁下`ctrl + b`，松开后再摁下`n`键。

下面所有的`prefix`均代表`ctrl + b`

**Session相关操作**

| 操作           | 快捷键         |
| ------------- |:-------------:|
| 查看/切换session      | `prefix s` |
| 离开Session     | `prefix d`       |
| 重命名当前Session | `prefix $`     |


**Window相关操作**

| 操作           | 快捷键         |
| ------------- |:-------------:|
| 切换到下一个窗格      | `prefix o` |
| 查看所有窗格的编号     | `prefix q`       |
| 垂直拆分出一个新窗格 | `prefix “`     |
| 水平拆分出一个新窗格 | `prefix %`     |
| 暂时把一个窗体放到最大 | `prefix z`     |

默认的tmux风格比较朴素甚至有些丑陋。如果希望做一些美化和个性化配置的话，建议使用[gpakosz的tmux配置](https://github.com/gpakosz/.tmux)。它的本质是一个`tmux`配置文件，安装方式也很简单：

```bash
cd ~
rm -rf .tmux
git clone https://github.com/gpakosz/.tmux.git
ln -s .tmux/.tmux.conf
cp .tmux/.tmux.conf.local .
```


	

	
	






		

	
	

	 








	

	
	
