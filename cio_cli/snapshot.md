# cio snapshot

<h3>Usage</h3>

`cio snapshot COMMAND [options] [YYYY-MM-DD-HHMM-NODEID-VDID]`

Create, get info, list, or remove snapshots.

<h3>Child commands</h3>

| Command             | Description                                         |
|:--------------------|:----------------------------------------------------|
| cio snapshot create | Create snapshot of a volume                         |
| cio snapshot info   | Display snapshot information by snapshot identifier |
| cio snapshot list   | List snapshots on a volume                          |
| cio snapshot remove | Remove snapshot by snapshot identifier              |

<h3>Options</h3>

| Name                        | Description         |
|:----------------------------|:--------------------|
| --volume, -v VOLUMENAME     | Volume              |
| --vdisk, -V VDISKID         | Vdisk identifier    |
| YYYY-MM-DD-HHMM-NODEID-VDID | Snapshot identifier |

## cio snapshot create

<h3>Usage</h3>

`cio snapshot create [<VOLUMENAME>] [options]`

`cio snapshot add [<VOLUMENAME>] [options]`

Create a snapshot on a volume.

<h3>Options</h3>

| Name                        | Description                      |
|:----------------------------|:---------------------------------|
| --description "DESCRIPTION" |Tag a description of the snapshot |

<h3>Examples</h3>

Create a snapshot of volume bar and add description.
```
$ sudo cio snapshot create bar --description "manual snapshot of volume bar"
Succeed: Created a snapshot of '/cio/vd6' in '/cio/vd6/.snap/2019-04-14-2034-f2385660-0006'
```

## cio snapshot info

<h3>Usage</h3>

`cio snapshot info <YYYY-MM-DD-HHMM-NODEID-VDID>`

Display snapshot information by snapshot id.

<h3>Examples</h3>

```
$ cio snapshot info 2019-04-14-2034-f2385660-0006
snapshot: 2019-04-14-2034-f2385660-0006
source id: 6
type: manual
directory: /cio/vd6/.snap/2019-04-14-2034-f2385660-0006
time: Sun Apr 14 20:34 2019
source: (null)
description: snapshot description
```

## cio snapshot list

<h3>Usage</h3>

`cio snapshot ls [<VOLUMENAME>]`

`cio snapshot list [<VOLUMENAME>]`

Display a list of snapshots on a volume.

<h3>Examples</h3>

```
$ cio snapshot list rotate
SNAPSHOT                           DATE                    DESCRIPTION
2019-04-21-1551-2c19b9f6-0000005   Sun Apr 21 15:51 2019   Rotating snapshot with auto cleanup
2019-04-21-1626-2c19b9f6-0000005   Sun Apr 21 16:26 2019   Snapshot volume rotate
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
Delete snapshot on volume rotate at '/cio/snap/vd5/.snap/2019-04-21-1626-2c19b9f6-0000005'
```
