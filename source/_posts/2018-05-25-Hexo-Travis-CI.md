---
title: Hexo + Travis CI 博客管理
tags: [Hexo, Travis CI]
description: <center>Hexo 博客版本控制 & Travis CI 自动部署</center>
date: 2018-05-25 09:20:33
updated: 2018-05-26 19:25:33
---

# 博客的部署流程

## 最初的基本流程

[博客搭建](https://liolok.github.io/2018/04/14/Hexo-GitHub-Pages/)一文中写过从本部署到云端, 这两者分别对应着什么呢?

- 本地的博客实例, 里面有我们用markdown写的文章, 有文章引用的资源比如图片, 还有博客以及主题的各种配置文件. 我觉得这些可以叫做"博客源码".
- 云端的GitHub Repository, 以`username.github.io`命名, 默认分支master里面是托管给GitHub Pages的静态网站文件. 我觉得可以叫做"博客站点".

按照之前的流程, 我们在本地目录创建一个Hexo框架的博客实例, 然后进行配置与写作, 本地预览调试觉得没问题可以上线博客了, 再将博客生成静态网站文件并部署到GitHub的repo上. 不出意外的话, 很快就能看到网站已经可以访问了.

![旧的流程](旧的流程.png)

> 上图中的部署(deploy)其实就是hexo封装好的`git push`, 将生成好的静态文件目录`./public`推到配置好的repo相应的branch上, 参见前文中的[修改博客的部署配置](https://liolok.github.io/2018/04/14/Hexo-GitHub-Pages/#修改博客的部署配置)一节.

用了半个月发现这个流程确实有问题, 这就涉及到Git的本质 ---- **版本控制**. 通过每次commit及其message, 我们可以看到博客的变迁过程, 也可以在出了错误的时候吃一吃后悔药, 这些都是版本控制的效果.

我想那肯定要好好利用啊, 正好学习学习Git以及GitHub的基本操作. 结果我更迷茫了:

每次对博客做了改动, 小心翼翼地`hexo d -g -m "更新说明"`, 然后在repo的commits记录里查看时, 却发现根本看不到自己对于博客**配置或者文章**的改动, 出现在眼前的是经由Hexo和exT渲染生成的HTML和CSS这些**静态文件**. 我就一个博客框架用户, 也看不懂啊. 这就好比我写了C的代码, 提交上去之后想看看代码变化, 却发现全是汇编甚至机器码. 这不是我想要的"**版本控制**".

## 目前的较新流程

生成的静态站点文件什么的, 就照旧放在repo的master分支好了, GitHub Pages会帮你把后面的事情做好. 而版本控制的对象, 不应该是master分支里的静态站点, 而是博客实例, 这里面才是实际的博客配置和文章, 我们关心的是这些.

那么如何实现呢? 我参考了很多博文和讨论, 看完了八仙过海之后, 我个人的做法是: 把博客实例整个push到repo的新建分支source, 并使用Travis CI将source分支里的博客实例自动部署到master分支. 这样一来, 重心放在博客本身上, 后面的生成静态文件和部署, 交给Travis CI去做, 我们只看结果, 没毛病就不问过程.

![较新的流程](较新的流程.png)

# 博客实例的版本控制

## 创建 source 分支

```bash
# 克隆项目到本地目录
git clone https://github.com/用户名/用户名.github.io.git
# 进入项目
cd 用户名.github.io/
# 创建并切换到 source 分支
git checkout -b source
```

保留目录下的.git文件夹, 删除其他文件, 将之前已创建好的博客实例迁移至`用户名.github.io`目录下, 继续后面的步骤.

## 添加 gitignore 列表

创建/修改`.gitignore`文件
```
node_modules/ 
public/
db.json
```
> `node_modules`目录是hexo博客实例的npm环境依赖, 据说是质量比黑洞还大的物体(笑). 我们选择忽略它, 反正最后到了Travis那里也会重新跑一遍`npm install`, 这些东西本来也会删了重来, 没有同步的意义.
> 
> `public`目录是hexo生成的静态文件, `db.json`是数据库文件, 同理, 由于Travis构建流程中会执行`hexo clean`, 都不需要同步.

## 配置主题子模块

关于博客实例根目录下themes中的主题有两种做法:

1. 将主题打包下载并解压到themes对应子目录下
2. 使用`git clone`将主题拉取到themes对应子目录下

> 如选择第一种方式, 则不需要配置git的子模块. 如需更新主题, 可以定期打包下载新版本并手动解决冲突, 使用新的特性同时保留自定义的配置.

我还是选择更git一点, 使用子模块功能实现主题甚至主题插件的添加及更新.

### fork 主题项目

比如我选择使用NexT主题, 就需要先去其项目主页[theme-next/hexo-theme-next](https://github.com/theme-next/hexo-theme-next)进行fork, 得到一个[liolok/hexo-theme-next](https://github.com/liolok/hexo-theme-next). 这样一来, 我就可以针对我的需求定制主题的同时, 通过git更新主题.

### 添加子模块

创建/修改`.gitmodules`文件

```
[submodule "themes/next"]
    path = themes/next
    url = https://github.com/liolok/hexo-theme-next
```

### 设置上游项目

```bash
cd themes/next/
git remote add upsteam https://github.com/theme-next/hexo-theme-next
```


# Travis CI 自动部署

## GitHub 账号的 Personal Access Token

> Travis CI 需要的 Token 才能有相应的权限替我们自动完成特定的操作.

进入账号的设置(`settings`), 左侧菜单最下方的`Developer settings`选项, 继续选择`Personal access tokens`, 通过右上方的`Generate new token`生成一个Travis CI自动部署博客专用的Token.

![生成Token](生成Token.png)

如上图所示, 填写Token用途后, 选中`repo`权限即可, 通过下方(权限列表略长, 往下翻页即可)的`Generate token`按钮完成生成, 并及时复制Token, 妥善保管.

![复制Token](复制Token.png)

## Travis CI 线上配置

### 使用GitHub账号登入
![使用GitHub账号登入Travis CI](Configure-Travis-CI-0.png)
<center>使用GitHub账号登入Travis CI</center>

### 开启repo的自动构建
![开启repo的自动构建并进入详细设置](Configure-Travis-CI-1.png)
<center>开启repo的自动构建并进入详细设置</center>

### 详细设置及添加Token
![详细设置及添加Token](Configure-Travis-CI-2.png)
<center>详细设置及添加Token</center>

> 因为repo下有两个分支: master和source, 开启上图中的`Build only if .travis.yml is present`选项, 保证不包含.travis.yml配置文件的master分支不会被监测变动以致循环构建.

## 构建流程配置

博客实例根目录下我所使用的.travis.yml配置:

```YAML
language: node_js  #设置语言

node_js: stable  #设置相应的版本

# 开始构建
before_install:
  - export TZ='Asia/Shanghai'  #统一构建环境和博客配置的时区, 防止文章时间错误
  
install:
  - npm install  #配置Hexo环境

script:
  - hexo cl  #清除
  - hexo g  #生成

after_script:
  - cd ./public
  - git init
  - git config user.name "your-username"  #用户名
  - git config user.email "your-email"  #邮箱
  - git add .
  - git commit -m "Site deployed by Travis CI"  #提交Commit时的说明
  - git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:master  #GH_TOKEN是在Travis中配置Token的名称
# 结束构建

branches:
  only:
    - source  #只监测master之外新增的source分支
env:
 global:
   - GH_REF: github.com/username/username.github.io.git  #设置GH_REF

cache:
  directories:  #缓存特定目录, 加快构建速度
    - node_modules

```

> - 从上面的配置文件中可以看到, Travis CI的构建流程中并没有使用`hexo d`这一命令, 而是在`hexo g`生成静态文件后直接将整个静态文件夹全新push到master分支, 这也体现了前面说到的"无需对站点文件进行版本控制".
> - 由于不再需要`hexo d`命令, 我们完全可以把博客实例中的hexo-deployer-git插件及其相关的部署配置全部精简掉. 这样也能确保本地的博客实例不会误操作命令.

# 参考资料

- [使用hexo，如果换了电脑怎么更新博客？](https://www.zhihu.com/question/21193762)参考了大多数回答里的做法, 决定采用同repo下双branch的做法进行博客版本控制, 并使用Travis CI实现自动部署.

## 子模块相关

- [Hexo博客源码管理 - 使用Git子模块 | 辛未羊的博客](https://panqiincs.me/2017/08/06/hexo-blog-code-management/#使用Git子模块)
- [手动配置Git的Submodule | Strago's Corner](http://blog.strago.xin/2016/GitSubmodule/)
- [坑3： travis CI自动构建部署之后，博客页面空白，什么也没有 | CodingLife](http://magicse7en.github.io/2016/03/27/travis-ci-auto-deploy-hexo-github/#%E5%9D%913%EF%BC%9A-travis-CI%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BA%E9%83%A8%E7%BD%B2%E4%B9%8B%E5%90%8E%EF%BC%8C%E5%8D%9A%E5%AE%A2%E9%A1%B5%E9%9D%A2%E7%A9%BA%E7%99%BD%EF%BC%8C%E4%BB%80%E4%B9%88%E4%B9%9F%E6%B2%A1%E6%9C%89)

## Travis CI 相关

- [使用 Travis CI 持续构建 Hexo | neoFelhz's Blog](https://blog.nfz.moe/archives/hexo-auto-deploy-with-travis-ci.html), 参考了Travis线上配置选项以及source开启分支保护.
- [使用Travis CI自动部署Hexo博客 | IT范儿](http://www.itfanr.cc/2017/08/09/using-travis-ci-automatic-deploy-hexo-blogs/#%E5%88%9B%E5%BB%BA-travis-yml-%E6%96%87%E4%BB%B6), 参考了其中最简单版本的`.travis.yml`配置文件, 不考虑对站点文件的版本控制.
