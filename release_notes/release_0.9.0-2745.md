---
title: Release 0.9.0-2745
description: Release notes for Storidge CIO version 0.9.0-2745; persistent volumes for kubernetes pods
lang: en-US
---

# Release 0.9.0-2745

# Improvements
- Add support Ubuntu 4.4.0-143-146, AWS Ubuntu 4.4.0-1075, 1077-1079, Centos 3.10.0-957.10.1
- Update to CVE-2019-5736 compliant Docker releases (18.09.5)
- Update mongo c driver to version 1.14
- Update fio to version 2.16
- Update to MongoDB 3.6.11 and spectre-meltdown-checker.sh
- Update CSI plugin for CSI spec v1.0 and Kubernetes 1.13
- Replace deprecated function with mongoc_collection_find_with_opts
- Add --provision flag for `cio volume create`
- Add route for POST /drives/rescan
- Update GET /volumes/{volume-id}/snapshots response code based on snapshots enabled or disabled
- Update POST /volumes/{volume-id}/snapshot to return 409 if no snapshot was created
- Return camel case format for keys in json response
- Enable volume moves when updating node name or id
- Enable interface parameters in GET /profiles/&lt;profile name&gt; and POST /profiles
- Set POST /profiles to list interface parameter type first
- Add endpoint GET /events/&lt;number&gt;
- Add -q option to `cioctl create` command to return token only
- Add `cioctl drive rescan` command to look for new drives
- Add Succeed: and Fail: status to `cioctl drive` and `cio snapshot` commands
- Update `cioctl cordon/uncordon` to significantly reduce operation times
- Set default host names for AWS instances
- Change reserved IO resource from 50% to 20%
- Add versioning for DAB (2 copies) and EAB (3 copies) in each drive
- Add TLS support to secure volume plugin to REST API communications

# Bug fixes
- Fix `cioctl drive add` returning wrong error message when adding non-existent drive
- Fix bug `cioctl drive add` returning both failed and succeed messages
- Fix bug `cio snapshot list` returning incorrect status on non-snapshot volumes
- Fix bug where "Pending request number of vdisk stays at 1024"
- Fix node crash with writePage errors under heavy vdbench load
- Fix revision comparison issue where signed type will covert to unsigned implicitly
- Fix conflict between normal rebuild and locality rebuild
- Fix locality rebuild thread hung
- Fix "rebuild_entry is NULL" error which may result in memory corruption
- Fix memory leaks in `volume move` and rebuild
- Fix bug cio daemon hung after multiple `cioctl node rm` operations
- Fix bug node cordon cannot remove dfs.ko due to volume move failure
- Fix bug causing fail to get local microdisk error
- Fix bug cio daemon crash creating volumes from profiles with interface parameters
- Fix cio daemon hung while running cycle vdisks test
- Resolve a conflict between normal rebuild and locality rebuild

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
