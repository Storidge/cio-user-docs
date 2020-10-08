---
title: Release 2.0.0-3411
description: Release notes for Storidge CIO version 2.0.0-3411
lang: en-US
---

# Release 2.0.0-3411
The release includes improvements, bug fixes and adds support for new kernel releases. In particular, this update fixes a critical bug introduced in release 3373. It is strongly recommended to update your cluster to this latest release. 

To update clusters running release 3249 to this release, please follow this [link](https://faq.storidge.com/software.html#how-to-update-a-storidge-cluster-from-release-v1-0-0-3249-and-below-to-latest-release) for details. 

## New
- Add initial support Ubuntu 20.04 and Centos 8 kernels

## Improvements
- Add support Ubuntu 4.15.0-{117, 118, 119}, AWS Ubuntu 4.15.0-{1081, 1082, 1083}
- Add support Ubuntu 4.4.0-{190, 191, 192}, AWS Ubuntu 4.4.0-{1112, 1113, 1114, 1115, 1116}
- Add support Ubuntu 5.4.0-{46, 47, 48, 49}
- Update Portainer image to portainer/portainer-ce (CE 2.0)
- Add endpoints for capacity info, volume clone and snapshot clone
- Update Swagger/OpenAPI for new capacity, volume and snapshot cloning endpoints
- Update `cio-report` to search extra patterns for BIO issues
- Changed Prometheus exporter (storidge/cio-prom) port from 16995 to 16990 to avoid conflict with cior
- Add cio-prom tcp port 16990 to /etc/service
- Release image storidge/cio-prom:0.3. Add configurable export levels

## Bug fixes
- Fixed cio-report to work with the new-style of `cioctl report` that will insert multiple syslog files in chronological order
- Reworked usage of any multi-statement bash commands used by cior to isolate any sync to just one invocation of cior
- Fixed a bug where sync issued by cior are spawn to the background to avoid a deadly embrace with Docker/libcontainerd.  sync completes at a later point writing into syslog a tag of "sync" and a message of "Done"
- Improved fix in wait_for_service_on_nodes(), where previously `docker service ps` could not easily print the information required
- Fixed bug where shared volume sometimes cannot move during cordon operation
- Fixed bug where `docker service ps <SERVICE>` sometimes "Reject"
- Fixed bug to avoid `cio volume ls` command hanging in cio client when a cio server is being restarted
- Fixed bug where removing sds node leaves docker node in down state
- Fixed critical bug for race condition completing gbio operation
