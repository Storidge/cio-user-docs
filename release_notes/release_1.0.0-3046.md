---
title: Release 1.0.0-3046
description: Release notes for Storidge CIO version 1.0.0-3046; persistent volumes for kubernetes pods
lang: en-US
---

# Release 1.0.0-3046
This release adds many stability and usability improvements, particularly for cluster load balancing and snapshot service.  

## New
- Add support for Centos 7.7
- Update csi driver to add support for Kubernetes 1.16
- Add support for Ubuntu 19.10 as the class "u19"
- Add initial Prometheus integration

## Improvements
- Add support Centos 7.7 kernels 3.10.0-1062.el7, 3.10.0-1062.1.1, 3.10.0-1062.1.2, 3.10.0-1062.4.1
- Add support Ubuntu 4.4.0-167, 4.15.0-{67, 68}, AWS Ubuntu 4.4.0-1097, 4.15.0-1053
- Remove retracted Ubuntu kernel 4.15.0-63
- Improve interface in cio snapshot to list all snapshots, delete any snapshot and rollback to any snapshot
- Update snapshot to only remove older periodic snapshots. Manual snapshots are managed manually
- Update snapshot rollback function to not delete any snapshot
- Default snapshot description to "Manual snapshot" if not specified
- Improve snapshot existence check when creating a new snapshot
- Update snapshot status messages with keywords for API parsing
- Improve `cioctl report` creation time with default timeouts to handle commands that do not return
- Improve tcp messaging to avoid cio daemon hang during cio volume operations
- Move CIO port numbers to 16996-16999 to minimize chance of conflicts with host mapped port numbers for containers
- Improve Docker Swarm load balancing after a cluster power cycle
- Improve load balancing for three node clusters with three managers, i.e. no worker nodes
- Improve cluster power cycle and load balancing to handle case where first worker node is a failed node
- Update cioctl migrate command to migrate docker named volume to external Storidge cluster
- Improve `cioctl migrate` command to auto create destination volume if it does not exist
- Update MongoDB and mongo-c-driver to 4.2.0 / 1.15.0 respectively
- Update Docker version to 19.03.4
- Allow restarting cio daemon when one node fails
- Add `cio network rm` command
- Synchronize status information between cio daemons after primary daemon is restarted
- Update fio to 3.16 and liburing to 0.2
