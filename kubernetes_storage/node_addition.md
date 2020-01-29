---
title: Node Addition
description: Adding new node to Storidge and Kubernetes cluster  
lang: en-US
---

# Adding new node

Adding a new node just takes two steps:
1. Add new node to Storidge cluster
2. Add new node to Kubernetes

## 1. Add to Storidge cluster

Running `cioctl join-token` generates a token to add a new node to an existing Storidge cluster. Copy the `cioctl node add ...` command string generated, and run on the new node.

Example:
```
root@sds:~# cioctl join-token
    cioctl node add 192.168.3.122 909ab2a6afad21f26369c00a8ba7307e-076f50d0
```

::: tip
The creation of new join tokens is disabled when there are on-going node operations, e.g. cordon, uncordon or removing a node from cluster. Wait and re-run the join-token command when the node operation is completed.
:::

## 2. Add to Kubernetes

After the new node is added to Storidge cluster, include in Kubernetes so pods can be scheduled.

Run `kubeadm token create --print-join-command` on a master node. Copy the `kubeadm join ...` command string, and run on the new node. 

Example:
```
root@master:~/examples# kubeadm token create --print-join-command
kubeadm join 192.168.3.21:6443 --token d7817i.flcq83smoad7npnd --discovery-token-ca-cert-hash sha256:d748737fa0b8f5f9145381cb681f5fbc41a1860ecd805e77cdce93acd92e07f2
```
