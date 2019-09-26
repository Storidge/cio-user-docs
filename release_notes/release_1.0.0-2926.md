---
title: Release 1.0.0-2926
description: Release notes for Storidge CIO version 1.0.0-2926
lang: en-US
---

# Release 1.0.0-2926
This release focuses on bug fixes, stability and usability improvements. It includes important stability fixes for AWS deployments.

# New
- Add `cioctl node update` command to simplify cio software updates for a node
- Installs Portainer agent during cluster initialization

# Improvements
- Add support Ubuntu 4.4.0-{156-159}, AWS Ubuntu 4.4.0-{1088-1090}
- Add support Centos 3.10.0-957.27.2
- Upgrade Docker to version 19.03.1
- Remove pre-Spectre and Meltdown Ubuntu releases from support list
- Improve reporting of errors in install script for getting Ubuntu keys and installing docker-ce package
- Extend exec timeouts for long running `cioctl` commands
- Add KVM instance in OpenStack to list of virtual servers so bare metal data collection is not started
- Add `--single-node` option to `cioctl create` command to automatically initialize a single node cluster
- After cluster reboot, extend time for docker daemon to be ready before setting node active
- Remove snapshots after rollback point to save capacity and iops
- Add --json and -j output option for cio volume info to display JSON format
- Add option `-s no` or `--snapshot no` to turn off periodic snapshots in `cio volume update` command
- Add 'Periodic' and "Manual' type for snapshots in cio snapshot list
- Update periodic snapshot service to only remove periodic snapshot. Manual snapshots will be manually deleted by user
- Add file system to metadata after volume move
- Call `cioctl repair` to run xfs_repair

# Bug fixes
- Fix SCST install issues in script cio-ce, caused by file naming changes
- Fix bug where snapshot rollback hit "Inappropriate ioctl for device" error
- Fix bug where cio daemon cannot be restarted after uncordon operation
- Fix bug where cordon operation fails when it takes too long to stop a service
- Fix bug where volume move does not work after a drive is removed
- Fix bug where volume expansion is not disabled when limit is reached
- Remove docker service scale up/scale down on cluster reboots
