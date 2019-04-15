# snapshot

**`cio snapshot COMMAND [options] [YYYY-MM-DD-HHMM-NODEID-VDID]`**

Manually create, get info about, list, or remove snapshots.

#### **Options**

- **-v , --volume &lt;volume name&gt;** : Apply to a volume identified by volume name.

- **-V , --vdisk &lt;id&gt;** : Apply to a volume identified by volume id.

- **&lt;YYYY-MM-DD-HHMM-NODEID-VDID&gt;** : Snapshot id used when removing or inspecting a snapshot.

## **create**

**`cio snapshot create`**

Manually create a snapshot on a volume.

#### **Options**

 - **--description "&lt;description&gt;"** : Add a description of the snapshot.

#### **Example**

Create a snapshot of volume bar and add description "snapshot description" to it.
```
$ sudo cio snapshot create bar --description "snapshot description"
Succeed: Created a snapshot of '/cio/vd6' in '/cio/vd6/.snap/2019-04-14-2034-f2385660-0006'
```

## **help**

**`cio snapshot help`**

Display snapshot commands and usage information.

#### **Example**

```
$ cio snapshot help
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

**`cio snapshot info <YYYY-MM-DD-HHMM-NODEID-VDID>`**

Display snapshot information by snapshot id.

#### **Example**

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

**`cio snapshot list <volumename>`**

Display a list of snapshots on a volume.

#### **Example**

```
$ cio snapshot list bar
SNAPSHOT                        DATE                    DESCRIPTION
2019-04-14-2009-f2385660-0006   Sun Apr 14 20:09 2019   Manual snapshot with auto cleanup
2019-04-14-2011-f2385660-0006   Sun Apr 14 20:11 2019   Manual snapshot with auto cleanup
2019-04-14-2012-f2385660-0006   Sun Apr 14 20:12 2019   Manual snapshot with auto cleanup
2019-04-14-2034-f2385660-0006   Sun Apr 14 20:34 2019   snapshot description
```

## **remove**

**`cio snapshot remove <YYYY-MM-DD-HHMM-NODEID-VDID>`**

Remove a snapshot by id.

#### **Example**

```
$ sudo cio snapshot remove 2019-04-14-2034-f2385660-0006
Delete snapshot on volume (null) at '/cio/vd6/.snap/2019-04-14-2034-f2385660-0006'
```
