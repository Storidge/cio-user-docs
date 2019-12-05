---
title: Release 1.0.0-3074
description: Release notes for Storidge CIO version 1.0.0-3074; persistent volumes for Kubernetes
lang: en-US
---

# Release 1.0.0-3074
This release updates the supported kernel list, adds a few feature requests and addresses a few bugs.

The changes to the `cioctl migrate` command enable any docker named volume to be migrated to a Storidge volume. Since Storidge volumes are also docker named volumes, any Storidge volume can be easily migrated from one Storidge cluster to a remote Storidge cluster, e.g. from production cluster to test cluster.

## New
- Migrate docker named volumes or Storidge volumes between Storidge clusters
- Add support for Ubuntu 19.04 (u19 class) on x86_64 architecture

## Improvements
- Add support Ubuntu 4.15.0-72, AWS Ubuntu 4.15.0-1056 kernels
- Remove retracted Ubuntu 4.15.0-71 kernel
- Add dynamic exporting of node, volume and drive metrics to Prometheus exporter
- Use sys interface for drive status to improve Prometheus exporter response
- Improve handling of unattended upgrades with `apt-get`
- Update Docker CE to 19.03.5 for all classes
- On Ubuntu 18.04, update MongoDB to 4.2.1 and mongo-c-driver to 1.15.2
- Force drive type for non-cloud virtual instances to be ssd
- Add option to set drive type with `--drive` flag in `cioctl create` command. This is needed in environments where auto detection of drive type may not be consistent.
- Add option to not launch UI service with `--noportainer` flag in `cioctl create`. This gives user option to preset user credentials separately instead of starting unsecured service.
- Improve `cioctl migrate` command to auto create destination volume on remote Storidge cluster

## Bug fixes
- Fix bug where error message "no Docker manager found in the cluster" is printed on k8s cluster
- Fix bug where cio-api is not running after initialization on k8s single node cluster
- Fix bug with Ubuntu 19.04 install script not correctly loading docker
- Fix bug where pre-installed open-iscsi result in non-unique iscsi initiator name on cloned VMs
