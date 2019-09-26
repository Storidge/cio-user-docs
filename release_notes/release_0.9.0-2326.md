---
title: Release 0.9.0-2326
description: Release notes for Storidge CIO version 0.9.0-2326; persistent volumes for kubernetes pods
lang: en-US
---

# Release 0.9.0-2326
This release focuses on stability improvements and bug fixes.

# New
This release adds auto-recovery of nodes that were accidentally rebooted.

# Improvements
- Add support AWS Ubuntu 4.4.0-1043-1058, Ubuntu 4.4.0-122-125, 3.13.0-146-148 kernels
- Runs Portainer as a Swarm service. Portainer service is constraint to cio and manager nodes
- Use performance data files from sds nodes on new nodes joining an existing cluster so QoS of new node can be turned on. This applies to bare
metal servers only.
- Improve cluster configuration check messages in cioctl
- Add Digital Ocean instances to list of recognized VMs
- Run perl using only the embedded "C language locale"
- Replace 'used' with 'allocate%' in cio vdinfo command for clarity
- Fix difference between actual and expected number of data drives during configuration check
- Simplify node addition to cioctl join-token and cioctl add commands
- Enable QoS feature only if real performance data is collected during cluster initialization
- Add work queue to avoid tasks being delayed by vdmv or other cli commands
- Improve getlocalip() to support Class A network addressing sub-netted into many Class B address ranges, e.g.
on Digital Ocean
- Improve vdisk event messages
- Update mount path to use volume name when available
- Add auto-rejoin for rebooted or power cycled cio nodes
- Add scst-cio utility to export any vdisk in cio cluster as an iscsi target
- Add volume plugin version info in plugin description

# Bug fixes
- Fix auto kernel update and SCST compile issue for Ubuntu 14.04 on AWS
- Fix cioctl and demo script when running on AWS to detect RHEL or Centos instances and return the correct UID symbolic name and HOME
directory
- Fixes for CentOS 7.4 and Ubuntu 16.04 install on AWS
- Fix for events to be sent for every volume. Re-enable events after volume expansion
- Turn off DRIVE_CHECK on DigitalOcean droplets
- Restarts snapshot services after cluster reboot
- Fix snapshots to rotate on snapshot number setting
- Fix cio vdinfo bug which shows default xfs file system on un-formatted vdisks
- Fix bug cannot delete volume due to "invalid vdisk id" error

# Known issues
### Profiles
- Certain capabilities of CIO have not been added to the Create Profile and Profile Details pages. These include directives supporting encryption service, volume labels, file
system selection and interface container types. These capabilities are available through CLI commands
and will be added to the UI in the next CIO release.
- Snapshot, compression and deduplication features shown in sample profiles are not yet released.
### TLS Support
- The pre-release version of CIO does not include support for TLS. This security feature will be added to the next release of CIO.
### Volumes
- Support for modifying volumes parameters, e.g. capacity, IOPS limits, etc. have not added to the Portainer UI. These capabilities are available through CLI commands and will be added to the UI in
a future CIO release.
