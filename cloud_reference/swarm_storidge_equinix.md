---
title: Swarm and Storidge on Equinix metal
description: Deployment guide for persistent storage cluster on Equinix Metal
lang: en-US
---

# Swarm and Storidge on Equinix Metal

This guide shows you how to deploy a Storidge cluster on Equinix Metal. Follow the steps below to deploy Equinix servers, install Storidge software, configure and initialize a cluster with persistent storage. 

At completion of the steps, you will have a Docker Swarm orchestration system, with persistent storage cluster that is ready to run stateful applications. Storidge also starts the Portainer service so you can immediately deploy stacks using the UI dashboard.

## Planning for installation

Before performing the installation, please review the following:

- A minimum of three nodes are required to form a Storidge cluster. For production use where high availability is important, it is recommended to start with at least four nodes
- Each node will require a minimum of three data drives to ensure data redundancy
- Networking should be configured to enable inter-node communications
- Storidge currently supports CentOS 7 (3.10 kernel), RHEL 7 (3.10 kernel), Ubuntu 18.04LTS (4.15 kernel), and Ubuntu 20.04 (5.4 kernel). Deploy servers using an operating system from the supported list

## Deploy Servers

Deploy the desired number of servers from the Equinix Metal console, CLI, or API. Servers can also be deployed using tooling such as Terraform. Refer to [Equinix deployment options](https://metal.equinix.com/developers/docs/deploy/) for additional details. 

## Install Storidge software

A convenience script installs the community edition of the Storidge software quickly and non-interactively. This is recommended for dev environments only as root permissions are required to run them. This script will detect your Linux distribution and version, and install all dependencies and suggestions of the package manager without asking for confirmation.

Run the convenience script below on each node of the cluster:

`curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash`

Example:
```
root@demo:~# curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash
Started installing release 2859 at Tue Jul  9 13:05:15 PDT 2019
Loading cio software for: u16  (4.4.0-148-generic)
Reading package lists... Done
Building dependency tree
.
.
.
Finished at Tue Jul  9 13:08:39 PDT 2019

Installation completed. cio requires a minimum of 3 local drives per node for data redundancy.

To start a cluster, run 'cioctl create' on primary node. To add a node, generate a join token
with 'cioctl join-token' on sds node. Then run the 'cioctl node add ...' output on this node.
```

## Configure Storidge cluster

With the Storidge software installed on all nodes, the next step is to configure a cluster and then initialize the cluster for use. As part of cluster creation, Storidge will automatically discover and add drive resources from each node into a storage pool.

::: tip
Drives that are partitioned or have a file system will not be added to the storage pool. This prevents accidentally overwriting data 
:::

Start configuring a Storidge cluster with the `cioctl create` command. This generates two command strings.

The `cioctl join` command string is used to join additional nodes into the cluster. After configuration, the `cioctl init` command finishes initialization so the cluster is ready for running applications.

Example:
```
[root@c1 ~]# cioctl create
Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
    cioctl join 192.168.3.95 root f26e695d

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init f26e695d
```

The first node, from which the `cioctl create` command is run, becomes the sds controller (primary) node. This node is identified as the sds node when the `cio node ls` command is run.

<h3>Single node cluster</h3>

For test purposes, Storidge also supports single node clusters. Run `cioctl create --single-node` to create the cluster and automatically complete initialization.

Example:
```
root@demo:~# cioctl create --single-node
Key Generation setup
Configuring Docker Swarm cluster with Portainer and Agent services
<13>Aug 24 15:15:36 cluster: initialization started
<13>Aug 24 15:15:37 cluster: Start node initialization
<13>Aug 24 15:15:38 node: Clear drives
<13>Aug 24 15:15:39 node: Load module
<13>Aug 24 15:15:39 node: Add node backup relationship
<13>Aug 24 15:15:43 node: Check drives
Adding disk /dev/sdb SSD to storage pool
Adding disk /dev/sdc SSD to storage pool
Adding disk /dev/sdd SSD to storage pool
<13>Aug 24 15:15:54 node: Collect drive IOPS and BW: Total IOPS:32553  Total BW:2175.7MB/s
<13>Aug 24 15:15:54 node: Initializing metadata
<13>Aug 24 15:15:54 cluster: Node initialization completed
<13>Aug 24 15:15:55 cluster: Start cio daemon
<13>Aug 24 15:15:59 cluster: Succeed: Add vd0: Type:2-copy, Size:20GB
<13>Aug 24 15:16:00 cluster: MongoDB ready
<13>Aug 24 15:16:01 cluster: Synchronizing VID files
<13>Aug 24 15:16:05 cluster: Starting API
<13>Aug 24 15:16:12 cluster: Starting Portainer and Agent
```

<h3>Multi node cluster</h3>

The output of the create sub-command includes a `cioctl join` command to add new nodes to the cluster. Add nodes by running the `cioctl join` command on each new node.

Example four node cluster with new nodes c2, c3, c4:
```
[root@c2 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

[root@c3 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

[root@c4 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node
```

## Initialize Storidge cluster

Return to the sds controller (primary) node and run the `cioctl init` command to complete initialization of the cluster.

Example:
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

<h3>Initializing bare metal servers with SSDs</h3>

The initialization process will take only a few minutes to complete for virtual servers. The Storidge software does not characterize performance on virtual servers. A 'virtual' IOPS budget is used instead.

When Storidge is installed on bare metal servers, such as Equinix Metal, with flash memory storage devices, the first initialization of the cluster will take about 30 minutes. This extra time is used to characterize the available performance. The performance data collected is used by the quality-of-service (QoS) feature to deliver guaranteed performance for individual applications.


## Verify installation

Run `cio node ls` to list the worker/storage nodes and status.

Example:
```
[root@c1 ~]# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
c1                   192.168.3.95      4132353b   sds        normal
c2                   192.168.3.53      dceacd20   backup1    normal
c3                   192.168.3.145     9ee22782   backup2    normal
c4                   192.168.3.129     d2004822   standard   normal
```

## Login dashboard

The Storidge will automatically configure a Docker Swarm cluster when Kubernetes is not detected. You can verify with the `docker node ls` command. 

Example:
```
[root@c1 ~]# docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS
gpx9996b1usy7a0h6cd686g62 *   c1                  Ready               Active              Leader
p917q3v1w3gapqx2zn87652f3     c2                  Ready               Active              Reachable
velj1g30557mhayy1hkoqqc75     c3                  Ready               Active              Reachable
jw4robjsehwzw7en48rw2mjie     c4                  Ready               Active
```

In addtion, a Portainer service is launched to provide a dashboard for cluster management.

Example: 
```
[root@c1 ~]# docker service ps portainer
ID                  NAME                IMAGE                        NODE                DESIRED STATE       CURRENT STATE           ERROR               PORTS
9jpoaen6ddke        portainer.1         portainer/portainer:latest   c1                  Running             Running 8 minutes ago
```

You can login to Portainer by pointing your browser at any node IP and port 9000. List the node IPs with `cio node ls`:

Example: 
```
[root@c1 ~]# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
c1                   192.168.3.95      4132353b   sds        normal
c2                   192.168.3.53      dceacd20   backup1    normal
c3                   192.168.3.145     9ee22782   backup2    normal
c4                   192.168.3.129     d2004822   standard   normal
```

In this example the browser can be pointed at 192.168.3.95:9000, where 9000 is the default Portainer service port number.

Set the admin password where prompted, and start deploying your applications.

<h3>Next steps</h3>

Check our [Getting Started guide](https://guide.storidge.com/) for a tutorial or our [documentation](https://docs.storidge.com/) for more information. 

Connect with us on our [Slack channel](http://storidge.com/join-cio-slack/) for support.
