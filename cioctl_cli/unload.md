---
title: cioctl unload
description: cioctl unload command usage 
lang: en-US
---

# cioctl unload

<h3>Usage</h3>

`cioctl unload`

Stop cio on a single node cluster.

The `cioctl unload` command supports online update of a single node cluster. Like the `cioctl node cordon` command, it will trigger a graceful shutdown of the node, stopping running containers and services, flushing data and metadata, detaching and unmounting volumes, before unloading cio processes.

Services are temporarily disrupted since there is no second node for services to failover to. After cio operations is stopped, the cio software, drivers, OS patches can be udpated. When ready run `cioctl load` to restart services.
