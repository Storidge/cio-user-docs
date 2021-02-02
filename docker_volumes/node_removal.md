---
title: Node Removal
description: Remove a node from Storidge cluster  
lang: en-US
---

# Remove Node

To remove a worker node from the cluster, run:
```
cioctl node remove <NODENAME>
```

This command triggers a process to drain the node which gracefully stops running containers and services. Services are restarted on operating nodes, and volumes from the drained node are automatically reattached to new nodes where the services are restarted.

After all data and metadata on the node is flushed, volumes detached and unmounted, the Storidge modules are unloaded. During the process of exiting the cluster, the node will show status 'leaving' in `cio node ls`.

Since drives on the decommisioned node are also removed, background processes on remaining nodes will automatically rebuild data that was on the removed drives.

::: tip
A minimum of three nodes are required for data redundancy. Storidge prevents removal of nodes when there are only three nodes left in the cluster.
:::

<h2>Rejoining node</h2>

A removed node can be added back to the cluster by running `cioctl join-token`, and then the `cioctl node add ...` command string. However the node will be treated as a new node as all previous history has been erased from the cluster.

See [node addition](https://docs.storidge.com/docker_volumes/node_addition.html) for details. 