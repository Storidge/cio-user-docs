# cioctl create

<h3>Usage</h3>

`cioctl create`

Generate command strings for creating a new cluster. 

<h3>Options</h3>

| Name               | Description                                    |
|:-------------------|:-----------------------------------------------|
| --ip <ip-address>  | Network interface to use for data path traffic |
| --single-node      | Initialize for single node cluster             |
| --zone             | Specify zone names for multi-zone cluster      |

Run the `cioctl join` command string on nodes to be added to the cluster. Run the `cioctl init` command string on the primary node, after adding nodes to cluster.

Use the `--ip` option to specify the interface to use for the storage network. This is used when there are more than one network interfaces that can be specified, to keep host and storage traffic separated. 

If a cluster is already configured, running this command will provide option to delete current configuration, destroy cluster and reboot all nodes. After running this command to erase the cluster, the nodes will be left in a clean state and a new cluster can be created. This command will prompt for confirmation to destroy the cluster. 

::: tip
If creating a single node cluster, use the `--single-node` option to start initializing the cluster, e.g. `cioctl create --single-node`
:::

<h3>Examples</h3>

**Create cluster**

To create a new cluster run `cioctl create` as root user on the SDS node and follow the instructions. If multiple IPs are available a message will prompt to specify IP to use.
```
$ cioctl create
[sudo] password for centos:
Cluster started. The current node is now the sds controller node. To add a storage node to this cluster, run the following command:
    cioctl join 192.168.1.131 root db667503

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init db667503
```

**Delete cluster**

To delete an existing cluster run `cioctl create` as root user on the current SDS node and the cluster will be de-configured and rebooted.
```
$ cioctl create
This is an active cluster. This operation will remove all member nodes for a new cluster
Data on existing volumes will be deleted!
Please confirm you wish to proceed [Y/N]: Y
The cluster will be de-configured then rebooted. After reboot enter following command to start a new cluster:
    cioctl create
```
