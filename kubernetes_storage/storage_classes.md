---
title: Storage Classes
description: Provision persistent volumes using storage classes and Storidge profiles
lang: en-US
---

# Storage Classes

Kubernetes provides the [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) resource as a way to deliver different types of storage to the cluster. A `StorageClass` can represent storage with different media or backends, range of performance guarantees, data protection capabilities or services, etc.

[Dynamic provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/) of volumes is dependent on the `StorageClass` resource. At least one or more `StorageClass` must be deployed in the cluster before volumes can be dynamically provisioned. Multiple `StorageClasses` can be deployed with each presenting access to different capabilities and services of the underlying storage systems.

## **Storage Class Fields**

The name of the `StorageClass` is how users request a particular class. In the `StorageClass` below, the [annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) (metadata) sets `storidge-cio` as the default. A default `StorageClass` is useful for automatic provisioning of volumes for `PersistentVolumeClaims` that do not name any storage class, i.e. the `storageClassName` field is not specified.

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: storidge-cio
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: com.storidge.csi.cio
parameters:
  level: "2"
  provision: "thin"
  iopsMin: "10"
  iopsMax: "1000000"
  type: "ssd"
reclaimPolicy: Delete
allowVolumeExpansion: true
```

The `provisioner` field determines the volume plugin used, in this case, `com.storidge.csi.cio` which is Storidge's CSI plugin for the CIO software.

The key value pairs in  `parameters` pass the desired volume attributes to the volume plugin (details below).

For dynamically provisioned volumes, the `reclaimPolicy` determines whether the volume is tied to the lifecycle of the pod.  

- `Delete` will result in the volume being removed when the pod and the `PersistentVolumeClaim` are terminated
- A `Retain` policy will preserve the `PersistentVolume ` beyond the lifecycle of the pod. However the `PersistentVolume` and `storidgeVolume` will require manual removal. Kubernetes defaults to `Delete` when no `reclaimPolicy` is defined

Storidge's volumes support on-line capacity expansion of btrfs, ext4 and xfs formatted volumes, so the `allowVolumeExpansion` field is set to "true".

## **Parameters**

Entries in `parameters` are optional as defaults are set for basic attributes. Storidge supports the following volume attributes:

`directory`:  set the bind mount directory on the host

`filesystem`:  file system to use for the volume. Valid values are `btrfs` , `etx4` and `xfs`. Defaults to `xfs`  

`iopsMin`:  sets the minimum iops guaranteed for the volume. This value is valid when volume `type` is `ssd` backed by flash memory devices on physical servers. Defaults to `30`.  

`iopsMax`:  sets the maximum iops allowed for the volume. This value is valid when volume `type` is `ssd` backed by flash memory devices on physical servers. Defaults to `1000000`, i.e. unlimited

`level`:  sets the redundancy level/number of synchronous replicas for the volume. Valid values are `1`, `2` and `3`. Defaults to two replicas.

`profile`:  sets the name of the [profile](https://storidge.com/docs/profiles/) to use for the volume. Provides option to manage parameter entries in profiles instead of maintaining multiple storage classes.

`provision`:  is the volume `thin` or `thick` provisioned. Defaults to `thin ` provisioned so capacity is automatically allocated on application I/O

`type`:   sets the media type for the volume. Valid values are `ssd` and `hdd`. Defaults to `ssd`

`encryption`:  is snapshot enabled for the volume. Defaults to `no`  

`snapshotEnabled`:  is snapshot enabled for the volume. Defaults to `no`  

`snapshotInterval`:  time interval in minutes for rotating snapshots. When interval is not specified, snapshots are created through script or cli command only

`snapshotMax`:  maximum number of snapshots to retain. The oldest snapshot is rotated out when the value of `snapshotMax` is reached

## **Example with nginx**

The `cio-nginx` class below deploys a `StorageClass` with desired parameters for an nginx application.

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: cio-nginx
provisioner: com.storidge.csi.cio
parameters:
  iopsMin: "100"
  iopsMax: "10000"  
  level: "2"
  provision: "thin"
  type: "ssd"
  snapshotEnabled: "yes"
  snapshotInterval: "60"
  snapshotMax: "5"
reclaimPolicy: Delete
allowVolumeExpansion: true
```

With volume attributes managed in a profile, the `StorageClass` can be expressed in compact form:

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: cio-nginx
provisioner: com.storidge.csi.cio
parameters:
  profile: NGINX
reclaimPolicy: Delete
allowVolumeExpansion: true
```

## **Create**

Save the `StorageClass` above in a file named 'cio-sc-nginx.yaml'. Deploy the `StorageClass` with:

`kubectl create -f cio-sc-nginx.yaml`

## **Confirm**

Use `kubectl get sc` to confirm `cio-nginx` class was deployed or run `kubectl describe sc cio-nginx` for details.

## **Delete**

Run `kubectl delete -f cio-sc-nginx.yaml` to remove the `StorageClass`.
