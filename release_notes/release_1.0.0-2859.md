---
title: Release 1.0.0-2859
description: Release notes for Storidge CIO version 1.0.0-2859; persistent volumes for kubernetes pods
lang: en-US
---

# Release 1.0.0-2859
This release adds beta support for auto expansion of volumes. Auto expansion is a service that eliminates application disruptions due to volumes running out of capacity.

When the auto expansion service is enabled for a volume, the Storidge software will automatically expand the volume capacity at both block and filesystem levels. This saves an operator from having to individually monitor and manage hundreds of volumes or applications runnning in cluster. He only has to monitor the overall available capacity in the storage pool which is much simpler. Values can be specified for threshold to trigger expansion, capacity to grow and maximum number of times to automatically increase capacity. Refer to [Using auto capacity expansion](https://guide.storidge.com/getting_started/autoexpand.html) for examples.

# New
- Add auto expansion service to profiles, CLI and API
- Add support for compression in profiles, CLI and API

# Improvements
- Add support Ubuntu 4.4.0-148-154
- Add support AWS Ubuntu 4.4.0-1083-1086
- Add support Centos 3.10.0-957.12.1, -957.12.2, -957.21.2, 957.21.3
- Enhance cluster initialization to eliminate user copying of SSH keys
- Update `cioctl` to stop containers on cordon, and restart containers on uncordon or auto-uncordoned operations
- Set worker nodes to active state before manager nodes after cluster reboot
- Update compression feature to use `-A` or `--algorithm` in profiles and cli. Valid values are lzo, zlib or zstd with lzo as default compression
- Reject volume move command if volume used by application
- Reject volume move command if propagation mount to container exists

# Bug fixes
- Fix bug where by install does not setup halt/poweroff/shutdown/telinit correctly
- Fix bug where swarm nodes stay in drain state after a `cioctl reboot` operation
- Fix bug where `cioctl join-token` command sometimes timeout
- Fix bug where `cioctl join-token` output is missing digest of CA key
