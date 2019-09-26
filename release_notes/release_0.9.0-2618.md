---
title: Release 0.9.0-2618
description: Release notes for Storidge CIO version 0.9.0-2618 
lang: en-US
---

# Release 0.9.0-2618
# New
- This release introduces support for a csi-cio volume plugin and deployment file for Kubernetes

# Improvements
- Add support Ubuntu 4.4.0-137-141, 3.13.0-160-162, AWS Ubuntu 4.4.0-1069-1074
- Add support Centos 3.10.0-862.14.4 - Add http support in convenience script cio-ce
- Update REST API for new cio volume and cio profile commands
- Add routes for node remove, cordon and uncordon
- Add routes for drive list, info, add and remove
- Add cioctl node cordon|uncordon|remove commands
- Add cioctl drive list|info|add|remove commands
- Set worker/storage nodes active first before manager nodes
- Disallow cluster reboot/shutdown when node cordoned
- Set cioctl node cordon|uncordon|remove defaults to current node
- Deprecates cio vdadd|vdrm|vdlist|vdmod|vdinfo and cio list|save|rm commands
- Add cio volume create|remove|list|update|info commands
- Add cio profile create|remove|list and node listcommands
- Uses volume name as default parameter if -v flag not specified
- Add cio debug [on | off] command for streaming logs to syslog
- Improve rebuild manager to ensure only one rebuild manager background task in queue
- improve fill_global_inv_atomic() to make sure there is only one fill-inventory background task in queue
- Add list alias to ls, remove alias to delete and rm, info alias to inspect in cio cli
- Add --interval, --snapshotMax usage to cio volume create help text
- Add --iopsmin, --iopsmax flags to volume create | update commands
- Use Storidge signature to check for invalid network packets
- Adds volume names in eventLog and syslog entries
- Add support for thick vdisk larger than local node's capacity
- Improve heartbeat retries to handle network disruptions on AWS
- Release mdisks to cordoned node when uncordoned
- Expands metadata area to first 1GB of each drive
- Use "EXTENT_LOCALCPY" flag and "localcpy_ext_cnt" to control locality rebuild
- Prioritize normal rebuild over locality rebuildEnsure any interrupted locality rebuilds are recorded and resumed

# Bug fixes
- Fix memory leak when localcpy thread aborts because of incoming rebuild thread
- Fix race condition between uncordon and host I/O
- Wait for rebuild/localcpy completion before dfs exits
- Fix bugs more than one drive added on cioctl drive add or node addition

# Known issues
### Profiles
- Certain capabilities of CIO have not been added to the Create Profile and Profile Details pages. These include directives supporting encryption service, volume labels, file
system selection and interface container types. These capabilities are available through CLI commands
and will be added to the UI in the next CIO release.
- Snapshot, compression and deduplication
features shown in sample profiles are not yet released.

### TLS Support
- The pre-release version of CIO does not include support for TLS. This security feature will be added to the next release of CIO.

### Volumes
- Support for modifying volumes parameters, e.g. capacity, IOPS limits, etc. have not added to
the Portainer UI. These capabilities are available through CLI commands and will be added to the UI in
a future CIO release.
