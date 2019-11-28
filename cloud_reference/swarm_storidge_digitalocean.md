---
title: Swarm and Storidge on Digital Ocean
description: Cloud reference for installing persistent storage cluster on Digital Ocean
lang: en-US
---

# Swarm and Storidge on Digital Ocean

This guide shows you how to easily deploy Storidge's Container IO (CIO) software on the DigitalOcean cloud platform. Follow the steps below to bring up a Swarm cluster with a Portainer dashboard, that's ready to run stateful apps in just a few minutes.

## Prerequisites

First, you'll need to setup the cluster resources to orchestrate:
- A minimum of three nodes (aka droplets) are required to form a cluster. Four nodes minimum are recommended for production clusters.
- Each node will need one boot volume and three data drives. Create the data drives using the Digital Ocean block storage service . Choose 'Manually Format & Mount' for volume configuration option, i.e. no filesystem
- Enable private networking for node-to-node networking within a region

::: tip
The Digital Ocean block storage service is only available in regions AMS3, BLR1, FRA1, LON1, NYC1, NYC3, SFO1, SFO2, SGP1 and TOR1.
:::

## Install cio software

Storidge's cio software currently supports CentOS 7.5, 7.6 (3.10 kernel), RHEL 7 (3.10 kernel), Ubuntu 16.04LTS (4.4 kernel), and Ubuntu 18.04LTS (4.15 kernel).

Note that the desktop edition of Ubuntu 16.04 lists a 4.15 kernel. Use the server edition of Ubuntu 18.04 instead for 4.15 kernel support.  

After verifying you have a supported distribution, run the convenience script below to begin installation.

`curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash`

Example:
```
root@cio1:~# curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash
Started installing release 2887 at Thu Jul 18 04:23:23 UTC 2019
Loading cio software for: u16  (4.4.0-154-generic)
Reading package lists... Done
Building dependency tree
.
.
.
Installation completed. cio requires a minimum of 3 local drives per node for data redundancy.

To start a cluster, run 'cioctl create' on primary node. To add a node, generate a join token
with 'cioctl join-token' on sds node. Then run the 'cioctl node add ...' output on this node.
root@cio1:~#
```

**Install additional nodes**

You can add more nodes to the cluster to increase capacity, performance and enable high availability for your applications. Repeat the convenience script installation on all nodes that will be added to the cluster.

`curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash`

::: tip
For production deployments, a minimum of four nodes is recommended
:::

## Configure cluster

With the CIO software installed on all nodes, the next step is to create a cluster and then initialize the cluster for use. As part of cluster creation, CIO will automatically discover and add drive resources from each node.

::: tip
Drives that are partitioned or have a file system will not be added to the storage pool
:::

Run the `cioctl create` command on the node you wish to be the leader of the cluster. This generates a `cioctl join` and a `cioctl init` command string.

```
root@cio1:~# cioctl create
There are multiple IP addresses on this system (138.68.50.155 on eth0, 10.46.0.5 on eth0, 10.138.148.183 on eth1).
Re-run the create command by specifying the IP address with the --ip flag, e.g.:
    cioctl create --ip 138.68.50.155
```

When there are multiple network interfaces and IP addresses, the `cioctl create` command will suggest the first IP address. Use the --ip flag to change to the IP address on the private network, e.g. 10.138.148.183 address on eth1 interface above.

```
root@cio1:~# cioctl create --ip 10.138.148.183
Key Generation setup
Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
    cioctl join 10.138.148.183 c8867176fe8214143c59135b1c696ae9-19bcc814

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init 19bcc814
```

**Join additional nodes**

The output of create includes a `cioctl join` command to add new nodes. Run the `cioctl join` command on nodes joining the cluster.

```
root@cio2:~# cioctl join 10.138.148.183 c8867176fe8214143c59135b1c696ae9-19bcc814
There are multiple IP addresses on this system (134.209.53.19 on eth0, 10.46.0.6 on eth0, 10.138.94.48 on eth1).
Re-run the join command by specifying the IP address with the --ip flag, e.g.:
    cioctl join 10.138.148.183 c8867176fe8214143c59135b1c696ae9-19bcc814 --ip 10.138.94.48
```

Since there are multiple network interfaces, the `cioctl join` command suggests the IP address of the corresponding network interface.

```
root@cio2:~# cioctl join 10.138.148.183 c8867176fe8214143c59135b1c696ae9-19bcc814 --ip 10.138.94.48
Adding this node to cluster as a storage node
root@cio2:~#
```

Repeat the `cioctl join` command on other nodes joining the cluster.


## Initialize cluster

With all nodes added, run the `cioctl init` command on the SDS node to start initializing the cluster.
```
root@cio1:~# cioctl init 19bcc814
Configuring Docker Swarm cluster with Portainer service
<13>Jul 19 18:25:25 cluster: initialization started
<13>Jul 19 18:25:29 cluster: Copy auto-multiNode-cio1.cfg to all nodes (NODE_NUMS:4)
.
.
.
<13>Jul 19 18:26:36 node: Initializing metadata
<13>Jul 19 18:27:21 cluster: Node initialization completed
<13>Jul 19 18:27:23 cluster: Start cio daemon
<13>Jul 19 18:27:35 cluster: Succeed: Add vd0: Type:2-copy, Size:20GB
<13>Jul 19 18:27:37 cluster: MongoDB ready
<13>Jul 19 18:27:38 cluster: Synchronizing VID files
<13>Jul 19 18:27:39 cluster: Starting API
```

## Login dashboard

At the end of initialization, you have a Storidge cluster running. A Docker Swarm cluster will be automatically configured if one is not already running.

Run `docker node ls` to show the compute cluster nodes.

```
root@cio1:~# docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS      ENGINE VERSION
mfivui1830fn6qktj28tlsuey *   cio1                Ready               Active              Reachable           18.09.6
g7nksqc3intvg9p0hls2vwa3n     cio2                Ready               Active              Reachable           18.09.6
mdxszf3vmh2utpkbad775jyq1     cio3                Ready               Active              Leader              18.09.6
wmspxh5158jafqlo9x45x23v7     cio4                Ready               Active                                  18.09.6
```

Run `cio node ls` to list the persistent storage nodes and status.

```
root@cio1:~# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
cio1                 10.138.148.183    adab4c7a   sds        normal
cio2                 10.138.94.48      b421a1c4   backup1    normal
cio3                 10.138.94.52      eb819d5a   backup2    normal
cio4                 10.138.94.196     85b99fea   standard   normal
```

The Portainer service is launched at the end of initialization. Verify with `docker service ls`:

```
root@cio1:~# docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE                        PORTS
z8gj7wd6zhfd        portainer           replicated          1/1                 portainer/portainer:latest   *:9000->9000/tcp
```

Login to the Portainer dashboard at any node's public IP on port 9000.
