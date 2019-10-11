---
title: Release 1.0.0-3007
description: Release notes for Storidge CIO version 1.0.0-3007; persistent volumes for kubernetes pods
lang: en-US
---

# Release 1.0.0-3007
This release addresses a number of community feature requests for new capabilities. The most important is an ability to boot a cluster when there is either a missing node or a failed node.

## New
- Add `cioctl migrate docker` command to migrate data from docker named volume to cio volume
- Add `cioctl node show-time` child command to show time left in maintenance window
- Add `cioctl node extend-time` child command to extend maintenance window by up to 60 minutes
- Add Proxmox/QEMU to VM list
- Add capability to remove a cordoned node
- Add capability to boot a cluster when there is a missing node or a node in maintenance mode
- Add `cio network ls` and `cio network info` commands

## Improvements
- Add support Ubuntu 4.4.0-166, 4.15.0-66, AWS Ubuntu 4.4.0-1096
- Add support AWS Ubuntu 4.15.0-{45, 47, 48, 50, 51, 52}
- Move install progress messages printed on console to /var/lib/storidge/installed_packages file
- Update CSI driver with support for v1 CSIDriver format and preliminary support for snapshots. Version changed to 1.1
- Verify at least 1.5TB capacity available in cluster before starting cluster initialization

## Bug fixes
- Fix bug where `cioctl node show-time` and `cioctl node extend-time` commands fail after cluster reforms with missing node
- Fix bug where volumes missing all node updated. Retry starting mongodb if socket is in use.
- Fix bug where `cioctl node show-time` is showing different time on different nodes
