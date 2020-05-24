---
title: Minikube and Storidge
description: Testing Storidge persistent storage with Minikube
lang: en-US
---

# Testing Storidge on Minikube

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

Run `docker version` to confirm both the client and server are running.

Kubernetes recommends systemd as the Docker cgroup driver. See guide at https://kubernetes.io/docs/setup/cri/ for Centos/RHEL installs.

```
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF

mkdir -p /etc/systemd/system/docker.service.d
systemctl daemon-reload
systemctl restart docker
```

### Install kubectl

Install the kubectl binary with curl on Linux.
```
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
chmod +x ./kubectl
mv ./kubectl /usr/local/bin/kubectl
kubectl version
```

Add dependency
```
apt-get install -y conntrack
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

When running minikube inside a VM, specify the `none` driver to skip creation of an additional VM layer.
```
minikube start --vm-driver=none
```

Minikube provides basic commands to start, stop, get status and delete the cluster. Configure `none` as default driver so you can just run `minikube start` when restarting the cluster.
```
minikube config set vm-driver none
```

### Install Storidge CIO

Install the Storidge CIO software with convenience script. This will check your Linux distro, download matching tarball, and install.
```
curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash
```

### Create Storidge cluster

Run `cioctl create --kubernetes --single-node` to initialize a single node Storidge cluster. This creates a storage abstraction layer for persistent storage.
```
root@ubuntu18:~# cioctl create --kubernetes --single-node
Key Generation setup
<13>May 23 22:45:09 cluster: initialization started
<13>May 23 22:45:11 cluster: WARNING: No user license info specified, using default
<13>May 23 22:45:12 cluster: Start node initialization
<13>May 23 22:45:13 node: Clear drives
<13>May 23 22:45:22 node: Load module
<13>May 23 22:45:22 node: Add node backup relationship
<13>May 23 22:45:22 node: Check drives
Adding disk /dev/sdb SSD to storage pool
Adding disk /dev/sdc SSD to storage pool
Adding disk /dev/sdd SSD to storage pool
<13>May 23 22:45:33 node: Collect drive IOPS and BW: Total IOPS:23955  Total BW:1102.8MB/s
<13>May 23 22:45:33 node: Initializing metadata
<13>May 23 22:45:33 cluster: Node initialization completed
<13>May 23 22:45:35 cluster: Synchronizing license
<13>May 23 22:45:35 cluster: Start cio daemon
<13>May 23 22:45:39 cluster: Succeed: Add vd0: Type:2-copy, Size:20GB
<13>May 23 22:45:41 cluster: MongoDB ready
<13>May 23 22:45:42 cluster: Synchronizing VID files
<13>May 23 22:45:58 cluster: Starting API
<13>May 23 22:46:06 cluster: Starting Portainer and Agent
```

### Deploy Storidge CSI driver

Deploy the Storidge CSI driver. This will also deploy a default storage class (cio-default). This example assumes Kubernetes 1.16.
```
root@ubuntu-16:~# kubectl create -f https://raw.githubusercontent.com/Storidge/csi-cio/master/deploy/releases/csi-cio-v1.3.0.yaml
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

For Kubernetes 1.15 and below, run:
```
kubectl create -f https://raw.githubusercontent.com/Storidge/csi-cio/master/deploy/releases/csi-cio-v1.1.0.yaml
```

::: tip
If you hit error message "The connection to the server 192.168.3.99:8443 was refused - did you specify the right host or port?", run `minikube delete`, then `minikube start`
:::

### Verify CSI driver deployed

Verify the Storidge volume plugin (csi-cio) is deployed.
```
root@minikube:~# kubectl get ds -A
NAMESPACE     NAME         DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
kube-system   csi-cio      1         1         1       1            1           <none>                        18s
kube-system   kube-proxy   1         1         1       1            1           beta.kubernetes.io/os=linux   7d20h
```

Verify the Storidge controller plugin is deployed.
```
root@minikube:~# kubectl get sts -A
NAMESPACE     NAME                 READY   AGE
kube-system   csi-cio-controller   1/1     26s
```

Verify the csi-cio pods are running.
```
root@minikube:~# kubectl get pods -A
NAMESPACE              NAME                                         READY   STATUS    RESTARTS   AGE
kube-system            coredns-5644d7b6d9-p44kv                     1/1     Running   11         7d20h
kube-system            coredns-5644d7b6d9-pm9wq                     1/1     Running   10         7d20h
kube-system            csi-cio-5c65s                                2/2     Running   0          2m37s
kube-system            csi-cio-controller-0                         3/3     Running   0          2m27s
kube-system            etcd-minikube                                1/1     Running   10         7d20h
kube-system            kube-addon-manager-minikube                  1/1     Running   10         7d20h
kube-system            kube-apiserver-minikube                      1/1     Running   10         7d20h
kube-system            kube-controller-manager-minikube             1/1     Running   9          7d4h
kube-system            kube-proxy-4pzpd                             1/1     Running   10         7d20h
kube-system            kube-scheduler-minikube                      1/1     Running   10         7d20h
kube-system            storage-provisioner                          1/1     Running   12         7d20h
```

### Next steps

With the Storidge cluster deployed, create storage classes and persistent volumes claims, or deploy pods with persistent storage. See [examples from GitHub repo](https://github.com/Storidge/csi-cio).

Check our [guide](https://guide.storidge.com/) or [documentation](https://docs.storidge.com/) for more information, and connect with us on our [Slack channel](http://storidge.com/join-cio-slack/) for support.
