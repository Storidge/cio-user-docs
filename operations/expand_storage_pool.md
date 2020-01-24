---
title: Expand Storage Pool
description: Expand capacity in storage pool of Storidge cluster   
lang: en-US
---

# Expand storage pool

As cluster usage increases and more data is written, you may start to run out of capacity in the storage pool. You can increase capacity in the storage pool by adding drives to the cluster nodes.

Storidge operates a storage abstraction layer that provides true isolation from underlying infrastructure. This means the addition of drives to a node, and new capacity to the storage pool is non-disruptive to running applications.

## Add drive

The capacity of the storage pool is expanded by:

1. Adding one or more drives to a node. In the cloud, this step entails provisioning cloud storage and attaching to the node.

::: tip
New drives that are attached to nodes can be discovered with `cioctl drive rescan` if they are not listed automatically.
:::

2. Using the `cioctl drive add` command to add the drive capacity to the storage pool.

List drives in the cluster with `cioctl drive ls`. Only drives marked with 'available' status can be added to the storage pool.

Drives are added by specifying the drive path and node name. Both parameters are listed in the `cioctl drive ls` command. Example:
```
$ cioctl drive add /dev/sdd u1
Succeed: node a8d3b506 has drive /dev/sdd added
```

::: tip
Storidge does not require all nodes to have the same capacity or drives. However it may be operationally simpler to have consistent drive capacity on all nodes.
:::
