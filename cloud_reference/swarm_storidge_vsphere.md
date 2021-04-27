---
title: Swarm on vSphere
description: Install guide for persistent storage cluster on vSphere
lang: en-US
---

# Swarm and Storidge on vSphere

This guide shows you how to easily deploy Storidge CIO software on vSphere virtual machines. Follow the steps below to bring up a Swarm cluster with a Portainer dashboard, that's ready to run stateful apps in just a few minutes.

## Prerequisites

First, you'll need to setup the cluster resources to orchestrate:
- A minimum of three nodes (VMs) are required to form a cluster. Four nodes minimum are recommended for production clusters.
- Each node will need a minimum of four drives; one boot drive and three data drives to ensure data redundancy. Use thin provisioned virtual disks with minimum 50GB size.
- Select VMXNET3 virtual adapter.
- Secure boot turned off. Storidge CIO will load kernel modules with modprobe.

::: tip
To turn secure boot off, VM must be powered off.

Then right-click VM, select Edit Settings. Click the VM Options tab, and expand Boot Options. Under Boot Options, ensure that firmware is set to EFI.

Deselect the Secure Boot check box to disable secure boot. Click OK.
:::

## Install Storidge software

Storidge CIO currently supports CentOS 7 (3.10 kernel), RHEL 7 (3.10 kernel), Ubuntu 18.04LTS (4.15 kernel), and Ubuntu 20.04 (5.4 kernel).

Note that the desktop edition of Ubuntu 16.04 lists a 4.15 kernel. Use the server edition of Ubuntu 18.04 instead for 4.15 kernel support.  

After verifying you have a supported distribution, run the convenience script below to begin installation.

`curl -fsSL https://download.storidge.com/pub/ce/cio-ce | sudo bash`

::: tip
FTP access may not be allowed from certain countries or locations. Try using http to download and install:

`curl -fsSL https://download.storidge.com/pub/ce/cio-ce | sudo bash`
:::

Example:
```
root@u185:~# curl -fsSL https://download.storidge.com/pub/ce/cio-ce | sudo bash
Started installing release 3062 at Thu Nov 28 00:33:48 UTC 2019
Loading cio software for: u18  (4.15.0-70-generic)
latest: Pulling from storidge/nfs
Digest: sha256:28c2b034e5d7dfe72183c4ce6559bc2f8a188d668187080c353416380418937d
Status: Image is up to date for storidge/nfs:latest
docker.io/storidge/nfs:latest
latest: Pulling from portainer/portainer
d1e017099d17: Already exists
292b789be2e4: Pull complete
Digest: sha256:63eb47d4b408c3f39e942368bcbf7e157a2b6e5dda94ffd403a14199e1137133
Status: Downloaded newer image for portainer/portainer:latest
docker.io/portainer/portainer:latest
latest: Pulling from portainer/agent
Digest: sha256:88989d2dd0783524ab5af4bb8f4f4be2ac82c10188e17c6c6bda862bb7a5676d
Status: Downloaded newer image for portainer/agent:latest
docker.io/portainer/agent:latest
Finished at Thu Nov 28 00:34:32 UTC 2019

Installation completed. cio requires a minimum of 3 local drives per node for data redundancy.

To start a cluster, run 'cioctl create' on primary node. To add a node, generate a join token
with 'cioctl join-token' on sds node. Then run the 'cioctl node add ...' output on this node.
```

**Install Additional Nodes**

You can add more nodes to the cluster to increase capacity, performance and enable high availability for your applications. Repeat the convenience script installation on all nodes that will be added to the cluster.

`curl -fsSL https://download.storidge.com/pub/ce/cio-ce | sudo bash`

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
root@u181:~# cioctl create
Configuring Docker Swarm cluster with Portainer and Agent services
Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
    cioctl join 192.168.3.201 59499b5a146a46abc72463c2c7ea7014-f57c51a0

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init f57c51a0
```

Run the `cioctl join` command on nodes joining the cluster.

## Initialize cluster

With all nodes added, run the `cioctl init` command on the SDS node to start initializing the cluster.

```
root@u181:~#     cioctl init f57c51a0
<13>Nov 28 00:18:21 cluster: initialization started
<13>Nov 28 00:18:38 cluster: Copy auto-multiNode-u181.cfg to all nodes (NODE_NUMS:5)
<13>Nov 28 00:19:02 cluster: Initialize target
<13>Nov 28 00:19:08 cluster: Initialize initiator
<13>Nov 28 00:19:08 cluster: Start node initialization
.
.
.
<13>Nov 28 00:19:54 cluster: Node initialization completed
<13>Nov 28 00:19:58 cluster: Start cio daemon
<13>Nov 28 00:20:11 cluster: Succeed: Add vd0: Type:2-copy, Size:20GB
<13>Nov 28 00:20:13 cluster: MongoDB ready
<13>Nov 28 00:20:19 cluster: Synchronizing VID files
<13>Nov 28 00:20:53 cluster: Starting API
<13>Nov 28 00:21:11 cluster: Starting Portainer and Agent
```

::: warning
In vSphere, nodes for the cluster can be cloned off a common template. If you see iscsi error messages reported, verify that the ISCSI initiator name on each node is unique.

On Linux, you can show the initiator name with:  `cat /etc/iscsi/initiatorname.iscsi`

If the ISCSI initiator name is not unique, you can change it with:  `echo "InitiatorName=`/sbin/iscsi-iname`" > /etc/iscsi/initiatorname.iscsi`
:::

## Login dashboard

At the end of initialization, you have a Storidge cluster running. A Docker Swarm cluster will be automatically configured if one is not already
running.

Run `docker node ls` to show the compute cluster nodes.
```
root@u181:~# docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS      ENGINE VERSION
mlek083gy4puktm858tch3g3b *   u181                Ready               Active              Reachable           19.03.2
zuzi5quika460xfrfyjk0mz6t     u182                Ready               Active              Leader              19.03.2
ixsosu7nmg4oos7rjmsbc2a4f     u183                Ready               Active              Reachable           19.03.2
hqqp4jglfvn51dbrrm5j8f5en     u184                Ready               Active                                  19.03.2
ph5i2h0m4e3cch6mzmzvh51qs     u185                Ready               Active                                  19.03.2
```

Run `cio node ls` to list the persistent storage nodes and status.
```
root@u181:~# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS      VERSION
u181                 192.168.3.201     eff76e15   sds        normal      V1.0.0-3072
u182                 192.168.3.202     e449659d   backup1    normal      V1.0.0-3072
u183                 192.168.3.203     1bc1177a   backup2    normal      V1.0.0-3072
u184                 192.168.3.204     fc5ccc3e   storage    normal      V1.0.0-3072
u185                 192.168.3.205     15253286   storage    normal      V1.0.0-3072
```

The Portainer service and agents are launched at the end of initialization. Verify with `docker service ls`:
```
root@u181:~# docker service ls
ID                  NAME                  MODE                REPLICAS            IMAGE                        PORTS
k6xi13wcp75r        portainer_agent       global              5/5                 portainer/agent:latest
y5xjd5xsyph7        portainer_portainer   replicated          1/1                 portainer/portainer:latest   *:9000->9000/tcp
```

Login to the Portainer dashboard at any node's IP address on port 9000.

::: warning
It is recommended not to use VMware snapshot for backups of cluster nodes. The snapshot, backup, remove snapshot cycle suspends the VM breaking connectivity to the rest of the cluster. See [this faq](https://faq.storidge.com/troubleshooting.html#cluster-breaks-on-vsphere-vms-with-errors-sds-node-mgmt-14380-warning-node-pingable-node-0-node-id-ab7dc460-172-164-2-21-last-alive-sec) for more info.

Storidge will be introducing a native backup service with container granularity that does not require a cluster node to be suspended.
:::

<h3>Next steps</h3>

Check our [Getting Started guide](https://guide.storidge.com/) for a tutorial or [documentation](https://docs.storidge.com/) for more information. Connect with us on our [Slack channel](http://storidge.com/join-cio-slack/) for support.
