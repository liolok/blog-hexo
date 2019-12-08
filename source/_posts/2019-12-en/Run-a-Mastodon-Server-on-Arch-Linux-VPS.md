---
title: Run a Mastodon Server on Arch Linux VPS
tags: [Arch Linux, VPS, Mastodon, Server]
date: 2019-12-08 22:00:00
---

## Preparation

I'm using free trail of AWS. Basically a VPS that one can install Arch Linux on it is enough. The

### Choose Image

Visit [this link][2] (from [ArchWiki][3]) and choose an image by region.

[2]: https://www.uplinklabs.net/projects/arch-linux-on-ec2/
[3]: <https://wiki.archlinux.org/index.php/Arch_Linux_AMIs_for_Amazon_Web_Services> "Arch Linux AMIs for Amazon Web Services - ArchWiki"

### Add Swap Space

> [Swap - ArchWiki](https://wiki.archlinux.org/index.php/Swap#systemd-swap "Swap - ArchWiki")

```shell
# pacman -S systemd-swap
# sed --in-place 's/swapfc_enabled=0/swapfc_enabled=1/' /etc/systemd/swap.conf
# systemctl enable systemd-swap
# reboot
```

### Install Some Packages

```shell
# pacman -S nano sudo tmux yay
```

> For package `yay`, one can install it after adding archlinuxcn source.

I don't know how to use `vi` so `nano` is needed. `tmux` will be used when install mastodon AUR package, it will take a pretty long time, I don't want it be interrupted.

### Create a Privileged User

An AUR package is not allowed to install with root user, so I have to run `useradd -m -G wheel liolok && passwd liolok` to create a user of administration group, then run `nano /etc/sudoers` and uncomment the line `%wheel ALL=(ALL) ALL`.

### Install AUR Package

```shell
# su - liolok
$ tmux
$ yay -S mastodon
```

## PostgreSQL and Redis

<pre><span style="background-color:#D75F00"><font color="#FFD700">  ip-172-31-21-37 </font></span><span style="background-color:#D70000"><font color="#D75F00"> </font></span><span style="background-color:#D70000"><font color="#FFFFFF"><b>root </b></font></span><span style="background-color:#585858"><font color="#D70000"> </font></span><span style="background-color:#585858"><font color="#D0D0D0"><b>~ </b></font></span><font color="#585858"> </font><font color="#4E9A06">systemctl</font> enable --now postgresql redis
Created symlink /etc/systemd/system/multi-user.target.wants/postgresql.service → /usr/lib/systemd/system/postgresql.service.
Created symlink /etc/systemd/system/multi-user.target.wants/redis.service → /usr/lib/systemd/system/redis.service.
Job for postgresql.service failed because the control process exited with error code.
See &quot;systemctl status postgresql.service&quot; and &quot;journalctl -xe&quot; for details.
<span style="background-color:#D75F00"><font color="#FFD700">  ip-172-31-21-37 </font></span><span style="background-color:#D70000"><font color="#D75F00"> </font></span><span style="background-color:#D70000"><font color="#FFFFFF"><b>root </b></font></span><span style="background-color:#585858"><font color="#D70000"> </font></span><span style="background-color:#585858"><font color="#D0D0D0"><b>~ </b></font></span><font color="#585858"> </font><font color="#4E9A06">systemctl</font> status postgresql                                                                                                                                                  <font color="#5F0000"> </font><span style="background-color:#5F0000"><font color="#FFFFFF"> 1 </font></span>
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
<span style="background-color:#D75F00"><font color="#FFD700">  ip-172-31-21-37 </font></span><span style="background-color:#D70000"><font color="#D75F00"> </font></span><span style="background-color:#D70000"><font color="#FFFFFF"><b>root </b></font></span><span style="background-color:#585858"><font color="#D70000"> </font></span><span style="background-color:#585858"><font color="#D0D0D0"><b>~ </b></font></span><font color="#585858"> </font><font color="#4E9A06">su</font> - postgres -c <font color="#C4A000">&quot;initdb --locale en_US.UTF-8 -D &apos;/var/lib/postgres/data&apos;&quot;</font>                                                                                                   <font color="#5F0000"> </font><span style="background-color:#5F0000"><font color="#FFFFFF"> 3 </font></span>
The files belonging to this database system will be owned by user &quot;postgres&quot;.
This user must also own the server process.

The database cluster will be initialized with locale &quot;en_US.UTF-8&quot;.
The default database encoding has accordingly been set to &quot;UTF8&quot;.
The default text search configuration will be set to &quot;english&quot;.

Data page checksums are disabled.

fixing permissions on existing directory /var/lib/postgres/data ... ok
creating subdirectories ... ok
selecting dynamic shared memory implementation ... posix
selecting default max_connections ... 100
selecting default shared_buffers ... 128MB
selecting default time zone ... UTC
creating configuration files ... ok
running bootstrap script ... ok
performing post-bootstrap initialization ... ok
syncing data to disk ... ok

initdb: warning: enabling &quot;trust&quot; authentication for local connections
You can change this by editing pg_hba.conf or using the option -A, or
--auth-local and --auth-host, the next time you run initdb.

Success. You can now start the database server using:

    pg_ctl -D /var/lib/postgres/data -l logfile start

<span style="background-color:#D75F00"><font color="#FFD700">  ip-172-31-21-37 </font></span><span style="background-color:#D70000"><font color="#D75F00"> </font></span><span style="background-color:#D70000"><font color="#FFFFFF"><b>root </b></font></span><span style="background-color:#585858"><font color="#D70000"> </font></span><span style="background-color:#585858"><font color="#D0D0D0"><b>~ </b></font></span><font color="#585858"> </font><font color="#4E9A06">systemctl</font> start postgresql
<span style="background-color:#D75F00"><font color="#FFD700">  ip-172-31-21-37 </font></span><span style="background-color:#D70000"><font color="#D75F00"> </font></span><span style="background-color:#D70000"><font color="#FFFFFF"><b>root </b></font></span><span style="background-color:#585858"><font color="#D70000"> </font></span><span style="background-color:#585858"><font color="#D0D0D0"><b>~ </b></font></span><font color="#585858"> </font><font color="#4E9A06">systemctl</font> status postgresql
<font color="#8AE234"><b>●</b></font> postgresql.service - PostgreSQL database server
     Loaded: loaded (/usr/lib/systemd/system/postgresql.service; enabled; vendor preset: disabled)
     Active: <font color="#8AE234"><b>active (running)</b></font> since Sun 2019-12-08 16:38:39 UTC; 4s ago
    Process: 151715 ExecStartPre=/usr/bin/postgresql-check-db-dir ${PGROOT}/data (code=exited, status=0/SUCCESS)
   Main PID: 151727 (postgres)
      Tasks: 7 (limit: 1142)
     Memory: 16.0M
     CGroup: /system.slice/postgresql.service
             ├─151727 /usr/bin/postgres -D /var/lib/postgres/data
             ├─151730 postgres: checkpointer
             ├─151731 postgres: background writer
             ├─151732 postgres: walwriter
             ├─151733 postgres: autovacuum launcher
             ├─151734 postgres: stats collector
             └─151735 postgres: logical replication launcher

Dec 08 16:38:39 ip-172-31-21-37 systemd[1]: Starting PostgreSQL database server...
Dec 08 16:38:39 ip-172-31-21-37 postgres[151727]: 2019-12-08 16:38:39.222 UTC [151727] LOG:  starting PostgreSQL 12.1 on x86_64-pc-linux-gnu, compiled by gcc (GCC) 9.2.0, 64-bit
Dec 08 16:38:39 ip-172-31-21-37 postgres[151727]: 2019-12-08 16:38:39.228 UTC [151727] LOG:  listening on IPv6 address &quot;::1&quot;, port 5432
Dec 08 16:38:39 ip-172-31-21-37 postgres[151727]: 2019-12-08 16:38:39.228 UTC [151727] LOG:  listening on IPv4 address &quot;127.0.0.1&quot;, port 5432
Dec 08 16:38:39 ip-172-31-21-37 postgres[151727]: 2019-12-08 16:38:39.230 UTC [151727] LOG:  listening on Unix socket &quot;/run/postgresql/.s.PGSQL.5432&quot;
Dec 08 16:38:39 ip-172-31-21-37 postgres[151729]: 2019-12-08 16:38:39.249 UTC [151729] LOG:  database system was shut down at 2019-12-08 16:38:13 UTC
Dec 08 16:38:39 ip-172-31-21-37 postgres[151727]: 2019-12-08 16:38:39.254 UTC [151727] LOG:  database system is ready to accept connections
Dec 08 16:38:39 ip-172-31-21-37 systemd[1]: Started PostgreSQL database server.
</pre>

Then create the Mastodon PostgreSQL user and grant it the ability to create databases:

```shell
# su - postgres -s /bin/sh -c "createuser -d mastodon"
```

## Nginx

```shell
# pacman -S nginx certbot-nginx
# mkdir /etc/nginx/sites-available /etc/nginx/sites-enabled
# cp -v /var/lib/mastodon/dist/nginx.conf /etc/nginx/sites-available/mastodon
# ln -sv /etc/nginx/sites-available/mastodon /etc/nginx/sites-enabled/mastodon
# sed --in-place=".before-path-fix" /etc/nginx/sites-available/mastodon \
    -e 's/example\.com/zone\.liolok\.com/' \
    -e 's/home\/mastodon\/live/var\/lib\/mastodon/'
```

After these, edit `/etc/nginx/nginx.conf` and add line `include /etc/nginx/sites-enabled/*;` to the end of `http` block.

<pre><span style="background-color:#D75F00"><font color="#FFD700">  ip-172-31-21-37 </font></span><span style="background-color:#D70000"><font color="#D75F00"> </font></span><span style="background-color:#D70000"><font color="#FFFFFF"><b>root </b></font></span><span style="background-color:#585858"><font color="#D70000"> </font></span><span style="background-color:#585858"><font color="#BCBCBC">/ </font></span><span style="background-color:#585858"><font color="#8A8A8A"> </font></span><span style="background-color:#585858"><font color="#BCBCBC">etc </font></span><span style="background-color:#585858"><font color="#8A8A8A"> </font></span><span style="background-color:#585858"><font color="#D0D0D0"><b>nginx </b></font></span><font color="#585858"> </font><font color="#4E9A06">certbot</font> --nginx -d zone.liolok.com
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx
Enter email address (used for urgent renewal and security notices) (Enter &apos;c&apos; to
cancel): i@liolok.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
agree in order to register with the ACME server at
https://acme-v02.api.letsencrypt.org/directory
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(A)gree/(C)ancel: A

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Would you be willing to share your email address with the Electronic Frontier
Foundation, a founding partner of the Let&apos;s Encrypt project and the non-profit
organization that develops Certbot? We&apos;d like to send you email about our work
encrypting the web, EFF news, campaigns, and ways to support digital freedom.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: N
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for zone.liolok.com
2019/12/08 16:57:32 [warn] 163104#163104: could not build optimal types_hash, you should increase either types_hash_max_size: 1024 or types_hash_bucket_size: 64; ignoring types_hash_bucket_size
2019/12/08 16:57:32 [notice] 163104#163104: signal process started
Waiting for verification...
Cleaning up challenges
2019/12/08 16:57:35 [warn] 163136#163136: could not build optimal types_hash, you should increase either types_hash_max_size: 1024 or types_hash_bucket_size: 64; ignoring types_hash_bucket_size
2019/12/08 16:57:35 [notice] 163136#163136: signal process started
Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/mastodon
2019/12/08 16:57:38 [warn] 163167#163167: could not build optimal types_hash, you should increase either types_hash_max_size: 1024 or types_hash_bucket_size: 64; ignoring types_hash_bucket_size
2019/12/08 16:57:38 [warn] 163167#163167: conflicting server name &quot;zone.liolok.com&quot; on [::]:443, ignored
2019/12/08 16:57:38 [warn] 163167#163167: conflicting server name &quot;zone.liolok.com&quot; on 0.0.0.0:443, ignored
2019/12/08 16:57:38 [notice] 163167#163167: signal process started

Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you&apos;re confident your site works on HTTPS. You can undo this
change by editing your web server&apos;s configuration.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press &apos;c&apos; to cancel): 2
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/mastodon
2019/12/08 16:57:55 [warn] 163325#163325: could not build optimal types_hash, you should increase either types_hash_max_size: 1024 or types_hash_bucket_size: 64; ignoring types_hash_bucket_size
2019/12/08 16:57:55 [warn] 163325#163325: conflicting server name &quot;zone.liolok.com&quot; on [::]:443, ignored
2019/12/08 16:57:55 [warn] 163325#163325: conflicting server name &quot;zone.liolok.com&quot; on 0.0.0.0:443, ignored
2019/12/08 16:57:55 [notice] 163325#163325: signal process started

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://zone.liolok.com

You should test your configuration at:
https://www.ssllabs.com/ssltest/analyze.html?d=zone.liolok.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

<b>IMPORTANT NOTES:</b>
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/zone.liolok.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/zone.liolok.com/privkey.pem
   Your cert will expire on 2020-03-07. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot again
   with the &quot;certonly&quot; option. To non-interactively renew *all* of
   your certificates, run &quot;certbot renew&quot;
 - Your account credentials have been saved in your Certbot
   configuration directory at /etc/letsencrypt. You should make a
   secure backup of this folder now. This configuration directory will
   also contain certificates and private keys obtained by Certbot so
   making regular backups of this folder is ideal.
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let&apos;s Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le

</pre>

Then run `systemctl enable --now nginx`.

## Final Mastodon Setup

```shell
# useradd --shell=/sbin/nologin --groups=postgres mastodon
# su - mastodon -s /bin/sh -c "cd '/var/lib/mastodon'; RAILS_ENV=production bundle exec rails mastodon:setup"
# systemctl enable --now mastodon.target
```

TODO: Email sending configuration, SSL certificate step detail.
