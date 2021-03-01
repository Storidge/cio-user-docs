---
title: Storage Classes
description: Provision persistent volumes using storage classes and Storidge profiles
lang: en-US
---

# Storage Classes

Kubernetes provides the [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) resource as a way to deliver different types of storage to the cluster. A storage class can represent storage with different media or backends, performance guarantees, data protection capabilities or services, etc.

[Dynamic provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/) of volumes is dependent on the `StorageClass` resource. At least one or more storage classes must be deployed in the cluster before volumes can be dynamically provisioned. Multiple storage classes can be deployed with each presenting access to different capabilities and services of the underlying storage systems.

## Storage Class Fields

The name of the storage class is how users request a particular class. In the storage class below, the [annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) (metadata) names `cio-default` as the default. A default storage class is useful for automatic provisioning of volumes for persistent volume claims that do not name any storage class, i.e. the `storageClassName` field is not specified.

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: cio-default
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: csi.cio.storidge.com
parameters:
  level: "2"
  provision: "thin"
  iopsMin: "10"
  iopsMax: "1000000"
  type: "ssd"
reclaimPolicy: Delete
allowVolumeExpansion: true
```

The `provisioner` field determines the volume plugin used, in this case, `csi.cio.storidge.com` which is [Storidge's CSI driver](https://hub.docker.com/_/storidge-csi-driver).

::: tip
The format of the provisioner field changed to forward dns in Kubernetes 1.16. Use `com.storidge.csi.cio` as the provisioner value for Kubernetes 1.15 and earlier.
:::

The key value pairs in `parameters` pass the desired volume attributes to the volume plugin.

For dynamically provisioned volumes, the `reclaimPolicy` determines whether the volume is tied to the lifecycle of the pod.  

- `reclaimPolicy: Delete` will result in the volume being removed when the pod and the persistent volume claim are terminated
- `reclaimPolicy: Retain` will preserve the persistent volume beyond the lifecycle of the pod. However the persistent volume and Storidge volume will require manual removal. Kubernetes defaults to `Delete` when no `reclaimPolicy` is defined.

Storidge volumes support both online capacity expansion and [auto capacity expansion](https://guide.storidge.com/docker_guide/autoexpand.html) of btrfs, ext4 and xfs formatted volumes, so the `allowVolumeExpansion` field is set to "true".

## Parameters

Entries in `parameters` are optional as defaults are set for basic attributes. Storidge supports the following volume attributes:

| Attribute         | Description                            | Valid Values       |
| ----------------- | -------------------------------------- | ------------------ |
| directory         | Bind mount on the host                 | /path/to/volume    |
| filesystem        | Filesystem on volume                   | btrfs, ext4, xfs*  |
| iopsmin           | Minimum iops guaranteed (SSD required) | minimum 30         |
| iopsmax           | Maximum iops allowed (SSD required)    | 10,000,000 max     |
| level             | Number of replicas for data redundancy | 1, 2, 3            |
| profile           | Profile to use for volume creation     | PROFILENAME        |
| provision         | Select thick or thin provisioning      | thin*, thick       |
| type              | Type of media or backend storage       | ssd, hdd           |
| snapshot          | Enable snapshot for volume             | yes, no*           |  
| interval          | Periodic snapshot interval in minutes  | minimum 1          |
| snapshotmax       | maximum number of snapshots to keep    | 99 max             |

## Example with nginx

The 'cio-nginx' example below deploys a storage class with desired parameters for an nginx application.

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: cio-nginx
provisioner: csi.cio.storidge.com
parameters:
  iopsmin: "100"
  iopsmax: "10000"  
  level: "2"
  provision: "thin"
  type: "ssd"
  snapshot: "yes"
  interval: "60"
  snapshotmax: "5"
reclaimPolicy: Delete
allowVolumeExpansion: true
```

If the volume attributes are managed in a [profile](https://docs.storidge.com/cio_cli/profile.html), the storage class can be expressed in compact form as:

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

<h3>Create</h3>

Save either of the storage class above to a file named 'cio-sc-nginx.yaml'. Deploy with:

`kubectl create -f cio-sc-nginx.yaml`

<h3>Inspect</h3>

Use `kubectl get sc` to confirm 'cio-nginx' storage class was deployed. Run `kubectl describe sc cio-nginx` to show details.

<h3>Delete</h3>

Run `kubectl delete -f cio-sc-nginx.yaml` to remove the storage class.
