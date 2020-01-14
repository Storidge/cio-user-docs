---
title: Release 1.0.0-3107
description: Release notes for Storidge CIO version 1.0.0-3107
lang: en-US
---

# Release 1.0.0-3107
This update adds new kernel releases, including new class u19 for Ubuntu 19.10.

This release also adds a cluster freeze capability to improve tolerance for unstable networks. Cluster will be automatically frozen when a potential cluster breaking failure is detected. This build also adds initial NVMEoF support for the upcoming Workgroup Edition to improve I/O performance for demanding applications. 

## New
- Add initial support for NVMe-TCP
- Add cluster freeze capability when second or third node failure detected. Disallow node uncordon before power cycling the cluster.
- After power cycling the cluster, all frozen nodes are rebuilt first. Cluster will wait for rebuild to finish before reforming.
- Add endpoint for updating software on node at /nodes/{nodeid}/update
- Add support Ubuntu 5.3.0-{22,23,24,26}, AWS Ubuntu 5.3.0-{1008,1009}. This adds new class 'u19'

## Improvements
- Add support Ubuntu 4.15.0.-74
- Add support Ubuntu 4.4.0-172, AWS Ubuntu 4.4.0-1101-112
- Implement a check for essential system packages after installation on Ubuntu distros
- Update Prometheus exporter to only issue `cio info` to sds node to reduce volume of commands

## Bug fixes
- Fix bug where cio did not install on Ubuntu 18.04.1 because subversion package not found
- Fix response for node update endpoint
- Fix bug where cioctl did not detect failed node correctly
- Fix bug where when sds node fails, backup1 node waits for mongodb lock
- Fix bug where race condition in volume move, create and remove commands caused dfs response to be ignored due to fast response
