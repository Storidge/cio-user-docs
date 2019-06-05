# Cluster Setup

## **Prerequisites**

To run through this guide, you need the following:

- [Four networked Linux hosts](#four-networked-hosts)
- [One boot drive and three data drives per host](#storage-resources-on-hosts)
- [IP address of the sds node ](#ip-address-of-the-sds-node)
- [Open ports between hosts](#open-ports-between-hosts)
- [CIO software installed](#install-cio)


## **Four networked hosts**

This guide requires four Linux hosts which can communicate over a network. They can be physical machines, virtual servers, or cloud instances. While three nodes minimum is required to form a cluster, four nodes minimum are recommended for operating redundancy. 

You can use `docker-machine create` to provision virtual servers. Here are examples using [VirtualBox](https://rominirani.com/docker-swarm-tutorial-b67470cf8872) and [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-create-a-cluster-of-docker-containers-with-docker-swarm-and-digitalocean-on-centos-7).

The first node used takes the sds controller role. Roles for backup nodes and storage node are assigned automatically during cluster creation.  

**Note:**  You can follow many of the steps to test single-node clusters. In this case, you need only one host. While multi-node commands do not work, you can initialize a cluster, create persistent volumes and run stateful containers and services.  

## **Storage resources on hosts**

Each host will require one boot drive and a minimum of three [data drives](http://storidge.com/docs/data-drive-requirements/). The CIO software aggregates the data drives into a storage pool to deliver data protection and availability across drive and node failures. 

## **IP address of the sds node**

The IP address must on a network interface available to the host operating system. Since all nodes in the cluster need to connect to the sds node at this IP address,  you should use a fixed IP address. Use `ifconfig` on Linux to see a list of available network interfaces. 

**Note:** The `cioctl create` command will suggest the first IP address found if the host is multi-homed, i.e. have more than one network connection. You can change to the desired IP address using the `--ip` flag. 

## **Open ports between hosts**

The following ports must be available for CIO to run.

- **TCP ports 2505, 9997, 9998, 9999 ** for cluster communications
- **TCP** port **3260** for backend storage traffic 

The following ports are needed for Docker Swarm. 

- **TCP port 2377** for cluster management communications
- **TCP** and **UDP port 7946** for communication among nodes
- **UDP port 4789** for overlay network traffic



## **Install CIO** 

A convenience script is provided for installing the free version of CIO into development environments quickly and non-interactively. This is recommended for dev environments only, as root permissions are required to run them. This script will detect your Linux distribution and version, and install all dependencies and suggestions of the package manager without asking for confirmation.

CIO currently supports CentOS 7.6 (3.10 kernel), RHEL 7 (3.10 kernel) and Ubuntu 16.04LTS (4.4 kernel for servers). Note that the desktop edition of Ubuntu 16.04 lists a 4.15 kernel, which is not supported. 

After verifying you have a supported distribution, run the convenience script below to begin installation.
```
curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash
```

Example:

```
root@c1:~# curl -fsSL ftp://download.storidge.com/pub/free/demo | sudo bash
Started installing release 2148 at Tue Jan 30 12:47:26 PST 2018
Loading cio software for: u16  (4.4.0-104-generic)
...
...
...
latest: Pulling from portainer/portainer
Digest: sha256:232742dcb04faeb109f1086241f290cb89ad4c0576e75197e902ca6e3bf3a9fc
Status: Image is up to date for portainer/portainer:latest
Finished at Tue Jan 30 12:48:04 PST 2018
cio software installation complete. cio requires a minimum of 3 local drives per node for data redundancy

Please verify local drives are available, then run 'cioctl create' command on primary node to start a new cluster

```

#### **Add nodes**

Repeat the same CIO installation on all nodes that will be members of the cluster.
