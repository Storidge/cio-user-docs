---
title: Expand Volume capacity
description: Expand capacity of persistent volume in Kubernetes cluster
lang: en-US
---

# Expand volume capacity

This guide describes how to dynamically expand a Storidge volume (PVC) in Kubernetes.

To resize a Storidge PVC, simply edit the PVC spec and change the size. We'll use the example PVC spec (pvc-test.yaml) below to create a volume and then expand it.

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-test
spec:
  accessModes:
  - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 11Gi
  storageClassName: cio-default
```

::: tip
The StorageClass must have allowVolumeExpansion: true
:::

## Create PVC and expand size

1. Run `kubectl apply -f pvc-test.yaml` to apply the PVC spec and create a Storidge volume of size 11GiB.

2. To resize the volume, run `kubectl edit pvc pvc-test` and change the size in the PVC spec to 22Gi.

3. Save the spec and confirm the resize operation by running `kubectl describe pvc pvc-test`. You should see an event like the entry below.

```
 volume pvc-443b9c5a-d92f-4171-a937-7362470c0f68
  Normal   VolumeResizeSuccessful  20s (x2 over 50s)  external-resizer csi.cio.storidge.com                              Resize volume succeeded
```

::: tip
Storidge volumes support automatic capacity expansion to minimize operator effort, and chance for application disruptions. See [example]((https://guide.storidge.com/getting_started/autoexpand.html) to enable this service. 
:::
