---
title: Release 0.9.0-2428
description: Release notes for Storidge CIO version 0.9.0-2428  
lang: en-US
---

# Release 0.9.0-2428
# New
- This release adds support for data locality. For containers, having local storage access reduces latency and improves applications’ response times. Instead of using techniques
such as labels, constraints or affinity/anti-affinity to ensure data locality, this new feature
automatically moves data to the node where a container is running after being rescheduled or on
restarts after a node failure. This ensures consistent high performance and low latency for
transaction apps such as databases. See blog for details.
- This release adds initial support for multi-zone clusters (aka stretched clusters). A storage cluster can now be defined across two zones in
an AWS region or two datacenters connected by dark fiber. This improves the availability of the
cluster and provides protection against zone failures.

# Improvements
- Adds support Centos 3.10.0-862.6.3-862.11.6 kernel
- Adds support Ubuntu 4.4.0-131-133, Ubuntu 3.13.0-154-155, AWS Ubuntu 4.4.0-1062-1065
- Adds support for arm64 architecture on Ubuntu 16.04
- Updates API for cio info unit conversion and cio vdinfo allocate% replacing used capacity
- Add API routes for /vdisks and /nodeid path - Use hostname for instance id when /etc/hostname is set
- Enable firewall on storage nodes with mk_iptables.sh for Ubuntu 16.04
- Add multi-zone (aka stretched cluster) feature. Use cioctl create --zone &lt;zone1&gt; &lt;zone2&gt; to start a cluster
- Add ZONE_LIST to configuration file
- Update node auto-rejoin feature for multi-zone cluster (aka stretched cluster)
- Improve cioctl join-token to output command strings based on balanced and unbalance cluster nodes
- Add support for scale up when only one node in first zone of a multi-zone cluster
- Update dfs code for fio version 3.1 reporting format
- Changed MB/s to MiB/s in cio info output and help messages. Previous reported units already in base 2 format
- Adds support for distributed snapshots on all nodes
- Add support for snapshot cli command cio snapshot
- Add lock /etc/convergeio/cio_node_mgmt.lock to avoid conflicts between scale up and scale down operations
- Add --nounits flag option to get capacity info in byte units
- Change mount path length from 127 to 160 characters for Kubernetes
- Add data locality feature. Host I/Os after a vdmv operation trigger rebuilds to local microdisks. A local mdisk
is allocated and mdisk[0] is freed. If rebuild is running, data locality will quit asap
- Change locality rebuild thread name from rbd to lrbd
- Update data locality capability for stretched cluster

# Bug fixes
- Fixed u16 class (Ubuntu 16.04) install issue with apt-get by using aptitude on certain errors
- Fixed garbled command that leads to empty /etc/iscsi/initiatorname.iscsi and hence issues creating a cluster - Fixed bug cioctl add allows nodes with different version to join cluster
- Fixed bug where SSD drives added as HDD drives after node rejoin
- Fixed memory corruption in recovering extent table group logic - Fixed bug where snapshot policy not started due to conflicting name in
mount path
- Fixed bug where backup1 and backup2 nodes don't know zone name of newly added node
- Fixed missing metadata after fourth rejoins multi-zone cluster (4 node cluster)
- Fixed cio vdlist command showing vdisk on wrong node after node failure in multi-zone cluster
- Fixed bug missing metadata in extent table after second node rejoin
- Fix bug get_remote_zone_copy_count node not found
- Fixed a bug where the configuration file is not copied to all nodes
- Fixed bug in cio vdadd where command with --capacity and --profile flags fail in kubernetes
- Fixed bug where vdisk owner is incorrect after failover

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
