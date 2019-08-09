# cioctl node

<h3>Usage</h3>

`cioctl node COMMAND <NODENAME | NODEID>`

Add, cordon, uncordon or remove a node

<h3>Child commands</h3>

| Command               | Description                                    |
|:----------------------|:-----------------------------------------------|
| cioctl node add       | Add new node to cluster                        |
| cioctl node remove    | Remove node from cluster                       |
| cioctl node cordon    | Drain node and cordon for maintenance          |
| cioctl node uncordon  | Rejoin cluster and resume scheduling onto node |
| cioctl node update    | Update Storidge software on node               |
| cioctl node clean     | Revert changes made from joining a cluster     |

## cioctl node add

<h3>Usage</h3>

`cioctl node add`

The add command is generated through the `cioctl join-token` command to add a node to an existing cluster.

<h3>Example</h3>

On the SDS node run `cioctl join-token`:
```
root@sds:~# cioctl join-token
    cioctl node add 192.168.3.122 909ab2a6afad21f26369c00a8ba7307e-076f50d0
```

Then run the generated add string on the node to be added:
```
[root@worker ~]# cioctl node add 192.168.3.122 909ab2a6afad21f26369c00a8ba7307e-076f50d0
Adding this node to cluster as a storage node
...
node: Initializing metadata
cluster: Starting cio daemon
cluster: Starting API
```


## cioctl node remove

<h3>Usage</h3>

`cioctl node rm <NODENAME | NODEID>`

`cioctl node remove <NODENAME | NODEID>`

`cioctl node delete <NODENAME | NODEID>`

Remove a node from the cluster. In a multi-node cluster a minimum of three nodes are required for redundancy.

::: tip
When a cluster only has three nodes, CIO disables node removal as a minimum of three nodes are required for data redundancy.
:::

The `cioctl node remove` command is used to remove nodes that are either no longer needed or must be replaced. As with the `cioctl node cordon` command, the node will be gracefully stopped before removal from the cluster. Background processes on the remaining nodes will rebuild the data that was on the removed node.

A removed node can be added back to the cluster by running a `cioctl join-token` command and then the `cioctl node add ...` command string. However the node will be treated as a new node as all previous history has been erased from the cluster.


## cioctl node cordon

<h3>Usage</h3>

`cioctl node cordon <NODENAME | NODEID>`

Drain and cordon node for maintenance.

The `cioctl node cordon` command supports online maintenance for a multi-node cluster. Each node member is cordoned, updated and uncordoned sequentially, until all node members are updated. This command will trigger a process to gracefully stop running containers and services, flush data and metadata, detach and unmount volumes, before unloading cio processes. The node will show status as 'cordoned' in `cio node ls` when ready for maintenace.

In cordoned state, the node is temporarily removed from the cio cluster. Changed block tracking is engaged to track updates that are destined for the cordoned node to enable fast rebuilds when the node is rejoined to the cluster. Any previously running services on the cordoned node will be restarted by the scheduler on other running nodes.


## cioctl node uncordon

<h3>Usage</h3>

`cioctl node uncordon <NODENAME | NODEID>`

Rejoin cluster and resume scheduling onto node.

After maintenance is completed, run the `cioctl node uncordon` command to add the node back to the cio cluster. The uncordoned node is automatically re-enabled to run services from the next cordoned node.


## cioctl node update

<h3>Usage</h3>

`cioctl node update`

Updates Storidge software on node. Run this command on node to be updated.

The `cioctl node update` command simplifies node maintenance when the only component to be updated is the Storidge software. This command automatically checks for software updates.

If update is available, the node is cordoned, the software update is downloaded and installed. When the software installation is completed, the node is rebooted and automatically rejoins the cluster.

::: tip Important
Always update the 'standard' nodes first, and update the sds node last.
:::

<h3>Example</h3>

On the node to be updated, run `cioctl node update`:

```
root@t5:~# cioctl node update
Release 2915 is available for upgrade
Loading cio software for: u16  (4.4.0-116-generic)
488233b0d7b8
.
.
.
Success: This node has been updated to cio version 1.0.0-2915. This node will be rebooted and automatically rejoin the cluster
```

## cioctl node clean

<h3>Usage</h3>

`cioctl node clean`

Revert changes made from joining a cluster. Run this command on node to clean state.

`cioctl node clean` will check that the node is not a member of a cluster. If so this command revert changes made to the node by `cioctl init` or `cioctl join`. It removes files that were created and wipes state information on the node. 
