---
title: Migrate volume
description: migrate volume data to different cluster
lang: en-US
---

# Migrate volume 

You can use the backup and recovery capabilities to move data to a different cluster. This guide walks through restoring a volume to a cluster which was not the source of the backup.

## Set credentials to repo 

First setup the credentials for access to the backup repo of the source cluster. The credentials will be the same used by the source cluster to access its backup repo. However it is setup using the 'alt' credentials, as this cluster may have its own backup repo. 

```
cio credential create cio_alt_aws_backup_repo s3:https://s3.amazonaws.com/backup8888
cio credential create cio_alt_aws_access_key AKIAYHD623GGZ5GRNDBI
cio credential create cio_alt_aws_secret_key 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
cio credential create cio_alt_aws_backup_password password
```

## Specify source for volume

List the backup copies (by backupid) of the source cluster, e.g. domainid 4e3efbff

```
cio backup info --backupid --domainid 4e3efbff --alternate --provider aws
```

Pick a volume to migrate using the `--source` option to specify the source cluster and volume. The most recent backup copy is used by default if the backupid is not specified. 

Example:

```
[root@c1 ~]# cio backup restore --alternate --source 4e3efbff:mysql-1 --provider aws
Succeed: Add vd2: Type:3-copy, Size:10GB
Succeed: restore backup: Restore started. A message will be posted to the eventLog after restore is complete
```

The volume migrated will have the same name as the source volume, therefore the destination cluster should not have a conflicting volume name. 


To migrate a backup that is not the most recent copy, specify the backupid with the desired timestamp. Example: 

```
cio backup restore --alternate --source 4e3efbff:mysql-1 --backupid 9a816c06 --provider aws
```

