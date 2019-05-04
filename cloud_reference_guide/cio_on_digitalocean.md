# Digital Ocean Cloud

This guide shows you how to easily deploy Storidge's Container IO (CIO) software on the DigitalOcean cloud platform. The steps below brings up a storage cluster in a just a few minutes. 

## Prerequisites 
First, you'll need to setup the cluster resources to orchestrate: 
- A minimum of three nodes (aka droplets) are required to form a cluster. However four nodes are needed for operational redundancy.
- Each node will need four drives minimum. One drive for the boot volume and three data drives for CIO to ensure data redundancy use. Note that the Digital Ocean block storage service is only available in regions AMS3, BLR1, FRA1, LON1, NYC1, NYC3, SFO2, SGP1 and TOR1. 
- Enable private networking for node-to-node networking within a region 
- The ssh key/pem file used to launched the droplets 

## Get droplet key
To secure communication among the cluster nodes, the installation script will generate SSH keypairs for the cluster and install on each node. The SSH key 
used to the launched the droplets are used to enable initial communication. The SSH key/pem file is 
required when creating the cluster the first time and should be removed after. 

Download the SSH key/pem file to the install directory of each node. You may need to run `chmod 600 <ssh key>.pem` to set 
the correct permissions for the key. 

## Install cio software
Storidge's cio software currently supports CentOS 7.5, 7.6 (3.10 kernel), RHEL 7 (3.10 kernel) and Ubuntu 16.04LTS (4.4 kernel). After verifying you have a supported distribution, run the convenience script below to begin installation.

`curl -fsSL ftp://download.storidge.com/pub/free/demo | sudo bash`

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

**Install Additional Nodes**

Add more nodes to the cluster to increase capacity and enable high availability for your applications. Repeat the convenience script installation on all nodes that will be members of the cluster.

## Configure cluster 
With the CIO software installed on all nodes, the next step is to create a cluster and then initialize the cluster for use. As part of cluster creation, CIO will automatically discover and add drive resources from each node. Drives that are partitioned or have a file system will not be added to the storage pool. 

Verify you are in the directory to where the SSH key/pem file is located. 

Start the CIO cluster with the `cioctl create` command. Example:
```
root@u1:~# cioctl create
There are multiple IP addresses on this system (167.99.163.116 on eth0, 10.46.0.6 on eth0, 10.138.136.13 on eth1).
Re-run the create command by specifying the IP address with the --ip flag, e.g.:
    cioctl create --ip 167.99.163.116 
```
The first node where the `cioctl create` command runs becomes the sds node. 

When there are multiple network interfaces and IP addresses, the `cioctl create` command will suggest the first IP address. Use the --ip flag to change to the IP address on the private network, e.g. address on eth1 interface above.
```
root@u1:~# cioctl create --ip 10.138.136.13
Cluster started. The current node is now the sds controller node. To add a storage node to this cluster, run the following command:
    cioctl join 10.138.136.13 root 01c64a41

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init 01c64a41 
```
The output of create includes a command to join new nodes to the cluster. Add new nodes to cluster with the `cioctl join` command. Example to add new node u2:
```
root@u2:~# cioctl join 10.138.136.13 root 01c64a41
There are multiple IP addresses on this system (167.99.171.44 on eth0, 10.46.0.7 on eth0, 10.138.216.24 on eth1).
Re-run the join command by specifying the IP address with the --ip flag, e.g.:
    cioctl join 10.138.136.13 root 01c64a41 --ip 10.138.216.24 
```
If there are multiple network interfaces and IP addresses, the `cioctl join` command will suggest the IP address of the corresponding 
network interface.
```
root@u2:~# cioctl join 10.138.136.13 root 01c64a41 --ip 10.138.216.24
Adding this node to cluster as a storage node
Using PEM file: ./do-test.pem; This file may be removed after the cluster is created. 
```
**Join additional nodes**

Repeat the `cioctl join` command to add other nodes to the cluster. 

## Initialize cluster 
Return to the first node (sds node) and run the `cioctl init` command to complete setup of the cluster.
```
root@u1:~# cioctl init 01c64a41
Configuring docker swarm with portainer.
Using PEM file: ./do-test.pem; This file may be removed after the cluster is created.
<13>Apr 18 07:25:58 cluster: initialization started
...
...
    
<13>Apr 18 07:27:53 cluster: Start cio daemon
<13>Apr 18 07:28:00 cluster: Succeed: Add vd0: Type:3-copy, Size:20GB
<13>Apr 18 07:28:01 cluster: MongoDB ready
<13>Apr 18 07:28:03 cluster: Synchronizing VID files 
```
## Ready to use 
At the end of initialization, you have a cio cluster running. A Swarm cluster will be automatically configured if one is not already 
running. Run the `docker node ls` command to confirm. 

In addition, the Portainer UI is launched in a container. Verify with:
```
root@u1:~# docker service ps portainer
ID NAME IMAGE NODE DESIRED STATE CURRENT STATE ERROR PORTS
uq66v8w6pcfl portainer.1 portainer/portainer:latest u1 Running Running 5 minutes ago 
```
Login to the container management UI by pointing your browser at any node IP and port 9000. You can check the node 
IPs with the `cio node ls` command:
```
root@u1:~# cio node ls
NODENAME IP NODE_ID ROLE STATUS
u1 10.138.136.13 c40c92b5 sds normal
u2 10.138.216.24 d584aa55 backup1 normal
u3 10.138.232.7 4d31ccf3 backup2 normal
u4 10.138.180.227 b0632579 standard normal 
```
In this example, point the browser at 10.138.136.13:9000, where 9000 is the default Portainer service port number.

