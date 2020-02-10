---
title: Release 1.0.0-3138
description: Release notes for Storidge CIO version 1.0.0-3138
lang: en-US
---

# Release 1.0.0-3138
This update adds new kernel releases, and expands support for snapshot feature.

Any snapshot can now be cloned into a Storidge volume. Support is added to list all snapshots in the cluster, and to include the volume name in the snapshot info.

## New
- Add support for Linux VMs on Microsoft Azure
- Add initial support for `cio license add | info | transfer | check`
- Add `cio snapshot ls` to list all snapshots in cluster. This simplifies finding a snapshot with tagged descriptions.
- Add support for cloning a volume from snapshot

## Improvements
- Add support Ubuntu 4.4.0-{173, 174}, 4.15.0-{75, 76, 87}
- Remove retracted Ubuntu 4.15.0 -67, -68 and -73
- Add support AWS Ubuntu 4.4.0-1102, 4.15.0-1058
- Remove retracted AWS Ubuntu 4.15.0 -1053-aws
- Add support Ubuntu 5.3.0-{28, 29}, Azure Ubuntu 5.3.0-{1007,1008,1010}
- Add support Centos 3.10.0-1062.12.1
- Update golang version to 1.13.7
- Add IO fencing to node failover
- Add QEMU to system-manufacturer list
- Add `cio info --count` command to show cluster node usage
- Request smaller memory allocation for drive table sysfs interface to minimize exposure to system memory fragmentation
- Add volume name to `cio snapshot ls | info`. If the volume name is not specified, show "noname"
- Support for mongo-c-driver 1.16.0 on Centos
- Add `--force` option for `cioctl node clean` command  

## Bug fixes
- Fix bug where there are not enough swarm manager nodes after a Swarm manager node is replaced
- Fix bug where iscsi initiator name not unique after initialization in a Promox environment.
