# Create a Cluster

With the CIO software installed on all nodes, you're ready to create a cluster. This guide steps through the creation of a four node cluster which is the minimum number of nodes recommended for a cluster. 

1. Open a terminal and ssh into the first machine which will become your sds controller node. This node will be identified as the sds node in the `cio nodes` command. Run the command below to start a new cluster. 

   ```
   cioctl create
   ```

   This guide uses a multi-homed machine connected to multiple networks, named `c41`. 

   ```
   # cioctl create
   There are multiple IP addresses on this system (192.168.1.41 on ens10f0, 10.10.1.41 on ens10f1, 192.168.122.1 on virbr0).
   Re-run the create command by specifying the IP address with the --ip flag, e.g.:
       cioctl create --ip 192.168.1.41
   ```

   On a multi-homed machine, `cioctl` suggests the first IP address found. You can use the suggested IP address or select a different network interface by changing the IP address after the `--ip` flag. 

   ```
   # cioctl create --ip 192.168.1.41
   Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
       cioctl join 192.168.1.41 root 395c2eb4

   After adding all storage nodes, return to this node and run following command to initialize the cluster:
       cioctl init 395c2eb4
   ```

2. Join three nodes to the cluster. 

   Open a terminal, ssh into the nodes to join. Run the `cioctl join` command produced by the `cioctl create` output to join nodes (c42, c43 and c44) to the cluster. 

   ```
   # cioctl join 192.168.1.41 root 395c2eb4
   There are multiple IP addresses on this system (192.168.1.42 on ens10f0, 10.10.1.42 on ens10f1, 192.168.122.1 on virbr0).
   Re-run the join command by specifying the IP address with the --ip flag, e.g.:
       cioctl join 192.168.1.41 root 395c2eb4 --ip 192.168.1.42
   ```

   On a multi-homed machine, `cioctl join` suggests the first IP address found. You can use the suggested IP address or select a different network interface by changing the IP address after the `--ip` flag. 

   ```
   # cioctl join 192.168.1.41 root 395c2eb4 --ip 192.168.1.42
   Adding this node to cluster as a storage node
   ```

   ```
   # cioctl join 192.168.1.41 root 395c2eb4 --ip 192.168.1.43
   Adding this node to cluster as a storage node
   ```

   ```
   # cioctl join 192.168.1.41 root 395c2eb4 --ip 192.168.1.44
   Adding this node to cluster as a storage node
   ```

   **Note:** If you are testing a single-node cluster, skip to the `cioctl init <token>` command.  There is no need to run the `cioctl join` command in this case. 

3. Return to the sds controller node and run the `cioctl init`command to complete initialization of the cluster.

   ```
   # cioctl init 395c2eb4
   <13>Feb 17 13:40:31 cluster: initialization started
   <13>Feb 17 13:40:38 cluster: Copy auto-multiNode-c41.cfg to all nodes (NODE_NUMS:4)
   <13>Feb 17 13:40:59 cluster: Initialize target
   ...
   <13>Feb 17 13:42:34 cluster: MongoDB ready
   <13>Feb 17 13:42:37 cluster: Synchronizing VID files
   <13>Feb 17 13:42:41 cluster: Starting API
   ```


   **Note:** There is no need to specify storage devices as `cioctl` automatically discovers and adds unused devices to the storage pool. See [data drive requirements](http://storidge.com/docs/data-drive-requirements/) for additional details.  

## **Ready To Use**

At the end of initialization, you have a four node [Docker Swarm](https://docs.docker.com/get-started/part4/) cluster running. The Swarm cluster will be automatically configured if one is not already running. There are three manager nodes and one worker node. Confirm with:

```
# docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS
enugy9ewjzzd5q0nl017s8rdb *   c41                 Ready               Active              Reachable
w5qxuxcvkg0lq1vr95hesmwej     c42                 Ready               Active              Leader
ccth7p2a1mmdkof3oa6j779gj     c43                 Ready               Active              Reachable
1o8ntxc0elmb6p7sezyf1fdrl     c44                 Ready               Active
```

In addition, the [Portainer UI](https://portainer.io/) is launched in a container. Verify with:

```
# docker service ps portainer
ID                  NAME                IMAGE                        NODE                DESIRED STATE       CURRENT STATE                ERROR                              PORTS
khnu6oo01ju1        portainer.1         portainer/portainer:latest   c43                 Running             Running 8 minutes ago                          
```

Login to the container management UI by pointing your browser at any node IP and port 9000. You can check the node IPs and status with the `cio nodes` command.

```
# cio nodes
NODENAME             IP                NODE_ID    ROLE       STATUS
c41                  192.168.1.41      a49d9ccc   sds        normal
c42                  192.168.1.42      c236e059   backup1    normal
c43                  192.168.1.43      06aa2eb7   backup2    normal
c44                  192.168.1.44      b19dacaf   standard   normal
```

In this example, point the browser at 192.168.1.43:9000, where 9000 is the default Portainer service port number.

Check the cluster performance and capacity resources with the `cio info` command.

```
# cio info
Domain: a49d9ccc
Domain ID: e23ed2f9

Metadata Version: 1.0
Nodes: 4
Vdisks: 2
SSDs: 12
HDDs: 0
Total capacity: 8.728TB
Used capacity: 0.018TB
Free capacity: 8.710TB
Provisioned capacity: 0.098TB
Total IOPS: 525561
Used IOPS: 0
Free IOPS: 525561
Provisioned IOPS: 118
Total bandwidth: 2226.500MB/s
Used bandwidth: 0.000MB/s
Free bandwidth: 2226.500MB/s
Provisioned bandwidth: 0.524MB/s

```

This sample output shows 8.7 TB of capacity in the cluster and an IOPS budget of 525K that can be allocated to volumes. 


