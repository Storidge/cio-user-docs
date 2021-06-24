---
title: Release 2.0.0-3556
description: Release notes for Storidge CIO version 2.0.0-3556
lang: en-US
---

# Release 2.0.0-3556
The release includes a new backup capability to cover use cases for backup and recovery, data migration and disaster recovery. Support for Kubernetes is expanded to bring the user experience closer to the ease of use of Docker. 

This update also adds stability enhancements, important bug fixes and support for the latest kernel releases.

## New
- Add Helm Chart to install Storidge service account and config files
- Add update-kubeconfig script to install storidge service account, rbac, kubeconfig and csi driver
- Add cio-report to installation tarball
- Add support for Azure Ubuntu 18.04 images
- Add backup capability to Workgroup Edition
- Add support for NVMEoF on Ubuntu 20.04

## Improvements
- Add support Ubuntu 5.4.0-{57-67, 70-76}, AWS 5.4.0-{1033-1039, 1041-1043, 1045-1050}, Azure 5.4.0-{1036-1038, 1040, 1041, 1043, 1044, 1046-1050}
- Add support Ubuntu 4.15.0-{127-130, 132-137, 139-144}, AWS 4.15.0-{1089, 1091-1102}
- Add support Ubuntu 4.4.0-{197-201, 203}, AWS 4.4.0-{1118-1121}
- Add support Centos 7.9 3.10.0-{1160.15.2, 1160.21.1, 1160.24.1, 1160.25.1, 1160.31.1}
- Remove retracted kernels Ubuntu 4.4.0-{195, 202}
- Add support Kubernetes assigning name for snapshot with `--snapshotid` flag
- Update network instability timeout to match Kubernetes node monitor grace period
- Update golang to 1.15.8
- Remove dependency on external grpc server for csi driver endpoints
- Reworked setup of /etc/iscsi/initiatorname.iscsi for Equinix
- Update Docker version to 20.10.6
- Wipe kube credentials on worker node when removed from cluster
- Add nvme list section in `cioctl report`
- Add network.cfg, `ip addr` and `ip route` sections in cioctl report
- Reworked Ubuntu 20.10.1+ to reference all 3 major .deb files so as to load only the specified version number
- When adding a new node, promote node to manager role when `--all-managers` flag is set 
- Disable RHEL subscription feature that can happen on certain updates to Centos 7
- Follow http 3XX response code redirects when loading kernel rpm package files for CentOS
- Update systemd service files for ciord, cio and cio-api to support rsyslog and syslog-ng
- Update `cioctl report` to remove false positive messages
- Improve placement of setup_systemctl() call
- Add `cioctl unlock_all` to remove backup and node management locks
- Add kubeadm to installer when target is Kubernetes node
- Add command to inspect Kubernetes snapshot

## Bug fixes
- Add fix to address rolling kernel updates on Ubuntu 18.04 EKS images on AWS. Use u20 tarballs on Ubuntu 18.04 EKS instances as kernel is auto updated to 5.4 kernel
- Correct syntax for JSON serialization hints in cio-keycp and cio-rsh
- Limit drive serial number passed to SCST to 20 characters
- Fix bug where cio network ls was not correctly returning networking info on Hetzner Cloud
- Fix bug where single node cluster with nvme drives cannot load kernel modules after reboot
- Fix bug where wrong profile format can corrupt vid file