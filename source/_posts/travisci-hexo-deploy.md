title: 使用travis-ci自动部署hexo博客
date: 2016-03-13 16:51:37
tags: hexo
categories: technology
---

travis-ci是一个持续集成工具，目前已经支持大部分主流语言了，如：node.js、objective-c、android、php、c、java、python、ruby、go等等。travis ci与github集成非常紧密，官方的集成测试托管只支持github项目，而且它对于公有的github仓库免费。在这篇文章中，我将介绍如何通过travis-ci自动化部署hexo博客。

<!-- more -->

## 开启travis-ci

首先去[travis-ci](https://travis-ci.org)官网，点击右上角`Sign in with GitHub`通过github授权登录。然后去到个人信息页面，开启需要使用travis的项目关：

![travis-ci](http://77g5i3.com1.z0.glb.clouddn.com//uploads/travis-ci-start.png)

## 加密私钥

首先我们要安装travis-ci的命令行工具

```bash
gem install travis
```

然后通过命令行登录travis-ci：

```bash
# https://github.com/travis-ci/travis.rb#login
travis login --auto
```

登录需要输入github用户名和密码。如果不想通过用户名登录的话，也可以通过github-token登录（反正我是通过这种方式登录的，通过输入用户名密码登录总是报`Validation Failed`的错误）：

```bash
travis login --github-token 'token'
```

github-token可以去[https://github.com/settings/tokens](https://github.com/settings/tokens)查看，如果`Personal access tokens`列表里面有的话可以选中一个点击`Edit`，然后点击`Regenerate token`重新生成就可以看到token了。没有的话点击`Generate new token`生成一个token。

![github-token](http://77g5i3.com1.z0.glb.clouddn.com/github-token.png)

可以检查一下是否登录成功：

```bash
travis whoami
```

接着我们需要对ssh私钥`id_rsa`进行加密：

```
# github支持对每个项目设置Deploy keys，并且赋予读取权限
# 所以ssh私钥最好是单独为当前项目准备的，不然travis就对整个账户有了控制权限
# 你可以通过ssh-keygen命令生成一个新的ssh密钥对
# 然后添加到项目的Settings->Deploy keys里面，并注意勾上Allow write access

travis encrypt-file ~/.ssh/id_rsa --add
```

其中`--add`参数，travis的客户端会自动检测当前目录中的git信息，并且把生成的解密key添加到`.travis.yml`中去。在进行此步操作前，目录下要先存在`.travis.yml`文件，否则会报错。

关于`encrypt-file`详细用法可以查看travis api文档[encrypting-files](https://docs.travis-ci.com/user/encrypting-files/)

执行完上面的命令之后，会在当前目录生成一个`id_rsa.enc`的加密文件，我们可以在当前项目新建一个`.travis`的目录，然后把该文件放到此目录一起添加至git仓库。

由于git在第一次连接的时候会询问`Are you sure you want to continue connecting (yes/no)?`，因此我们需要配置一下ssh让它不询问。在项目的`.travis`目录下面新建`ssh_config`文件，下面是我的配置，可以根据你的需要修改：

```
Host github.com
    User git
    StrictHostKeyChecking no
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes

Host gitcafe.com
    User git
    StrictHostKeyChecking no
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes

Host git.coding.net
    User git
    StrictHostKeyChecking no
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
```

到此构建准备工作完毕。

## 构建配置

上面的操作就是为了让travis-ci对仓库拥有push权限，但是又不能把我们的私钥暴露出去。

下面就是我的`.travis.yml`文件的配置信息：

```yml
language: node_js

sudo: false

# master为hexo博客所在分支
branches:
  only:
  - master

before_install:
- openssl aes-256-cbc -K $encrypted_0a6446eb3ae3_key -iv $encrypted_0a6446eb3ae3_key -in .travis/id_rsa.enc -out ~/.ssh/id_rsa -d
- chmod 600 ~/.ssh/id_rsa
- eval $(ssh-agent)
- ssh-add ~/.ssh/id_rsa
- cp .travis/ssh_config ~/.ssh/config
- git config --global user.name 'bukas'
- git config --global user.email 'bukas@gmail.com'

install:
- npm install hexo-cli -g
- npm install

script:
- hexo clean
- hexo g
- hexo d
```

其中的`$encrypted_0a6446eb3ae3_key`便是你`travis encrypt-file`的时候生成的。如果你在执行`encrypt-file`的时候存在`.travis.yml`文件，它将会自动把`openssl ...`这段添加进去。

有关`.travis.yml`文件的更多配置可以看这里：[customizing-the-build](https://docs.travis-ci.com/user/customizing-the-build/)

## 结语

把你的项目修改提交一下，你将在travi-ci看到一条build信息。

如果你也想在github的README.md显示构建成功与否的标示，你可以这样：

```md
[build-info](https://travis-ci.org/userName/repoName.svg)
```








