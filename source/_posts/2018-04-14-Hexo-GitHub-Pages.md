---
title: Hexo + GitHub Pages 博客搭建
date: 2018-04-14 10:41:26
updated: 2018-04-19
tags: 
	- Hexo
	- Github Pages
description: <center>基于Hexo框架和GitHub Pages托管服务的个人博客搭建过程</center>
---
# 本地 - Hexo博客框架

Hexo是一个基于**Node.js**的博客框架, 我们会在本地维护一个Hexo项目, 并在需要发布时使用**Git**将其部署到Github Pages.

> Hexo[官方网站](https://hexo.io/zh-cn/)及[中文文档](https://hexo.io/zh-cn/docs/)

## Node.js环境搭建

在[Node.js官方下载页面](https://nodejs.org/en/download/)可以下载到全平台各种形式的Node.js资源, 这里直接给出当前(2018年4月中旬)最新的长期支持版Windows64位安装包[下载链接](https://nodejs.org/dist/v8.11.1/node-v8.11.1-x64.msi).

安装完成后打开命令提示符*(Win + R运行`cmd`)*, 输入`node -v`验证Node.js环境配置成功, 输入`npm -v`验证Node.js的包管理器安装成功.

![验证Node.js环境配置与npm安装](验证Node.js环境配置与npm安装.png "验证Node.js及npm安装")

## Git环境搭建

在[Git官方下载页面](https://git-scm.com/downloads)可以下载到全平台的Git安装包.

**未翻墙**用户在[Git for Windows 国内下载站](https://github.com/waylau/git-for-win)可以下载到Windows平台的Git安装包.

![Git安装](Git安装.png "Git安装")

下图中的Windows资源管理器目录下的右键菜单选项`Git Bash Here`会取代Windows自带的命令提示符, 是后续的基本操作.

![Git右键菜单](Git右键菜单.png "Git右键菜单")

安装完成后在任意目录下右键空白处`Git Bash Here`后输入`git --version`验证Git安装成功.

![验证Git安装](验证Git安装.png "验证Git安装")

## Hexo框架安装

在Git Bash中输入`npm install -g hexo-cli`以安装Hexo框架.

Windows平台上可能会有如下两个WARN, 提示可选依赖`fsevent`安装失败, 因为需要的系统环境是OS X的darwin, **忽略**即可.

> `npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.1.3 (node_modules\hexo-cli\node_modules\fsevents):`
>
> `npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"  win32","arch":"x64"})`

安装完成后继续输入`hexo version`验证安装.

![验证Hexo安装](验证Hexo安装.png "验证Hexo安装")

## 创建一个博客

详细内容请参考Hexo官方文档中的[建站](https://hexo.io/zh-cn/docs/setup.html)

可以在想要创建博客所在目录运行Git Bash命令行输入`hexo init blogname`, 其中`blogname`是博客名称, 也可以先创建`blogname`子目录并在其中运行`hexo init`, 结果是一样的. 下图中使用的是后一种方式.

![创建博客](创建博客.png "创建博客")

上图中的`npm install`命令应该是用来安装所需的Nodejs模块的, 笔者感觉只是起到确保更新到最新的作用.

现在我们得到了`blogname`这个目录, 它将是我们的博客在本地磁盘的实例, 是未发布的线下版本, 我们对博客的各种配置, 博文的创建与编辑, 都是在这里进行的.

## 本地预览博客

上面我们已经创建了一个崭新的博客, 就先来看看它对应的网页是什么样子吧. 

在博客目录下运行Git Bash命令`hexo server`或其简写`hexo s`

根据命令的回显, 访问http://localhost:4000, 即可浏览该博客.

![预览博客](预览博客.png "预览博客")

我们看到的会是hexo默认的博客, landscape主题, 标题是Hexo, 只有一篇Hello World博文作为快速指南.

初级阶段, 我们的想法很简单:

- 博客标题总得改成自己的命名, 这会涉及到基本的博客[配置](https://hexo.io/zh-cn/docs/configuration.html);
- 起码要把默认的博文换成自己写的, 这会涉及到博文的[写作](https://hexo.io/zh-cn/docs/writing.html).

不过这就是本地博客的事情了, 我们暂且放下这些, 继续搭建过程.

# 云端 - GitHub Pages

> GitHub Pages [官方网站](https://pages.github.com)以及[官方帮助](https://help.github.com/categories/github-pages-basics/)
>

> GitHub Pages is a static site hosting service designed to host your personal, organization, or project pages directly from a GitHub repository.

简单说, GitHub Pages是一个静态网站托管服务. 很巧的是Hexo就是一个静态博客框架, 而且目前为止我们已经在本地准备好了一个Hexo博客. 所以我们需要创建一个用来部署网站的代码仓库, 就可以把博客托管在上面了.

## 创建博客专用仓库

用你自己的[GitHub账号](https://github.com/join)进行[New repository](https://github.com/new)操作, 详细配置如下, **替换**`liolok`为你的GitHub账号用户名(与左边的Owner**一致**)即可.

![创建仓库](创建仓库.png "创建仓库")

在此之后, 这个独属于你的GitHub代码仓库就可以用来部署你的博客了.

## 配置Git本地个人信息

将向repo提交commits的身份设为你自己.

在Git Bash中运行下面两条命令:

`git config --global user.name "你的用户名"`

`git config --global user.email "注册邮箱"`

## 修改博客的部署配置

详细内容请参考官方文档中的[部署](https://hexo.io/zh-cn/docs/deployment.html)

博客目录下的`_config.yml`是博客整体配置文件, 我们修改其中的`deploy`部分为自己的参数.

```YML
deploy:
  type: git
  repo: https://github.com/你的用户名/你的用户名.github.io.git
  branch: master
```

![修改部署配置](修改部署配置.png "修改部署配置")



## 部署博客到代码仓库

在博客目录下运行Git Bash并输入`hexo deploy -generate`或其简写`hexo -d -g`, 让Hexo在生成静态文件完毕后自动部署网站到前面配置好的GitHub代码仓库.

![部署博客](部署博客.png "部署博客")

如上图所示, 在(第一次)部署时会弹出GitHub的登陆对话框, 登录即可.

稍等片刻, 访问`https://你的用户名.github.io`, 博客应该已经呈现在眼前了.