---
title: cio backup
description: Manage backup services for volumes
lang: en-US
---

# cio backup

<h3>Usage</h3>

`cio backup COMMAND [<VOLUMENAME>] <OPTIONS>`

Manage backup services for volumes

<h3>Child commands</h3>

| Command            | Description                                |
|:-------------------|:-------------------------------------------|
| cio backup create  | Create backup service for a volume         |
| cio backup info    | Show backup info on volume or repository   |
| cio backup list    | List all backup volumes in a cluster       |
| cio backup remove  | Remove backup service for a volume         |
| cio backup restore | Restore backup identifier to a new volume  |
| cio backup update  | Update backup service settings on a volume |

## cio backup create

<h3>Usage</h3>

`cio backup create [<VOLUMENAME>] <OPTIONS>`

`cio backup add [<VOLUMENAME>] <OPTIONS>`

Create backup service for a volume 

The backup service for a volume can be created using the `cio backup create` command. The backup service can also be started by using a profile to create a volume. The profile must have the backup service already enabled.  

<h3>Options</h3>

| Name              | Description                                      |
|:------------------|:-------------------------------------------------|
| --backupinterval  | Backup interval in hours                         |
| --backupmax       | Max number of backups to keep, 0 means unlimited |
| --provider        | Provider for backup repository                   |

<h3>Examples</h3>

Create a backup service for volume foo which will backup every hour and keep a maximum of 2 backups. The backend is an AWS S3 bucket. 
```
cio backup create foo --backupinterval 1 --backupmax 2 --provider aws
```

Create a backup service for vdisk 5 which will backup every 24 hours and keep a maximum of 3 backups. The backend is an AWS S3 bucket. 
```
cio backup create -V 5 --backupinterval 24 --backupmax 3 --provider aws
```

## cio backup info

<h3>Usage</h3>

`cio backup info [VOLUMENAME] <OPTIONS>`

Show backup info on volume or backup repository

<h3>Options</h3>

| Name         | Description                                              |
|:-------------|:---------------------------------------------------------|
| --alternate  | Specify backup repository of another cluster (alternate) |
| --backupid   | List backup identifiers for volume or list all backupids |
| --domainid   | Domain identifier for a Storidge cluster                 |
| --provider   | Cloud or service provider for backup repository          |
| --vdisk, -V  | Virtual disk identifier                                  |
| --volume, -v | Volume name                                              |

<h3>Examples</h3>

Show backup parameters for volume foo 
```
cio backup info foo			  
```

Show all backups in the repository for volume	foo
```
cio backup info foo --backupid --provider aws  
```

List all backups in the repository
```
$ cio backup info --backupid --provider aws			 
ID        TIME                 HOST          SOURCE                         PATH
bfb4edf6  2021-04-08 23:23:02  830da6a07ff4  ffda21df:vd2_b2b965e6          /data
111deb9f  2021-04-08 23:25:01  5773ca693321  ffda21df:vd2_b2b965e6          /data
83c8f46f  2021-04-08 23:27:06  dc764db727b8  ffda21df:vd2_b2b965e6          /data
be6aac0d  2021-04-08 23:28:58  c1d9268a8574  ffda21df:vd2_b2b965e6:profile  /data/.backup/profile
dd83830a  2021-04-08 23:29:11  c1d9268a8574  ffda21df:vd2_b2b965e6          /data
```

List all backups in the repository for a particular domain or cluster
```
cio backup info --backupid --domainid a28bcd11 --provider aws
```

List all backups in the alternate repository
```
cio backup info --backupid --alternate --provider aws
```

List all backups in the alternate repo for a particular domain or cluster 
```
cio backup info --backupid --domainid a28bcd11 --alternate --provider aws
```

## cio backup list

<h3>Usage</h3>

`cio backup ls`

`cio backup list`

List all volumes with backup service enabled in a cluster 

<h3>Examples</h3>

```
$ cio backup list
```

## cio backup remove

<h3>Usage</h3>

`cio backup remove [VOLUMENAME]`

`cio backup delete [VOLUMENAME]`

Remove backup service on a volume

<h3>Examples</h3>

Stop backup service for volume foo
```
cio backup remove foo 
```

## cio backup update

<h3>Usage</h3>

`cio backup update [VOLUMENAME] [OPTIONS]`

`cio backup update [VOLUMENAME] [OPTIONS]`

Update backup service settings on a volume

<h3>Options</h3>

| Name             | Description                                      |
|:-----------------|:-------------------------------------------------|
| --backupinterval | Backup interval in hours                         |
| --backupmax      | Max number of backups to keep, 0 means unlimited |
| --provider       | Cloud or service provider for backup repository  |
| --vdisk, -V      | Virtual disk identifier                          |
| --volume, -v     | Volume name                                      |

<h3>Examples</h3>

Update backup settings for volume foo
```
cio backup update foo --backupinterval 1 --backupmax 2 --provider aws
```

## cio backup restore

<h3>Usage</h3>

`cio backup restore [VOLUMENAME] [OPTIONS]`

`cio backup restore [VOLUMENAME] [OPTIONS]`

Restore from backup identifier to a new volume  

<h3>Options</h3>

| Name         | Description                                                        |
|:-------------|:-------------------------------------------------------------------|
| --alternate  | Point to backup repository of another cluster                      |
| --backupid   | Backup identifier of a backup object                               |
| --node, -n   | Node name                                                          |
| --nodeid, -N | Node identifier                                                    |
| --provider   | Cloud or service provider for backup repository                    |
| --source     | Source of original backup. Format of source is DOMAINID:VOLUMENAME |
| --vdisk, -V  | Virtual disk identifier                                            |
| --volume, -v | Volume name                                                        |

<h3>Examples</h3>

Restore most recent backup of volume foo to sds node (default). The restored volume will be named foo_lastcopy
```
cio backup restore foo --provider aws
```

Restore most recent backup of volume foo to node name host3. The restored volume will be named foo_lastcopy
```
cio backup restore foo -n host3 --provider aws
```

Restore backup of volume foo using backup identifier 83c8f46f. The restored volume will be named foo_83c8f46f attached to node host3
```
cio backup restore foo -n host3 --backupid 83c8f46f --provider aws
```

Restore most recent backup of volume mysql-1 from alternate cluster with domain identifier bb1c4c92. The restored volume will be the original volume name attached to node name host3. 
```
cio backup restore -n host3 --alternate --source bb1c4c92:mysql-1 --provider aws
```

Restore most recent backup of volume mysql-1 from alternate cluster with domain identifier bb1c4c92. The restored volume will be the original volume name attached to sds node. 
```
cio backup restore --alternate --source bb1c4c92:mysql-1 --provider aws
```

Restore volume mysql-1 from alternate cluster with domain identifier bb1c4c92. Restore using backup identifier 83c8f46f. The restored volume will be the original volume name
```
cio backup restore -n host3 --alternate --source bb1c4c92:mysql-1 --backupid 83c8f46f --provider aws
```
