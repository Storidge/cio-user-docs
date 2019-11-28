---
title: Kubernetes on AWS
description: Cloud reference for adding persistent storage to a Kubernetes cluster on AWS
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

Storidge's CIO software currently supports CentOS 7.5, 7.6 (3.10 kernel), RHEL 7 (3.10 kernel), Ubuntu 16.04LTS (4.4 kernel), and Ubuntu 18.04LTS (4.15 kernel).

Note that the desktop edition of Ubuntu 16.04 lists a 4.15 kernel. Use the server edition of Ubuntu 18.04 instead for 4.15 kernel support.  

After verifying you have a supported distribution, run the convenience script below on a worker node:

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
root@ip-172-31-22-159:~# cioctl create
Key Generation setup
Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
    cioctl join 172.31.22.159 7598e9e2eb9fe221b98f9040cb3c73bc-bd987b6a

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init bd987b6a
```

Run the `cioctl join` command on worker nodes joining the cluster.

## Initialize Storidge cluster

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

## Deploy CSI driver

With the Storidge cluster initialized, deploy the Storidge CSI driver from a Kubernetes master node. This will also deploy a default storage class (cio-default). This example below assumes Kubernetes 1.16.
```
root@ubuntu-16:~# kubectl create -f https://raw.githubusercontent.com/Storidge/csi-cio/master/deploy/releases/csi-cio-v1.2.0.yaml
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
root@minikube:~# kubectl get ds -A
NAMESPACE     NAME         DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
kube-system   csi-cio      1         1         1       1            1           <none>                        18s
kube-system   kube-proxy   1         1         1       1            1           beta.kubernetes.io/os=linux   7d20h
```

Verify the Storidge controller plugin is deployed.
```
root@minikube:~# kubectl get sts -A
NAMESPACE     NAME                 READY   AGE
kube-system   csi-cio-controller   1/1     26s
```

Verify the csi-cio pods are running.
```
root@minikube:~# kubectl get pods -A
NAMESPACE              NAME                                         READY   STATUS    RESTARTS   AGE
kube-system            coredns-5644d7b6d9-p44kv                     1/1     Running   11         7d20h
kube-system            coredns-5644d7b6d9-pm9wq                     1/1     Running   10         7d20h
kube-system            csi-cio-5c65s                                2/2     Running   0          2m37s
kube-system            csi-cio-controller-0                         3/3     Running   0          2m27s
kube-system            etcd-minikube                                1/1     Running   10         7d20h
kube-system            kube-addon-manager-minikube                  1/1     Running   10         7d20h
kube-system            kube-apiserver-minikube                      1/1     Running   10         7d20h
kube-system            kube-controller-manager-minikube             1/1     Running   9          7d4h
kube-system            kube-proxy-4pzpd                             1/1     Running   10         7d20h
kube-system            kube-scheduler-minikube                      1/1     Running   10         7d20h
kube-system            storage-provisioner                          1/1     Running   12         7d20h
```

### Next steps

With the Storidge cluster deployed, create storage classes and persistent volumes claims, or deploy pods with persistent storage. See [examples from GitHub repo](https://github.com/Storidge/csi-cio).

Check our [guide](https://guide.storidge.com/) or [documentation](https://docs.storidge.com/) for more information, and connect with us on our [Slack channel](http://storidge.com/join-cio-slack/) for support.
