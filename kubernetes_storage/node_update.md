---
title: Node Update
description: Update Storidge software and dependencies in Kubernetes  
lang: en-US
---

# Update Storidge Software

You may want to update Storidge software and dependencies on a node when a new version is released.

Storidge supports cluster aware updates. This enables updating nodes to the latest software release, while the cluster is online and services continue to run. Each node is updated sequentially while services continue to run on operating nodes.

The node update follows sequence below to prepare node for maintenance, update software, and then uncordon the node:
1. Drain node with `kubectl drain <NODENAME> --ignore-daemonsets`
2. Update Storidge software with `cioctl node update <NODENAME>`
3. Uncordon node with `kubectl uncordon <NODENAME>`

## 1. Drain node

Run `kubectl drain <NODENAME> --ignore-daemonsets` to drain the node and prepare for maintenance. This marks the node as unschedulable and deletes pods.

## 2. Update Storidge software

Run `cioctl node update <NODENAME>` to update Storidge software components and dependencies. This command checks for available software update. If an update is available, it performs the following sequence:

1. Drains node, so services are moved to operating nodes
2. Cordons node, setting it into maintenance mode
3. Downloads latest software release to /var/lib/storidge
4. Installs software update and any dependencies
5. Reboots node
6. Uncordons node to exit maintenance mode, and rejoin cluster

## 3. Uncordon node

After the node has rejoined the Storidge cluster, run `kubectl uncordon <NODENAME>` so the node is schedulable again.

## Auto rebuild after update

While in cordoned state, the node is put into maintenance mode. This engages the change block tracking feature to track updates that are destined for the cordoned node.

After a node is updated and rejoins the cluster, the recovery is extremely fast as only the changed blocks are rebuilt. Also the amount of changed data is small as node updates take only a few minutes.

## Node update sequence

`cioctl node update` will prescribe an update sequence where storage nodes are updated before controller nodes. Follow the suggested sequence to update each node.

All node update commands can be issued from the sds node. The last node to be updated will be the sds node.
