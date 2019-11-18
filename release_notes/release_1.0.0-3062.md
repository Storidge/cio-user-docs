---
title: Release 1.0.0-3062
description: Release notes for Storidge CIO version 1.0.0-3062; persistent volumes for Kubernetes
lang: en-US
---

# Release 1.0.0-3062
This release updates the supported kernel list for recent additions. There are minor enhancements and a feature request for addition of two example profiles.   

## Improvements
- Add support Centos 7.7 kernels 3.10.0-{1062.4.2, 1062.4.3}
- Add support Ubuntu 4.4.0-{169, 170}, 4.15.0-{70, 71}, AWS Ubuntu 4.4.0-{1098, 1099}, 4.15.0-1054
- Add profiles for MONGO and REDIS per feature request
- Improve install scripts to better cope with Ubuntu 18.04 unattended upgrades
- Add apt-get message requesting system reboot after auto updates. This applies only to Ubuntu 18.04 installations

## Bug fixes
- Fix bug where hostname and version is missing in `cio node list` for node in maintenance mode
