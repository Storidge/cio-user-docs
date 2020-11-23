---
title: Release 2.0.0-3450
description: Release notes for Storidge CIO version 2.0.0-3450
lang: en-US
---

# Release 2.0.0-3450
The release includes improvements, bug fixes and adds support for new kernel releases. 

## New
- Add support for Ubuntu 20.04 and Centos 7.9

## Improvements
- Add support Ubuntu 4.15.0-{121, 122, 123, 124, 125}, AWS Ubuntu 4.15.0-{1084, 1086, 1087, 1088}
- Add support Ubuntu 4.4.0-{193, 194, 195}, AWS Ubuntu 4.4.0-{1117}
- Add support Ubuntu 5.4.0-{51, 53, 54, 55}, AWS Ubuntu 5.4.0-{1022, 1024, 1025, 1026, 1028, 1029, 1030}
- Add support Centos 7.9 3.10.0-1160
- Remove retracted kernels Ubuntu 4.15.0-{102, 103, 107, 110, 113, 114, 116}
- Remove retracted kernels AWS Ubuntu 4.15.0-{1068, 1074, 1081}
- Removed retracted kernels Ubuntu 5.4.0-{44, 46}
- Add support to auto update kernel modules when host kernel is updated due to installation of applications
- Change image pre-load from portainer/portainer to portainer/portainer-ce
- Enable `cioctl create --help` to run from all nodes
- Add systemd service file for cio-api
- Enable auto expansion scanning only from primary/sds node
- Auto assign names to clone volumes/snapshots if desired volume name not passed in request body
- Update `cioctl create --help` to match docs
- Remove spinlocks to improve performance of QoS
- Expand support for failover in Kubernetes
- Restrict loading of package files for certain kernel signatures
- Fixed a timing issue in cior loading of remote disks using SCST
- Updated golang to version 1.15.4
- Updated Docker version to 19.03.13-3
- Updated MongoDB to 3.6.20 (for u16 and CentOS 7), MongoDB 4.2.10 for u18, MongoDB 4.4.1 for u20 and CentOS 8
- Update Prometheus exporter for changes in /proc/diskstats output

## Bug fixes
- Fixed bug where cluster initialization does not complete on Ubuntu 20.04
- Fixed bug with warning "no blkg associated for bio on block-device: nvme0n1" in Ubuntu 20.04
- Fixed bug where allocation percentage was missing in Prometheus exporter output