---
title: Release 2.0.0-3336
description: Release notes for Storidge CIO version 2.0.0-3336
lang: en-US
---

# Release 2.0.0-3336
This update adds user feature requests, stability Improvements, important bug fixes and support for new kernel releases.

::: warning Important
This release includes a protocol change for internode communications. This protocol change was made to support installation and operation in highly secure network environments. 

Although security is enhanced, this change breaks the ability to use `cioctl node update` (cluster aware update) to upgrade nodes to the latest release. A release is planned which will support updating existing clusters to newer releases using the new communications protocol.
:::

## New
- Add cio-report utility to pre-process and extract information collected by cioctl report
- Add support for monthly and annual subscriptions

## Improvements
- Add support for Ubuntu 4.4.0-{180, 184, 185, 186, 187}, 4.15.0-{101, 102, 103, 106, 107, 108, 109, 110, 111, 112}  
- Add support for AWS Ubuntu 4.4.0-{1106, 1107, 1109, 1110, 1111}, 4.15.0-{1067, 1068, 1073, 1074, 1076, 1077, 1079}
- Add support for Centos 3.10.0-{1127, 1127.8.2, 1127.10.1, 1127.13.1, 1127.18.2}
- Remove retracted Ubuntu 4.15.0-{97, 100} kernels
- Remove retracted Ubuntu 4.4.0-{181}, AWS Ubuntu 4.4.0-1108 kernels
- Standardize message for memory allocation failures to simplify cio-report pattern matching
- Synchronize license info on controller nodes when it is updated on sds node
- Update install scripts to automate Kubernetes installations for single node clusters
- Add conntrack package as dependency. This is a requirement on k8s 1.18.2 
- Remove dependency on ssh/scp/sshd and replace with cior/ciord
- Update golang to 1.14.4
- Update to support iostat in CentOS 7.8
- Fix bug in cio-keycp when processing URLs
- Improve error reporting in cio-keycp
- Update cioctl migrate docker to work with cior/ciord
- Improve cior for better error messages and better calculations of expected executions timeouts
- Improve cioctl handling of inconsistent docker swarm configurations
- Improve handling of cio_node_management.lock file
- Update csi volume plugin to 1.3 specifications
- Add notification to update cluster manually for versions 3249 and older

## Bug fixes
- Fixed bug where shared volume were not removed/added after node remove/add
- Fixed minor error message on in misconfigured DNS setup
- Fixed bug where shared volumes on CentOS 7 hangs during cluster reboot
- Fixed minor array overflows in sds controller
- Fixed cioctl all command for ssh dependency
- Fixed bug where the iscsid.service file was sometimes misconfigured