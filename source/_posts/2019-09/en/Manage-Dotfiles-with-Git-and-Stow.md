---
title: Manage Dotfiles with Git and Stow
tags: [Linux]
date: 2019-09-28 19:46:30
---

# What is Dotfiles

This name came from the dot prefix of file name, for example, your probably most familiar one: `~/.bashrc`.

So when we say dotfiles, we're talking about user level application configuration, which should be stored as text files in `~/.config`, according to [XDG Base Directory Specification][xdg]).

However dotfiles may be at anywhere under your home directory: `~/.bashrc`, `~/.zshrc`, `~/.ssh/config`. Apparently, not all apps follow the XDG standard.

<!-- more -->

# Manage for What

- Filter out your important preferences of application;
- Backup them to your public or private repository online;
- Synchronize them between different personal devices;
- Share configuration tricks with people online.

There may be more benefits, synchronization is considered the most useful one, however.

# Control with Git

Git is really powerful also complicated, but in this scene, we start with a quite simple workflow, just initialize a local Git repository right under user's home directory:

```sh
$ git init dotfiles
```

This `~/dotfiles` local repository will contain all of app configurations to manage, just as other general Git repositories.

To take control of an app's configuration, we create a directory for it, then move its dotfile(s) there, keeping the **directory structure relative to $HOME**.

`~/.ssh/config`, for example, the dotfile of SSH, let's move it into our fresh empty repository:

```sh
$ mkdir ~/dotfiles/ssh/ && cd ~/dotfiles/ssh/  # make and change to directory for SSH
$ mkdir .ssh/ && cd .ssh/  # keep the directory structre relative to ~/
$ pwd  # now in ~/dotfiles/ssh/.ssh/
$ mv -v ~/.ssh/config .  # move dotfile here
```

Then comes a set of basic instructions of Git to manage the local repository:

```sh
$ cd ~/dotfiles/  # manage repository
$ git add ssh  # track the whole SSH's dotfile directory
$ git commit -m "add ssh"
```

Now we create an empty repository online, public or private, GitHub / GitLab / other platform / even your self-hosted Git server, it's your call. Add remote repo's url to the local one then push.

```sh
$ git remote add origin <your-repo-url>
$ git push -u origin master
```

# Deploy with Stow

If you know little about [Stow][stow], it's just a tool that makes [symbolic links][symlink] from `~/dotfiles/<app>` to `~/`. I rather call this proceed "deploying", it's easy and intuitive, just one command in `~/dotfiles/`:

```sh
$ stow <app1> [<app2> <app3> ...]
```

So a command like `stow bash ssh fontconfig` make symbolic links:

- from `~/dotfiles/bash/.bashrc` to `~/.bashrc`;
- from `~/dotfiles/ssh/.ssh/config` to `~/.ssh/config`;
- from `~/dotfiles/fontconfig/.config/fontconfig/fonts.conf` to `~/.config/fontconfig/fonts.conf`.

This is not a reversed instruction to "taking control of app's dotfiles",because symbolic links are not moving, they are more like shortcuts. Applications read configuration from symbolic link, while we users could focus on editing in `~/dotfiles`.

After a fresh install or some new apps added, we just need to clone or pull the repository, update it to latest version, then choose apps to run `stow` to deploy, simple and flexible, right?

## About `--dotfiles` Option

This new feature [introduced in Stow 2.3.0][stow-2.3.0] preprocesses `dot-` prefix to real dot, so that users could use `~/dotfiles/bash/dot-bashrc` rather than the hidden one.

Up to September of 2019 with version 2.3.1, this feature is **still not fully functional** with directories like `~/dotfiles/ssh/dot-ssh/`, see details in [this thread][bug-thread-1] and [this thread][bug-thread-2].

For now, vanilla usage with hidden directories and files is still recommended. Once the bug is fixed, we could use `--dotfiles` option to use unhidden ones.

# Reference

- [Using GNU Stow to manage your dotfiles][brandon]: basically the beginning of all the stories;
- [【译】使用 GNU stow 管理你的点文件][fc]: Prof. fc translated the article to Chinese;
- [farseerfc/dotfiles: My dotfiles controlled by GNU Stow][fc/dotfiles]: Prof. fc's dotfiles, much to learn;
- To be continued ...

[xdg]: https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
[stow]: https://www.gnu.org/software/stow/ "Stow - GNU Project - Free Software Foundation"
[symlink]: https://en.wikipedia.org/wiki/Symbolic_link "Symbolic link - Wikipedia"
[stow-2.3.0]: https://lists.gnu.org/archive/html/info-stow/2019-06/msg00000.html "[Info-stow] GNU Stow 2.3.0 released"
[bug-thread-1]: https://lists.gnu.org/archive/html/bug-stow/2019-08/msg00000.html "[Bug-stow] 'dot-' prefix and preexisiting directories"
[bug-thread-2]: https://lists.gnu.org/archive/html/bug-stow/2019-09/msg00000.html "[Bug-stow] Tree folding and --dotfiles do not cooperate"
[brandon]: http://brandon.invergo.net/news/2012-05-26-using-gnu-stow-to-manage-your-dotfiles.html "Brandon Invergo - Using GNU Stow to manage your dotfiles"
[fc]: https://farseerfc.me/zhs/using-gnu-stow-to-manage-your-dotfiles.html "【译】使用 GNU stow 管理你的点文件 - Farseerfc的小窝"
[fc/dotfiles]: https://github.com/farseerfc/dotfiles "farseerfc/dotfiles: My dotfiles controlled by GNU Stow"
