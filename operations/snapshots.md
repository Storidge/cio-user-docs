---
title: Snapshots
description: working with basic snapshot operations  
lang: en-US
---

# Snapshot Operations

Snapshots are point-in-time copies of volumes. Once created, you can use snapshots to read and recover one or more files from an earlier point in time. Snapshots are also useful for making backup copies of data, or to create clone volumes for testing.

Snapshots are created using a copy-on-write technique. Only the modified data is stored so capacity is efficiently used.

Storidge supports both manual and periodic snapshots. Manual snapshots can be created through the `cio volume snapshot` command or programmatically through the API. Periodic snapshots can be set during time of volume creation with cli options, or can be specified in a profile.

::: tip
Snapshots can also be created natively from kubectl or docker commands. The snapshot settings, including profiles, can be specified in manifest or stack files. Settings can also be passed through volume options in a docker command.
:::

## Creating snapshots

First, create a volume with snapshot enabled. Snapshots can now be manually applied against the volume.
```
$ cio volume create mysnap --snapshot yes
Succeed: Add vd5: Type:2-copy, Size:20GB
```

You can also create a volume with periodic snapshots enabled, e.g. snapshot every 60 minutes with maximum 5 snapshots retained.
```
$ cio volume create mysnap --snapshot yes --interval 60 --snapshotMax 5
Succeed: Add vd5: Type:2-copy, Size:20GB
```

Create a snapshot
```
$ cio snapshot create mysnap --description 'Manual snapshot 1'
Succeed: Created a snapshot of '/cio/volumes/vd5' in '/cio/volumes/vd5/.snap/2020-01-19-1752-b579e251-0000005'
```

The output returns the ID of the new snapshot including the directory on the volume where it is created. You can use this snapshot ID to reference the snapshot in subsequent commands.

The `--description` flag allows you to tag the snapshot with information.

You can also manually snapshot a volume with periodic snapshots enabled. However only periodic snapshots are automatically removed based on the maximum snapshot setting. Manual snapshots must be individually managed.

## Listing snapshots

List existing snapshots on a volume by volume name, e.g.:
```
cio snapshot ls mysnap
SNAPSHOT                           DATE                    TYPE       DESCRIPTION
2020-01-19-1752-b579e251-0000005   Sun Jan 19 17:52 2020   Manual     Manual snapshot 1
2020-01-19-1848-b579e251-0000005   Sun Jan 19 18:48 2020   Periodic   Rotating snapshot with auto cleanup
```

The type of snapshot is listed, including any earlier description attached to the snapshot.

## Inspect snapshots

You can specify the snapshot ID to get details on a snapshot.
```
$ cio snapshot info 2020-01-19-1812-b579e251-0000005
snapshot: 2020-01-19-1812-b579e251-0000005
source id: 5
type: Manual
directory: /cio/volumes/vd5/.snap/2020-01-19-1812-b579e251-0000005
time: Sun Jan 19 18:12 2020
description:  Manual snapshot 2
```

The path to the snapshot is useful for pointing a backup application to the data.

You can also access the directory to search and restore files from an earlier point in time.

## Deleting snapshots

To delete a snapshot, run `cio snapshot remove` specifying the snapshot ID to remove, e.g.:
```
$ cio snapshot remove 2020-01-19-1812-b579e251-0000005
Delete snapshot on volume mysnap at '/cio/volumes/vd5/.snap/2020-01-19-1812-b579e251-0000005'
```

## Rollback snapshots

You can rollback a snapshot to restore a volume to a previous state. Use `cio snapshot rollback` specifying the snapshot ID to restore from, e.g.:
```
cio snapshot rollback 2020-01-19-1752-b579e251-0000005
Succeed: Rolled back volume mysnap at /cio/volumes/vd5 to snapshot 2020-01-19-1752-b579e251-0000005
```

## View snapshot settings

To see the snapshot settings for a volume, use `cio volume info`. This example shows periodic snapshot every 60 minutes with last 5 snapshots retained.
```
$ cio volume info mysnap
vdisk                          5
uuid                           73b219e8
node                           c5
ipaddr                         192.168.3.235
nodeid                         b579e251
name                           mysnap
capacity                       20GB
redundancy                     2
drive type                     SSD
local drive only               no
provisioning                   thin
minimum iops                   10
maximum iops                   10000000
directory                      /cio/volumes/vd5
autoexpand enabled             no
autoexpand threshold           70
autoexpand increment           20
autoexpand limit               3
autoexpand count               0
encryption                     disabled
snapshot                       enabled
snapshot interval              60
maximum snapshots              5
filesystem                     btrfs
labels
allocated                      0.5%
```

## Using profiles for snapshot settings

While you can pass snapshot settings through CLI options, you may want to use a profile for operational consistency. The profile can easily be passed as volume options in kubectl manifests and docker stack files.

Example: Copy a sample profile to file SNAP for editing
```
$ cio profile info NGINX > SNAP
```

Edit the file for desired snapshot settings, then save to datastore.
```
$ vi SNAP

$ cio profile add SNAP
```

Confirm profile saved.
```
$ cio profile info SNAP
capacity: 20
directory: /cio/volumes
iops:
  min: 1000
  max: 2000
level: 2
local: no
provision: thin
type: ssd
service:
  autoexpand:
    enabled: no
    threshold: 70
    increment: 20
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
    enabled: yes
    interval: 60
    max: 10
```

Create a snapshot volume using the profile.
```
$ cio volume create newsnap -p SNAP
Succeed: Add vd6: Type:2-copy, Size:20GB
```
