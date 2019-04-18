# cioctl create

**`cioctl create`**

Generate command strings for creating a new cluster. If a cluster is already configured this command will de-configure and restart the cluster.

### **Examples**

To create a new cluster run `cioctl create` as root user on the SDS node and follow the instructions. If multiple IPs are available a message will prompt for specification.
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
