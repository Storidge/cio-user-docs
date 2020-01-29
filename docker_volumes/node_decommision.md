---
title: Node Decommision
description: Decommision and remove node from cluster  
lang: en-US
---

# Decommision a Node

## Remove decommisioned node

You can decommision and remove a Storidge node from your cluster.

The `cioctl node remove` command is used to remove nodes that are either no longer needed or must be replaced. This command triggers a process to drain the node which gracefully stops running containers and services. Services are restarted on operating nodes, and volumes from the drained node are automatically reattached to new nodes where the services are restarted.

After all data and metadata on the node is flushed, volumes detached and unmounted, the Storidge modules are unloaded. During the process of exiting the cluster, the node will show status 'leaving' in `cio node ls`.

Since drives on the decommisioned node are also removed, background processes on remaining nodes will automatically rebuild data that was on the removed drives.

::: tip
A minimum of three nodes are required for data redundancy. Storidge prevents removal of nodes when there are only three nodes left in the cluster.
:::

## Rejoining node

A removed node can be added back to the cluster by running `cioctl join-token`, and then the `cioctl node add ...` command string. However the node will be treated as a new node as all previous history has been erased from the cluster.
