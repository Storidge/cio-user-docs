# cio snapshot

<h3>Usage</h3>

**`cio snapshot COMMAND [options] [YYYY-MM-DD-HHMM-NODEID-VDID]`**

Create, get info, list, or remove snapshots.

<h3>Commands</h3>

- **create** : Create snapshot of a volume
- **info** : Display snapshot information by snapshot id
- **list** : List snapshots on a volume
- **remove** : Remove snapshot by snapshot id

<h3>Options</h3>

- **-v , --volume &lt;volume name&gt;** : Apply to a volume identified by volume name.

- **-V , --vdisk &lt;id&gt;** : Apply to a volume identified by volume id.

- **&lt;YYYY-MM-DD-HHMM-NODEID-VDID&gt;** : Snapshot id used when removing or inspecting a snapshot.

## **create**

<h3>Usage</h3>

**`cio snapshot create <volume name> [options]`**

Manually create a snapshot on a volume.

<h3>Options</h3>

 - **--description "&lt;description&gt;"** : Add a description of the snapshot.

<h3>Examples</h3>

Create a snapshot of volume bar and add description.
```
$ sudo cio snapshot create bar --description "manual snapshot of volume bar"
Succeed: Created a snapshot of '/cio/vd6' in '/cio/vd6/.snap/2019-04-14-2034-f2385660-0006'
```

## **help**

<h3>Usage</h3>

**`cio snapshot --help`**

Display `cio snapshot` commands with usage information.

<h3>Examples</h3>

```
$ cio snapshot --help
Usage: cio snapshot COMMAND [options] [YYYY-MM-DD-HHMM-NODEID-VDID]

Manually create a snapshot, print info, list all snapshots or remove a snapshot

Commands:
    create    Create snapshot of a volume
    help      Show command usage information
    info      Display snapshot information by snapshot id
    list      List snapshots on a volume
    remove    Remove snapshot by snapshot id

Options:
    -v | --volume <volume name>         apply to volume identified by volume name
    -V | --vdisk <id>                   apply to volume identified by vdisk ID
    YYYY-MM-DD-HHMM-NODEID-VDID         snapshot ID, present only for remove
```

## **info**

<h3>Usage</h3>

**`cio snapshot info <YYYY-MM-DD-HHMM-NODEID-VDID>`**

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

## **list**

<h3>Usage</h3>

**`cio snapshot list <volumename>`**

Display a list of snapshots on a volume.

<h3>Examples</h3>

```
$ cio snapshot list rotate
SNAPSHOT                           DATE                    DESCRIPTION
2019-04-21-1551-2c19b9f6-0000005   Sun Apr 21 15:51 2019   Rotating snapshot with auto cleanup
2019-04-21-1626-2c19b9f6-0000005   Sun Apr 21 16:26 2019   Snapshot volume rotate
```

## **remove**

<h3>Usage</h3>

**`cio snapshot remove <YYYY-MM-DD-HHMM-NODEID-VDID>`**

Remove a snapshot by id.

<h3>Examples</h3>

```
# cio snapshot rm 2019-04-21-1626-2c19b9f6-0000005
Delete snapshot on volume rotate at '/cio/snap/vd5/.snap/2019-04-21-1626-2c19b9f6-0000005'
```
