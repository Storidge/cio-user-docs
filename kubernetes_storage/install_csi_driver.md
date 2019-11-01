---
title: Install Storidge CSI Driver
description: Overview of csi driver and installing Storidge csi driver for Kubernetes
lang: en-US
---

# Install Storidge CSI Driver

Storidge's CSI Driver interfaces a Container Orchestrator (CO), such as Kubernetes or Docker EE, to a Storidge cluster. With this driver you can dynamically provision persistent volumes from a storage abstraction layer managed by the Storidge CIO software.

The Storidge CSI driver is mostly tested on Kubernetes but should also work on other CSI based CO. Feel free to test it on other CO and give us feedback.

A Storige cluster should be deployed first before installing the CSI driver. When ready, install the Storidge CSI driver by running on a master node:

<h4>Kubernetes 1.16</h4>
```
kubectl create -f https://raw.githubusercontent.com/Storidge/csi-cio/master/deploy/releases/csi-cio-v1.2.0.yaml
```

<h4>Kubernetes 1.15 and below</h4>
```
kubectl create -f https://raw.githubusercontent.com/Storidge/csi-cio/master/deploy/releases/csi-cio-v1.1.0.yaml
```

See [Storidge CSI Driver on Docker Hub](https://hub.docker.com/_/storidge-csi-driver) for more information.
