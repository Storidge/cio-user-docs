---
title: Release 0.9.0-2762
description: Release notes for Storidge CIO version 0.9.0-2762; persistent volumes for kubernetes pods
lang: en-US
---

# Release 0.9.0-2762

# Improvements
- Add support Ubuntu 4.4.0-143-147, AWS Ubuntu 4.4.0-1075, 1077-1079, 1081-1082
- Add suport Centos 3.10.0-957.10.1
- Remove redacted Ubuntu kernels
- Update golang to 1.12.4
- Update SCST drive to revision 8276 to fix compilation issue on Ubuntu
- Add API support for bandwidth min and max settings in profiles
- Add API support for filesystem object in profiles
- Filter null inputs from POST /profiles and PUT /profiles
- Release API as 1.0
- Improve daemonizing of cio-api

# Bug fixes
- Fix bug where 'interval' and 'start' keys are included in profile when periodic snapshot is not enabled
- Fix bug where Mongodb did not restart after an uncordon operation
- Fix bug where volume rebuild and locality rebuild conflicts, after uncordon exits and cluster is overloaded
- Prevent unload() and dfs_shutdown service from tearing down cluster at same time as cfg_remove()
