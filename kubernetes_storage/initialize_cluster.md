---
title: Initialize Cluster
description: Create persistent storage cluster for Kubernetes
lang: en-US
---

# Initialize Storidge cluster

With the cio software installed on all nodes, the next step is to configure a cluster and then initialize the cluster for use. As part of cluster creation, cio will automatically discover and add drive resources from each node into a storage pool. Drives that are partitioned or have a file system will not be added.

## 1. Create cluster

Start configuring a cio storage cluster with the `cioctl create` command. This generates two command strings.

The `cioctl join` command string is used to configure additional nodes into the cluster. After configuration, the `cioctl init` command finishes initialization so the cluster is ready for running applications.

Example:
```
[root@c1 ~]# cioctl create
Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
    cioctl join 192.168.3.95 root f26e695d

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init f26e695d
```
The first node, from which the `cioctl create` command is run, becomes the sds controller node (c1 in example above). This node is identified as the sds node when the `cio node ls` command is run.

## 2. Join nodes to cluster

The output of the create sub-command includes a `cioctl join` command to add new nodes to the cluster. Add nodes by running the `cioctl join` command on each worker node.

Example four node cluster with new nodes c2, c3, c4:
```
[root@c2 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

[root@c3 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

[root@c4 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node
```
Return to the sds controller node and run the `cioctl init` command to complete initialization of the cluster.
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

The initialization process will take a few minutes to complete for virtual servers. The cio software currently does not characterize performance on virtual servers. A 'virtual' IOPS budget is used instead.

When the cio software is installed on physical servers with high performance devices such as SSDs, the first initialization of the cluster will take about 30 minutes. This extra time is used to characterize the available performance. This performance information is used in the quality-of-service (QoS) feature to deliver guaranteed performance for individual applications.

## 3. Add to Kubernetes

Add the worker nodes to Kubernetes so pods can be scheduled.

Run `kubeadm token create --print-join-command` on an initialized cluster master node to print join commands. Copy the `kubeadm join ...` command string, and run on each of the worker nodes.

Example:
```
root@master:~/examples# kubeadm token create --print-join-command
kubeadm join 192.168.3.21:6443 --token d7817i.flcq83smoad7npnd --discovery-token-ca-cert-hash sha256:d748737fa0b8f5f9145381cb681f5fbc41a1860ecd805e77cdce93acd92e07f2
```

## 4. Install kubeconfig and CSI Driver

Install the kubeconfig file for storidge user and the CSI driver to dynamically provision volumes from Kubernetes. 

Ensure you have the following prerequisites:
- Kubernetes v1.15+
- Storidge CIO cluster
- Enabled `--allow-privileged` on Kubernetes API Server and kubelet
- Set the following feature gates: `--feature-gates=VolumeSnapshotDataSource=true,KubeletPluginsWatcher=true,CSINodeInfo=true,CSIDriverRegistry=true` on Kubernetes API server and kubelet

On master node run:

```
curl -fsSL ftp://download.storidge.com/pub/ce/update-kubeconfig | sudo bash
```