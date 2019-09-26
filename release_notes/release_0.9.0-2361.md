---
title: Release 0.9.0-2361
description: Release notes for Storidge CIO version 0.9.0-2361   
lang: en-US
---

# Release 0.9.0-2361
# New
- This release adds support for auto-recovery of nodes. The node may have been accidently rebooted or failed, and was removed from the cluster. When the node is available again, it
will automatically rejoin the cluster. Previous workloads that stopped because of a lack of resources
will be restarted by the scheduler on the rejoined node.
- Adds online capacity expansion of volumes with file systems. This enable applications to continue running while capacity is added to a volume
running out of working space. Supported file systems are ext4, btrfs and xfs.

# Improvements
- Add support AWS Ubuntu 4.4.0-1043-1061 and Ubuntu 4.4.0-122-129, 3.13.0-146-151
- Adds support for newly released Centos 7.5 distro
- On bare metal servers, use QoS performance files from sds node on new nodes
- Improve cluster configuration check messages in cioctl
- Add Digital Ocean droplets to list of recognized VMs
- Turn off DRIVE_CHECK on DigitalOcean droplets
- Run perl using only the embedded "C language locale"
- Label cio nodes and set constraint for Portainer service to cio and manager nodes
- Use get_homepath() to locate .pem file from the default AWS login ID home directory (as well as CWD and /etc/convergeio/config).
- Replace 'used' with 'allocate%' in cio vdinfo command
- Simplify steps for adding new node to cioctl join-token and cioctl add commands
- Add work queue to avoid tasks being delayed by vdmv or other cli commands
- Reduce vdmv timeout from 60 seconds back to 30 seconds so other cli commands can be processed earlier
- Add warning message if vdmv takes more than 2 seconds
- Enable QoS feature only if real performance data is collected during cluster initialization
- Improve getlocalip() to support Class A network addressing sub-netted into many Class B address ranges, e.g. on Digital Ocean
- Improve vdisk event messages in syslog and include volume names when available
- Update mount path to use volume name when available to link apps to volumes

# Bug fixes
- Fix auto kernel update and scst compile issue for Ubuntu 14.04 on AWS
- Fix cioctl and demo script when running on AWS to detect RHEL or Centos instances and return the correct UID symbolic name
and HOME directory
- Fixes for CentOS 7.4 and Ubuntu 16.04 install on AWS
- Fix for events to be sent for every volume. Re-enable events after volume expansion
- Fix difference between actual and expected number of data drives during configuration check
- Fix snapshots to rotate on snapshot number setting
- Restart snapshot after cluster reboot
- Fix metadata check issue when there is less then 3 drives
- Fix cio vdinfo shows default xfs file system on un-formatted vdisks
- Fix bug where vdisk not movable if a 3-drive node has one drive failure
- Fix for two drives marked faulty
- Fix race condition and improve error handling

# Known issues
### Profiles
- Certain capabilities of CIO have not been added to the Create Profile and Profile Details pages. These include directives supporting encryption service,
volume labels, file system selection and interface container types. These capabilities are available
through CLI commands and will be added to the UI in the next CIO release.
- Snapshot, compression and deduplication features shown in sample profiles are not yet released.
### TLS Support
- The pre-release version of CIO does not include support for TLS. This security feature will be added to the next
release of CIO.
### Volumes
- Support for modifying volumes parameters, e.g. capacity, IOPS limits, etc. have not added to the Portainer UI. These capabilities are available through CLI commands and will be
added to the UI in a future CIO release.
