---
title: Release 1.0.0-2972
description: Release notes for Storidge CIO version 1.0.0-2972; persistent volumes for kubernetes pods
lang: en-US
---

# Release 1.0.0-2972
This release adds a few new capabilities. The 2968 release adds initial support for Ubuntu 18.04. Due to limited testing hours, this should be considered for beta use only.

A new `cioctl report` command is added to simplify the gathering of logs and info from all nodes for diagnostics.

We've added initial support for a shared volume concept similar to shared volumes in Kubernetes pods. This allows multiple services to share the same volume on a Swarm node. See example stack file at https://github.com/Storidge/docker-stacks/blob/master/share.yml.

This release also includes a number of stability and usability improvements.

## IMPORTANT

To simplify code maintenance going forward, a change was made in the network message format used for internode communications. This unfortunately breaks individual node software updates.

If you have an existing cluster running v1.0.0-2942 or earlier, do NOT use the `cioctl node update` command to update individual nodes. Instead use the curl script method to update all nodes. When all nodes are updated, run `cioctl reboot` to reboot the cluster into the new version.

There was a recent release v1.0.0-2949. This version will support `cioctl node update` for updating individual nodes to v1.0.0-2968.

## New
- Initial support for Ubuntu 18.04 LTS (beta)
- Add new `cioctl report` command to collect logs and info from all nodes. The report is saved to /var/lib/storidge. See details at https://docs.storidge.com/cioctl_cli/report.html
- Add initial support for shared volume with containers on same Swarm node, similar to Kubernetes pod. A shared volume requires a volume label with key value 'cio.volume=shared'. See example at https://github.com/Storidge/cio-profiles/blob/master/SHARE

## Improvements
- Add support Ubuntu 4.4.0-{160, 161, 163, 164} kernel, AWS Ubuntu 4.4.0-{1092, 1094}
- Add support Ubuntu 4.15.0-{20, 29, 54, 55, 62}, AWS Ubuntu 4.15.0-1044
- Remove retracted Ubuntu 4.4.0-158 kernel
- Point Centos 7.6 repo to mirror.centos.org
- Update `cioctl node clean` to reject command on nodes that are part of a cluster
- Change portainer and agent to run as a stack instead of a service. A copy of the portainer.yml is saved at /etc/storidge/config so the stack can be removed and re-deployed.
- The uninstall script now removes MongDB and mongo-c-driver
- Persist volume label information in metadata instead of just MongoDB datastore
- Add cio version in `cio node ls` output. This helps with `cioctl node update` so it's clear which nodes have been updated
- Improve low capacity handling (storage pool under 10% available capacity) to avoid volume mounting issues after node reboot
- Improve recovery so volume rebuilds are not stopped when new capacity is not required
- Add 'cio redundancy_check' to verify if any volumes needs rebuilding. If so, `cioctl node cordon | remove | reboot` commands are rejected
- Update `cio info` output to not include capacity of faulty drives
- Change IPAM function to use CIDR for specifying IP address range when used with NFS and S3 interface containers
- Simplify `cio volume move` and `cio volume create` network message format.
- Updates `cioctl rebalance` command
- Updates `cioctl node update` to redirect install/uninstall messages to /var/lib/storidge

## Bug fixes
- Fix a bug where node is in maintenance mode after a cluster reboot, i.e. `cioctl reboot`
- Fix bug where node stays in maintenance mode after node power reset
- Fix bug where volume created with label and no filesystem has errors with `cio volume move` command
- Fix bug where rebuild threads do not stop and raid_get_mdisk ERROR is printed endlessly
