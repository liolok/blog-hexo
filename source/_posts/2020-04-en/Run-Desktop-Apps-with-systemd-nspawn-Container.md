---
title: Run Desktop Apps with systemd-nspawn Container
tags: [Linux, systemd, container, GUI]
date: 2020-04-05 17:03:52
---

- Full filesystem isolation with manual access control;
- Independent and complete runtime, ready for migration;
- No additional dependency on host, except systemd of course.

## Choose Distribution

One could install basically almost any **modern** Linux distribution into a container, the tools and instructions depend on the distributions of both host and container.

I've tried Arch Linux and Ubuntu 18.04 containers on my desktop running Arch Linux. For more examples, refer to systemd's documentations listed at the end of this article.

### Arch Linux Container

```console
$ container_dir=~/machines # directory of my containers
$ mkdir $container_dir # create it if not exists yet
$ cd $container_dir # change into it
$ container_name=archlinux-container
$ mkdir $container_name
# pacman -S arch-install-scripts # provides `pacstrap` command
# pacstrap -c $container_name
```

About the last `pacstrap` command:

- The `-c` option tells `pacstrap` to use the package cache on the host;
- If no packages specified, `pacstrap` defaults to the `base` group;
- Additional packages could be installed like this: `pacstrap -c $container_name base base-devel sudo nano`.

### Ubuntu 18.04 Container

```console
$ container_dir=~/machines # directory of my containers
$ mkdir $container_dir # create it if not exists yet
$ cd $container_dir # change into it
$ container_name=bionic-container
$ bionic_repo_url='https://mirrors.tuna.tsinghua.edu.cn/ubuntu/'
# pacman -S debootstrap ubuntu-keyring
# debootstrap --include=systemd-container --components=main,universe \
> bionic $container_name $bionic_repo_url
```

For `$bionic_repo_url`, one could select a suitable mirror from [Launchpad](https://launchpad.net/ubuntu/+archivemirrors).

Command `debootstrap` should finish with `I: Base system installed successfully`, if the last output is `E: Couldn't download packages:...`, just run it again to complete installation.

## Startup Container

After get a directory of minimal full distribution, one can use command `systemd-nspawn -D $container_name` to start up the container, `-D` stands for `--directory=`.

## Configure Container

There are two easy and full-featured methods to configure a container:

- Options append to `systemd-nspawn` command;
- Configurations written in `/etc/systemd/nspawn/$container_name.nspawn` file.

Choose either one. **Do not mix both**, unless you completely understand the precedence mechanism inside.

My personal usage is running container directly into its only target application, wrapping command options into a shell script is more suitable and flexible in this case.

If you want a common container that run several applications, it's considered necessary to run it as a background service along with host boots. A set of configurations is better for maintenance in this situation.

###  Host Filesystem Access Control

> By default a container has no access to host filesystem.

`--bind=` in command options or `Bind=` in `[Files]` section of configurations; `--bind-ro=` or `BindReadOnly=` for read-only access.

These options could be used multiple times, so that you may expose as many files/folders to container as you want. I prefer to allow read-only access as long as it works.

I'll show several simple use cases below, with basic `--bind=`, other forms are similar.

Simplest case, expose certain file/folder on host to the **same** path in container:

```console
$ host_path=/absolute/path/on/host
# systemd-nspawn \
> --directory=$container_name \
> --bind=$host_path
```

If you want container to access it with **different** path:

```console
$ host_path=/absolute/path/on/host
$ container_path=/absolute/path/inside/container
# systemd-nspawn \
> --directory=$container_name \
> --bind=$host_path:$container_path
```

To allow one-time access, you could use an empty string for host path: `--bind=:$container_path`. systemd-nspawn will create a temporary folder for container below the host's `/var/tmp` directory, and remove it automatically when container is shut down.

By default, a folder will be bind-mounted recursively. To allow access to particular path without sub-directories below it, you could append mount option: `--bind=$host_path:$container_path:norbind`.

### Environment Variables

`--set-env=`, `-E` in command options or `Environment=` in `[Exec]` section of configurations.

## Access to Host X Server for GUI

Pass X server temporary directory and `DISPLAY` environment variable on host to container:

`--bind-ro=/tmp/.X11-unix/` and `--set-env=DISPLAY=$DISPLAY`

or in configuration file:

> Run `echo $DISPLAY` to see its value, which is usually ":0".

```properties
[Exec]
Environment=DISPLAY=:0

[Files]
BindReadOnly=/tmp/.X11-unix/
```

### X Authority

> As far as I experienced, if run GUI application as the same user as host, one **may not need** to handle the authority stuff. So if window works fine after instructions above, just skip this step.

```console
$ auth_file=/tmp/${container_name}_xauth
$ xauth nextract - "$DISPLAY" | sed -e 's/^..../ffff/' | xauth -f "$auth_file" nmerge -
# systemd-nspawn \
> --directory=$container_name \
> --bind=/tmp/.X11-unix \
> --bind="$auth_file" \
> --set-env=DISPLAY="$DISPLAY" \
> --set-env=XAUTHORITY="$auth_file"
```

## Host Device Access

For quick and full access, bind the whole `/dev/` directory on host to container.

For more fine-grained access control, one need understand what devices does target app in container really need to run well, and which files under `/dev/` are the [devices allocated][linux-kernel-doc] to.

[linux-kernel-doc]: https://www.kernel.org/doc/html/latest/admin-guide/devices.html "Linux allocated devices (4.x+ version) - The Linux Kernel documentation"

Here is what I understood for my own usage:

| Device File    | Access to                           |
| -------------- | ----------------------------------- |
| /dev/dri/card0 | First graphics card of Intel or AMD |
| /dev/nvidia0   | First graphics card of NVIDIA       |
| /dev/shm       | Shared memory                       |
| /dev/input/js0 | First joystick                      |

## Host Network Access

No command option needed, or `VirtualEthernet=no` in `[Network]` section of configurations.

## Prepare Container

Startup the container, install your target application, create an unprivileged user then run it for test. If it doesn't work as expected, go back to configure container out.

## Tray Icon through DBus

```console
$ if [[ -n $DBUS_SESSION_BUS_ADDRESS ]]; then # remove prefix
>     host_bus=${DBUS_SESSION_BUS_ADDRESS#unix:path=};
> else # default guess
>     host_bus=/run/user/$UID/bus;
> fi
$ container_bus=/run/user/host/bus
# systemd-nspawn \
> --directory=$container_name \
> --bind-ro=$host_bus:$container_bus \
> --set-env=DBUS_SESSION_BUS_ADDRESS=unix:path=$container_bus
```

## Sound through PulseAudio

```console
$ if [[ -n $PULSE_SERVER ]]; then # remove prefix
>   host_pulse=${PULSE_SERVER#unix:};
> else # default guess
>   host_pulse=/run/user/$UID/pulse;
> fi
$ container_pulse=/run/user/host/pulse/
# systemd-nspawn \
> --direcoty=$container_name \
> --bind-ro=$host_pulse:$container_pulse \
> --setenv=PULSE_SERVER=unix:$container_pulse/native
```

> Apps explicitly depend on ALSA can break PulseAudio, for Arch Linux container `pacman -S pulseaudio-alsa --assume-installed pulseaudio` solves the problem.

## UI Consistency

If target app runs but looks different than how it does on host. Maybe binding themes, icons and fonts to container would help:

`--bind-ro=/usr/share/themes/:$XDG_DATA_HOME/themes/` and the same for icons and fonts.

This method is more balanced between container and host system, only thing to pay attention is that you better create `~/.local/share/` in container, or it will be read-only to target application.

If only the theme / icon / font files are not enough to application, consider bind your corresponding configurations (read-only too). And better create user directory first, too.

## Desktop Entry

After test, container and configurations should be ready for app. Write a shell script and wrap it into a desktop entry file, so it looks like a native app then.

App launch script `~/scripts/app-launch`:

```bash
#!/bin/bash

# Path to container
container_name=your-container
container_path=$HOME/machines/ # parent directory
container_path+=$container_name # root directory

# Binary of target application
app_binary=/path/to/your/application

# Run container directly into target application
pkexec systemd-nspawn \
--directory=$container_path \
--user=$USER --chdir=$HOME \
--bind-ro=/tmp/.X11-unix/ \
--setenv=DISPLAY=$DISPLAY \
--as-pid2 $app_binary
```

App desktop entry `~/.local/share/applications/app.desktop`

```properties
[Desktop Entry]
Type=Application
Version=1.1
Name=Your App
Comment=Description of your app
Exec=app-launch
Icon=icon-file-name
```

For `Exec` key, script file name `app-launch` could be used only after append `~/scripts/` to your `PATH` environment variable, or input its full path. Former method also supports running from terminal.

For `Icon` key, put icon file into `$XDG_DATA_DIRS/icons/hicolor/[size]/apps/`.
