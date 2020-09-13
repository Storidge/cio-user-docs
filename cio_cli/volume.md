---
title: cio volume
description: cio volume command; docker volumes for containers; persistent volumes for pods
lang: en-US
---

# cio volume

<h3>Usage</h3>

`cio volume COMMAND [options]`

Create, get info, list, move, remove, or update volume.

Storidge volumes can be specified using the volume name (-v flag or default), the vdisk ID (-V flag) or uuid (-u flag). Each identifier is unique and can be used interchangeably.

<h3>Child commands</h3>

| Command           | Description                             |
|:------------------|:----------------------------------------|
| cio volume create | Create a new volume                     |
| cio volume info   | Display volume info by name or vdisk id |
| cio volume list   | List volumes in cluster or on a node    |
| cio volume move   | Move a volume to specified node         |
| cio volume remove | Remove a volume                         |
| cio volume update | Update volume attributes                |

## cio volume create

<h3>Usage</h3>

`cio volume create [<VOLUMENAME>] [options]`

`cio volume add [<VOLUMENAME>] [options]`

Create a new volume.

<h3>Options</h3>

| Name               | Valid Values      | Description                                 |
|:-------------------|:------------------|:--------------------------------------------|
| --bandwidthmin     | 1 to 1,000,000    | Minimum bandwidth guaranteed                |
| --bandwidthmax     | 1 to 1,000,000    | Maximum bandwidth allowed                   |
| --capacity, -c     | NUMBER_IN_GB      | Volume capacity in gigabytes                |
| --directory, -D    | PATH_ON_HOST      | Bind mount directory on the host            |
| --filesystem, -f   | btrfs, ext4, xfs  | Filesystem to format and mount              |
| --help             |                   | Display usage info                          |
| --iopsmin          | 30 to 1,000,000   | Minimum iops guaranteed                     |
| --iopsmax          | 30 to 1,000,000   | Maximum iops allowed                        |
| --label            | KEY=VALUE         | Add label to volume                         |
| --level, -l        | 2, 3              | Number of replicas for redundancy           |
| --node, -n         | NODE_NAME         | Create volume on named node                 |
| --nodeid, -N       | NODE_ID           | Create volume on node with node id          |
| --local, -o        |                   | Create volume only on local attached drives |
| --profile, -p      | PROFILE_NAME      | Use profile to create volume                |
| --provision, -P    | thin, thick       | Specify thin or thick provisioning          |
| --quiet, -q        |                   | Return assigned vdisk id                    |
| --type, -t         | ssd, hdd          | Select backend media type                   |
| --volume, -v       | VOLUME_NAME       | Set volume name                             |
| **Auto Expansion** |                   |                                             |
| --autoexpand       | yes, no           | Enable auto expansion service               |
| --increment        | PERCENTAGE_NUMBER | Percentage of volume capacity to increment  |
| --limit            | NUMBER            | Maximum number of times to expand           |
| --threshold        | PERCENTAGE_NUMBER | Percentage of capacity to trigger expansion |
| **Compression**    |                   |                                             |
| --compression, -C  | yes               | Enable compression service                  |
| --algorithm, -A    | lzo, zlib, zstd   | Compression method to use                   |
| **Snapshot**       |                   |                                             |
| --snapshot         | yes, no           | Enable snapshot service                     |
| --interval         | NUMBER_IN_MINUTES | Interval for periodic snapshots in minutes  |
| --snapshotMax      | MAX_NUMBER        | Maximum number of snapshots before rotating |

<h3>Examples</h3>

**Create with default settings**

Create volume named 'foo' with default parameters

```
$ cio volume create foo
Succeed: Add vd5: Type:2-copy, Size:20GB
```

**Create with parameters**

Create a volume named 'Hello' with a capacity of 5 GB, three copy redundancy, and thick provisioning.
```
$ cio volume create Hello -c 5 -l 3 -P thick
Succeed: Add vd2: Type:3-copy, Size:5GB
```

**Create with auto expansion enabled**

Create volume with auto expansion enabled and expansion threshold of 70%. Increase capacity 25% each time, and limit number of expansions to three.
```
$ cio volume create auto --capacity 2 --autoexpand yes --threshold 70 --increment 25 --limit 3
Succeed: Add vd3: Type:2-copy, Size:2GB
```

**Create with labels**

Create volume with labels.
```
$ cio volume create label --label version=1.0 --label stage=test --label region=us-west  
Succeed: Add vd4: Type:2-copy, Size:20GB
```

**Create with shared volume label**

Create volume marked with shared volume label.
```
$ cio volume create share --label cio.volume=shared  
Succeed: Add vd5: Type:2-copy, Size:20GB
```

**Create with profile**

Create volume named 'nginx' with profile NGINX
```
$ cio volume create nginx -p NGINX
Succeed: Add vd6: Type:2-copy, Size:25GB
```

**Create with manual snapshot enabled**

Create volume 'manual' with manual snapshots, bind mount /cio/snap and max 10 snapshots
```
$ cio volume create manual -s -D /cio/snap --snapshotMax 10
Succeed: Add vd7: Type:2-copy, Size:20GB
```

**Create with periodic snapshot enabled**

Create volume 'rotate' with periodic snapshots every 60 minutes and max 24 snapshots
```
$ cio volume create rotate -s -D /cio/snap --interval 60 --snapshotMax 24
Succeed: Add vd8: Type:2-copy, Size:20GB
```

## cio volume info

<h3>Usage</h3>

`cio volume info [<VOLUMENAME>] [options]`

`cio volume inspect [<VOLUMENAME>] [options]`

Display volume info by name or id.

<h3>Options</h3>

| Name                    | Description                                 |
|:------------------------|:--------------------------------------------|
| --directory, -D         | Display bind mount directory on the host    |
| --filesystem, -f        | Display file system                         |
| --help                  | Display usage info                          |
| --json, -j              | Display volume info in JSON format          |
| --label                 | Display labels on volume                    |
| --long, -L              | Display extended volume info                |
| --nounits               | Display information using byte units        |
| --uuid, -u              | Display volume UUID                         |
| --uuid, -u UUID         | Display volume info by UUID                 |
| --volume, -v            | Display volume name                         |
| --volume, -v VOLUMENAME | Display volume info by volume name          |
| --vdisk, -V             | Display vdisk id                            |
| --vdisk, -V VDISKID     | Display volume info by vdisk id             |

<h3>Examples</h3>

**Info by volume name**

Display info by volume name for a volume named portainer.

```
$ cio volume info portainer
vdisk                          1
uuid                           44ddb75f
node                           n3
ipaddr                         192.168.1.138
nodeid                         99f8673e
name                           portainer
capacity                       20GB
redundancy                     2
drive type                     SSD
local drive only               no
provisioning                   thin
minimum iops                   10
maximum iops                   10000000
directory                      /cio/portainer/vd1
encryption                     disabled
snapshot                       disabled
snapshot interval              0
maximum snapshots              0
filesystem                     xfs
labels                         
allocated                      0.4%
```

**Info with JSON output**

Display volume info in JSON format
```
root@t1:~# cio volume info portainer --json
{
  "vdisk": 1,
  "uuid": "6db0d022",
  "node": "t3",
  "ipaddr": "192.168.3.84",
  "nodeid": "ee31a199",
  "name": "portainer",
  "capacity": "20GB",
  "redundancy": "2",
  "driveType": "SSD",
  "localDriveOnly": "no",
  "provisioning": "thin",
  "minimumIOPS": 10,
  "maximumIOPS": 10000000,
  "directory": "/cio/portainer/vd1",
  "autoexpandEnabled": false,
  "autoexpandThreshold": 80,
  "autoexpandIncrement": 20,
  "autoexpandLimit": 3,
  "autoexpandCount": 0,
  "encryption": false,
  "snapshot": false,
  "snapInterval": 0,
  "maximumSnapshots": 0,
  "filesystem": "xfs",
  "labels": {"stage": "production", "version": "1.21.0"},
  "allocated": "0.4%"
}
```

**Info by vdisk identifier**

Display info by volume id for vd1.
```
$ cio volume info -V 1
vdisk                          1
uuid                           44ddb75f
node                           n3
ipaddr                         192.168.1.138
nodeid                         99f8673e
name                           portainer
capacity                       20GB
redundancy                     2
drive type                     SSD
local drive only               no
provisioning                   thin
minimum iops                   10
maximum iops                   10000000
directory                      /cio/portainer/vd1
encryption                     disabled
snapshot                       disabled
snapshot interval              0
maximum snapshots              0
filesystem                     xfs
labels                         
allocated                      0.4%
```

**Display bind mount directory**

Display mount directory for portainer volume.
```
$ cio volume info portainer -D
/cio/portainer/vd1
```

## cio volume list

<h3>Usage</h3>

`cio volume ls [options]`

`cio volume list [options]`

List all volumes in a cluster or on a node

<h3>Options</h3>

| Name                | Description                              |
|:--------------------|:-----------------------------------------|
| --allocated, -a     | List volumes with capacity allocated     |
| --node, -n NODENAME | List volumes on node with node name      |
| --nodeid, -N NODEID | List volumes on node with node id        |
| --nounits           | Display information using byte units     |

<h3>Examples</h3>

**List all volumes**

List all the volumes on the cluster.
```
$ cio volume ls

root@v4:/etc/storidge/profiles# cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
v2                   vd9       SSD   2-copy                  20GB  8f0db895  portainer
v4                   vd3       SSD   2-copy                  20GB  08ba8120  foo
v4                   vd4       SSD   2-copy                  20GB  ce34c0e2  manual
v1                   vd5       SSD   2-copy                  20GB  a79d2ebe  rotate
v2                   vd6       SSD   2-copy                  25GB  c678c49e  nginx
```

**List volumes on a node**

List all volumes on node named 'v2' with allocated capacity percentage.
```
$ cio volume ls -a -n v2
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME             ALLOCATED
v2                   vd9       SSD   2-copy                  20GB  8f0db895  portainer                   0.4%
v2                   vd1       SSD   2-copy                  20GB  7a4d0803  bw                          0.4%
v2                   vd2       SSD   2-copy                  20GB  f5de8225  bwtest                      0.4%
v2                   vd6       SSD   2-copy                  25GB  c678c49e  nginx                       0.3%
```

## cio volume move

<h3>Usage</h3>

`cio volume move [<VOLUMENAME>] [options]`

Move volume to specified node. Do not move volumes opened by an application.

<h3>Options</h3>

| Name                    | Description                              |
|:------------------------|:-----------------------------------------|
| --volume, -v VOLUMENAME | Volume name to move                      |
| --vdisk, -V VDISKID     | Vdisk id to move                         |
| --node, -n NODENAME     | Specify destination node using node name |
| --nodeid, -N NODEID     | Specify destination node using node id   |

<h3>Examples</h3>

**Move volume to specified node**

Move volume foo to node v2.
```
$ cio volume move foo -n v2
Succeed: Move vd2 from 99f8673e to f2385660
```

**Do not move open volumes**

Open volumes cannot be moved!
```
$ cio volume move portainer -n v2
Fail: Move vd1: vdisk is opened
```

## cio volume clone

<h3>Usage</h3>

`cio volume clone [<SOURCEVOLUMENAME>] [<DESTINATIONVOLUMENAME>]`

Clone volume to a new volume.

<h3>Examples</h3>

```
$ cio volume clone foo newFoo
Success: This operation will take some time. Run 'cio events' for completion status.
```

## cio volume remove

<h3>Usage</h3>

`cio volume rm [<VOLUMENAME>] [options]`

`cio volume remove [<VOLUMENAME>] [options]`

`cio volume delete [<VOLUMENAME>] [options]`

Remove a volume.  

<h3>Options</h3>

| Name                    | Description                                    |
|:------------------------|:-----------------------------------------------|
| --volume,-v  VOLUMENAME | Volume name to delete                          |
| --vdisk, -V VDISKID     | Vdisk id to delete                             |
| --yes, -y               | Do not prompt for confirmation before deleting |

<h3>Examples</h3>

**Remove by volume name**

Remove volume foo by name.
```
$ cio volume rm foo
This operation will remove the vdisk and delete all existing data! Please confirm you wish to proceed [Y/N]: Y
Succeed: Remove vd3
```

**Remove vdisk without confirmation**

Remove volume foo by volume id without confirmation.
```
$ cio volume rm -y -V 3
Succeed: Remove vd3
```
## cio volume update

<h3>Usage</h3>

`cio volume update [<VOLUMENAME>] [options]`

Update a volume's attributes.  

<h3>Options</h3>

| Name               | Valid Values      | Description                                 |
|:-------------------|:------------------|:--------------------------------------------|
| --bandwidthmin     | 1 to 1,000,000    | Minimum bandwidth guaranteed                |
| --bandwidthmax     | 1 to 1,000,000    | Maximum bandwidth allowed                   |
| --capacity, -c     | NUMBER_IN_GB      | Desired capacity in gigabytes               |
| --directory, -D    | PATH_ON_HOST      | Change bind mount directory on the host     |
| --filesystem, -f   | btrfs, ext4, xfs  | Filesystem to format and mount              |
| --grow, -g         | NUMBER_IN_GB      | Size in gigabytes to grow capacity          |
| --help             |                   | Display usage info                          |
| --iopsmin          | 30 to 1,000,000   | Minimum iops guaranteed                     |
| --iopsmax          | 30 to 1,000,000   | Maximum iops allowed                        |
| --label            | KEY=VALUE         | Update label on volume                      |
| --profile, -p      | PROFILE_NAME      | Use profile to update volume                |
| --status, -S       | STATUS            | Set volume status                           |
| --userid, -U       | USERID            | Set user id                                 |
| --uuid, -u         | UUID              | Specify volume to update by UUID            |
| --volume, -v       | VOLUME_NAME       | Specify volume to update by volume name     |
| --vdisk, -V        | VDISK_ID          | Specify volume to update by vdisk id        |
| **Auto Expansion** |                   |                                             |
| --autoexpand       | yes, no           | Re-enable or stop auto expansion            |
| --increment        | PERCENTAGE_NUMBER | Percentage of volume capacity to increment  |
| --limit            | NUMBER            | Maximum number of times to expand           |
| --threshold        | PERCENTAGE_NUMBER | Percentage of capacity to trigger expansion |
| **Snapshot**       |                   |                                             |
| --snapshot         | yes, no           | Re-enable or stop snapshot service          |

<h3>Examples</h3>

**Update volume capacity**

Change volume portainer capacity from 20 GB to 25 GB.
```
$ cio volume update portainer -c 25
Succeed: Update vd9 capacity: increased to 25GB
```

**Update performance limits**

Change IOPS limits on volume portainer.
```
$ cio volume update portainer --iopsmin 1000 --iopsmax 8500
Succeed: Update vd9 iops: iops_min:1000 iops_max:8500
```
