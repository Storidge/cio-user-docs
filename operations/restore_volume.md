---
title: Restore volume
description: restore volume data from previous backup
lang: en-US
---

# Restore

If you need to recover files that were accidentally deleted or were corrupted, you can restore them from a backup. This guide steps through restoring a backup to the cluster you created it from.

## Restore most recent backup

1. List the backup copies available. The restore points are listed by backup identifiers (backupid), including timestamps of the backups. You can list the restore points for a volume or list all available backups in the repo.

For example, to list all the available restore points for volume mysql-1:

```
root@u1:~# cio backup info mysql-1 --backupid --provider aws
BACKUPID  TIME                 HOST          SOURCE                             PATH
de8f8b46  2021-06-17 21:15:27  25c7c8775472  4e3efbff:mysql-10                       /data
9a816c06  2021-06-17 21:30:27  c84a3c47609c  4e3efbff:mysql-1                        /data
cd4adc19  2021-06-17 22:16:04  7146b9e7fd81  4e3efbff:mysql-10                       /data
a29c6dcd  2021-06-17 22:19:21  3524fe3e11cc  4e3efbff:mysql-1                        /data
6b819147  2021-06-17 23:14:49  8abc026bc181  4e3efbff:mysql-10                       /data
67850d7b  2021-06-17 23:18:17  87d0e59a9a9c  4e3efbff:mysql-1                        /data
2536e3f6  2021-06-18 00:16:47  6c90e3a22798  4e3efbff:mysql-10                       /data
71b28f1b  2021-06-18 00:20:32  7e16520184ef  4e3efbff:mysql-1                        /data
b5a31def  2021-06-18 01:16:10  7374756a077d  4e3efbff:mysql-10                       /data
08b74bda  2021-06-18 01:19:54  ab4a393684fb  4e3efbff:mysql-1                        /data
531fba80  2021-06-18 02:15:32  c6bb6ba6006f  4e3efbff:mysql-10                       /data
f28abd29  2021-06-18 02:19:23  561bde4c3e26  4e3efbff:mysql-1                        /data
9dc10ec2  2021-06-21 23:22:06  9748b9b9c3bb  4e3efbff:mysql-10:profile               /data/.backup/profile
f9b95a6a  2021-06-21 23:22:11  9748b9b9c3bb  4e3efbff:mysql-10                       /data
8119bddd  2021-06-21 23:27:59  764b053dc5cd  4e3efbff:mysql-1:profile                /data/.backup/profile
3e8450eb  2021-06-21 23:28:03  764b053dc5cd  4e3efbff:mysql-1                        /data
```

2. The most recent backup copy of the volume will be restored, if the backupid is not specified. Since volume names must be unique, the new volume's name is source-volume-name_lastcopy.

Example: 

```
root@u1:~# cio backup restore mysql-1 --provider aws
Succeed: Add vd14: Type:3-copy, Size:10GB
Succeed: restore backup: Restore started. A message will be posted to the eventLog after restore is complete
```

After restore, the event log shows the backup was restored to volume mysql-1_lastcopy. 
```
06/18/2021-02:38:21 [info] [DFS] volume mysql-1_lastcopy (vd14) created on node 7df18353:1009
06/18/2021-02:38:53 [info] [DFS] 4e3efbff:mysql-1 is successfully restored to vd14:1024
```

NOTE: Restore can take a few minutes as this depends on the amount of data captured by the restore point. The restore time is dependent on the speed of the provider infrastructure.


## Restore by backupid

You can use the backupid to restore a backup from a particular point in time. For example, to restore backupid a29c6dcd for volume mysql-1. 

```
root@u1:~# cio backup restore mysql-1 --backupid a29c6dcd --provider aws
Succeed: Add vd15: Type:3-copy, Size:10GB
Succeed: restore backup: Restore started. A message will be posted to the eventLog after restore is complete
```

Event log shows the backup was restored on volume mysql-1_a29c6dcd.

```
06/21/2021-23:56:39 [info] [DFS] volume mysql-1_a29c6dcd (vd15) created on node 05a38ced:1009
06/21/2021-23:57:11 [info] [DFS] 4e3efbff:mysql-1 is successfully restored to vd15:1024
```

NOTE: When the node to restore a volume to is not specified, the volume is restored to the primary node (sds).

You can confirm which node the volume is attached to with `cio volume ls`, e.g.: 

```
root@u1:~# cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
u1                   vd1       SSD   2-copy                  20GB  547344ba  portainer_portainer
u5                   vd7       SSD   3-copy                  10GB  e77cf78d  mysql-3
u3                   vd9       SSD   3-copy                  10GB  f69658d7  mysql-1
u5                   vd11      SSD   3-copy                  10GB  f4eb8efe  mysql-2
u1                   vd14      SSD   3-copy                  10GB  047186d1  mysql-1_lastcopy
u1                   vd15      SSD   3-copy                  10GB  8dfe7435  mysql-1_a29c6dcd
```

## Recover files

Inspect the volume to see where it is mounted. 

In example below, volume mysql-1_lastcopy is mounted at /cio/mysql/vd14. You can peruse and recover the desired files from this path.  

```
root@u1:~# cio volume info mysql-1_lastcopy
vdisk                          14
uuid                           047186d1
node                           u1
ipaddr                         192.168.1.175
nodeid                         7df18353
name                           mysql-1_lastcopy
capacity                       10GB
redundancy                     3
drive type                     SSD
local drive only               no
provisioning                   thin
minimum iops                   1000
maximum iops                   5000
directory                      /cio/mysql/vd14
autoexpand enabled             no
autoexpand threshold           80
autoexpand increment           20
autoexpand limit               3
autoexpand count               0
encryption                     disabled
snapshot                       disabled
snapshot interval              0
maximum snapshots              0
filesystem                     xfs
labels
allocated                      2.10%
```
