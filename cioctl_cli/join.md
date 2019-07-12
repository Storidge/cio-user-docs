# cioctl join

<h3>Usage</h3>

`cioctl join`

The join command is generated through the `cioctl create` command to add nodes to a cluster before initializing it.  

<h3>Example</h3>

On the SDS node run `cioctl create`:
```
[root@sds ~]# cioctl create
Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
    cioctl join 192.168.3.95 root f26e695d

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init f26e695d
```
This generates unique join and init strings for this cluster. Before running the init string on the SDS node, run the join string on all the other nodes you want to add to the cluster:
```
[root@worker1 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

[root@worker2 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

[root@worker3 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node
```
