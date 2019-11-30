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

Copy files from a docker named volume to a Storidge volume. The Storidge volume will be automatically created if it does not exist.

A docker named volume is broadly defined as any volume that is listed in `docker volume ls` regardless of the volume driver.

<h3>Options</h3>

| Name             | Description                                          |
|:-----------------|:-----------------------------------------------------|
| --ip, -i         | IP address of sds node on external Storidge cluster  |
| --profile, -p    | Profile to use for creating Storidge volume          |
| --verbose, -v    | Print extra details about the activities performed   |

<h3>Examples</h3>

Migrate data on Docker named volume foo to Storidge volume bar on the same node. Note the volume names must be different due to namespace conflict. 
```
[root@c1 ~]# cioctl migrate docker foo bar --profile DEMO
Succeed: Copied and compared files from /var/lib/docker/volumes/foo/_data to /cio/bar/vd2
```

In example below, volume bar created by Docker's local driver and volume foo created by Storidge's cio volume plugin are both docker named volumes. Both volume bar and foo can be migrated to a remote Storidge cluster.  
```
root@minikube:~# docker volume ls
DRIVER              VOLUME NAME
local               bar
cio:latest          foo
```

Migrate volumes bar and foo to remote Storidge cluster. Since there is no namespace conflict, volume names on local and remote cluster can be identical.
```
root@u181:~# cioctl migrate docker bar bar --ip 192.168.3.96
bar
Succeed: Copied and compared files from /cio/bar/vd2 to /cio/bar/vd2

root@u181:~# cioctl migrate docker foo foo --ip 192.168.3.96
foo
Succeed: Copied and compared files from /cio/foo/vd1 to /cio/foo/vd3
```
