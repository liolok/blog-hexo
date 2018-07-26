---
title: Linux 系统及虚拟机新手指南
tags: [操作系统, 课程设计, Linux, 虚拟机]
description: <center></center>
date: 2018-07-26 10:00:00
updated: 2018-07-27 02:16:31
---

> Linux 是一款自由且开源的操作系统, 新用户会面临诸多选择. 本文以新手**学习** Linux 为目的, 从各个层次出发, 帮助读者快速做出选择.

# Linux 发行版及桌面环境

先说结论, 相比所谓新手友好的 Ubuntu, 笔者个人更倾向于基于 Arch Linux 的 Manjaro. 它致力于让强大的 Arch 更方便用户使用, 继承了 Arch 的丰富软件和健全文档([ArchWiki](https://wiki.archlinux.org/)), 同时在开箱即用方面也下足了功夫, 最近一年内已经成为全球第一的发行版(数据来源: [DistroWatch Page Hit Ranking](https://distrowatch.com/dwres.php?resource=popularity)).

下载页面 [Get Manjaro | Manjaro Linux](https://manjaro.org/get-manjaro/), 注意校验镜像文件信息.

Manjaro 官方支持三大传统桌面环境, 分别是 Gnome, KDE 和 Xfce, 按个人喜好自行选择即可.

> 如果配置较低需要节约资源可以选择 Xfce, 本文笔者使用的是 Manjaro Gnome.

# 使用虚拟机学习 Linux

> 为什么使用虚拟机而不是实体机**学习** Linux:
> - 系统安装只需镜像文件和简单配置, 实体机通常需要考虑安装媒介和硬件兼容性;
> - 合理运用虚拟机的快照功能, Linux 系统崩溃时可以轻松恢复如初;
> - 通过剪贴板共享和文件拖放, 可以在熟悉的主操作系统下查阅资料同时对 Linux 进行操作.

笔者使用 VMware Workstation, 许可证密钥请自行谷歌, 下载页面 [Download VMware Workstation Pro](https://www.vmware.com/products/workstation-pro/workstation-pro-evaluation.html). 

如果读者是正版软件用户/开源爱好者, 推荐使用 VBox, 同样支持前面提到的各种功能, 下载页面 [Oracle VM VirtualBox - Downloads](http://www.oracle.com/technetwork/server-storage/virtualbox/downloads/index.html).

# 为 Linux 创建一个新的虚拟机

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

