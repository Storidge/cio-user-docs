---
title: Kubernetes on Equinix metal
description: Deployment guide for persistent storage cluster on Equinix Metal
lang: en-US
---

# Kubernetes and Storidge on Equinix Metal


This guide shows you how to deploy a Storidge cluster on Equinix Metal. Follow the steps below to deploy Equinix servers, install Storidge software, configure and initialize a cluster with persistent storage. 

At completion of the steps, you will have deployed a Storidge cluster with a storage abstraction layer for running Kubernetes stateful applications. 

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

Run the convenience script below on all nodes that will be running stateful workloads:

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
root@worker1:~# cioctl create
Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
    cioctl join 192.168.3.95 root f26e695d

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init f26e695d
```

The first node, from which the `cioctl create` command is run, becomes the sds controller (primary) node. This node is identified as the sds node when the `cio node ls` command is run.

Run the `cioctl join` command on each node joining the Storidge cluster. 

Example four node cluster with new nodes worker2, worker3, worker4:
```
root@worker2:~# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

root@worker3:~# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

root@worker4:~# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node
```

## Initialize Storidge cluster

Return to the sds controller (primary) node and run the `cioctl init` command to complete initialization of the cluster.

Example:
```
root@worker1:~# cioctl init f26e695d
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
root@worker1:~# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
worker1              192.168.3.95      4132353b   sds        normal
worker2              192.168.3.53      dceacd20   backup1    normal
worker3              192.168.3.145     9ee22782   backup2    normal
worker4              192.168.3.129     d2004822   standard   normal
```

## Add to Kubernetes master

Add the worker nodes to the Kubernetes control plane so pods can be scheduled.

Run `kubeadm token create --print-join-command` on a master node. Copy the `kubeadm join ...` command string, and run on each of the worker nodes.

Example:
```
root@master:~/examples# kubeadm token create --print-join-command
kubeadm join 192.168.3.21:6443 --token d7817i.flcq83smoad7npnd --discovery-token-ca-cert-hash sha256:d748737fa0b8f5f9145381cb681f5fbc41a1860ecd805e77cdce93acd92e07f2
```

After the worker nodes have been added, you can confirm with `kubectl get nodes`.

Example:
```
root@master:~# kubectl get nodes
NAME      STATUS   ROLES    AGE     VERSION
kmaster   Ready    master   69d     v1.19.2
worker1   Ready    <none>   4m57s   v1.19.2
worker2   Ready    <none>   18s     v1.19.2
worker3   Ready    <none>   12s     v1.19.2
worker4   Ready    <none>   2m1s    v1.19.2
```

## Install kubeconfig and CSI Driver

Install the kubeconfig file for storidge user and the CSI driver to dynamically provision volumes from Kubernetes. 

On the master node run:

```
curl -fsSL ftp://download.storidge.com/pub/ce/update-kubeconfig | sudo bash
```

Verify that the csi driver has been deployed with `kubectl get pods -A`

Example:
```
root@kmaster:~# kubectl get pods -A
NAMESPACE     NAME                                       READY   STATUS        RESTARTS   AGE
kube-system   calico-kube-controllers-744cfdf676-65bjr   1/1     Running       5          69d
kube-system   calico-node-567pj                          1/1     Running       0          19d
kube-system   calico-node-gcbrs                          1/1     Running       5          69d
kube-system   calico-node-gkxf5                          1/1     Running       0          68m
kube-system   calico-node-hhw6c                          1/1     Running       0          19d
kube-system   calico-node-thn9g                          1/1     Running       0          19d
kube-system   coredns-f9fd979d6-9tskh                    1/1     Running       5          69d
kube-system   coredns-f9fd979d6-rczkk                    1/1     Running       5          69d
kube-system   csi-cio-27cl7                              2/2     Running       0          9s
kube-system   csi-cio-c4vjc                              2/2     Running       0          9s
kube-system   csi-cio-controller-7967955cfb-8gkf6        6/6     Running       0          10s
kube-system   csi-cio-p56cz                              2/2     Running       0          9s
kube-system   csi-cio-w5rkw                              2/2     Running       0          9s
kube-system   etcd-kmaster                               1/1     Running       5          69d
kube-system   kube-apiserver-kmaster                     1/1     Running       6          69d
kube-system   kube-controller-manager-kmaster            1/1     Running       11         69d
kube-system   kube-proxy-5fgv5                           1/1     Running       0          19d
kube-system   kube-proxy-5q6xx                           1/1     Running       0          68m
kube-system   kube-proxy-9p464                           1/1     Running       5          69d
kube-system   kube-proxy-hl8mq                           1/1     Running       0          19d
kube-system   kube-proxy-wvxhg                           1/1     Running       0          19d
kube-system   kube-scheduler-kmaster                     1/1     Running       10         69d
```

The example above shows the csi-cio-controller and csi-cio drivers deployed on 4 nodes of the kube cluster. 

<h3>Next steps</h3>

With the Storidge cluster deployed, create storage classes and persistent volumes claims, or deploy pods with persistent storage. See [examples from GitHub repo](https://github.com/Storidge/csi-cio).

Check our [Getting Started guide](https://guide.storidge.com/) for a tutorial or our [documentation](https://docs.storidge.com/) for more information. 

Connect with us on our [Slack channel](http://storidge.com/join-cio-slack/) for support.