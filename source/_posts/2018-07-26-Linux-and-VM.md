---
title: Linux 发行版推荐及虚拟机部署方案
tags: [Linux, 虚拟机]
description: <center>Linux 是一款自由且开源的操作系统，新用户/初学者会面临诸多选择。</br>本文以学习 Linux 为目的，从各个层次出发，帮助读者快速做出选择。</center>
date: 2018-07-26 10:00:00
updated: 2018-10-10 00:40:00
---

# 发行版

Linux 发行版，[Linux发行版 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/Linux%E5%8F%91%E8%A1%8C%E7%89%88)

[Linux distribution - Wikipedia](https://en.wikipedia.org/wiki/Linux_distribution)

先说结论，相比所谓新手友好的 Ubuntu，笔者更推荐基于 Arch Linux 的 Manjaro。

Manjaro 致力于让强大的 Arch 更方便用户使用，继承了 Arch 的丰富软件和健全文档([ArchWiki](https://wiki.archlinux.org/))，同时在开箱即用方面也下足了功夫，最近一年内已经成为全球第一的发行版(数据来源: [DistroWatch Page Hit Ranking](https://distrowatch.com/dwres.php?resource=popularity))。

下载页面 [Get Manjaro | Manjaro Linux](https://manjaro.org/get-manjaro/)，注意校验镜像文件信息。

# 桌面环境

*桌面环境（Desktop Environment，简称 DE）通过汇集使用相同组件库的程序，为用户提供了完全的图形用户界面。——[ArchWiki](https://wiki.archlinux.org/index.php/Desktop_environment_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)*

> 2018 的十一黄金周刚刚过去，笔者从无桌面环境仅窗口管理器的 Arch + i3wm 上坚持了半个多月后终于败下阵来，真香了 Arch + KDE。切身体会过了 DE 为用户做的一系列事情，笔者时间也是一种成本，一个靠谱的 DE 意味着，我们新用户无需繁多的手动配置，降低使用成本。

在下载页面可以看到，Manjaro 官方支持三大主流桌面环境，分别是 Gnome，KDE 和 Xfce。审美因人而异，笔者并不想对比三者的“颜值”，下面从需求出发按优先级进行建议。

1. 配置较低，需要节约资源占用？请使用三者中最轻量的 Xfce；
2. 好奇心强，想折腾设置？可以尝试三者中可配置项最多的 KDE；
3. 不考虑占用也不想折腾设置？可以尝试笔者又爱又恨、不知道怎么推荐的 Gnome。

# 虚拟机

为什么推荐初学者使用虚拟机而不是实体机：
- 系统安装：只需镜像文件、简单配置和全盘安装即可；实体机需要考虑安装媒介和硬件兼容性；
- 面对故障：合理运用的快照功能，系统崩溃时可以轻松恢复如初；实体机上先积累一定的 Windows/Mac 维护经验再谈进阶吧；
- 使用习惯：通过剪贴板共享和文件拖放，可以在熟悉的宿主系统下查阅资料同时对虚拟机中的 Linux 系统进行操作；实体机上多半会先在中文输入法和科学上网等方面花时间踩坑。

笔者使用 VMware Workstation，下载页面 [Download VMware Workstation Pro](https://www.vmware.com/products/workstation-pro/workstation-pro-evaluation.html)，许可证密钥 [VMware Workstation 15 Pro Keygen](https://aite.me/vmware.php)。

如果读者是正版/开源软件用户，推荐 VirtualBox，日常使用体验并不逊于 VMware，下载页面 [Oracle VM VirtualBox - Downloads](http://www.oracle.com/technetwork/server-storage/virtualbox/downloads/index.html)。

# 为 Linux 创建一个新的虚拟机

> 本章节及后续内容有待改进及更新

在虚拟机软件中, 使用从发行版官网下载的镜像文件新建一个的虚拟机, 配置如下:

- 系统: Linux 4.x 或更高版本内核 64 位;
- 目录: 空间足够则建议放在 SSD, 相比机械硬盘体验会有所提升;
- 磁盘: 建议不小于 `30G`, 并存储为单个文件, 笔者分配了 `40G`;
- 内存: 建议不低于 `2G`, 也不建议超过物理内存的一半, 笔者分配了 `4G`/`16G`;
- 处理器: `数量` <= `核心数`, `内核数量` <= `线程数`/`核心数`, 如笔者的 E3 1231 v3 是四核八线程, 配置见下图;
- 显示(可选): 配置足够的情况下可以开启 `3D 图形加速` 并适当分配显存以提升使用体验.

![处理器配置示例](2018-07-22-Linux-kernel-compilation-and-adding-syscall/vmware_cpu.png)
<center>处理器配置示例</center>

配置完成后运行虚拟机, 进入 LiveCD 环境后运行安装程序, 可以调整语言和地区并进行用户名和密码等配置, 硬盘分区直接选择全盘安装即可.

