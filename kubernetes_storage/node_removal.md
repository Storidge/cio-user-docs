---
title: Node Removal
description: Remove node from Storidge and Kubernetes cluster
lang: en-US
---

# Remove a cluster node

Run `cioctl node remove <NODENAME>` to remove a worker node from the cluster. 

This command performs the following sequence:

1. Cordon the node, marking the node as unschedulable for new pods
2. Drain node to safely evict pods to operating nodes 
3. Remove node from both Storidge and Kubernetes cluster 

Volumes from the removed node are automatically reattached to new nodes where pods are restarting.

After all data and metadata on the node is flushed, volumes detached and unmounted, the Storidge modules are unloaded. During the process of exiting the cluster, the node will show status 'leaving' in `cio node ls`.

Since drives on the decommisioned node are also removed, background processes on remaining nodes will automatically rebuild data that was on the removed drives.

::: tip
A minimum of three nodes are required for data redundancy. Storidge prevents removal of nodes when there are only three nodes left in the cluster.
:::

## Rejoining Storidge node

A removed node can be added back to the Storidge cluster by running `cioctl join-token`, and then the `cioctl node add ...` command string. However the node will be treated as a new node as all previous history has been erased from the cluster. 

See [node addition](https://docs.storidge.com/kubernetes_storage/node_addition.html#add-node) for details. 