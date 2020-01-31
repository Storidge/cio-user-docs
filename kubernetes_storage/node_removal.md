---
title: Node Removal
description: Remove node from Storidge and Kubernetes cluster
lang: en-US
---

# Remove a cluster node

Decommisioning a node follows sequence below to drain node, remove from Storidge cluster, and then remove from Kubernetes:
1. Drain node with `kubectl drain <NODENAME> --ignore-daemonsets`
2. Update Storidge software with `cioctl node remove <NODENAME>`
3. Delete node with `kubectl delete node <NODENAME>`

## 1. Drain node

Run `kubectl drain <NODENAME> --delete-local-data --ignore-daemonsets` to drain the node. This marks the node as unschedulable stopping new pods from landing, and safely evicts pods on the node. Pods with replica sets are replaced by a new pod scheduled to another node. For pods with no replica sets use the `--force` option to drain, then bring up a new copy of the pod.

## 2. Remove Storidge node

Run `cioctl node remove <NODENAME>` to remove node. Volumes from the removed node are automatically reattached to new nodes where the pods are restarted.

After all data and metadata on the node is flushed, volumes detached and unmounted, the Storidge modules are unloaded. During the process of exiting the cluster, the node will show status 'leaving' in `cio node ls`.

Since drives on the decommisioned node are also removed, background processes on remaining nodes will automatically rebuild data that was on the removed drives.

::: tip
A minimum of three nodes are required for data redundancy. Storidge prevents removal of nodes when there are only three nodes left in the cluster.
:::

## 3. Delete node

After the node is removed from Storidge cluster, run:
1. `kubectl delete node <NODENAME>` to delete the node
2. `kubeadm reset` to revert changes made by kubeadm init or kubeadm join

## Rejoining Storidge node

A removed node can be added back to the Storidge cluster by running `cioctl join-token`, and then the `cioctl node add ...` command string. However the node will be treated as a new node as all previous history has been erased from the cluster.
