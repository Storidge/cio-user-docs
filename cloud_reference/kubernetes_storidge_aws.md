---
title: Kubernetes on AWS
description: Install guide for persistent storage cluster for Kubernetes cluster on AWS
lang: en-US
---

# Kubernetes and Storidge on AWS

This guide shows you how to easily add persistent storage capabilities to a Kubernetes cluster on AWS.

The Storidge CIO software deployed to worker nodes, adds a storage abstraction layer from which persistent volumes will be dynamically provisioned to pods. This reduces dependencies on provider infrastructure, eliminating cloud lock-in so apps and data can be more portable.

## Prerequisites

This guide assumes one or more Kubernetes master nodes are already deployed.

- Minimum of three worker nodes (instances) are required to form a cluster. Four worker nodes minimum are recommended for production clusters.
- Worker nodes require a minimum of three data drives to provide data redundancy.
- Security group which enables all inbound traffic within the cluster.

## Deployment Sequence

The cluster is deployed following steps below:  

1. Deploy Kubernetes cluster - assumed deployed
2. Deploy Storidge cluster - see guide below
3. Deploy Storidge CSI Driver - see guide below

## Install Storidge software

Storidge's CIO software currently supports CentOS 7 (3.10 kernel), RHEL 7 (3.10 kernel), Ubuntu 18.04LTS (4.15 kernel), and Ubuntu 20.04 (5.4 kernel).

Note that the desktop edition of Ubuntu 16.04 lists a 4.15 kernel. Use the server edition of Ubuntu 18.04 instead for 4.15 kernel support.  

After verifying you have a supported distribution, run the convenience script below on a worker node:

`curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash`

::: tip
FTP access may not be allowed from certain countries or locations. Try using http to download and install:

`curl -fsSL http://download.storidge.com/pub/ce/cio-ce | sudo bash`
:::

Example:
```
root@worker1:~# curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash
Started installing release 3062 at Thu Nov 28 15:46:06 UTC 2019
Loading cio software for: u18  (4.15.0-1051-aws)
Installing system packages
net.core.netdev_max_backlog = 4096
net.core.optmem_max = 40960
net.core.rmem_max = 8388608
net.core.wmem_max = 8388608
net.core.rmem_default = 1048576
net.core.wmem_default = 1048576
net.ipv4.tcp_rmem = 4096 1048576 8388608
net.ipv4.tcp_wmem = 4096 1048576 8388608
Installing mongo-org 4.2.1
Installing mongo-c-driver-1.15.2.u18.x86_64
A make of SCST (scst-3.4.x-r8620) will take some time.  Please wait
Finished at Thu Nov 28 15:48:17 UTC 2019

Installation completed. cio requires a minimum of 3 local drives per node for data redundancy.

To start a cluster, run 'cioctl create' on primary node. To add a node, generate a join token
with 'cioctl join-token' on sds node. Then run the 'cioctl node add ...' output on this node.
```

**Install Additional Nodes**

You can add more worker nodes to the Storidge cluster to increase capacity, performance and enable high availability for your applications. Repeat the convenience script installation on all worker nodes that will be part of the Storidge cluster.

`curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash`

::: tip
For production deployments, a minimum of four nodes is recommended
:::

## Configure Storidge cluster

With the Storidge software installed, the next step is to create a Storidge cluster and initialize it for use. As part of cluster creation, the Storidge CIO software will automatically discover and add drive resources from each worker node.

::: tip
Drives that are partitioned or have a file system will not be added to the storage pool
:::

Run the `cioctl create` command on the node you wish to be the leader of the cluster. This generates a `cioctl join` and a `cioctl init` command.

```
root@worker1:~# cioctl create
There are multiple IP addresses on this system (172.31.27.212 on ens5, 192.168.235.128 on tunl0).
Re-run the create command by specifying the IP address with the --ip flag, e.g.:
    cioctl create --ip 172.31.27.212

root@worker1:~# cioctl create --ip 172.31.27.212
Key Generation setup
Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
    cioctl join 172.31.27.212 f73dde3610663a98645a33596bcb60e8-3b8cc64d

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init 3b8cc64d
```

Run the `cioctl join` command on worker nodes joining the cluster.

## Initialize Storidge cluster

With all nodes added, run the `cioctl init` command on the SDS node to start initializing the cluster.

```
root@worker1:~# cioctl init 3b8cc64d
Warning: Permanently added '172.31.31.92' (ECDSA) to the list of known hosts.
Warning: Permanently added '172.31.19.191' (ECDSA) to the list of known hosts.
Warning: Permanently added '172.31.27.103' (ECDSA) to the list of known hosts.
<13>Nov 28 15:50:35 cluster: Setup AWS persistent hostname for sds node
<13>Nov 28 15:50:45 cluster: initialization started
.
.
.
<13>Nov 28 15:52:16 cluster: Node initialization completed
<13>Nov 28 15:52:20 cluster: Start cio daemon
<13>Nov 28 15:52:36 cluster: Succeed: Add vd0: Type:2-copy, Size:20GB
<13>Nov 28 15:52:38 cluster: MongoDB ready
<13>Nov 28 15:52:42 cluster: Synchronizing VID files
```

Run `cio node ls` to list the worker/storage nodes and status.
```
root@worker1:~# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS      VERSION
c-e046b7d8           172.31.27.212     e046b7d8   sds        normal      V1.0.0-3062
c-d9840580           172.31.31.92      d9840580   backup1    normal      V1.0.0-3062
c-1cdb75bb           172.31.19.191     1cdb75bb   backup2    normal      V1.0.0-3062
c-7f0b896f           172.31.27.103     7f0b896f   storage    normal      V1.0.0-3062
```

## Deploy CSI driver

With the Storidge cluster initialized, deploy the Storidge CSI driver from a Kubernetes master node. This will also deploy a default storage class (cio-default). This example below assumes Kubernetes 1.16.
```
root@master:~# kubectl create -f https://raw.githubusercontent.com/Storidge/csi-cio/master/deploy/releases/csi-cio-v1.2.0.yaml
csidriver.storage.k8s.io/csi.cio.storidge.com created
storageclass.storage.k8s.io/cio-default created
statefulset.apps/csi-cio-controller created
serviceaccount/csi-cio-controller-sa created
clusterrole.rbac.authorization.k8s.io/csi-cio-provisioner-role created
clusterrolebinding.rbac.authorization.k8s.io/csi-cio-provisioner-binding created
clusterrole.rbac.authorization.k8s.io/csi-cio-attacher-role created
clusterrolebinding.rbac.authorization.k8s.io/csi-cio-attacher-binding created
daemonset.apps/csi-cio created
serviceaccount/csi-nodeplugin-sa created
clusterrole.rbac.authorization.k8s.io/csi-cio-driver-registrar-role created
clusterrolebinding.rbac.authorization.k8s.io/csi-cio-driver-registrar-binding created
```

For Kubernetes 1.15 and below, run:
```
kubectl create -f https://raw.githubusercontent.com/Storidge/csi-cio/master/deploy/releases/csi-cio-v1.1.0.yaml
```

## Verify CSI driver deployed

Verify the Storidge volume plugin (csi-cio) is deployed.
```
root@master:~# kubectl get ds -A
NAMESPACE     NAME          DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
kube-system   calico-node   5         5         5       5            5           beta.kubernetes.io/os=linux   19m
kube-system   csi-cio       4         4         4       4            4           <none>                        19s
kube-system   kube-proxy    5         5         5       5            5           beta.kubernetes.io/os=linux   20m
```

Verify the Storidge controller plugin is deployed.
```
root@master:~# kubectl get sts -A
NAMESPACE     NAME                 READY   AGE
kube-system   csi-cio-controller   1/1     30s
```

Verify the csi-cio pods are running.
```
root@master:~# kubectl get po -A
NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
kube-system   calico-kube-controllers-6b64bcd855-tns44   1/1     Running   0          20m
kube-system   calico-node-4xcxg                          1/1     Running   1          19m
kube-system   calico-node-7blz9                          1/1     Running   1          19m
kube-system   calico-node-mq7pt                          1/1     Running   0          20m
kube-system   calico-node-nbg4p                          1/1     Running   1          19m
kube-system   calico-node-rzqk4                          1/1     Running   1          19m
kube-system   coredns-5644d7b6d9-hj6cr                   1/1     Running   0          21m
kube-system   coredns-5644d7b6d9-t84tw                   1/1     Running   0          21m
kube-system   csi-cio-56xsc                              2/2     Running   0          65s
kube-system   csi-cio-5l78f                              2/2     Running   0          65s
kube-system   csi-cio-controller-0                       3/3     Running   0          65s
kube-system   csi-cio-kpkmx                              2/2     Running   0          65s
kube-system   csi-cio-vch88                              2/2     Running   0          65s
kube-system   etcd-master                                1/1     Running   0          20m
kube-system   kube-apiserver-master                      1/1     Running   0          20m
kube-system   kube-controller-manager-master             1/1     Running   0          20m
kube-system   kube-proxy-gw7hf                           1/1     Running   1          19m
kube-system   kube-proxy-k2ld8                           1/1     Running   1          19m
kube-system   kube-proxy-k8mps                           1/1     Running   1          19m
kube-system   kube-proxy-p9t88                           1/1     Running   1          19m
kube-system   kube-proxy-wlgt8                           1/1     Running   0          21m
kube-system   kube-scheduler-master                      1/1     Running   0          20m
```

<h3>Next steps</h3>

With the Storidge cluster deployed, create storage classes and persistent volumes claims, or deploy pods with persistent storage. See [examples from GitHub repo](https://github.com/Storidge/csi-cio).

Check our [Getting Started guide](https://guide.storidge.com/) for a tutorial or [documentation](https://docs.storidge.com/) for more information. Connect with us on our [Slack channel](http://storidge.com/join-cio-slack/) for support.
