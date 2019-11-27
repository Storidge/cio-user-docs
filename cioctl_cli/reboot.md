---
title: cioctl reboot
description: cioctl reboot command; docker volumes for containers; persistent volumes for pods
lang: en-US
---

# cioctl reboot

<h3>Usage</h3>

`cioctl reboot`

Stop services and reboot all nodes in the cluster.

The `cioctl reboot` command will trigger a process to gracefully stop the cluster before rebooting the nodes. Running containers and services will be stopped, data and metadata flushed, volumes detached and unmounted, the cio processes unloaded, and OS shutdown before nodes are rebooted. After all nodes have been rebooted and member nodes are detected online, the cio cluster will be reformed automatically.

Do NOT use a Linux `reboot` command to bypass the `cioctl reboot` process as data in memory buffers may not be synced to backend drives. In the event a node is 'accidently' rebooted, cio will attempt to flush data and metadata, detach volumes and stop cio related processes before the node shuts down.
