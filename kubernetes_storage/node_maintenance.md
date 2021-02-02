---
title: Node Maintenance
description: Put a node in maintenance to apply software updates or update hardware  
lang: en-US
---

# Node Maintenance

<h2>Cordon node for maintenance</h2>

You may want to put a node in maintenance to apply software updates (non Storidge software), replace or update hardware.

Storidge supports cluster aware updates. This allows a node to be put into maintenance mode while the cluster is online and pods continue to run on operating nodes.

To start maintenance on a node, run: 
```
cioctl node cordon <NODENAME>
```

This command performs sequence below to temporarily remove a worker node from the cluster for maintenance: 
1. Cordon worker node, marking the node as unschedulable for new pods
2. Drain worker node to safely evict pods to operating nodes 
3. Cordon Storidge node which will show status 'cordoned' in `cio node ls`.

While cordoned, the changed block tracking feature is engaged to track updates that are destined for the cordoned node. This enables fast rebuilds when the node is rejoined to the cluster after maintenance.

<h2>Uncordon node to rejoin</h2>

After maintenance is completed, run: 
```
cioctl node uncordon
``` 

This rejoins the node back to the Storidge cluster and uncordons the node so new pods can be scheduled.

Rebooting a node after maintenance is completed will automatically uncordon the node to rejoin the cluster.

<h2>Extend maintenance window</h2>

When change block tracking is engaged, a maintenance window of 30 minutes is started. At the end of 30 minutes, the cordoned node will be automatically removed from the cluster so rebuilds can be started to restore redundancy.

If additional time is needed, the maintenance window can be extended. To extend time for maintenance up to maximum of 60 minutes, run: 
```
cioctl node extend-time TIME-IN-MINUTES
```

TIME-IN-MINUTES is an int value for the number of minutes to extend.

<h2>Show maintenance window</h2>

To display time left in maintenance window, run: 
```
cioctl node show-time
```
