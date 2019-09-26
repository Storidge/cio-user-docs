---
title: Release 0.9.0-2653
description: Release notes for Storidge CIO version 0.9.0-2653; persistent volumes for kubernetes pods 
lang: en-US
---

# Release 0.9.0-2653
# New
- This release introduces support for physical drive management and TLS support for securing REST API

# Improvements
- Add support Ubuntu 4.4.0-142, Centos 3.10.0-957.5.1
- Add TLS support to API. Enable TLS with --tls flag
- Add CA, server and client key/certificates to /etc/storidge/cert on initialization
- Generate CA, server and Portainer keys/certs during cluster initialization
- Replace drive label with serial number in NODE_DRIVELIST of default.cfg"
- Add cioctl qos to demo different class of services
- Improve update_sn() to handle longer drive labels
- Update cioctl drive ls to handle drive table size exceeding 4095 bytes sysfs limit
- Add csi-cio volume plugin and deployment file for Kubernetes
- Add support for mixed drive type configurations
- Improve volume create error handling. Disallow allocating drive mdisks to volume when drive type does not match
- Set n+1 rule for volume creation, e.g. 2-copy volume require at least 3 nodes with matching drive type
- Remove status field from cio volume info
- Improve cio info error message when cio client not running
- Handle drive table size exceeding sysfs limit of 4095 bytes
- Add member "revision" in DAB, EAB and Extent Page metadata

# Bug fixes
- Fix bug where wrong ISCSI drive is removed. Enforce tighter pattern match for drive removal
- Fix bug where cioctl drive add only updates drive table of one node
- Fix incorrect scst error messages on cioctl node remove
- Fix bug where after cioctl reboot, deleted local drive is mistakenly added back to cluster
- Fix bug where newly added node has empty global drive table
- Fix for node crash due to locality rebuild
- Fix locality rebuild always being interrupted
- Fix race conditions related to locality rebuild

# Known issues
### Profiles
- Certain capabilities of CIO have not been added to the Create Profile and Profile Details pages. These include directives supporting encryption service,
volume labels, file system selection and interface container types. These capabilities are available
through CLI commands and will be added to the UI in the next CIO release.
- Snapshot, compression and deduplication features shown in sample profiles are not yet released.
### TLS Support
- The pre-release version of CIO does not include support for TLS. This security feature will be added to the next
release of CIO.
### Volumes
- Support for modifying volumes parameters, e.g. capacity, IOPS limits, etc. have not added to the Portainer UI. These capabilities are available through CLI commands and will be
added to the UI in a future CIO release.
