---
title: Release 1.0.0-3246
description: Release notes for Storidge CIO version 1.0.0-3246
lang: en-US
---

# Release 1.0.0-3246
This update adds user feature requests, stability Improvements, important bug fixes and support for new kernel releases.

## New
- Add feature request to provide `--all-managers` option in `cioctl create` command. This assigns all nodes to have manager role in a Swarm cluster
- Add feature request to provide `--version` option in `cioctl node update` command. This provides ability for user to update to a specified cio version instead of automatically updating to latest version
- Add support for shared volumes. Shared volumes are specified using `--shared` flag in `cio volume create` or `shared: yes` key value in a profile. The shared volume is accessible on all nodes without having to spec an nfs client within a container or pod. Shared volumes are initially supported where Storidge's IPAM capability can allocate and manage IP addresses for each shared volume.
- Add initial support for Ubuntu 20.04
- Add command `cio license add --token | --license` for cluster setup and enable additional functionality during runtime
- Add support for air-gap installations on RHEL 7 node with new `install --air-gap` option

## Improvements
- Add support for Ubuntu 4.4.0-{177, 178, 179}, 4.15.0-{96, 97, 99, 100}
- Add support for AWS Ubuntu 4.4.0-1105, 4.15.0-{1065, 1066}
- Add support for Centos 3.10.0-1062.18.1
- Update SCST to version scst-3.4.x-r8836
- Update Docker version to 19.03.8
- On Ubuntu 16.04 and Centos 7, update MongoDB to 3.6.17
- On Ubuntu 18.04, update MongoDB to 4.2.3 and mongo-c-driver to 1.16.2
- Update creation of domain id to support `cio license add`
- Improve `cioctl report` to include older syslog files
- Update `cio license add` for `--email` ,  `--token` , `--license` options
- Update `cio license info | show | remove` commands
- Set promiscuous mode on network interface when macvlan driver is specified
- Add collection of system memory information to `cioctl report`
- Add dependency container-selinux for docker-ce in RHEL7
- Add NFS client packages for shared volumes
- Switch Linux version check from lsb_release to /etc/os-release
- Use alloc-pages for local drive table allocation

## Bug fixes
- Fixed a timing issue which resulted in wrong number of drives reported, when checking drives during cluster initialization
- Fixed invalid character issues with the Prometheus monitor by filtering invalid characters in volume names
- Fixed bug where kernel version change detected incorrectly in RHEL 7
- Fix bug where cluster cannot complete boot after cordoned node and power cycle all nodes
