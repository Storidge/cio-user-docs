# cioctl drive

<h3>Usage</h3>

**`cioctl drive COMMAND [<driveid>]`**

List, inspect, add, remove or rescan drive resources.

Drives are the raw devices that cio adds to a storage pool for creating volumes used by applications. When a cluster is created, cio will perform an automated discovery for drives to be added. Only drives that do not have filesystems or partitions will be automatically added. Drives can be local attached devices, e.g. ephemeral drives on cloud instances or can be networked attached devices. 

The `add` subcommand enable drives to added to increase capacity in the storage pool. Drives that are marked 'faulty' by the cio software can be removed and replaced. Drives with 'normal' status cannot be removed. New drives that are attached to nodes can be discovered with the `rescan` subcommand if they are not listed automatically. 

<h3>Commands</h3>

- **add** : Add drive to storage pool
- **info** : Get information on drive resource
- **list** : List drives in cluster
- **remove** : Remove drive from storage pool
- **rescan** : Rescan nodes in cluster for new drives or changed capacity

## **add**

<h3>Usage</h3>

**`cioctl drive add <device> <node>`**
**`cioctl drive create <device> <node>`**

Add a drive to the storage pool. 

Only drives marked with 'available' status can be added to the storage pool. Drives are added by specifying the drive path and node name. These two parameters are listed in the `cioctl drive ls` command. 

<h3>Arguments</h3>

- **device** : Device is the identifier from `cioctl drive list`
- **node** : Specifies the node to which the drive is attached.

<h3>Examples</h3>

```
$ cioctl drive add /dev/sdd u1
Succeed: node a8d3b506 has drive /dev/sdd added
```

## **help**

<h3>Usage</h3>

**`cioctl drive help`**

Shows command usage information.

<h3>Examples</h3>

```
$ cioctl drive help
Usage: cioctl drive COMMAND <drive label | device> [node]

Drive management commands to add, get info, list or remove drives from the storage
pool. This command defaults to drives attached to the local node. Node name is an
optional parameter to manage drives on member nodes in the cluster.

Commands:
    add        Add a drive to the storage pool
    help       Show command usage information
    info       Display information on drive label
    list       List drives in storage pool
    remove     Remove a drive from storage pool
    rescan     Rescan all nodes in a cluster for new drives or chnages to existing capacity

Run 'cioctl drive COMMAND --help' for more information on a command
```

## **info**

<h3>Usage</h3>

**`cioctl drive info <drive-id>`**
**`cioctl drive inspect <drive-id>`**

Get information about a device by drive id.

<h3>Examples</h3>

```
$ cioctl drive info a6b898730002sdd
nodeid: a6b89873
device: /dev/sdd
use: cio
type: SSD
capacity:      19 Gib
driveid: a6b898730002sdd
status: normal
Succeed: drive a6b898730002sdd info complete
```

## **list**

<h3>Usage</h3>

**`cioctl drive ls`**
**`cioctl drive list`**

List drives in the cluster's storage pool. Drives marked as 'available' can be added to the storage pool.

<h3>Examples</h3>

```
$ cioctl drive ls
NODENAME             DEVICE       USE  TYPE  SIZE(GB) DRIVE ID              STATUS
n1                   /dev/sdb     cio  SSD         9  7eb00b7d0000sdb       normal
n1                   /dev/sdc     cio  SSD        19  7eb00b7d0001sdc       normal
n1                   /dev/sdd     cio  SSD        19  7eb00b7d0002sdd       normal
n2                   /dev/sdb     cio  SSD         9  cd9a46fe0000sdb       normal
n2                   /dev/sdc     cio  SSD        19  cd9a46fe0001sdc       normal
n2                   /dev/sdd     cio  SSD        19  cd9a46fe0002sdd       normal
n3                   /dev/sdb     cio  SSD         9  a6b898730000sdb       normal
n3                   /dev/sdc     cio  SSD        19  a6b898730001sdc       normal
n3                   /dev/sdd     cio  SSD        19  a6b898730002sdd       normal
n4                   /dev/sdb     cio  SSD         9  92a88ffd0000sdb       normal
n4                   /dev/sdc     cio  SSD        19  92a88ffd0001sdc       normal
n4                   /dev/sdd     cio  SSD        19  92a88ffd0002sdd       normal
```

## **remove**

<h3>Usage</h3>

**`cioctl drive rm <drive id>`**
**`cioctl drive remove <drive id>`**
**`cioctl drive delete <drive id>`**

Remove a faulty drive from the storage pool. Drives with 'normal' status cannot be removed. 

<h3>Examples</h3>

Remove a faulty drive.
```
$ cioctl drive rm a8d3b5060002sdd
Succeed: drive a8d3b5060002sdd removed from storage pool
```

Remove a normal drive.
```
$ cioctl drive rm 92a88ffd0001sdc
Fail: Drive sdc on node 92a88ffd is not faulty
```

## **rescan**

<h3>Usage</h3>

**`cioctl drive rescan`**

Rescan all nodes in cluster for new drives or modified drive capacity. Any drive that can be added to the storage pool will have status 'available'.

<h3>Examples</h3>

```
$ cioctl drive rescan
Succeed: Scan drives complete
```
