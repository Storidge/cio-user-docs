---
title: Release 0.9.0-2466
description: Release notes for Storidge CIO version 0.9.0-2466; persistent volumes for kubernetes pods  
lang: en-US
---

# Release 0.9.0-2466
# New
- This release introduces support for changed block tracking (CBT) capability, together with two new
CLI commands. `cioctl node cordon` allows a node to be temporarily removed from a cluster for
maintenance operations. After completion of software or hardware updates, the node is added back to
cluster with `cioctl node uncordon` command. While in cordoned state, drives attached to the node are
inaccessible. However changes for the cordoned drives are tracked through CBT capability. When the
node is uncordon, CBT allows for fast node rebuilds as changed data is updated.
- This release adds snapshot service to the cio cli and API. The snapshot capability supports both periodic and
command/API triggered snapshots. A maximum limit can be set for snapshots so that oldest snapshots are
automatically rotated out.

# Improvements
- Add support Ubuntu 4.4.0-134-136, Ubuntu 3.13.0-156-158, AWS Ubuntu 4.4.0-1066-1067
- Add /mount and /umount routes for CSI volume plugin
- Add support for snapshots to API - Add `cio snapshot [create | remove | list | info ]` commands
- Add `cioctl [cordon | uncordon]` commands for non-disruptive updates
- Update cioctl to setup swarm cluster and portainer service if `kubectl version` not running
- Remove container load of Portainer or CIO NFS containers when Kubernetes is detected
- Improve cioctl to not assume that primary sds node is always the first node in node list
- Add management lock for add drive/scan node operation
- Change mount path length from 127 to 160 characters for Kubernetes
- Add support for drive additions to cluster nodes. `cioctl` checks new drive, initializes metadata,
notifies sds to modify configuration file to all nodes, restart iscsi target service on target node,
restart iscsi initiator services on all nodes, trigger scannode cmd on all nodes
- Block CLI commands during scale down to resolve conflict between `vdmv` and `cioctl remove` or node failure
- Improve snapshot CLI interface with `--snapshotMax` flags and `--interval` flag for rotating snapshots
- Check for serial number conflicts when adding drives to the cluster
- Add `cioctl cordon` and `cioctl uncordon` commands to support non-disruptive node updates
- Add changed block tracking for fast node rebuilds after `cordon/uncordon` operations

# Bug fixes
- Fixed updating of /lib/systemd/system/iscsid.service to place SCST before CIO, Kubernetes or Docker
- Fix cio-api not started after cluster reboot or initialization in Kubernetes cluster
- Fix bug deleted snapshots still listed
- Fix snapshots before cluster reboot not listed
- Fix for "NMI watchdog: BUG: soft lockup" on AWS

# Known issues
### Profiles
- Certain capabilities of CIO have not been added to the Create Profile and Profile Details pages.
These include directives supporting encryption service, volume labels, file system selection and
interface container types. These capabilities are available through CLI commands and will be added to
the UI in the next CIO release.
- Snapshot, compression and deduplication features shown in sample
profiles are not yet released.
### TLS Support
- The pre-release version of CIO does not include support for TLS. This security feature will be added
to the next release of CIO.
### Volumes
- Support for modifying volumes parameters, e.g. capacity, IOPS limits, etc. have not added to the
Portainer UI. These capabilities are available through CLI commands and will be added to the UI in a
future CIO release.
