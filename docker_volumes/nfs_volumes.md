---
title: NFS Volumes
description: Using NFS to share volumes between containers on Docker Swarm
lang: en-US
---

# NFS Volumes

Docker volumes enable data persistence for stateful applications. The Docker volume mount can be leveraged to create either a data volume or data volume container that is used or even shared with other containers. The problem is that the volume mount is local to the host representing a single point failure, i.e. if you lose the host, the data is lost. 

The Storidge software enables any Storidge volume to be shared as a NFS volume. This allows data on the NFS volume to be shared with other containers or services in the cluster. Since NFS is a network access protocol, the NFS volume is also accessible on the local subnet using a NFS client.

This guide steps through examples of how to configure, create and access NFS volumes on a Docker Swarm cluster. 

## Create "cionet" network

Each NFS volume must be assigned a unique network address through which the NFS share is accessed. The Storidge software includes an IP address management (IPAM) function to allocate/deallocate IP addresses for the NFS volumes. To enable this capability, create a network named 'cionet' and pass a range of IP addresses that will be managed by the IPAM function. The Storidge software will assign IP addresses from this range to the NFS volumes.

For example:
```
cio network create cionet --driver macvlan --iprange 192.168.3.100-192.168.3.150 --subnet 192.168.3.0/24 --gateway 192.168.3.1 --port enp0s3
```
Note: Details on `cio network` command can be found [here](https://docs.storidge.com/cio_cli/network.html). 

The example above creates a network 'cionet' and assigns 51 IP addresses on the local subnet to the IPAM function. Substitute the parameters for your network accordingly. 

## Create NFS volume

Storidge provides profile 'INFS' as an example to use for creating NFS volumes. Profiles provide a simple way to declare application requirements through YAML formatted files. See this [guide](https://guide.storidge.com/getting_started/why_profiles.html) to see why profiles are useful. 

You can modify the example profiles at /etc/storidge/profiles to suit your requirements. Save changes to the datastore to make them permanent. Parameters in the INFS profile are:
```
[root@c7-1 ~]# cio profile info INFS
---
capacity: 4
interface:
  type: nfs
  driver: macvlan
  network: cionet
  conf: "*(rw,sync,fsid=0,secure,root_squash,all_squash)"
directory: /cio/nfs
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

We'll use the INFS profile to create a NFS volume. The example below creates a Storidge volume named 'nfsvol'. This volume is a NFS share, accessed using a NFS client. 
```
[root@c7-1 ~]# cio volume create nfsvol -p INFS
Succeed: Add vd2: Type:2-copy, Size:4GB
```

Info on nfsvol shows that IP address 192.168.1.100 has been assigned to this NFS volume. The NFS volume has been attached to node c7-1. 
```
[root@c7-1 ~]# cio volume info nfsvol
vdisk                          2
uuid                           69f6b684
node                           c7-1
ipaddr                         192.168.1.211
nodeid                         4589c379
name                           nfsvol
capacity                       4GB
redundancy                     2
drive type                     SSD
local drive only               no
provisioning                   thin
minimum iops                   30
maximum iops                   2000
directory                      /cio/nfs/vd2
autoexpand enabled             no
autoexpand threshold           80
autoexpand increment           20
autoexpand limit               3
autoexpand count               0
encryption                     disabled
snapshot                       disabled
snapshot interval              0
maximum snapshots              0
interface                      type:nfs@driver:macvlan@name:nfs@network:cionet@conf:*(rw,sync,fsid=0,secure,root_squash,all_squash)@ip_address:192.168.1.100@
filesystem                     xfs
labels
allocated                      1.10%
```

`showmount` indicates that the /exports directory is available on the NFS share: 
```
[root@c7-5 ~]# showmount -e 192.168.1.100
Export list for 192.168.1.100:
/exports *
```
Note: If you are running in a virtual instance, allow 'promiscuous mode' on the VM so network requests will be passed through to the macvlan driver.

## Mount NFS volume to node

The NFS volume can be mounted (e.g. to /mnt/nfs below) to any node using an NFS client. Example:
```
[root@c7-5 ~]# mount -t nfs4 192.168.1.100:/ /mnt/nfs

[root@c7-5 ~]# mount |grep nfs
sunrpc on /var/lib/nfs/rpc_pipefs type rpc_pipefs (rw,relatime)
192.168.1.100:/ on /mnt/nfs type nfs4 (rw,relatime,vers=4.1,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=192.168.1.215,local_lock=none,addr=192.168.1.100)
```

## Use NFS volume with container 

After mounting the NFS volume, the mounted path /mnt/nfs can be passed to a container. Example: 
```
docker run -it -v /mnt/nfs:/data \
--name test_nfs alpine /bin/sh -c "while true; do echo 'OK'; sleep 2; done"
```

## Access NFS volume from different nodes

A NFS volume can be mounted and accessed by containers on different nodes. All writes and modifications to files and directories are immediately available to consumers of the NFS volume. Concurrency of files is handled by the volume’s filesystem.