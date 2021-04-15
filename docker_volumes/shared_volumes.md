---
title: Shared Volumes
description: Creating shared volumes for Swarm workloads with Storidge
lang: en-US
---

# Shared volumes

It is typical for a stateful service or container to have one or more volumes.

There are however use cases where multiple containers can benefit from access to the same volume, possibly from different nodes in a cluster. Accordingly, Storidge provides a shared volume feature which enables the filesystem on a volume to be concurrently read/write accessible by multiple containers or services.

Example use cases include:
- Collecting logs to a central location
- Scaling a number of application containers (e.g. Wordpress) while maintaining content on a single shared volume
- Pushing data from multiple containers to a shared volume for centralized backup
- Sharing a volume with a single writer and multiple readers

## Create "cionet" network

Each shared volume must be assigned a unique network address for access. The Storidge software includes an IP address management (IPAM) function to allocate/deallocate IP addresses for shared volumes. To enable this capability, create a network named 'cionet' and pass a range of IP addresses that will be managed by the IPAM function. The Storidge software will assign IP addresses from this range to the shared volumes.

For example:
```
cio network create cionet --driver macvlan --iprange 192.168.3.100-192.168.3.150 --subnet 192.168.3.0/24 --gateway 192.168.3.1 --port enp0s3
```
Note: Details on `cio network` command can be found [here](https://docs.storidge.com/cio_cli/network.html). 

The example above creates a network 'cionet' and assigns 51 IP addresses on the local subnet to the IPAM function. Substitute the parameters for your network accordingly. 

## Create shared volumes

Storidge provides profile 'SHARED' as an example to use for creating shared volumes. Profiles provide a simple way to declare application requirements through YAML formatted files. See this [guide](https://guide.storidge.com/getting_started/why_profiles.html) to see why profiles are useful. 

You can modify the example profiles at /etc/storidge/profiles to suit your requirements. Save changes to the datastore to make them permanent. Parameters in the SHARED profile are:
```
[root@c7-1 ~]# cio profile info SHARED
---
capacity: 4
interface:
  type: nfs
  driver: macvlan
  network: cionet
  conf: "*(rw,sync,fsid=0,secure,no_root_squash,no_subtree_check)"
  name: sharedvol
directory: /cio/shared
shared: yes
iops:
  min: 30
  max: 2000
level: 2
local: no
provision: thin
type: ssd
service:
  autoexpand:
    enabled: no
    threshold: 80
    increment: 25
    limit: 3
  compression:
    enabled: no
    algorithm: lzo
  encryption:
    enabled: no
  replication:
    enabled: no
    destination: none
    interval: 120
    type: synchronous
  snapshot:
    enabled: no
    interval: 60
    max: 10
```

We'll use the SHARED profile to create a shared volume. The example below creates a Storidge volume named 'sharedvol'. 
```
[root@c7-1 ~]# cio volume create sharedvol -p SHARED
Succeed: Add vd2: Type:2-copy, Size:4GB
```

Info on sharedvol shows that IP address 192.168.1.100 has been assigned. The shared volume has been attached to node c7-3. 
```
[root@c7-1 ~]# cio volume info sharedvol
vdisk                          2
uuid                           052461e3
node                           c7-3
ipaddr                         192.168.1.213
nodeid                         3662e4c1
name                           sharedvol
capacity                       4GB
redundancy                     2
drive type                     SSD
local drive only               no
provisioning                   thin
minimum iops                   30
maximum iops                   2000
directory                      /cio/shared/vd2
autoexpand enabled             no
autoexpand threshold           80
autoexpand increment           20
autoexpand limit               3
autoexpand count               0
encryption                     disabled
snapshot                       disabled
snapshot interval              0
maximum snapshots              0
interface                      type:nfs@driver:macvlan@name:sharedvol@network:cionet@conf:*(rw,sync,fsid=0,secure,no_root_squash,no_subtree_check)@ip_address:192.168.1.100@
filesystem                     xfs
labels
allocated                      1.10%
```

::: warning Important
If you are running in a virtual machine or server, enable 'promiscuous mode' on the VM. 

This allows network requests for IP addresses other than the host IP to be passed through to the network port to the macvlan driver.
:::

The SHARED profile creates a NFS share which is auto-mounted to each node at the same directory path. This allows transparent accessed from all nodes without having to setup/configure NFS clients. This directory can be seen from `cio volume info`, e.g. /cio/shared/vd2 above.  

Also you can use `docker volume inspect` to verify the mountpoint. 
```
[root@c7-1 ~]# docker volume inspect sharedvol
[
    {
        "CreatedAt": "0001-01-01T00:00:00Z",
        "Driver": "cio:latest",
        "Labels": null,
        "Mountpoint": "/cio/shared/vd2",
        "Name": "sharedvol",
        "Options": null,
        "Scope": "local"
    }
]
```

## Using shared volumes with container

Shared volumes are accessed in the same way any volume would be used in Docker. Example:
```
docker run -it -v /cio/shared/vd2:/data \
--name test_shared alpine /bin/sh -c "while true; do echo 'OK'; sleep 2; done"
```

## Using shared volume with docker service  

You can use the shared volume with docker service. In example below, the volume is passed to directory /data inside the container: 
```
docker service create --mount type=bind,source=/cio/shared/vd2,target=/data \
--replicas 1 --name test_shared alpine /bin/sh -c "while true; do echo 'OK'; sleep 2; done"
```

## Mount NFS volume with NFS client

Any host outside of the Storidge cluster can access the NFS volume with an NFS client. Example:

```
[root@host ~]# mount -t nfs4 192.168.1.100:/ /mnt

[root@host ~]# mount |grep mnt
192.168.1.100:/ on /mnt type nfs4 (rw,relatime,vers=4.1,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=192.168.1.215,local_lock=none,addr=192.168.1.100)
```

A shared volume can be mounted and accessed by containers and services on different nodes. All writes and modifications to files and directories are immediately available to consumers of the shared volume. Concurrency of files is handled by the volume’s filesystem.
