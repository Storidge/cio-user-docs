---
title: Storidge with Minikube
description: Cookbook for testing Storidge persistent storage with Minikube
lang: en-US
---

# Storidge with Minikube

Minikube is a lightweight Kubernetes implementation which deploys a simple cluster containing only one node. Deploying Storidge alongside a Minikube single node cluster, provides a quick way to get started with persistent storage on Kubernetes.

In this guide, we'll step through a Minikube installation with Storidge in a VirtualBox instance on your personal computer.

### Prerequisites

Configure your virtual machine for:
1. 2 CPUs - minimum of 2 CPUs required by Kubernetes
2. 4GB memory - 2GB works but will limit capabilities
3. 3 x 100GB drives - select dynamically allocated disks to minimize capacity used

### Install Docker

Install Docker for the Linux distribution you are using.

[Docker on CentOS](https://docs.docker.com/install/linux/docker-ce/centos/)

[Docker on Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

### Install kubectl

Install the kubectl binary with curl on Linux.
```
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
chmod +x ./kubectl
mv ./kubectl /usr/local/bin/kubectl
kubectl version
```

### Install Minikube

Install the Minikube binary via direct download, and add the executable to your path.
```
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
mkdir -p /usr/local/bin/
install minikube /usr/local/bin/
```

### Start Minikube with none driver for VirtualBox

When running minikube inside a VM, specify the none driver to skip creation of an additional VM layer.
```
minikube start --vm-driver=none
```

Set `none` as default driver.
```
minikube config set vm-driver none
```

### Install Storidge CIO

Install the Storidge CIO software with convenience script. This will check your Linux distro, download matching tarball, and install.
```
curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash
```

### Create Storidge cluster

Run `cioctl create --single-node` to initialize a single node Storidge cluster. This creates a storage abstraction layer for persistent storage.
```
root@ubuntu-16:~# cioctl create --single-node
<13>Nov 20 11:09:18 cluster: initialization started
<13>Nov 20 11:09:19 cluster: Start node initialization
<13>Nov 20 11:09:21 node: Clear drives
<13>Nov 20 11:09:23 node: Load module
<13>Nov 20 11:09:23 node: Add node backup relationship
<13>Nov 20 11:09:27 node: Check drives
Adding disk /dev/sdb SSD to storage pool
Adding disk /dev/sdc SSD to storage pool
Adding disk /dev/sdd SSD to storage pool
<13>Nov 20 11:09:38 node: Collect drive IOPS and BW: Total IOPS:43196  Total BW:2042.2MB/s
<13>Nov 20 11:09:39 node: Initializing metadata
<13>Nov 20 11:09:39 cluster: Node initialization completed
<13>Nov 20 11:09:39 cluster: Start cio daemon
<13>Nov 20 11:09:43 cluster: Succeed: Add vd0: Type:2-copy, Size:20GB
<13>Nov 20 11:09:45 cluster: MongoDB ready
<13>Nov 20 11:09:46 cluster: Synchronizing VID files
```

### Start API

Start the Storidge API server.
```
cio-api &
```

### Deploy Storidge CSI driver

Deploy the Storidge CSI driver. This will also deploy a default storage class (cio-default).
```
root@ubuntu-16:~# kubectl create -f https://raw.githubusercontent.com/Storidge/csi-cio/master/deploy/releases/csi-cio-v1.2.0.yaml
csidriver.storage.k8s.io/csi.cio.storidge.com created
storageclass.storage.k8s.io/cio-default created
statefulset.apps/csi-cio-controller created
serviceaccount/csi-cio-controller-sa created
clusterrole.rbac.authorization.k8s.io/csi-cio-provisioner-role created
clusterrolebinding.rbac.authorization.k8s.io/csi-cio-provisioner-binding created
clusterrole.rbac.authorization.k8s.io/csi-cio-attacher-role created
clusterrolebinding.rbac.authorization.k8s.io/csi-cio-attacher-binding created
daemonset.apps/csi-cio created
serviceaccount/csi-nodeplugin-sa created
clusterrole.rbac.authorization.k8s.io/csi-cio-driver-registrar-role created
clusterrolebinding.rbac.authorization.k8s.io/csi-cio-driver-registrar-binding created
```

### Verify CSI driver deployed

Verify the csi-cio pods are running.
```
root@ubuntu-16:~# kubectl get po -A
NAMESPACE     NAME                               READY   STATUS    RESTARTS   AGE
kube-system   coredns-5644d7b6d9-p44kv           1/1     Running   0          15h
kube-system   coredns-5644d7b6d9-pm9wq           1/1     Running   0          15h
kube-system   csi-cio-2hzn9                      2/2     Running   0          15h
kube-system   csi-cio-controller-0               3/3     Running   0          15h
kube-system   etcd-minikube                      1/1     Running   0          15h
kube-system   kube-addon-manager-minikube        1/1     Running   0          15h
kube-system   kube-apiserver-minikube            1/1     Running   0          15h
kube-system   kube-controller-manager-minikube   1/1     Running   0          15h
kube-system   kube-proxy-4pzpd                   1/1     Running   0          15h
kube-system   kube-scheduler-minikube            1/1     Running   0          15h
kube-system   storage-provisioner                1/1     Running   0          15h
```

### Next steps

With the Storidge cluster deployed, create storage classes and persistent volumes claims, or deploy pods with persistent storage. See [examples from GitHub repo](https://github.com/Storidge/csi-cio).

Check our [guide](https://guide.storidge.com/) or [documentation](https://docs.storidge.com/) for more information, and connect with us on our [Slack channel](http://storidge.com/join-cio-slack/) for support.
