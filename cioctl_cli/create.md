# cioctl create

<h3>Usage</h3>

`cioctl create`

Generate command strings for creating a new cluster. 

Run the `cioctl join ...` command string on nodes to be added to the cluster. If creating a single node cluster for test, proceed to run the `cioctl init <token>` command string. 

If a cluster is already configured, this command will delete current configuration, destroy cluster and reboot all nodes. After running this command to erase the cluster, the nodes will be left in a clean state and a new cluster can be created. This command will prompt for confirmation to destroy the cluster. 

<h3>Examples</h3>

To create a new cluster run `cioctl create` as root user on the SDS node and follow the instructions. If multiple IPs are available a message will prompt to specify IP to use.
```
$ cioctl create
[sudo] password for centos:
Cluster started. The current node is now the sds controller node. To add a storage node to this cluster, run the following command:
    cioctl join 192.168.1.131 root db667503

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init db667503
```

To delete an existing cluster run `cioctl create` as root user on the current SDS node and the cluster will be de-configured and rebooted.
```
$ cioctl create
This is an active cluster. This operation will remove all member nodes for a new cluster
Data on existing volumes will be deleted!
Please confirm you wish to proceed [Y/N]: Y
The cluster will be de-configured then rebooted. After reboot enter following command to start a new cluster:
    cioctl create
```
