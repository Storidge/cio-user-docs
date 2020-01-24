---
title: Storage Concepts
description: Kubernetes storage concepts; persistent volume, persistent volume claim, storage class
lang: en-US
---

# Kubernetes storage concepts

## Volumes

Kubernetes uses a [volume abstraction](https://kubernetes.io/docs/concepts/storage/volumes/) to share files between containers in a pod, and to provide data persistence across pod restarts. The shared volume is a directory which is accessible to each container in the Pod.

There are many types of volumes, and a Pod can use any number of them at the same time. How a directory comes to be, the storage attributes, and access protocols are determined by the volume type used.

To use a volume, a Pod specifies the volume type, and the mountpoint in one or more containers.

## PV, PVC and Storage Class

Kubernetes manages resources in a cluster through abstraction layers. For storage, persistent volume (PV) and persistent volume claim (PVC) are objects used to represent and request storage resources. PV and PVC ultimately points to storage resources where data for the Pod is actually persisted.

A [persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) (PV) is an abstraction describing a storage resource in the cluster. PVs can be pre-provisioned (static provisioning) or dynamically provisioned. The lifecycle of a PV is independent of the Pod.

A persistent volume claim (PVC) is an abstraction representing a request for storage. A PVC represents a request for specific capacity, access mode and storage attributes. A Pod makes a request for storage resources through specs in a pod template (aka manifest).

While PVCs allow Pods to consume storage resources, it is common to request volumes with varying attributes for different applications. Kubernetes uses the [storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/) object to express the desired properties of a PV. This enables the underlying storage infrastructure to support and deliver different classes of service to applications.
