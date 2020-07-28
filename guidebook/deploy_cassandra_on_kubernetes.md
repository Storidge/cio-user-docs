---
title: Cassandra Database on Kubernetes
description: Deploying Cassandra with Storidge on Kubernetes
---

# Deploying Cassandra database with Storidge on Kubernetes

Apache Cassandra is a NoSQL database that we can use to deal with large amounts of data across a cluster. It has Docker support and can be deployed and accessed through Portainer in conjunction with Storidge CIO software. This guide steps through deploying Cassandra with Storidge volumes on a Kubernetes cluster.

# **Prerequisites**

- Storidge CIO software installed and running on your machine. Install from [here](https://guide.storidge.com/getting_started/install.html).

- Storidge CSI driver installed on your machine. Install from [here](https://github.com/Storidge/csi-cio)

- Familiarity with with [Cassandra](https://cassandra.apache.org/doc/latest/).

- Familiarity with Kubernetes and a Kubernetes cluster running on your machine.

# **Setup**

To deploy Cassandra, we need to create a `Service` and `StatefulSet`. First, create a Service file called `cassandra-service.yaml` in your working directory containing the following:

```
apiVersion: v1
kind: Service
metadata:
  labels:
    app: cassandra
  name: cassandra
spec:
  clusterIP: None
  ports:
  - port: 9042
  selector:
    app: cassandra
```

This Service will be used for communication and DNS lookups between your Cassandra Pods. After creating this file, run a `kubectl apply -f cassandra-service.yaml` to create the Service.

Validate Cassandra with `kubectl get svc cassandra` to make sure your Cassandra service exists. Next, create a StatefulSet file called `cassandra-statefulset.yaml` containing the following:

```
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: cassandra
  labels:
    app: cassandra
spec:
  serviceName: cassandra
  replicas: 3
  selector:
    matchLabels:
      app: cassandra
  template:
    metadata:
      labels:
        app: cassandra
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: cassandra
        image: gcr.io/google-samples/cassandra:v13
        imagePullPolicy: Always
        ports:
        - containerPort: 7000
          name: intra-node
        - containerPort: 7001
          name: tls-intra-node
        - containerPort: 7199
          name: jmx
        - containerPort: 9042
          name: cql
        resources:
          limits:
            cpu: "500m"
            memory: 1Gi
          requests:
            cpu: "500m"
            memory: 1Gi
        securityContext:
          capabilities:
            add:
              - IPC_LOCK
        lifecycle:
          preStop:
            exec:
              command: 
              - /bin/sh
              - -c
              - nodetool drain
        env:
          - name: MAX_HEAP_SIZE
            value: 512M
          - name: HEAP_NEWSIZE
            value: 100M
          - name: CASSANDRA_SEEDS
            value: "cassandra-0.cassandra.default.svc.cluster.local"
          - name: CASSANDRA_CLUSTER_NAME
            value: "K8Demo"
          - name: CASSANDRA_DC
            value: "DC1-K8Demo"
          - name: CASSANDRA_RACK
            value: "Rack1-K8Demo"
          - name: POD_IP
            valueFrom:
              fieldRef:
                fieldPath: status.podIP
        readinessProbe:
          exec:
            command:
            - /bin/bash
            - -c
            - /ready-probe.sh
          initialDelaySeconds: 15
          timeoutSeconds: 5
        # These volume mounts are persistent. They are like inline claims,
        # but not exactly because the names need to match exactly one of
        # the stateful pod volumes.
        volumeMounts:
        - name: cassandra-data
          mountPath: /cassandra_data
  # These are converted to volume claims by the controller
  # and mounted at the paths mentioned above.
  # do not use these in production until ssd GCEPersistentDisk or other ssd pd
  volumeClaimTemplates:
  - metadata:
      name: cassandra-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: cio-default
      resources:
        requests:
          storage: 1Gi
---
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: cio-default
provisioner: csi.cio.storidge.com
parameters:
  type: "ssd"
```

This StatefulSet file will use our CSI driver (cio-default) as the `StorageClass` and create 3 Cassandra instances with a timeout of 10 seconds each. Run `kubectl apply -f cassandra-statefulset.yaml` to apply the StatefulSet. 

We can check if our StatefulSet was created with `kubectl get statefulset cassandra` and check our pods with `kubectl get pods`. The pods should look something like the following once they are all running:

```
NAME          READY     STATUS              RESTARTS   AGE
cassandra-0   1/1       Running             0          1m
cassandra-1   0/1       Running             0          3m
cassandra-2   0/1       Running             0          7m
```

We can check the status of the Cassandra cluster by running `kubectl exec -it cassandra-0 -- nodetool status`. This calls the Cassandra nodetool on the first pod.

# **Teardown**
To delete everything in the Cassandra StatefulSet, run the following:

```
grace=$(kubectl get pod cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
  && kubectl delete statefulset -l app=cassandra \
  && echo "Sleeping ${grace} seconds" 1>&2 \
  && sleep $grace \
  && kubectl delete persistentvolumeclaim -l app=cassandra
```

Finally, delete the Cassandra service with the following:

```
kubectl delete service -l app=cassandra
```