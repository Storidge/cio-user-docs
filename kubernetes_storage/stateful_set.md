---
title: StatefulSets with Storidge
description: Demonstrate how to create, scale up/down, delete, and update the Pods of StatefulSets.
lang: en-US
---
# StatefulSet Basics

StatefulSets are intended to be used with stateful applications and distributed systems. They provide persistence for your workload using storage volumes and maintaining a sticky identity for each pod that is deployed. Therefore, if a pod fails, the persistent pod identifier makes it easier to match existing volumes to new pods that replace the ones that failed.

Note: A limitation of using StatefulSet is that deleting and/or scaling down pods will not delete the volumes associated.

The example below will demonstrate the steps to:
 1. Create a StatefulSet
 2. Scale up and down pod replicas
 3. Delete a StatefulSet

## StatefulSet example

<h3>1. Create a StatefulSet </h3>

Save example below as file 'web.yaml'.

Note: To see how to create Storage Classes, see [Storage Classes](https://docs.storidge.com/kubernetes_storage/storage_classes.html) for details.

```
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx 
  serviceName: "nginx"
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: k8s.gcr.io/nginx-slim:0.8
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: cio-default
      resources:
        requests:
          storage: 1Gi
```

Create StatefulSet defined in 'web.yaml':
```
kubectl apply -f web.yaml
```

Open a second terminal to verify StatefulSet's pods are created:
```
root@master:~# kubectl get pods -o wide
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          1m
web-1     1/1       Running   0          1m
```

<h3>2. Scale up pod replicas</h3>

```
root@master:~# kubectl get sts
NAME    DESIRED     CURRENT     AGE
web     2           2           1m
```

Scale up pod replicas:
```
kubectl scale sts web --replicas=5
```

Verify replicas are created:
```
root@master:~# kubectl get pods -o wide
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          3m
web-1     1/1       Running   0          3m
web-2     1/1       Running   0          1m
web-3     1/1       Running   0          1m
web-4     1/1       Running   0          1m
```

<h3>3. Scale down pod replicas </h3>

```
root@master:~# kubectl get sts
NAME    DESIRED     CURRENT     AGE
web     5           5           3m
```

Scale down pod replicas:
```
kubectl scale sts web --replicas=3
```

Verify replicas are removed:
```
root@master:~# kubectl get pods -o wide
NAME      READY     STATUS         RESTARTS   AGE
web-0     1/1       Running        0          5m
web-1     1/1       Running        0          5m
web-2     1/1       Running        0          3m
web-3     1/1       Terminating    0          3m
web-4     1/1       Terminating    0          3m
```

<h3>4. Delete pod replicas </h3>

To delete the StatefulSet:
```
kubectl delete pods -l app=nginx
```

Verify pods are being deleted:
```
root@master:~# watch kubectl get pods -o wide
NAME      READY     STATUS        RESTARTS   AGE
web-0     1/1       Terminating   0          12m
web-1     1/1       Terminating   0          12m
web-2     1/1       Terminating   0          12m
```

## Clean Up

To do a complete deletion of a StatefulSet:

```
kubectl delete sts -l app=web
```

Verify pods are being deleted:
```
root@master:~# watch kubectl get pods -o wide
NAME      READY     STATUS        RESTARTS   AGE
web-0     1/1       Terminating   0          12m
web-1     1/1       Terminating   0          12m
web-2     1/1       Terminating   0          12m
```

Delete PVC's:
```
kubectl delete pvc -l app=web
```

Verify PVC are deleted:
```
root@master:~# kubectl get pvc
NAME      STATUS        VOLUME     CAPACITY    ACCESS MODES    STORAGECLASS     AGE
```


