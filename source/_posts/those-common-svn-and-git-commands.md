title: 那些常用的svn和git命令
date: 2015-09-03 22:51:37
tags: [svn, git]
categories: technology

---

版本管理基本上是多人协作开发中必不可少的工具，常用的版本管理工具有：svn和git。虽然都有可视化的工具帮助我们使用这些工具，然而当你用上命令行之后，我想你会选择抛弃这些可视化工具。下面是我整理的一些常用的svn和git命令。

<!-- more -->

![git&svn](http://blog.u.qiniudn.com/uploads/git&svn.png)

## Svn篇

首先你可以通过`svn help/h`来查看帮助信息。


### 开始工作

**检出(`checkout`)服务器数据到本地**

你刚入职一家公司，或新加入某个团队，立马参与到一个项目中，那么就得获取项目代码，开始你的项目生涯。这个时候一般你需要检出项目代码：

```bash
svn checkout/co [directory] project(本地目录名，可选)
// 检出版本3
svn checkout/co –revision/r 3 [directory] project(本地目录名，可选)
```
		
接着你就可以通过`svn info`来查看版本信息了。
	
**导入(`import`)项目**

有时候项目尚未创建，你需要将本地的目录放到SVN版本仓库中：

```bash
svn import project(本地目录名) [directory]
```
		
然后可以通过`svn list/ls`确认已经在版本仓库中了。
	
### 更新

每次你开始编码前，你都最好先更新下本地的工作目录：

```bash
cd project
svn update/up
// 更新到版本3
svn update/up –revision/r 3
```
	
这样你就可以在新的项目代码基础上工作了。

### 修改

可能你写了一个新的模块，增加了一些新的文件，需要纳入项目的版本控制：

```bash
svn add index.html list.html ...
```
	
可能你发现某个模块已经陈旧了，不再使用了：

```bash
svn delete/del/remove/rm hello.html
```
	
可能你发现一个模块的命名不太合理，需要改名：

```bash
svn move/mv main.css common.css
```


可能你要创建一个新的较大的模块，需要新增目录：

```bash
svn mkdir list
```

可能你发现要写的模块代码似于旧的模块，直接复制整个代码：
	
```bash
svn copy/cp users/list.js list/list.js
```
	
### 检查

忙碌的一天过去了，或者一个任务完成了，这个时候一般会将你的工作成果，也就是代码更新到版本仓库。

习惯上会先检查下修改状态：

```bash
svn status/stat/st
```
	
看到一些SVN状态位信息，确认是修改了哪些文件，之后一般会自己code review一下代码的改动，可能有的人会习惯直接用SVN方式来查看：

```bash
svn diff/di folder(本地目录名，可选，默认当前目录)
// 查看index.html当前版本和版本3的差别
svn diff/di –revision/r 3 index.html
// 查看index.html版本3和版本4的差别
svn diff/di –revision/r 3:4 index.html
```
	
一般来说这个时候，没有什么特殊情况，就直接进入“提交”阶段了，然后结束一个工作日或工作周期，但难免会有些特殊情况出现。

### 取消修改

当你code review完后，发现有些改动不满意，你可能又会取消这些修改：

```bash
svn revert index.html
// 回滚整个目录
svn revert . -R/--recursive
```
	
### 分支操作
#### 创建分支

**创建一个分支**

```bash
svn copy/cp svn://xxx.com/repo/trunk svn://xxx.com/repo/branches/test -m 'make branch test'
```
	
**把工作目录转到分支**

```bash
svn switch/sw svn://xxx.com/repo/branches/test
```
	
当然，也可以再转到主干`svn switch/sw svn://xxx.com/repo/trunk`。
	
#### 给分支打标签

复制最新的发布分支为标签：

```bash
svn copy/cp svn://xxx.com/repo/branches/test svn://xxx.com/repo/tags/test_tag
```

#### 合并一个分支到主干

**查找到分支版本**

```bash
cd branches/test(分支目录)
svn log –stop-on-copy
```
		
最后一个r11340就是创建分支时的reversion，也可：
	
```bash
cd trunk(主干目录)
svn -q –stop-on-copy svn://xxx.com/repo/branches/test(分支url)
```

这条命令会查询出自创建分支以后分支上的所有修改，最下面的那个版本号就是我们要找的版本号。
	
**合并到主干**
		
```bash
cd trunk（主干目录）
svn merge -r 11340(分支版本):HEAD svn://xxx.com/repo/branches/test(分支url)
```

#### 两个分支合并

假设99是从旧主干引出，100打完tag，表示是新主干。

合并最新代码的意思是：将新主干与旧主干比对，并添加到99中。这样99既有自己的新增的代码，也同时有最新线上的代码。

```bash
cd 99_Branch
svn merge svn://xxx.com/repo/tags/project_Old_BL svn://xxx.com/repo/tags/project_New_BL
svn ci -m 'merge 100 trunk'
```
	
但是后来，其他人又向100提了代码，所以还需要将100分支（即打了tag后的100，打了tag前的100已是主干）合并至99中。

合并办法：找出100分支，比对与新主干之间的差别，并添加到99中。这样99就有最新的全部代码了。
	

```bash
cd 99_Branch
svn merge svn://xxx.com/repo/tags/project_New_BL svn:/xxx.com/repo/branches/100_Branch
svn ci -m 'merge 100 branch'
```
	
#### 发布

给当前主干打个标签，并且这个标签不再改动了，但是实际上标签和分支是一个意思，你可以在标签上继续做改动，但这不推荐。

```bash
svn copy/cp svn://xxx.com/repo/trunk svn://xxx.com/repo/tags/RB-1.0
```

#### 合并主干到分支

```bash
svn merge -r LastRevisionMergedFromTrunkToBranch:HEAD svn:/xxx.com/repo/branches/99_Branch
```
	

### 解决冲突

当发生冲突的时候，会提示如下信息：

> Conflict discovered in 'index.html'.
> 
> Select: (p) postpone, (df) diff-full, (e) edit, 
> 
> (mc) mine-conflict, (tc) theirs-conflict, 
>         
> (s) show all options: 
>    
> svn detects that theres a conflict here and require you to take some kind of action. 


如果你输入s选项，则会列出所有svn解决冲突的选项，如下所示：

> (e) edit - change merged file in an editor #直接进入编辑
>  
> (df) diff-full -show all changes made to merged file #显示更改至目标文件的所有变化 
> 
> (r) resolved -accept merged version of file 
>
> (dc) display-conflict -show all conflicts(ignoring merged version)  #显示所有冲突
> 
>(mc) mine-conflict -accept my version for all conflicts (same) #冲突以本地为准
>
> (tc) theirs-conflict -accept their version for all conflicts (same) #冲突以服务器为准
>
> (mf) mine-full -accept my version of entire file (even non-conflicts) #完全以本地为准
> 
> (tf) theirs-full -accept their version of entire file (same) #完全以服务器为准
> 
> (p) postpone -mark the conflict to be resolved later #标记冲突，稍后解决
> 
> (l) launch -launch external tool to resolve conflict
> 
> (s) show all -show this list

一般我们会选择`p`稍后解决冲突，这样会生成三个文件：.mine, .rOLDREV, .rNEWREV。比如：

```
index.html
index.html.mine
index.html.r1
index.html.r2
```
	
解决冲突方法大致有一下几种：

**手工修改index.html文件，然后将当前index.html作为最后提交的版本**

```bash
svn resolve index.html –-accept working
```

**选择base版本，即index.html.rOLDREV作为最后提交的版本**

```bash
svn resolve index.html –-accept base
```

**使用index.html.rNEWREV作为最后提交的版本**

```bash
svn resolve index.html –-accept theirs-full
```

**使用index.html.mine作为最后提交的版本** 

```bash
svn resolve index.html –-accept mine-full
// 或者用下面这条命令也可以
// svn resolve index.html –-accept theirs-conflict
```
		
### 提交代码

最后，一切确认没问题了：code review完毕，自己觉得代码满意了；然后也合并完别人的修改并且没有冲突了。那么就提交代码吧：

```bash
svn commit/ci -m 'message'
```
	
### 导出代码

你想把你的代码导出，不包含svn版本信息，那么你可以：

```bash
svn export svn://xxx.com/repo/branches/test folder(本地目录)
```
	
## Git篇

### 安装之后第一步

安装 Git 之后，你要做的第一件事情就是去配置你的名字和邮箱，因为每一次提交都需要这些信息：

```bash
git config --global user.name "bukas"
git config --global user.email "bukas@gmail.com"
```
	
获取Git配置信息，执行以下命令：
	
```bash
git config --list
```
	
### 创建版本库
	
什么是版本库呢？版本库又名仓库，英文名repository，你可以简单理解成一个目录，这个目录里面的所有文件都可以被Git管理起来，每个文件的修改、删除，Git都能跟踪，以便任何时刻都可以追踪历史，或者在将来某个时刻可以“还原”。

```bash
mkdir testgit && cd testgit
git init
```
	
瞬间Git就把仓库建好了，细心的读者可以发现当前目录下多了一个`.git`的目录，默认是隐藏的，用`ls -ah`命令就可以看见。

![git-init](http://blog.u.qiniudn.com/uploads/git1.png)

### 把文件添加到版本库

```bash
touch readme.md
git add readme.md
```
	
然后用命令`git commit`告诉Git把文件提交到仓库：

```bash
git commit -m "wrote a readme file"
```
	
简单解释一下`git commit`命令，`-m`后面输入的是本次提交的说明，可以输入任意内容，当然最好是有意义的，这样你就能从历史记录里方便地找到改动记录。

一次可以`add`多个不同的文件，以空格分隔：

```bash
git add a.txt b.txt c.txt
```
	
### 仓库状态

```bash
git status
```
	
`git status`命令可以让我们时刻掌握仓库当前的状态。

但如果能看看具体修改了什么内容就更好了：

```bash
git diff readme.md
```
	
### 版本回退

在实际工作中，我们脑子里怎么可能记得一个几千行的文件每次都改了什么内容，不然要版本控制系统干什么。版本控制系统肯定有某个命令可以告诉我们历史记录，在Git中，我们用`git log`命令查看： 

```bash
git log
```
	
![git-log](http://blog.u.qiniudn.com/uploads/git2.png)
	
`git log`命令显示从最近到最远的提交日志。如果嫌输出信息太多，看得眼花缭乱的，可以试试加上`--pretty=oneline`参数：

```bash
git log --pretty=oneline
```
	
![git-log-pretty](http://blog.u.qiniudn.com/uploads/git3.png)
	
需要友情提示的是，你看到的一大串类似`2e70fd...376315`的是`commit id`（版本号）

在 Git中，用`HEAD`表示当前版本，也就是最新的提交`commit id`，上一个版本就是`HEAD^`，上上一个版本就是`HEAD^^`，当然往上100个版本写100个^比较容易数不过来，所以写成`HEAD~100`。

现在我们要把当前版本回退到上一个版本，就可以使用`git reset`命令：

```bash
git reset --hard HEAD^
```
	
然我们用`git log`再看看现在版本库的状态，最新的那个版本已经看不到了！好比你从21世纪坐时光穿梭机来到了19世纪，想再回去已经回不去了，肿么办？

![git-reset](http://blog.u.qiniudn.com/uploads/git4.png)

办法其实还是有的，只要上面的命令行窗口还没有被关掉，你就可以顺着往上找啊找啊，假设找到那个`commit id`是`2e70fdf...`，于是就可以指定回到未来的某个版本：

```bash
git reset --hard 2e70fdf
```
	
版本号没必要写全，前几位就可以了，Git会自动去找。当然也不能只写前一两位，因为Git可能会找到多个版本号，就无法确定是哪一个了。

现在，你回退到了某个版本，关掉了电脑，第二天早上就后悔了，想恢复到新版本怎么办？找不到新版本的`commit id`怎么办？

Git提供了一个命令`git reflog`用来记录你的每一次命令：

```bash
git reflog
```

![git-reflog](http://blog.u.qiniudn.com/uploads/git5.png)
	 
终于舒了口气，于是你看到的`commit id`是`2e70fdf`，现在，你又可以乘坐时光机回到未来了。

### 工作区和暂存区

Git和其他版本控制系统如SVN的一个不同之处就是有暂存区的概念。

工作区就是你在电脑里能看到的目录，比如我的`testgit`文件夹就是一个工作区。

工作区有一个隐藏目录`.git`，这个不算工作区，而是Git的版本库。

Git的版本库里存了很多东西，其中最重要的就是称为`stage`（或者叫`index`）的暂存区，还有Git为我们自动创建的第一个分支`master`，以及指向 `master`的一个指针叫`HEAD`。

前面讲了我们把文件往 Git 版本库里添加的时候，是分两步执行的：

第一步是用`git add`把文件添加进去，实际上就是把文件修改添加到暂存区；

第二步是用`git commit`提交更改，实际上就是把暂存区的所有内容提交到当前分支。

因为我们创建Git版本库时，Git自动为我们创建了唯一一个`master`分支，所以现在`git commit`就是往`master`分支上提交更改。

你可以简单理解为，`git add`命令实际上就是把要提交的所有修改放到暂存区（Stage），然后执行`git commit`就可以一次性把暂存区的所有修改提交到分支。

一旦提交后，如果你又没有对工作区做任何修改，那么工作区就是“干净”的。

### 修改与撤销

用`git diff HEAD -- readme.md`命令可以查看工作区和版本库里面最新版本的区别。

`git checkout -- file`可以丢弃工作区的修改：

```bash
git checkout -- readme.md
```
	
命令`git checkout -- readme.md`意思就是，把`readme.md`文件在工作区的修改全部撤销，即让这个文件回到最近一次`git commit`或`git add`时的状态。

当然也可以用`git reset`命令。

### 删除文件

一般情况下，你通常直接在文件管理器中把没用的文件删了，或者用`rm`命令删了：

```bash
rm readme.md
```
	
这个时候，Git 知道你删除了文件，因此，工作区和版本库就不一致了，`git status`命令会立刻告诉你哪些文件被删除了。

现在你有两个选择，一是确实要从版本库中删除该文件，那就用命令`git rm`删掉，并且`git commit`：

```bash
git rm readme.md
git commit -m "remove readme.md"
```
	
现在，文件就从版本库中被删除了。

另一种情况是删错了，因为版本库里还有呢，所以可以很轻松地把误删的文件恢复到最新版本：

```bash
git checkout -- readme.md
```
	 
### 生成SSH key

创建 SSH Key。在用户主目录下，看看有没有`.ssh`目录，如果有，再看看这个目录下有没有`id_rsa`和`id_rsa.pub`这两个文件，如果已经有了，可直接跳到下一步。如果没有，打开 Shell（Windows下打开Git Bash），创建SSH Key：

```bash
ssh-keygen -t rsa -C "youremail@example.com"
```
	
你需要把邮件地址换成你自己的邮件地址，然后一路回车，使用默认值即可。

如果一切顺利的话，可以在用户主目录里找到`.ssh`目录，里面有`id_rsa`和`id_rsa.pub`两个文件，这两个就是SSH Key的秘钥对，`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，可以放心地告诉任何人。

然后登录GitHub（或者其它Git代码托管平台），打开`Account settings`，`SSH Keys`页面，点`Add SSH Key`，填上任意`Title`，在`Key`文本框里粘贴`id_rsa.pub`文件的内容。

为什么GitHub需要SSH Key呢？因为GitHub需要识别出你推送的提交确实是你推送的，而不是别人冒充的，而Git支持SSH协议，所以GitHub只要知道了你的公钥，就可以确认只有你自己才能推送。

当然，GitHub允许你添加多个Key。假定你有若干电脑，你一会儿在公司提交，一会儿在家里提交，只要把每台电脑的Key都添加到GitHub，就可以在每台电脑上往GitHub推送了。

### 远程服务器

Git 最强大的功能之一是可以有一个以上的远程服务器（另一个事实，你总是可以运行一个本地仓库）。你不一定总是需要写访问权限，你可以从多个服务器中读取（用于合并），然后写到另一个服务器中。添加一个远程服务器很简单：

```bash
git remote add origin(别名，根据爱好命名) git@github.com:bukas/bukas.git
```
	 
如果你想查看远程服务器的相关信息，你可以这样做：
	
```bash
# shows URLs of each remote server
git remote -v
	
# gives more details about origin
git remote show origin(别名)
```
	
下一步，就可以把本地库的所有内容推送到远程库上：

```bash
git push -u origin master
```
	
把本地库的内容推送到远程，用`git push`命令，实际上是把当前分支`master`推送到远程。

由于远程库是空的，我们第一次推送`master`分支时，加上了`-u`参数，Git不但会把本地的`master`分支内容推送的远程新的`master`分支，还会把本地的`master`分支和远程的`master`分支关联起来，在以后的推送或者拉取时就可以简化命令。

从现在起，只要本地作了提交，就可以通过命令把本地`master`分支的最新修改推送至GitHub：

```bash
git push origin master
```
	
**SSH警告**

当你第一次使用Git的`clone`或者`push`命令连接GitHub时，会得到一个警告：

> The authenticity of host 'github.com (xx.xx.xx.xx)' can't be established.
> 
> RSA key fingerprint is xx.xx.xx.xx.xx.
> 
> Are you sure you want to continue connecting (yes/no)?
	
这是因为Git使用SSH连接，而SSH连接在第一次验证GitHub服务器的Key时，需要你确认 GitHub的Key的指纹信息是否真的来自GitHub的服务器，输入`yes`回车即可。

### 从远程库克隆

当已经有一个远程库的时候，我们可以用命令`git clone`克隆一个本地库：

```bash
git clone git@github.com:test/testgit.git
```
	
你也许还注意到，GitHub给出的地址不止一个，还可以用`https://github.com/test/testgit.git`这样的地址。实际上Git支持多种协议，默认的`git://`使用`ssh`，但也可以使用 `https`等其他协议。使用`https`除了速度慢以外，还有个最大的麻烦是每次推送都必须输入口令，但是在某些只开放`http`端口的公司内部就无法使用`ssh`协议而只能用`https`。

### 创建与合并分支

首先我们创建`dev`分支，然后切换到`dev`分支：

```bash
git checkout -b dev
```
	
`git checkout`命令加上`-b`参数表示创建并切换，相当于以下两条命令：

```bash
git branch dev
git checkout dev
```
	
然后用`git branch`命令查看当前分支：

```bash
git branch
```
	
我们在`dev`分支上进行添加修改操作，然后我们把`dev`分支的工作成果合并到`master`分支上：

```bash
git checkout master
git merge dev
```
	
`git merge`命令用于合并指定分支到当前分支。

注意到`git merge`的信息里面可能有`Fast-forward`字样，Git告诉我们，这次合并是“快进模式”，也就是直接把`master`指向`dev`的当前提交，所以合并速度非常快。

当然也不是每次合并都能`Fast-forward`。

合并完成后，就可以放心地删除`dev`分支了：

```bash
git branch -d dev
```
	
如果要丢弃一个没有被合并过的分支，可以通过`git branch -D <branch>`强行删除。

在本地创建和远程分支对应的分支，使用`git checkout -b branch-name origin/branch-name`，本地和远程分支的名称最好一致；

建立本地分支和远程分支的关联，使用`git branch --set-upstream branch-name origin/branch-name`；

从远程抓取分支，使用`git pull`，如果有冲突，要先处理冲突。
	
### 解决冲突

人生不如意之事十之八九，合并分支往往也不是一帆风顺的。

有时候我们进行合并的时候，会提示有冲突出现`CONFLICT (content)`，必须手动解决冲突后再提交。`git status`也可以告诉我们冲突的文件。

打开冲突文件我们会看到Git用`<<<<<<<`，`=======`，`>>>>>>>`标记出不同分支的内容，我们修改后提交：

```bash
git add readme.md
git commit -m "conflict fixed"
```
	
用带参数的`git log`也可以看到分支的合并情况：

```bash
git log --graph --pretty=oneline --abbrev-commit
```
	
### 分支管理策略

通常，合并分支时，如果可能，Git会用`Fast forward`模式，但这种模式下，删除分支后，会丢掉分支信息。

如果要强制禁用`Fast forward`模式，Git就会在`merge`时生成一个新的`commit`，这样，从分支历史上就可以看出分支信息。

下面我们实战一下`--no-ff`方式的`git merge`：

首先，仍然创建并切换`dev`分支：

```bash
git checkout -b dev
```
	
修改`readme.md`文件，并提交一个新的`commit`：

```bash
git add readme.md
git commit -m "add merge"
```
	
现在，我们切换回`master`：

```bash
git checkout master
```
	
准备合并`dev`分支，请注意`--no-ff`参数，表示禁用`Fast forward`：

```bash
git merge --no-ff -m "merge with no-ff" dev
```
	
### Bug分支

软件开发中，bug就像家常便饭一样。有了bug就需要修复，在Git中，由于分支是如此的强大，所以，每个bug都可以通过一个新的临时分支来修复，修复后，合并分支，然后将临时分支删除。

当你接到一个修复一个代号101的bug的任务时，很自然地，你想创建一个分支`issue-101`来修复它，但是，等等，当前正在`dev`上进行的工作还没有提交。

并不是你不想提交，而是工作只进行到一半，还没法提交，预计完成还需1天时间。但是，必须在两个小时内修复该bug，怎么办？

幸好，Git还提供了一个`stash`功能，可以把当前工作现场“储藏”起来，等以后恢复现场后继续工作：

```bash
git stash
```
	
现在，用`git status`查看工作区，就是干净的（除非有没有被 Git 管理的文件），因此可以放心地创建分支来修复bug。

首先确定要在哪个分支上修复bug，假定需要在`master`分支上修复，就从`master`创建临时分支：

```bash
git checkout master
git checkout -b issue-101
```
	
现在修复bug，然后提交：

```bash
git add readme.md
git commit -m "fix bug 101"
```
	 
修复完成后，切换到`master`分支，并完成合并，最后删除`issue-101`分支：

```bash
git checkout master
git merge --no-ff -m "merged bug fix 101" issue-101
```
	
太棒了，原计划两个小时的bug修复只花了5分钟！现在，是时候接着回到`dev`分支干活了！

```bash
git checkout dev
git status
```
	
工作区是干净的，刚才的工作现场存到哪去了？用`git stash list`命令看看：

```bash
git stash list
```
	 
工作现场还在，Git把`stash`内容存在某个地方了，但是需要恢复一下，有两个办法：

一是用`git stash apply`恢复，但是恢复后，`stash`内容并不删除，你需要用`git stash drop`来删除；

另一种方式是用`git stash pop`，恢复的同时把`stash`内容也删了：

```bash
git stash pop
```
	
再用`git stash list`查看，就看不到任何`stash`内容了。

你可以多次`stash`，恢复的时候，先用`git stash list`查看，然后恢复指定的`stash`，用命令

```bash
git stash apply stash@{0}
```
	
	
### 标签管理

发布一个版本时，我们通常先在版本库中打一个标签，这样，就唯一确定了打标签时刻的版本。将来无论什么时候，取某个标签的版本，就是把那个打标签的时刻的历史版本取出来。所以，标签也是版本库的一个快照。

命令`git tag <tagname>`用于新建一个标签，默认为`HEAD`，也可以指定一个`commit id`。

`git tag -a <tagname> -m "blablabla..."`可以指定标签信息。

还可以通过`-s`用私钥签名一个标签：

```bash
git tag -s v0.5 -m "signed version 0.2 released" fec145a
```
	
`git tag`可以查看所有标签。

用命令`git show <tagname>`可以查看某个标签的详细信息。

如果标签打错了，也可以删除：

```bash
git tag -d v0.1
```
	
因为创建的标签都只存储在本地，不会自动推送到远程。所以，打错的标签可以在本地安全删除。

如果要推送某个标签到远程，使用命令`git push origin <tagname>`：

```bash
git push origin v1.0
```
	
或者，一次性推送全部尚未推送到远程的本地标签：

```bash
git push origin --tags
```
	
如果标签已经推送到远程，要删除远程标签就麻烦一点，先从本地删除：

```bash
git tag -d v0.9
```
	
然后，从远程删除。删除命令也是`push`，但是格式如下：

```bash
git push origin :refs/tags/v0.9
```
	
### 忽略特殊文件

在安装Git一节中，我们已经配置了`user.name` 和`user.email`，实际上，Git还有很多可配置项。

比如，让Git显示颜色，会让命令输出看起来更醒目：

```bash
git config --global color.ui true
```
	
有些时候，你必须把某些文件放到Git工作目录中，但又不能提交它们，比如保存了数据库密码的配置文件啦，等等，每次`git status`都会显示Untracked files...，有强迫症的童鞋心里肯定不爽。

好在Git考虑到了大家的感受，这个问题解决起来也很简单，在 Git工作区的根目录下创建一个特殊的`.gitignore`文件，然后把要忽略的文件名填进去，Git就会自动忽略这些文件。

不需要从头写`.gitignore`文件，GitHub已经为我们准备了各种配置文件，只需要组合一下就可以使用了。所有配置文件可以直接在线浏览：[https://github.com/github/gitignore](https://github.com/github/gitignore)

当然也可以配置全局忽略的文件，这样就不用每个项目都加gitignore了：

```bash
git config --global core.excludesfile '~/.gitignore'
```

### 配置别名

有没有经常敲错命令？比如`git status`？`status`这个单词真心不好记。

如果敲`git st`就表示`git status`那就简单多了，当然这种偷懒的办法我们是极力赞成的。

我们只需要敲一行命令，告诉Git，以后`st`就表示`status`：

```bash
git config --global alias.st status
```
	
当然还有别的命令可以简写：
	
```bash
git config --global alias.co checkout
git config --global alias.ci commit
git config --global alias.br branch
```
	
`--global`参数是全局参数，也就是这些命令在这台电脑的所有Git仓库下都有用。

在撤销修改一节中，我们知道，命令`git reset HEAD file`可以把暂存区的修改撤销掉（`unstage`），重新放回工作区。既然是一个`unstage`操作，就可以配置一个`unstage`别名：

```bash
git config --global alias.unstage 'reset HEAD'
```
	
配置一个`git last`，让其显示最后一次提交信息：

```bash
git config --global alias.last 'log -1'
```
	 
甚至还有人把`lg`配置成了：

```bash
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```
	
**配置文件**

配置Git的时候，加上--global是针对当前用户起作用的，如果不加，那只针对当前的仓库起作用。

配置文件放哪了？每个仓库的Git配置文件都放在`.git/config`文件中。

而当前用户的Git配置文件放在用户主目录下的一个隐藏文件`.gitconfig`中。




	






	  

  		
  	


	

	
