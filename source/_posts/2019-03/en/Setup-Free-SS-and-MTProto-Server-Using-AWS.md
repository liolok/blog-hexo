---
title: Setup Free SS and MTProto Server Using AWS
tags: [Free, Shadowsocks, MTProto, VPS]
date: 2019-03-23 09:30:11
updated: 2019-03-23 14:30:11
---

# Signup an AWS account

> A credit card is needed for signup the account, see support types below.

![AWS Account Support Credit Card Types](./Setup-Free-SS-and-MTProto-Server-Using-AWS/AWS-Credit-Card-Types.png)

https://portal.aws.amazon.com/billing/signup

*AWS accounts include 12 months of free tier access, including use of Amazon EC2, Amazon S3, and Amazon DynamoDB.*

We will create an [Arch Linux][0] EC2 instance in this article, and setup a [V2Ray][1] service to run server for Shadowsocks and MTProto.

[0]: <https://www.archlinux.org/>
[1]: <https://www.v2ray.com/en/index.html> "Project V · Project V"

> It's not only Amazon that provides one-year free VPS, but also Google. Maybe I'll cover on that later.

<!-- more -->

# Create EC2 Instance

Visit [this link][2] (from [ArchWiki][3]) and choose an instance by region.

![Choose Image](./Setup-Free-SS-and-MTProto-Server-Using-AWS/Choose-Image.png)

[2]: https://www.uplinklabs.net/projects/arch-linux-on-ec2/
[3]: <https://wiki.archlinux.org/index.php/Arch_Linux_AMIs_for_Amazon_Web_Services> "Arch Linux AMIs for Amazon Web Services - ArchWiki"

For example if you want an instance in Singapore, so be the `ap-southeast-1` or `ap-southeast-2`. Click on the "ami-xxxx" link and go on.

## Choose Instance Type

![Choose Instance Type](./Setup-Free-SS-and-MTProto-Server-Using-AWS/Choose-Instance-Type.png)

There would be only one free type so we actually have no choice, just skip to step 6.

## Add Traffic Rule

![Add Traffic Rule](./Setup-Free-SS-and-MTProto-Server-Using-AWS/Add-Traffic-Rule.png)

![Added Traffic Rule](./Setup-Free-SS-and-MTProto-Server-Using-AWS/Added-Traffic-Rule.png)

> Well, I don't know how unsafe would it be if we allow all traffic from anywhere. If you care about security, read the documentations and make it secure.

## Download Key File and Launch Instance

![Download Key File and Launch](./Setup-Free-SS-and-MTProto-Server-Using-AWS/Download-Key-File-and-Launch.png)

This `ArchVPS.pem` private key file is quite important, we download it to  `~/.ssh/ArchVPS.pem`, or anywhere considered as safe and not easy to be cleared.

## Connect to Instance

We can see the instance here after launched:

![Get Instance IP](./Setup-Free-SS-and-MTProto-Server-Using-AWS/Get-Instance-IP.png "Get Instance IP")

Now we've got the IP address of the instance, run this command to connect:

```shell
$ ssh -i ~/.ssh/ArchVPS.pem root@put.instance.ip.here
```

If you get the warning below, run `chmod 400 ~/.ssh/ArchVPS.pem` and retry.

```shell
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for '.ssh/ArchVPS.pem' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key ".ssh/ArchVPS.pem": bad permissions
root@*.*.*.*: Permission denied (publickey).
```

If you get this, just say yes to let SSH know the host.

```shell
The authenticity of host '*.*.*.* (*.*.*.*)' can't be established.
ECDSA key fingerprint is SHA256:blablabla.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '*.*.*.*' (ECDSA) to the list of known hosts.
```

Now you should have already logged into the instance as root, run `pacman -Syyuu` and then reboot to make sure this Arch Linux is up to date.

# Setup V2Ray for SS and MTProto

## Configuration

First of all, here comes a [configuration template](./Setup-Free-SS-and-MTProto-Server-Using-AWS/config.json "V2Ray-Server-Configuration.jsonc").

Do NOT read it online, download or just copy and paste it to your favorite editor. For example in VS Code, switch to "JSON with Comments" language mode, and use folding to understand the hierarchy better.

![Folding with VSCode](./Setup-Free-SS-and-MTProto-Server-Using-AWS/Folding-with-VSCode.png "Folding with VSCode")

These are what you need to know about in the `inbounds` part of template, which would also be used in client configuration:

- Shadowsocks
    - port
    - settings
        - method
        - **password**
- MTProto for Telegram
    - port
    - settings -> users -> **secret**

You could leave all the other values unchanged, except these two, you have to complete them on your own:

- Write/generate a password for Shadowsocks, a password more than 16 characters is recommended;
- Generate a user secret for MTProto, run `openssl rand -hex 16` locally, or on Arch VPS.

Now you've got a complete and unique configuration. Connect to the instance, run these commands to change configuration to your own.

```shell
# pacman -S v2ray # install V2Ray
# cd /etc/v2ray # change to V2Ray configuration directory
# mv -v config.json config.json.origin # backup origin configuration
# nano config.json # edit fresh new configuration
```

In nano editor, paste your own configuration by right-click menu or whatever, `Ctrl + O` and `Enter` to save, `Ctrl + X` to exit.

## Service

```shell
# systemctl enable v2ray.service
# systemctl start v2ray.service
```

Now the service should be running, to check status run `systemctl status v2ray.service`.
