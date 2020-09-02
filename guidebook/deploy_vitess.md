---
title: Vitess Operator on Kubernetes
description: Deploying Vitess with Storidge on Kubernetes
---

# Deploying Vitess Operator with Storidge on Kubernetes

[Vitess](https://vitess.io/) is a database clustering system that provides highly scalable and manageable MySQL services. It provides its own operator for Kubernetes, allowing the user to install it under their own Kubernetes cluster as a pod.

## **Prerequisites**
- CentOS 7 as a main operating system. Make sure SELINUX is disabled across all VMs.

- Storidge CIO cluster running on your machine. Install [here](https://docs.storidge.com/kubernetes_storage/install.html#install-storidge).

- Kubernetes cluster running on your machine.

- Storidge CSI driver installed on your master node. Install [here](https://docs.storidge.com/kubernetes_storage/initialize_cluster.html#_4-install-csi-driver).

- Familiarity with Kubernetes.

- MySQL and vtctlclient installed on your master node. Install with `yum install mysql`

- The Vitess `vtctlclient` installed on your master node. Install with `go get vitess.io/vitess/go/cmd/vtctlclient` if Golang is installed on your machine. Alternatively, extract the `vtctlclient` from the latest [Vitess release](https://github.com/vitessio/vitess/releases).


## **Setup**
After making sure that there is an active CIO and Kubernetes cluster present across your machine, check if the CSI driver is created. If the Storidge CSI driver has not been applied to the master node, run `kubectl get sc` and make sure that there is a StorageClass with provisioner name `csi.cio.storidge.com`. It should look something like this:

```
NAME                    PROVISIONER            RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
cio-default (default)   csi.cio.storidge.com   Delete          Immediate           true                   8s
```

We will be working with Vitess's sample repositories to deploy our cluster. On your main node, run `git clone https://github.com/vitessio/vitess.git` and `cd vitess/examples/operator` to access an example setup.

Next, apply the Vitess Operator with `kubectl apply -f operator.yaml` and apply the cluster sample with `kubectl apply -f 101_initial_cluster.yaml`. The pods created will bind with the `csi.cio.storidge.com` StorageClass, effectively applying Storidge's CSI driver. Verify that your cluster has been created with `kubectl get pods`. It will display something like the following:

```
[root@c1 operator]# kubectl get pods
NAME                                             READY   STATUS             RESTARTS   AGE
example-etcd-faf13de3-1                          1/1     Running            0          60s
example-etcd-faf13de3-2                          1/1     Running            0          60s
example-etcd-faf13de3-3                          1/1     Running            1          60s
example-vttablet-zone1-2469782763-bfadd780       3/3     Running		    4          60s
example-vttablet-zone1-2548885007-46a852d0       3/3     Running		    4          60s
example-zone1-vtctld-1d4dcad0-cf87d58cb-j769v    1/1     Running		    2          60s
example-zone1-vtgate-bc6cde92-685d69cc5c-tgqf9   1/1     Running		    2          60s
vitess-operator-6b495ddbb-ml5lg                  1/1     Running            0          78s
```

We can also confirm that CIO has created the necessary volumes by comparing the PVCs created in `kubectl get pvc` and `cio volume list:`

```
$ cio volume list
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
c1                   vd1       SSD   2-copy                  20GB  994c2ddf  portainer_portainer
c2                   vd2       SSD   2-copy                   1GB  2fa7ed70  pvc-5018d5c7-3392-4eba-8653-843b5adfe329
c2                   vd3       SSD   2-copy                  10GB  9661f218  pvc-de0af963-3e03-4cdb-a7d1-2c6b1adb9db2
c3                   vd4       SSD   2-copy                   1GB  f86929ea  pvc-d1fa88df-5516-447b-a60a-61cfcac9b469
c4                   vd5       SSD   2-copy                   1GB  ac59b5ef  pvc-2e94383a-9922-4517-9405-83d90b2c587a
c4                   vd6       SSD   2-copy                  10GB  3c945067  pvc-583410da-29a3-4de7-bb67-fde70ab68ce1

$ kubectl get pvc
NAME                                         STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
example-etcd-faf13de3-1                      Bound    pvc-5018d5c7-3392-4eba-8653-843b5adfe329   1Gi        RWO            cio-default    12m
example-etcd-faf13de3-2                      Bound    pvc-d1fa88df-5516-447b-a60a-61cfcac9b469   1Gi        RWO            cio-default    12m
example-etcd-faf13de3-3                      Bound    pvc-2e94383a-9922-4517-9405-83d90b2c587a   1Gi        RWO            cio-default    12m
example-vttablet-zone1-2469782763-bfadd780   Bound    pvc-583410da-29a3-4de7-bb67-fde70ab68ce1   10Gi       RWO            cio-default    12m
example-vttablet-zone1-2548885007-46a852d0   Bound    pvc-de0af963-3e03-4cdb-a7d1-2c6b1adb9db2   10Gi       RWO            cio-default    12m
```

## **Port Forwarding, Schema Creation, and Cluster**

If we want to have MySQL always connect to Vitess in a session, set aliases for MySQL and vtctlclient like so:

```
./pf.sh &
alias vtctlclient="vtctlclient -server=localhost:15999"
alias mysql="mysql -h 127.0.0.1 -P 15306 -u user"
```

To create our initial schema and connect to our MySQL cluster, open up a new instance of your master node, `cd` to the location of vtctlclient (usually `vitess/bin/vtctlclient`), and run the following:

```
$ ./vtctlclient ApplySchema -sql="$(cat create_commerce_schema.sql)" commerce
$ ./vtctlclient ApplyVSchema -vschema="$(cat vschema_commerce_initial.json)" commerce
```

While port forwarding is happening, we can run `mysql` in another separate window of the master node:

```
#Cluster connect
$ mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.7.9-Vitess MySQL Community Server (GPL)

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+-----------+
| Databases |
+-----------+
| commerce  |
+-----------+
1 row in set (0.00 sec)
```
