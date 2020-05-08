---
title: 在 Arch Linux VPS 上运行 Mastodon 服务端
tags: [Arch Linux, VPS, Mastodon, Server]
lang: zh-CN
date: 2019-12-08 22:00:00
---

## Mastodon 是啥

开源私服推特。为啥不用推特？

- 各路人生赢家——嫉妒
- 各种政见不合——愤怒
- ~~汤不热凉了，大部分转移到推特——色欲~~

## VPS 要求

我还在为期一年的 AWS（亚马逊云）白嫖中，可以直接用 [Arch Linux AMIs][archlinux_ami] 镜像启动 EC2 实例（参见 [ArchWiki][arch_wiki]）。

理论上只要可以安装 Arch Linux 的 VPS 都可以；配置要求取决于用户量，但是个人小范围使用的话，白嫖的配置应该够用了。

[arch_wiki]: https://wiki.archlinux.org/index.php/Arch_Linux_AMIs_for_Amazon_Web_Services "Arch Linux AMIs for Amazon Web Services - ArchWiki"
[archlinux_ami]: https://www.uplinklabs.net/projects/arch-linux-on-ec2/ "Uplink Laboratories"

## 添加 DNS 记录

登录 DNS 服务商管理页面，用 VPS 的公网 IP 为域名添加一条 A 记录（Type A Record）。

## 增加交换空间

> [Swap - ArchWiki](https://wiki.archlinux.org/index.php/Swap#systemd-swap "Swap - ArchWiki")

VPS 只有 1G 内存，创建一个交换文件还是很有必要的。

```shell
# pacman -S systemd-swap
# sed --in-place 's/swapfc_enabled=0/swapfc_enabled=1/' /etc/systemd/swap.conf
# systemctl enable systemd-swap
# reboot
```

## 安装所需软件包

```shell
# pacman -S nano sudo tmux yay nginx certbot-nginx
```

不会用 `vi`，装 `nano`。

对于 `yay` 包，可以先 [添加 Arch Linux CN 仓库][archlinuxcn] 再安装。

[archlinuxcn]: https://github.com/archlinuxcn/repo#usage "archlinuxcn/repo: Arch Linux CN Repository"

## 创建特权用户

使用 root 用户无法安装 AUR 包，所以只好先 `useradd -m -G wheel liolok && passwd liolok` 创建一个属于管理员组的用户，然后 `nano /etc/sudoers` 并取消 `%wheel ALL=(ALL) ALL` 所在行的注释。

## 安装 AUR 包

```shell
# su - liolok
$ tmux
$ yay -S mastodon
```

会在 Nodejs 相关的步骤花费很长时间而且甚至没有输出。安装完成后按两次 `Ctrl` + `D` 返回 root 用户。

## PostgreSQL 及 Redis

```shell
# systemctl enable --now postgresql redis
```

遇到了 PostgreSQL 服务启动失败的情况，看一下什么情况：

<pre><span style="background-color:#D70000"><font color="#D75F00"> </font></span><span style="background-color:#D70000"><font color="#FFFFFF"><b>root </b></font></span><span style="background-color:#585858"><font color="#D70000"> </font></span><span style="background-color:#585858"><font color="#D0D0D0"><b>~ </b></font></span><font color="#585858"> </font><font color="#4E9A06">systemctl</font> status postgresql                                                                                                                                                  <font color="#5F0000"> </font><span style="background-color:#5F0000"><font color="#FFFFFF"> 1 </font></span>
<font color="#EF2929"><b>●</b></font> postgresql.service - PostgreSQL database server
     Loaded: loaded (/usr/lib/systemd/system/postgresql.service; enabled; vendor preset: disabled)
     Active: <font color="#EF2929"><b>failed</b></font> (Result: exit-code) since Sun 2019-12-08 16:37:37 UTC; 20s ago
    Process: 150840 ExecStartPre=/usr/bin/postgresql-check-db-dir ${PGROOT}/data <font color="#EF2929"><b>(code=exited, status=1/FAILURE)</b></font>

Dec 08 16:37:37 ip-172-31-21-37 systemd[1]: Starting PostgreSQL database server...
Dec 08 16:37:37 ip-172-31-21-37 postgres[150840]: &quot;/var/lib/postgres/data&quot; is missing or empty. Use a command like
Dec 08 16:37:37 ip-172-31-21-37 postgres[150840]:   su - postgres -c &quot;initdb --locale en_US.UTF-8 -D &apos;/var/lib/postgres/data&apos;&quot;
Dec 08 16:37:37 ip-172-31-21-37 postgres[150840]: with relevant options, to initialize the database cluster.
Dec 08 16:37:37 ip-172-31-21-37 systemd[1]: <b>postgresql.service: Control process exited, code=exited, status=1/FAILURE</b>
Dec 08 16:37:37 ip-172-31-21-37 systemd[1]: <font color="#D7D75F"><b>postgresql.service: Failed with result &apos;exit-code&apos;.</b></font>
Dec 08 16:37:37 ip-172-31-21-37 systemd[1]: <font color="#EF2929"><b>Failed to start PostgreSQL database server.</b></font>
</pre>

看起来问题不大，跑一下命令初始化一下数据库什么的再启动服务。

```shell
# su - postgres -c "initdb --locale en_US.UTF-8 -D '/var/lib/postgres/data'"
# systemctl start postgres
```

然后创建 PostgreSQL 的 Mastodon 用户，并授权创建数据库：

```shell
# su - postgres -s /bin/sh -c "createuser -d mastodon"
```

## Nginx

复制 Mastodon 默认的 nginx 配置：

```shell
# cd /etc/nginx/
# mkdir sites-available sites-enabled
# cp -v /var/lib/mastodon/dist/nginx.conf sites-available/mastodon
# ln -sv sites-available/mastodon sites-enabled/mastodon
```

把域名替换成自己的，再修复一下 Mastodon 的实际路径：

```shell
# sed --in-place=".default" /etc/nginx/sites-available/mastodon \
-e 's/example\.com/zone\.liolok\.com/' \
-e 's/home\/mastodon\/live/var\/lib\/mastodon/'
```

生成证书：

```shell
# certbot --nginx -d zone.liolok.com
```

这条命令会报告说证书已保存但未安装到 nginx 配置中。

没关系，进行以下步骤：

- 编辑 `/etc/nginx/nginx.conf`，将 `include /etc/nginx/sites-enabled/*;` 这一行添加到 `http` 语句块末尾；
- 编辑 `/etc/nginx/sites-enabled/mastodon`，去掉 `ssl_certificate` 和 `ssl_certificate_key` 所在两行的注释。

然后运行 `systemctl enable --now nginx`。

## 最后一步安装

```shell
# tmux
# su - mastodon -s /bin/sh -c "cd '/var/lib/mastodon'; RAILS_ENV=production bundle exec rails mastodon:setup"
```

在这一步，会有个还算友好的命令行交互界面。

第一个要输入的内容是自己的域名 `zone.liolok.com`；然后是 PostgreSQL 和 Redis 相关的配置，保留默认；然后到了邮件的部分：这块卡了我好久，最后用了之前配置的 Yandex 域名邮箱：

- host: smtp.yandex.com
- port: 587 (not the common search result 465)
- user: i@liolok.com
- sender: Mastodon \<notify@liolok.com>

然后是数据库和预编译，后者会更久一些。最后配置管理员用户信息，拿到随机生成的默认密码。

至此，万事皆备。启动 Mastodon 服务，然后网站就能访问啦。

```shell
# systemctl enable --now mastodon.target
```
