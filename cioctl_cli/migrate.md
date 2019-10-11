---
title: cioctl migrate
description: cioctl migrate command; docker volumes for containers; persistent volumes for pods
lang: en-US
---

# cioctl migrate

<h3>Usage</h3>

`cioctl migrate COMMAND <source-volume> <storidge-volume> [options]`

Copy files from a source volume to a Storidge volume

<h3>Child commands</h3>

| Command               | Description                                                |
|:----------------------|:-----------------------------------------------------------|
| cioctl migrate docker | Migrate data from docker named volume to Storidge volume   |


## cioctl migrate docker

<h3>Usage</h3>

`cioctl migrate docker <docker-volume> <storidge-volume> [options]`

Copy files from a docker named volume to a Storidge volume

<h3>Options</h3>

| Name             | Description                                               |
|:-----------------|:----------------------------------------------------------|
| --verbose, -v    | Print extra details about the activities performed        |

<h3>Examples</h3>

Migrate data on Docker named volume foo to Storidge volume bar
```
[root@c1 ~]# cioctl migrate docker foo bar
Succeed: Copied and compared files from /var/lib/docker/volumes/foo/_data to /cio/bar/vd2
```
