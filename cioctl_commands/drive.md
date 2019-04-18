# cioctl drive

**`cioctl drive COMMAND [<driveid>]`**

Add, get info about, list, or remove drive resources.

## **add**

**`cioctl drive add <device> <node>`**

Add a drive to the storage pool.

#### **Arguments**

- **device** : Device is the identifier from `cioctl drive list`
- **node** : Specifies the node to which the drive is attached.

#### **Example**

```
$ cioctl drive add /dev/sdd u1
Succeed: node a8d3b506 has drive /dev/sdd added
```

## **help**

**`cioctl drive help`**

Shows command usage information.

#### **Example**

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

**`cioctl drive info <drive-id>`**
**`cioctl drive inspect <drive-id>`**

Get information about a device by drive id.

#### **Example**

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

**`cioctl drive ls`**
**`cioctl drive list`**

List drives in the cluster's storage pool. Drives marked as available can be added to the storage pool.

#### **Example**

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

**`cioctl drive rm <drive id>`**
**`cioctl drive remove <drive id>`**

Remove a faulty drive from the storage pool.

#### **Examples**

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

**`cioctl drive rescan`**

Rescan nodes for new drives or modified drive capacity.

#### **Example**

```
$ cioctl drive rescan
Succeed: Scan drives complete
```
