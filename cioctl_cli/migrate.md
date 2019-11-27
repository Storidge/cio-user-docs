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

Copy files from a docker named volume to a Storidge volume. Storidge volume will be automatically created if it does not exist.

<h3>Options</h3>

| Name             | Description                                          |
|:-----------------|:-----------------------------------------------------|
| --ip, -i         | IP address of sds node on external Storidge cluster  |
| --profile, -p    | Profile to use for creating Storidge volume          |
| --verbose, -v    | Print extra details about the activities performed   |

<h3>Examples</h3>

Migrate data on Docker named volume foo to Storidge volume bar on the same node
```
[root@c1 ~]# cioctl migrate docker foo bar --profile DEMO
Succeed: Copied and compared files from /var/lib/docker/volumes/foo/_data to /cio/bar/vd2
```

Migrate data on Docker named volume foo across network to volume bar on external Storidge cluster
```
[root@c1 ~]# cioctl migrate docker foo bar --ip 192.168.1.120
Succeed: Copied and compared files from /var/lib/docker/volumes/foo/_data to /cio/bar/vd2
```
