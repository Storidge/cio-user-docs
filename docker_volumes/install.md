---
title: Install
description: Install persistent storage for Docker Swarm
lang: en-US
---

# Install software and dependencies

A convenience script installs the community edition of the Storidge software quickly and non-interactively. The use of convenience scripts is recommended for dev environments only, as root permissions are required to run them. This script will detect your Linux distribution and version, and install all dependencies and suggestions of the package manager without asking for confirmation.

Run the convenience script below on all workers nodes:
```
curl -fsSL https://download.storidge.com/pub/ce/cio-ce | sudo bash
```

A multi-node cluster requires minimum three nodes. For production deployments and high availability support, a minimum of four nodes is recommended. 

::: tip
FTP access may not be allowed from certain countries or locations. Try using http to download and install:

`curl -fsSL https://download.storidge.com/pub/ce/cio-ce | sudo bash`
:::

Example:
```
root@demo:~# curl -fsSL https://download.storidge.com/pub/ce/cio-ce | sudo bash
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

::: warning
When working with virtual servers, it is common to clone off a base image. For multi-node clusters, verify that the ISCSI initiator name on each node is unique after cluster initialization completes.

On Linux, you can show the initiator name with:  `cat /etc/iscsi/initiatorname.iscsi`
:::

<h2>Next</h2>

With software installation completed, you are ready to configure and [initialize a cluster](https://docs.storidge.com/docker_volumes/initialize_cluster.html).
