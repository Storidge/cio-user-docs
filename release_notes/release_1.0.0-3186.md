---
title: Release 1.0.0-3186
description: Release notes for Storidge CIO version 1.0.0-3186
lang: en-US
---

# Release 1.0.0-3186
In addition to feature enhancements, bug fixes and support for new kernel releases, this update includes a number of feature requests from users.

New features include support for configuring S3 interface on any Storidge volumes. This makes it simple to create datastores for configuration files, unstructured data, backup target, etc. For example, two Storidge clusters can be configured to provide cross-backup services to each other.  

Support is added for installing Storidge software on AWS EKS instances. This makes it much simpler to deploy a cluster of Kubernetes worker nodes with integrated persistent storage, while using AWS EKS for the Kubernetes control plane (master nodes).

::: warning Important

This release fixes a SCST issue that can stop a node from shutting down correctly. When `cioctl node update` updates a cluster node to latest release, this bug may result in a node hang.

If you have an existing cluster and hit this issue during a node update operation, perform a hard reset to reboot the node. After the node has rebooted and rejoined the cluster, run `cioctl node update` again to complete the node update. 

:::

## New
- Add support for running Storidge on AWS Ubuntu EKS images
- Automatically assign a new Swarm manager node when manager node is removed from cluster
- Add support for S3 interface on volumes using minio image. Naming convention for volumes are <interface>-<vdisk id>, e.g. s3-vd1
- Add `--no-reboot` option in `cioctl node update` so node reboot can be automated through Ansible
- Provide environment variables to configure metrics exported by storidge/cio-prom

## Improvements
- Add support Ubuntu 5.3.0-{40, 41}
- Add support Ubuntu 4.15.0-91
- Add support AWS Ubuntu 4.15.0-{1060, 1063}
- Add support Ubuntu 4.4.0-{175, 176}, AWS Ubuntu 4.4.0-{1103. 1104}
- Remove retracted kernels 4.15.0-{89, 90, 1061, 1062}
- Enable user to use host name for passing IP addresses to cioctl create
- Update to Golang version 1.14
- Add gbio support for Ubuntu 19.10 when crossing boundaries
- Fix bug where large I/O crosses three or more microdisks
- Improve node partial failure handling
- Significantly reduce amount of messages going into system syslog
- Update Prometheus exporter to add more volume info; volume name, capacity, allocated percentage. This is to enable displaying graphs of disk usage, e.g. on grafana
- Reduce output from storidge/cio-prom exporter so less noisy
- Update SCST to version scst-3.4.x-r8620

## Bug fixes
- Fixed issue with `cio network create` where sometimes `docker network create` command is not called
- Fixed issue with `cio network create` where '---' is incorrectly inserted in network configuration file
- Fixed bug where Ubuntu 18.04.1 did not install because subversion package was missing
- Fixed bug in `cioctl unload` to correctly search for volume portainer_portainer from stack file portainer  
- Fixed bug to resolve potential node hangs during cordon operation due to dependency between initiator and target scst code
