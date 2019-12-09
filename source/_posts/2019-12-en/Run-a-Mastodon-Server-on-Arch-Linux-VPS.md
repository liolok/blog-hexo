---
title: Run a Mastodon Server on Arch Linux VPS
tags: [Arch Linux, VPS, Mastodon, Server]
date: 2019-12-08 22:00:00
---

I'm using one-year free trial of AWS, , there are [Arch Linux AMIs][archlinux_ami] according to [ArchWiki][arch_wiki], which peopel can directly launch.

Basically a VPS that one can install Arch Linux on it is enough.

[arch_wiki]: https://wiki.archlinux.org/index.php/Arch_Linux_AMIs_for_Amazon_Web_Services "Arch Linux AMIs for Amazon Web Services - ArchWiki"
[archlinux_ami]: https://www.uplinklabs.net/projects/arch-linux-on-ec2/ "Uplink Laboratories"

## Add Swap Space

> [Swap - ArchWiki](https://wiki.archlinux.org/index.php/Swap#systemd-swap "Swap - ArchWiki")

My VPS has only 1G memory, so a swapfile is considered necessery.

```shell
# pacman -S systemd-swap
# sed --in-place 's/swapfc_enabled=0/swapfc_enabled=1/' /etc/systemd/swap.conf
# systemctl enable systemd-swap
# reboot
```

## Install Packages Needed

```shell
# pacman -S nano sudo tmux yay nginx certbot-nginx
```

I don't know how to use `vi` so `nano` is needed.

For package `yay`, one can install it after [adding archlinuxcn repo][archlinuxcn].

[archlinuxcn]: https://github.com/archlinuxcn/repo#usage "archlinuxcn/repo: Arch Linux CN Repository"

## Create a Privileged User

An AUR package is not allowed to install with root user, so I have to run `useradd -m -G wheel liolok && passwd liolok` to create a user of administration group, then run `nano /etc/sudoers` and uncomment the line `%wheel ALL=(ALL) ALL`.

## Install AUR Package

```shell
# su - liolok
$ tmux
$ yay -S mastodon
```

Nodejs stuff will take quite a long time even without output. After installation, press `Ctrl` + `D` twice to return to root user.

## PostgreSQL and Redis

```shell
# systemctl enable --now postgresql redis
```

I ran into a trouble that postgresql.service failed to start, so look into it:

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

It seems not a big deal, just follow the instruction to initialize the database cluster and then start service.

```shell
# su - postgres -c "initdb --locale en_US.UTF-8 -D '/var/lib/postgres/data'"
# systemctl start postgres
```

Then create the Mastodon PostgreSQL user and grant it the ability to create databases:

```shell
# su - postgres -s /bin/sh -c "createuser -d mastodon"
```

## Nginx

Copy Mastodon's default nginx configuration:

```shell
# cd /etc/nginx/
# mkdir sites-available sites-enabled
# cp -v /var/lib/mastodon/dist/nginx.conf sites-available/mastodon
# ln -sv sites-available/mastodon sites-enabled/mastodon
```

Replace `example.com` with my own domain, fix mastodon path:

```shell
# sed --in-place=".default" /etc/nginx/sites-available/mastodon \
-e 's/example\.com/zone\.liolok\.com/' \
-e 's/home\/mastodon\/live/var\/lib\/mastodon/'
```

Generate certificate:

```shell
# certbot --nginx -d zone.liolok.com
```

This command reports that certificate and chain are saved, but haven't been installed to nginx configuration.

It's ok, do the next steps:
- edit `/etc/nginx/nginx.conf` and add line `include /etc/nginx/sites-enabled/*;` to the end of `http` block;
- edit `/etc/nginx/sites-enabled/mastodon` and uncomment the `ssl_certificate` and `ssl_certificate_key` lines.

Then run `systemctl enable --now nginx`.

## Final Mastodon Setup

```shell
# tmux
# su - mastodon -s /bin/sh -c "cd '/var/lib/mastodon'; RAILS_ENV=production bundle exec rails mastodon:setup"
```

In this step, there will be a command line interface that seems kind of user friendly.

First content to input is my own domain `zone.liolok.com`; then comes stuff about postgrsql and redis, leave them default; then comes E-mail part: this confused me for a lot of time, at last I used my previous configured Yandex domain mail:

- host: smtp.yandex.com
- port: 587 (not the common search result 465)
- user: i@liolok.com
- sender: Mastodon \<notify@liolok.com>

Then the database and pre-compile work, latter would take longer. Finally I config the admin account information, and get the default password generated.

Up to now, everything is ready, start the mastodon services, and the website becomes available.

```shell
# systemctl enable --now mastodon.target
```
