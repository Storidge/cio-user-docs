# cioctl node

<h3>Usage</h3>

**`cioctl node COMMAND <nodename | node-id>`**

Cordon, uncordon or remove a node

<h3>Commands</h3>

- **cordon** : Drain node and cordon for maintenance
- **uncordon** : Rejoin cluster and resume scheduling onto node
- **remove** : Remove node from cluster

## **cordon**

<h3>Usage</h3>

**`cioctl node cordon <nodename | node-id>`**

Drain and cordon node for maintenance. 

The `cioctl node cordon` command supports online maintenance for a multi-node cluster. Each node member is cordoned, updated and uncordoned sequentially, until all node members are updated. This command will trigger a process to gracefully stop running containers and services, flush data and metadata, detach and unmount volumes, before unloading cio processes. The node will show status as 'cordoned' in `cio node ls` when ready for maintenace. 

In cordoned state, the node is temporarily removed from the cio cluster. Changed block tracking is engaged to track updates that are destined for the cordoned node to enable fast rebuilds when the node is rejoined to the cluster. Any previously running services on the cordoned node will be restarted by the scheduler on other running nodes. 

## **uncordon**

<h3>Usage</h3>

**`cioctl node uncordon <nodename | node-id>`**

Rejoin cluster and resume scheduling onto node.

After maintenance is completed, run the `cioctl node uncordon` command to add the node back to the cio cluster. The uncordoned node is automatically re-enabled to run services from the next cordoned node. 

## **remove**

<h3>Usage</h3>

**`cioctl node rm <nodename | node-id>`**
**`cioctl node remove <nodename | node-id>`**

**`cioctl node delete <nodename | node-id>`**

Remove a node from the cluster. In a multi-node cluster a minimum of three nodes are required for redundancy.

The `cioctl node remove` command is used to remove nodes that are either no longer needed or must be replaced. As with the `cioctl node cordon` command, the node will be gracefully stopped before removal from the cluster. Background processes on the remaining nodes will rebuild the data that was on the removed node. 

A removed node can be added back to the cluster by running a `cioctl join-token` command and then the `cioctl add ...` command string. However the node will be treated as a new node as all previous history has been erased from the cluster. 

