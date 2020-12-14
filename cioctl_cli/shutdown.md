---
title: cioctl shutdown
description: cioctl shutdown command; docker volumes for containers; persistent volumes for pods
lang: en-US
---

# cioctl shutdown

<h3>Usage</h3>

`cioctl shutdown`

Stop services and shutdown all nodes in the cluster.

The `cioctl shutdown` command will trigger a graceful shutdown of the cluster. Running containers and services will be stopped, data and metadata flushed, volumes detached and unmounted, cio processes unloaded and the OS shutdown.

There is no --force option to force a shutdown as this may result in data loss if data in memory buffers are not synced correctly to backend drives. For the same reason, do not bypass the `cioctl shutdown` command with an OS shutdown.

::: tip
The completion of a cluster shutdown means that the cluster will stop operating and all nodes will be powered off. For cloud instances, this means virtual servers will gracefully shutdown and enter a stopped state.
:::