---
title: Release 1.0.0-2803
description: Release notes for Storidge CIO version 1.0.0-2803
lang: en-US
---

# Release 1.0.0-2803

# New
- Add endpoint `POST /clusters/rebalance` to rebalance services in a cluster
- Add endpoint `GET /capacity/{period}` for cluster capacity usage info
- Add `cioctl rebalance` command to rebalance services in a cluster
- Add support for `cio capacity info` with --period options for day, month and year data

# Improvements
- Add support Ubuntu 4.4.0-148-149, AWS Ubuntu 4.4.0-1083, Centos 3.10.0-957.12.1,-957.12.2
- Removed support for redacted kernels Ubuntu 4.4.0-143,-145-147
- Updated golang to 1.12.6
- Updated installation to use docker-ce-18.09.6-3
- Check block special files for filesystem of type "ASCII text, with noline terminators" on AWS. Automatically clear metadata area if found
- Improve reliability of reading serial numbers/drive identifiers on cio drives
- Switch Portainer container image to PR2711
- Leave cordoned node in cordoned state after a node reboot
- Resolve conflict between rebuild and volume move/remove operations under overloaded conditions
- Update --snapshot flag to support 'yes | no' inputs for enabling snapshots
- Update cio to synchronize multi writes to mongodb as mongoc driver is not multi-thread safe
- Add "Error:" keyword for API to return as 500 response code
- Update `cio events` command to work on any node in cluster
- Change the GMT timestamp in event log to local time
- Increase timeout for heartbeat on AWS

# Bug fixes
- Fix Docker daemon hang after node power cycled or rebooted
- Fix bug on AWS where after a node remove operation, there are multiple nodes with the same node name
- Fix Perl library warning in a multi-language environment and default language is not configured
- Fix bug where docker volume plugin is using AWS host name instead of assigned host name
- Fix bug where uncordon can overlap cordon operation
- Fix bug where uncordoning twice set multiple nodes in maintenance mode
- Fix bug where node cannot uncordon due to 'node still cordoned' error message
- Fix bug where after volume move, snapshot sub-volume on /cio/snap directory
- Fix bug where `cio volume create` command with -s option uses input parameter as volume name
- Fix bug where updating bandwidth values has no effect and wipes out bandwidth settings on volume
- Fix parsing errors with `cio profile` command
