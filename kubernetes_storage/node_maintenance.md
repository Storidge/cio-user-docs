---
title: Node Maintenance
description: Put a node in maintenance to apply software updates or update hardware  
lang: en-US
---

# Node Maintenance

You may want to put a node in maintenance to apply software updates (non Storidge software), replace or update hardware.

Storidge supports cluster aware updates. This allows a node to be put into maintenance mode while the cluster is online and services continue to run on operating nodes.

Follow sequence below to prepare node for maintenance, maintain, and then uncordon the node:
1. Drain node with `kubectl drain <NODENAME> --ignore-daemonsets`
2. Cordon node for maintenance `cioctl node cordon <NODENAME>`
3. Reboot node
4. Uncordon node with `kubectl uncordon <NODENAME>`

## 1. Drain node

Run `kubectl drain <NODENAME> --ignore-daemonsets` to drain the node and prepare for maintenance. This marks the node as unschedulable stopping new pods from landing, and safely evicts pods on the node. Pods with replica sets are replaced by a new pod scheduled to another node. For pods with no replica sets use the `--force` option to drain, then bring up a new copy of the pod.

## 2. Cordon Storidge node

`cioctl node cordon` is used to temporarily remove a node from the Storidge cluster for maintenance. Changed block tracking is engaged to track updates that are destined for the cordoned node. This enables fast rebuilds when the node is rejoined to the cluster after maintenance.

The node will show status 'cordoned' in `cio node ls`.

## 3. Reboot node

After maintenance is completed, run `reboot` to automatically uncordon the node and rejoin the Storidge cluster.

## 4. Uncordon node

After the node has rejoined the Storidge cluster, run `kubectl uncordon <NODENAME>` so the node is schedulable again.

## Extend maintenance window

When change block tracking is engaged, a maintenance window of 30 minutes is started. At the end of 30 minutes, the cordoned node will be automatically removed from the cluster so rebuilds can be started to restore redundancy.

If additional time is needed, the maintenance window can be extended. Use `cioctl node extend-time time-in-minutes` to extend time for maintenance up to maximum of 60 minutes, where time-in-minutes is an int value for the number of minutes to extend.

## Show maintenance window

Run `cioctl node show-time` to display time left in maintenance window.
