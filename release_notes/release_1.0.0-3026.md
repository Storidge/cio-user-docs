---
title: Release 1.0.0-3026
description: Release notes for Storidge CIO version 1.0.0-3026; persistent volumes for kubernetes pods
lang: en-US
---

# Release 1.0.0-3026
This release focuses on bug fixes, stability and usability improvements.

## New
- Add support for Centos 7.7

## Improvements
- Add support Centos 7.7 kernels 3.10.0-1062.el7, 3.10.0-1062.1.1, 3.10.0-1062.1.2, 3.10.0-1062.4.1
- Add support Ubuntu 4.4.0-167, 4.15.0-67, AWS Ubuntu 4.4.0-1097, 4.15.0-1053
- Improve interface in cio snapshot to list all snapshots, delete any snapshot and rollback to any snapshot
- Update snapshot to only remove older periodic snapshots. Manual snapshots are managed manually
- Update snapshot rollback function to not delete any snapshot
- Improve cioctl report creation time with default timeouts to handle commands that do not return
- Improve tcp messaging to avoid cio daemon hang during cio volume operations
- Move CIO port numbers to 16996-16999 to minimize chance of conflicts with host mapped port numbers for containers
- Improve Docker Swarm load balancing after a cluster power cycle
- Improve load balancing for three node clusters with three managers, i.e. no worker nodes
- Improve cluster power cycle and load balancing to handle case where first worker node is a failed node
- Update cioctl migrate command to migrate docker named volume to external Storidge cluster

## Bug fixes
