---
title: cio snapshot
description: cio snapshot command; docker volumes for containers; persistent volumes for pods
lang: en-US
---

# cio snapshot

<h3>Usage</h3>

`cio snapshot COMMAND [options] [YYYY-MM-DD-HHMM-NODEID-VDID]`

Create, get info, list, remove, or rollback snapshots.

<h3>Child commands</h3>

| Command               | Description                                         |
|:----------------------|:----------------------------------------------------|
| cio snapshot create   | Create snapshot of a volume                         |
| cio snapshot clone    | Clone snapshot id into a new volume                 |
| cio snapshot info     | Display snapshot information by snapshot identifier |
| cio snapshot list     | List snapshots in cluster or on a volume            |
| cio snapshot remove   | Remove snapshot by snapshot identifier              |
| cio snapshot rollback | Revert volume state to previous snapshot            |

<h3>Options</h3>

| Name                        | Description         |
|:----------------------------|:--------------------|
| --volume, -v VOLUMENAME     | Volume name         |
| --vdisk, -V VDISKID         | Vdisk identifier    |
| YYYY-MM-DD-HHMM-NODEID-VDID | Snapshot identifier |

## cio snapshot create

<h3>Usage</h3>

`cio snapshot create <VOLUMENAME> [options]`

`cio snapshot add <VOLUMENAME> [options]`

Create a snapshot on a volume.

<h3>Options</h3>

| Name                        | Description                      |
|:----------------------------|:---------------------------------|
| --description "DESCRIPTION" |Tag a description of the snapshot |
| --volume, -v VOLUMENAME     | Volume name                      |
| --vdisk, -V VDISKID         | Vdisk identifier                 |

<h3>Examples</h3>

Create a snapshot of volume bar and add description.
```
$ sudo cio snapshot create bar --description "manual snapshot of volume bar"
Succeed: Created a snapshot of '/cio/vd6' in '/cio/vd6/.snap/2019-04-14-2034-f2385660-0006'
```

## cio snapshot clone

<h3>Usage</h3>

`cio snapshot clone <YYYY-MM-DD-HHMM-NODEID-VDID> <VOLUMENAME>`

Clone snapshot id into a new volume. The volume will be created with the same attributes and settings as the source volume for the snapshot.

<h3>Examples</h3>

```
$ cio snapshot clone 2020-02-07-1329-69b2ae3a-0000013 snapclone
Succeed: Cloned snapshot 2020-02-07-1329-69b2ae3a-0000013 to volume snapclone
```

## cio snapshot info

<h3>Usage</h3>

`cio snapshot info <YYYY-MM-DD-HHMM-NODEID-VDID>`

Display snapshot information by snapshot id.

<h3>Examples</h3>

```
$ cio snapshot info 2020-02-06-1448-b3839fc0-0000002
name: snap1
snapshot: 2020-02-06-1448-b3839fc0-0000002
source id: 2
type: Periodic
directory: /cio/volumes/vd2/.snap/2020-02-06-1448-b3839fc0-0000002
time: Thu Feb 06 14:48 2020
description: Rotating snapshot with auto cleanup
```

## cio snapshot list

<h3>Usage</h3>

`cio snapshot ls [VOLUMENAME]`

`cio snapshot list [VOLUMENAME]`

Display a list of snapshots in cluster or on a volume.

<h3>Examples</h3>

```
$ cio snapshot ls
VOLUME      SNAPSHOT                           DATE                    TYPE       DESCRIPTION
snap1       2020-02-06-1149-b3839fc0-0000002   Thu Feb 06 11:49 2020   Manual     Manual 1
snap1       2020-02-06-1434-b3839fc0-0000002   Thu Feb 06 14:34 2020   Periodic   Rotating snapshot with auto cleanup
snap1       2020-02-06-1435-b3839fc0-0000002   Thu Feb 06 14:35 2020   Periodic   Rotating snapshot with auto cleanup
snap1       2020-02-06-1436-b3839fc0-0000002   Thu Feb 06 14:36 2020   Periodic   Rotating snapshot with auto cleanup
snap1       2020-02-06-1437-b3839fc0-0000002   Thu Feb 06 14:37 2020   Periodic   Rotating snapshot with auto cleanup
snap1       2020-02-06-1438-b3839fc0-0000002   Thu Feb 06 14:38 2020   Periodic   Rotating snapshot with auto cleanup
snap2       2020-02-06-1149-0825fb00-0000003   Thu Feb 06 11:49 2020   Manual     Manual 1
snap2       2020-02-06-1202-0825fb00-0000003   Thu Feb 06 12:02 2020   Periodic   Rotating snapshot with auto cleanup
snap2       2020-02-06-1202-0825fb00-0000003   Thu Feb 06 12:02 2020   Manual     Manual 2
```

```
$ cio snapshot list snap1
VOLUME      SNAPSHOT                           DATE                    TYPE       DESCRIPTION
snap1       2020-02-06-1149-b3839fc0-0000002   Thu Feb 06 11:49 2020   Manual     Manual 1
snap1       2020-02-06-1444-b3839fc0-0000002   Thu Feb 06 14:44 2020   Periodic   Rotating snapshot with auto cleanup
snap1       2020-02-06-1445-b3839fc0-0000002   Thu Feb 06 14:45 2020   Periodic   Rotating snapshot with auto cleanup
snap1       2020-02-06-1446-b3839fc0-0000002   Thu Feb 06 14:46 2020   Periodic   Rotating snapshot with auto cleanup
snap1       2020-02-06-1447-b3839fc0-0000002   Thu Feb 06 14:47 2020   Periodic   Rotating snapshot with auto cleanup
snap1       2020-02-06-1448-b3839fc0-0000002   Thu Feb 06 14:48 2020   Periodic   Rotating snapshot with auto cleanup
```

## cio snapshot remove

<h3>Usage</h3>

`cio snapshot rm <YYYY-MM-DD-HHMM-NODEID-VDID>`

`cio snapshot remove <YYYY-MM-DD-HHMM-NODEID-VDID>`

`cio snapshot delete <YYYY-MM-DD-HHMM-NODEID-VDID>`

Remove a snapshot by id.

<h3>Examples</h3>

```
# cio snapshot rm 2019-04-21-1626-2c19b9f6-0000005
Succeed: Deleted snapshot on volume rotate at '/cio/snap/vd5/.snap/2019-04-21-1626-2c19b9f6-0000005'
```

## cio snapshot rollback

<h3>Usage</h3>

`cio snapshot rollback <YYYY-MM-DD-HHMM-NODEID-VDID>`

Revert volume state to previous snapshot

<h3>Examples</h3>

```
# cio snapshot rollback 2020-01-28-0052-816a0c7d-0000003
Succeed: Rolled back volume snap at /cio/snap/vd3 to snapshot 2020-01-28-0052-816a0c7d-0000003
```
