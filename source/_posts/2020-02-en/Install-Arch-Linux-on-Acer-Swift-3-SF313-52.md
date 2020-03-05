---
title: Install Arch Linux on Acer Swift 3 SF313-52
tags: [Linux]
date: 2020-02-28 17:54:32
---

User Manual from Acer's [product support page](https://www.acer.com/ac/en/US/content/support-product/8233) told me to press F2 to get in BIOS settings.

Secure boot failed, need to disable. Option grayed out? Google brought me here: [bios - How to disable Secure Boot on an Acer Aspire 3 laptop? - Super User](https://superuser.com/questions/1324323/how-to-disable-secure-boot-on-an-acer-aspire-3-laptop). So set supervisor password, disabled secure boot and boot into archiso.

HiDPI font size solution:

- [3.1 Preview and temporary changes](https://wiki.archlinux.org/index.php/Linux_console#Preview_and_temporary_changes)
- [HiDPI - ArchWiki](https://wiki.archlinux.org/index.php/HiDPI#Linux_console)

```shell
# setfont latarcyrheb-sun32
```

`wifi-menu` to connect network, and `ping archlinux.org -c 4` to verify.

`lsblk` / `fdisk -l` shows me no disk aside my USB stick? Where is the SSD inside?

... Fuck Acer and iRST

`cgdisk` `EF00`

```shell
# mkfs.xfs /dev/nvme0n1p1
# mkfs.fat /dev/nvme0n1p2 -F32
# mount /dev/nvme0n1p1 /mnt
# mount /dev/nvme0n1p2 /mnt/boot
# pacstrap /mnt base linux linux-firmware xfsprogs netctl dhcpcd dialog nano man-db man-pages texinfo
```

```shell
# useradd -m -G additional_groups -s login_shell username
```
