# Installing Developer Release

## **Prerequisites**

First, you'll need to setup the cluster resources to orchestrate:

- Physical or virtual [servers](http://storidge.com/docs/server-requirements/). A minimum three nodes is required to form a cluster but four nodes are recommended for improved operating redundancy. You can use `docker-machine create` to provision virtual servers. Here are examples using [VirtualBox](https://rominirani.com/docker-swarm-tutorial-b67470cf8872) and [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-create-a-cluster-of-docker-containers-with-docker-swarm-and-digitalocean-on-centos-7).
- Since we want data protected and available, each host will need a minimum of four drives, one for the boot volume and three [data drives](http://storidge.com/docs/data-drive-requirements/) attached for CIO use.
- Configure networking to allow SSH connections across all nodes.

## **Install cio**

For your convenience, a script is provided for installing the free version of CIO into development environments quickly and non-interactively. The use of convenience scripts is recommended for dev environments only, as root permissions are required to run them. This script will detect your Linux distribution and version, and install all dependencies and suggestions of the package manager without asking for confirmation.

CIO currently supports CentOS 7.4 (3.10 kernel), RHEL 7 (3.10 kernel) and Ubuntu 14.04LTS (3.13 kernel). After verifying you have a supported distribution, run the demo script below to begin installation.

```
curl -fsSL ftp://download.storidge.com/pub/free/demo | sudo bash

```

Example:

```
root@c1:~# curl -fsSL ftp://download.storidge.com/pub/free/demo | sudo bash
Started installing release 2148 at Tue Jan 30 12:47:26 PST 2018
Loading cio software for: u16  (4.4.0-104-generic)
...
...
...
latest: Pulling from portainer/portainer
Digest: sha256:232742dcb04faeb109f1086241f290cb89ad4c0576e75197e902ca6e3bf3a9fc
Status: Image is up to date for portainer/portainer:latest
Finished at Tue Jan 30 12:48:04 PST 2018
cio software installation complete. cio requires a minimum of 3 local drives per node for data redundancy

Please verify local drives are available, then run 'cioctl create' command on primary node to start a new cluster

```

#### **Adding nodes**

Add nodes to increase capacity and enable high availability for the cluster. Repeat the cio installation on all nodes that will be members of the cluster.

## **Initialize the cluster**

With the CIO software installed on all nodes, the next step is to create a cluster and then initialize the cluster for use. As part of cluster creation, CIO will automatically discover and add drive resources from each node. Drives that are partitioned or have a file system will not be added to the storage pool.

Start the CIO cluster with the `cioctl create` command. Example:

```
[root@c1 ~]# cioctl create
Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
    cioctl join 192.168.3.95 root f26e695d

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init f26e695d

```

The first node (c1 in above example) where the `cioctl create` command ran becomes the sds controller node.

The output of create includes a command to join new nodes to the cluster. Add new nodes to cluster with the `cioctl join` command. Example for four node cluster with new nodes c2, c3, c4:

```
[root@c2 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

```

```
[root@c3 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

```

```
[root@c4 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

```

Return to the sds controller node and run the `cioctl init`command to complete initialization of the cluster.

```
[root@c1 ~]# cioctl init f26e695d
cluster: initialization started
...
cluster: Node initialization completed
cluster: Start cio daemon
cluster: Succeed: Add vd0: Type:3-copy, Size:20GB
cluster: MongoDB ready
cluster: Synchronizing VID files
cluster: Starting API

```

**Note:** If you are testing a single-node cluster, skip to the `cioctl init <token>` command.  There is no need to run the `cioctl join` command in this case. 

#### **Initializing physical servers with SSDs**

The initialization process will take a few minutes to complete for virtual servers. However when CIO is installed on physical servers with high performance devices such as SSDs, the first initialization of the cluster will take about 30 minutes.

This extra time is used to characterize the available performance and the performance information is used in CIO's quality-of-service (QoS) feature to deliver guaranteed performance for individual applications. For example, a four node Intel cluster with 3 NVMe devices each was tested at 6 million read IOPS in the cluster.

## **Ready To Use**

At the end of initialization, you have a four node [Docker Swarm](https://docs.docker.com/get-started/part4/) cluster running. The Swarm cluster will be automatically configured if one is not already running. There are three manager nodes and one worker node. Confirm with:

```
[root@c1 ~]# docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS
gpx9996b1usy7a0h6cd686g62 *   c1                  Ready               Active              Leader
p917q3v1w3gapqx2zn87652f3     c2                  Ready               Active              Reachable
velj1g30557mhayy1hkoqqc75     c3                  Ready               Active              Reachable
jw4robjsehwzw7en48rw2mjie     c4                  Ready               Active


```

In addition, the [Portainer UI](https://portainer.io/) is launched in a container. Verify with:

```
[root@c1 ~]# docker service ps portainer
ID                  NAME                IMAGE                        NODE                DESIRED STATE       CURRENT STATE           ERROR               PORTS
9jpoaen6ddke        portainer.1         portainer/portainer:latest   c1                  Running             Running 8 minutes ago

```

Login to the container management UI by pointing your browser at any node IP and port 9000. You can check the node IPs with the `cio nodes` command:

```
[root@c1 ~]# cio nodes
NODENAME             IP                NODE_ID    ROLE       STATUS
c1                   192.168.3.95      4132353b   sds        normal
c2                   192.168.3.53      dceacd20   backup1    normal
c3                   192.168.3.145     9ee22782   backup2    normal
c4                   192.168.3.129     d2004822   standard   normal

```

In this example, point the browser at 192.168.3.95:9000, where 9000 is the default Portainer service port number.


