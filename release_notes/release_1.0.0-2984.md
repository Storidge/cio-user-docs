---
title: Release 1.0.0-2984
description: Release notes for Storidge CIO version 1.0.0-2984; persistent volumes for kubernetes pods
lang: en-US
---

# Release 1.0.0-2984
This release is a small update to address a few improvements

## Improvements
- Add support Ubuntu 4.4.0-165, AWS Ubuntu 4.4.0-1095
- Send `cioctl node update` return messages to stdout for API parsing
- Improve acquisition of messages in install/uninstall scripts for files installed_packages and uninstalled_packages
- Update `cioctl unload` to be multi node cluster aware
- Add missing packages 'dmidecode' and 'file' to install scripts
- Ignore trailing "." on the end of a host name acquired from a host command
- Update install scripts to search both vault.centos.org and mirror.centos.org repos
- Make original hostname of a AWS container use 127.0.1.1
