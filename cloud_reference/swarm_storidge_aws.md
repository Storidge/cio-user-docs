---
title: Swarm on AWS
description: Cloud reference for installing persistent storage cluster on AWS
lang: en-US
---

# Swarm and Storidge on AWS

This guide shows you how to easily deploy Storidge's Container IO (CIO) software on AWS instances. Follow the steps below to bring up a Swarm cluster with a Portainer dashboard, that's ready to run stateful apps in just a few minutes.

## Prerequisites

First, you'll need to setup the cluster resources to orchestrate:
- A minimum of three nodes (instances) are required to form a cluster. Four nodes minimum are recommended for production clusters.
- Each node will need a minimum of four drives; one boot drive and three data drives for CIO to ensure data redundancy.
- A security group which enables all inbound traffic within the cluster.

## Install cio software

Storidge's cio software currently supports CentOS 7.5, 7.6 (3.10 kernel), RHEL 7 (3.10 kernel), Ubuntu 16.04LTS (4.4 kernel), and Ubuntu 18.04LTS (4.15 kernel).

Note that the desktop edition of Ubuntu 16.04 lists a 4.15 kernel. Use the server edition of Ubuntu 18.04 instead for 4.15 kernel support.  

After verifying you have a supported distribution, run the convenience script below to begin installation.

`curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash`

Example:
```
root@ip-172-31-27-160:~# curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash
Started installing release 2879 at Sat Jul 13 02:52:57 UTC 2019
Loading cio software for: u16  (4.4.0-1087-aws)
Reading package lists... Done
Building dependency tree
.
.
.
Finished at Sat Jul 13 02:53:06 UTC 2019

Installation completed. cio requires a minimum of 3 local drives per node for data redundancy.

To start a cluster, run 'cioctl create' on primary node. To add a node, generate a join token
with 'cioctl join-token' on sds node. Then run the 'cioctl node add ...' output on this node.
```

**Install Additional Nodes**

You can add more nodes to the cluster to increase capacity, performance and enable high availability for your applications. Repeat the convenience script installation on all nodes that will be added to the cluster.

`curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash`

::: tip
For production deployments, a minimum of four nodes is recommended
:::


## Configure cluster
With the CIO software installed on all nodes, the next step is to create a cluster and initialize it for use. As part of cluster creation, CIO will automatically discover and add drive resources from each node.

::: tip
Drives that are partitioned or have a file system will not be added to the storage pool
:::

Run the `cioctl create` command on the node you wish to be the leader of the cluster. This generates a `cioctl join` and a `cioctl init` command.

```
root@ip-172-31-22-159:~# cioctl create
Key Generation setup
Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
    cioctl join 172.31.22.159 7598e9e2eb9fe221b98f9040cb3c73bc-bd987b6a

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init bd987b6a
```

Run the `cioctl join` command on nodes joining the cluster.

## Initialize cluster

With all nodes added, run the `cioctl init` command on the SDS node to start initializing the cluster.

```
root@ip-172-31-22-159:~# cioctl init bd987b6a
Configuring Docker Swarm cluster with Portainer service
<13>Jul 13 02:43:40 cluster: Setup AWS persistent hostname for sds node
<13>Jul 13 02:44:00 cluster: initialization started
<13>Jul 13 02:44:03 cluster: Setup AWS persistent hostnames
.
.
.
<13>Jul 13 02:47:24 cluster: Node initialization completed
<13>Jul 13 02:47:26 cluster: Start cio daemon
<13>Jul 13 02:47:34 cluster: Succeed: Add vd0: Type:2-copy, Size:20GB
<13>Jul 13 02:47:36 cluster: MongoDB ready
<13>Jul 13 02:47:37 cluster: Synchronizing VID files
<13>Jul 13 02:47:38 cluster: Starting API
```

## Login dashboard
At the end of initialization, you have a Storidge cluster running. A Docker Swarm cluster will be automatically configured if one is not already
running.

Run `docker node ls` to show the compute cluster nodes.

```
root@ip-172-31-22-159:~# docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS      ENGINE VERSION
k9lwu33n1qvc4qw06t8rhmrn0     c-8ca106d7          Ready               Active              Reachable           18.09.6
18yxcme2s8b4q9jiq0iceh35y     c-6945fd81          Ready               Active              Leader              18.09.6
pmjn72izhrrb6hn2gnaq895c4 *   c-abc38f75          Ready               Active              Reachable           18.09.6
```

Run `cio node ls` to list the persistent storage nodes and status.

```
root@ip-172-31-22-159:~# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
c-abc38f75           172.31.22.159     abc38f75   sds        normal
c-8ca106d7           172.31.25.153     8ca106d7   backup1    normal
c-6945fd81           172.31.27.160     6945fd81   backup2    normal
```

The Portainer service is launched at the end of initialization. Verify with `docker service ps portainer`:
```
root@ip-172-31-22-159:~# docker service ps portainer
ID                  NAME                IMAGE                        NODE                DESIRED STATE       CURRENT STATE           ERROR               PORTS
zhu4ykc1hdlu        portainer.1         portainer/portainer:latest   c-6945fd81          Running             Running 4 minutes ago
```

**Note:** If not using a VPN, you will need to add a rule to the security group allowing inbound TCP traffic on port 9000 to access the Portainer dashboard.

Login to Portainer at any node's public IP on port 9000. The public IP addresses of the AWS instances can be found in the EC2 Management Console under Instances.
