---
title: Release 2.0.0-3373
description: Release notes for Storidge CIO version 2.0.0-3373
lang: en-US
---

::: warning Important
Due to a critical bug, release 3373 has been retracted. 
:::

# Release 2.0.0-3373
This update adds volume cloning features, improved cluster resilience, critical bug fixes and support for new kernel releases.

In addition, there is an upgrade path from clusters running release 3249 to this release. Please follow this [link](https://faq.storidge.com/software.html#how-to-update-a-storidge-cluster-from-release-v1-0-0-3249-and-below-to-latest-release) for details. 

## New
- Add new feature to clone a volume with `cio volume clone`
- Add new feature to clone volume from a snapshot with `cio snapshot clone`
- Add network instability handling to improve cluster resilience
- Add `update3249` to update clusters on release 3249 to release 3373

## Improvements
- Add support Ubuntu 4.4.0-189
- Add support Ubuntu 4.15.0-{113, 114, 115}, AWS Ubuntu 4.15.0-1080
- Add support Centos 3.10.0-1127.19.1
- Add support for ScaleFlux drives with label sfdv
- Add 'filesystem' field to cio profile show output
- Improve execution speed of `cio snapshot ls`
- Improved error response on API endpoints for greater consistency of CSI driver
- Add support for snapshots for CSI driver
- Update CSI driver to CSI 1.3 spec
- Added advisory lock for periodic checking of volume auto expansion to prevent multiple simultaneous scans
- Reworked cioctl report to include up to 10 syslog files in a report in chronological order
- The ciord daemon will now dump its golang stack into syslog when it receives a SIGQUIT
- Update Docker volume plugin with improved error messages
- Update Docker volume plugin to retry volume mounting operation up to 50 seconds

## Bug fixes
- Fixed bug where vid file not correctly copied by ciord to destination
- Fixed bug where shared volume not remounted after node cordon/uncordon and reboot
- Fixed problem where iSCSI daemon is not restarted after changing the initiator name. Affects virtual instances only
- Return failure on cioctl node cordon operation if docker daemon state is down
- Fixed bug where SCST make did not complete on Hetzner Cloud instances
- Fixed bug where REST API was dependent on eventLogFile