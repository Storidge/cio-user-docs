---
title: CockroachDB on Kubernetes
description: Deploying CockroachDB with Storidge on Kubernetes cluster
lang: en-US
---

# Deploying CockroachDB with Storidge on Swarm cluster

[CockroachDB](https://www.cockroachlabs.com/docs/stable/) is a distributed SQL database system that stores persistent data that allows for fast access. In this guide, we will deploy a CockroachDB cluster on a Kubernetes cluster that uses Storidge volumes. The guide will follow parts of Cockroach Labs' [guide](https://www.cockroachlabs.com/docs/stable/orchestrate-a-local-cluster-with-kubernetes.html).

## Prerequisites

- Storidge [CIO](https://guide.storidge.com/getting_started/install.html) cluster with at least 3 nodes.
- Kubernetes cluster running.
- Root access enabled on your master node on your CIO and Kubernetes cluster. Everything on this guide **will be run on the master node**.
- Storidge CSI driver installed on your machine. Install from [here](https://github.com/Storidge/csi-cio).
- (Optional) Helm client installed on your master node.

## Installation

There are two ways of starting up CockroachDB. One option is to use Helm, a package manager, and the other option is to use manual installs through `curl`.

### Helm Download

Install [Helm](https://helm.sh/docs/intro/install/) on your master node. To add the CockroachDB chart repository, run:

```
$ helm repo add cockroachdb https://charts.cockroachdb.com/
```

Update the Helm chart repositories with `helm repo update`. This will update your CockroachDB chart if you are using an older version.

Create a new file called `my-values.yaml` containing the contents of [values.yaml](https://github.com/cockroachdb/helm-charts/blob/master/cockroachdb/values.yaml) in your working directory. Under `tls` (line 338), set the following:
```
tls:
  enabled: true
```

Install the CockroachDB Helm chart using your own custom release name `releaseNameHere` the `my-values.yaml` file:
```
$ helm install releaseNameHere --values my-values.yaml cockroachdb/cockroachdb
```

### Manual Download

Download the Kubernetes certificate by running the following:

```
$ curl -O https://raw.githubusercontent.com/cockroachdb/cockroach/master/cloud/kubernetes/cockroachdb-statefulset-secure.yaml
```

## Setup

CockroachDB will create three different pods. With each pod creation, it will issue a Certificate Signing Request (CSR) to be signed by the Kubernetes CA.

Confirm that the CSRs are pending:
```
$ kubectl get csr
NAME                                      AGE     SIGNERNAME                                    REQUESTOR                                                CONDITION
csr-54lqp                                 162m    kubernetes.io/kube-apiserver-client-kubelet   system:bootstrap:pbmuef                                  Approved,Issued
csr-69sfq                                 162m    kubernetes.io/kube-apiserver-client-kubelet   system:bootstrap:pbmuef                                  Approved,Issued
csr-tbdlk                                 162m    kubernetes.io/kube-apiserver-client-kubelet   system:bootstrap:pbmuef                                  Approved,Issued
default.client.root                       3m19s   kubernetes.io/legacy-unknown                  system:serviceaccount:default:test-release-cockroachdb   Pending
default.node.test-release-cockroachdb-0   3m5s    kubernetes.io/legacy-unknown                  system:serviceaccount:default:test-release-cockroachdb   Pending
default.node.test-release-cockroachdb-1   3m8s    kubernetes.io/legacy-unknown                  system:serviceaccount:default:test-release-cockroachdb   Pending
default.node.test-release-cockroachdb-2   2m56s   kubernetes.io/legacy-unknown                  system:serviceaccount:default:test-release-cockroachdb   Pending
```

Examine the CSR for the each pod and confirm the information inside of it is valid:
```
$ kubectl describe csr default.node.test-release-cockroachdb-0
Name:               default.node.test-release-cockroachdb-0
Labels:             <none>
Annotations:        <none>
CreationTimestamp:  Thu, 08 Oct 2020 00:55:58 -0400
Requesting User:    system:serviceaccount:default:test-release-cockroachdb
Signer:             kubernetes.io/legacy-unknown
Status:             Pending
Subject:
  Common Name:    node
  Serial Number:
  Organization:   Cockroach
Subject Alternative Names:
         DNS Names:     localhost
                        test-release-cockroachdb-0.test-release-cockroachdb.default.svc.cluster.local
                        test-release-cockroachdb-0.test-release-cockroachdb
                        test-release-cockroachdb-public
                        test-release-cockroachdb-public.default.svc.cluster.local
         IP Addresses:  127.0.0.1
Events:  <none>
```

Approve the CSR for each pod:
```
$ kubectl certificate approve default.node.test-release-cockroachdb-0
certificatesigningrequest.certificates.k8s.io/default.node.test-release-cockroachdb-0 approved

$ kubectl certificate approve default.node.test-release-cockroachdb-1
certificatesigningrequest.certificates.k8s.io/default.node.test-release-cockroachdb-1 approved

$ kubectl certificate approve default.node.test-release-cockroachdb-2
certificatesigningrequest.certificates.k8s.io/default.node.test-release-cockroachdb-2 approved
```

Once the CSRs are all approved, the pods can begin running. Confirm that the three pods are running:
```
$ kubectl get pods
NAME                                  READY   STATUS     RESTARTS   AGE
test-release-cockroachdb-0            0/1     Running    0          23m
test-release-cockroachdb-1            0/1     Running    0          23m
test-release-cockroachdb-2            0/1     Running    0          23m
test-release-cockroachdb-init-pkr8h   0/1     Init:0/1   0          23m
```

To initialize the CockroachDB cluster, approve the CSR for the extra `init` pod:
```
$ kubectl certificate approve default.client.root
certificatesigningrequest.certificates.k8s.io/default.client.root approved
```

Confirm that the CockroachDB cluster initialization has completed successfully. Each CockroachDB release pod should be `Running` status, and the `init` pod should be `Completed` status:
```
$ kubectl get pods
NAME                                  READY   STATUS      RESTARTS   AGE
test-release-cockroachdb-0            1/1     Running     0          34m
test-release-cockroachdb-1            1/1     Running     0          34m
test-release-cockroachdb-2            1/1     Running     0          34m
test-release-cockroachdb-init-pkr8h   0/1     Completed   0          34m
```

Confirm that persistent volumes and corresponding claims were created successfully for all 3 pods:
```
$ kubectl get pv
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                        STORAGECLASS   REASON   AGE
pvc-09bbf279-81da-4ad6-a934-cba7c6ca48de   100Gi      RWO            Delete           Bound    default/datadir-test-release-cockroachdb-2   cio-default             35m
pvc-66c2fa2a-f81e-4ea4-96ce-6983b3d8c3e8   100Gi      RWO            Delete           Bound    default/datadir-test-release-cockroachdb-1   cio-default             35m
pvc-b11cab03-6244-41f4-b893-88105f402e8e   100Gi      RWO            Delete           Bound    default/datadir-test-release-cockroachdb-0   cio-default             35m
```

## Usage

### SQL Client
CockroachDB has a built-in SQL client to execute SQL statements from the command line.

In your working directory, download CockroachDB's `client-secure.yaml` file:
```
$ curl -OOOOOOOOO \
https://raw.githubusercontent.com/cockroachdb/cockroach/master/cloud/kubernetes/client-secure.yaml
```

Access the file and assign the `serviceAccountName` value to `serviceAccountName: test-release-cockroachdb`. Using this file, launch a pod and run it indefinitely:
```
$ kubectl create -f client-secure.yaml
pod "cockroachdb-client-secure" created
```

Get a shell into the pod and start the CockroachDB built-in client:
```
$ kubectl exec -it cockroachdb-client-secure -- ./cockroach sql --certs-dir=/cockroach-certs --host=test-release-cockroachdb-public
#
# Welcome to the CockroachDB SQL shell.
# All statements must be terminated by a semicolon.
# To exit, type: \q.
#
# Server version: CockroachDB CCL v20.1.6 (x86_64-unknown-linux-gnu, built 2020/09/24 18:16:45, go1.13.9) (same version as client)
# Cluster ID: ceb7518e-ff4b-46e1-91de-74dfdf894393
#
# Enter \? for a brief introduction.
#
root@test-release-cockroachdb-public:26257/defaultdb>
```

Test out some CockroachDB SQL statements:
```
> CREATE DATABASE bank;
> CREATE TABLE bank.accounts (id INT PRIMARY KEY, balance DECIMAL);
> INSERT INTO bank.accounts VALUES (1, 1000.50);
> SELECT * FROM bank.accounts;
```

This creates a table called `bank.accounts` with values of `id` and `balance`:
```
id | balance
+----+---------+
 1 | 1000.50
(1 row)
```

Create a user profile with a password. This can be used to access the Admin UI:
```
> CREATE USER roach WITH PASSWORD 'Q7gc8rEdS';
```

Quit the SQL shell and pod with `\q`.

### Admin UI

Start the CockroachDB SQL client:
```
$ kubectl exec -it cockroachdb-client-secure -- ./cockroach sql --certs-dir=/cockroach-certs --host=cockroachdb-public
```

Grant a user called `roach` admin role:
```
> GRANT admin TO roach;
```

Exit the SQL shell and pod with `\q`. In a new window, port forward from local machine to a CockroachDB pod:

```
$ kubectl port-forward test-release-cockroachdb-0 8080

Forwarding from 127.0.0.1:8080 -> 8080
```

Pull up a browser at `https://localhost:8080` and log in with the user profile created earlier. Verify that all nodes have joined the cluster under `View nodes list` and check that the `bank` is listed under `Databases`.

## Teardown

To get rid of all running CockroachDB instances, delete all CockroachDB-related services, statefulsets, and pods. Check with the following commands:
```
$ kubectl get services
$ kubectl get statefulsets
$ kubectl get pods
```
