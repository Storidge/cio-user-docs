# AWS

This guide shows you how to easily deploy Storidge's Container IO (CIO) software using AWS. Follow the steps below to bring up a storage cluster in just a few minutes.

## Prerequisites
First, you'll need to setup the cluster resources to orchestrate:
- A minimum of three nodes (aka instances) are required to form a cluster. However, four nodes are needed for operational redundancy.
- Each node will need a minimum of four drives: one for the boot volume and three data drives for CIO to ensure data redundancy.
- A security group which enables all inbound traffic within the cluster.

## Install cio software
Storidge's CIO software currently supports CentOS 7.6 (3.10 kernel), RHEL 7 (3.10 kernel) and Ubuntu 16.04LTS (4.4 kernel). Note that the desktop edition of Ubuntu 16.04 lists a 4.15 kernel which is not supported.

After verifying you have a supported distribution, run the convenience script below on each node to begin installation.

`curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash`

Example:
```
root@a1:~# curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash
Started installing release 2773 at Fri May 10 16:57:37 UTC 2019
Loading cio software for: u16  (4.4.0-1075-aws)
...
...
...
latest: Pulling from portainer/portainer
Digest: sha256:d6cc2c20c0af38d8d557ab994c419c799a10fe825e4aa57fea2e2e507a13747d
Status: Image is up to date for portainer/portainer:latest
Finished at Fri May 10 16:57:53 UTC 2019
cio software installation complete. cio requires a minimum of 3 local drives per node for data redundancy

Please verify local drives are available, then run 'cioctl create' command on primary node to start a new cluster
```

**Install Additional Nodes**

Add more nodes to the cluster to increase capacity and enable high availability for your applications. Repeat the convenience script installation on all nodes that will be members of the cluster.

## Configure cluster
With the CIO software installed on all nodes, the next step is to create a cluster and initialize it for use. As part of cluster creation, CIO will automatically discover and add drive resources from each node.

Note: Drives that are partitioned or have a file system will not be added to the storage pool.

Verify you are in the same directory as the SSH key/pem file. Then start the CIO cluster with the `cioctl create` command on the node you wish to be the leader of the cluster. When the `cioctl create` command is run it generates two subsequent commands. The `cioctl join` command should be repeated on every node other than the SDS that will be part of the cluster. Once all the nodes have been added, run the `cioctl init` command on the SDS node to initialize the cluster.
```
root@a1:~# sudo cioctl create
Cluster started. The current node is now the sds controller node. To add a storage node to this cluster, run the following command:
    cioctl join 172.31.20.244 root 5855963b

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init 5855963b
```

Note: If there are multiple network interfaces on the node you will be prompted to specify the IP address you would like CIO to use. The node on which the `cioctl create` command runs becomes the SDS node. This is an example of such a case:
```
root@u1:~# cioctl create
There are multiple IP addresses on this system (167.99.163.116 on eth0, 10.46.0.6 on eth0, 10.138.136.13 on eth1).
Re-run the create command by specifying the IP address with the --ip flag, e.g.:
    cioctl create --ip 167.99.163.116
```

Running `cioctl join` on a node with multiple network interfaces will result in the same IP prompt as running `cioctl create`.
```
root@a2:~# cioctl join 172.31.20.244 root 5855963b
Adding this node to cluster as a storage node
```

## Initialize cluster
Running the `cioctl init` command on the SDS node completes the cluster setup:
```
root@a1:~# cioctl init 5855963b
Configuring Docker Swarm cluster with Portainer service
cluster: Setup AWS persistent hostname for sds node
Using PEM file: ./aws.pem;  This file should be removed after the cluster is created
cluster: initialization started
...
...
...
cluster: Start cio daemon
cluster: Succeed: Add vd0: Type:2-copy, Size:20GB
cluster: MongoDB ready
cluster: Synchronizing VID files
cluster: Starting API
```

## Ready to use
At the end of initialization, you have a CIO cluster running. A Docker Swarm cluster will be automatically configured if one is not already
running. Run the `docker node ls` and `cio node ls` commands to confirm:

```
root@a1:~# docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS      ENGINE VERSION
9zof56xjkdjhap5c45ghi2j4d     a1                  Ready               Active              Reachable           18.09.5
193oinpngjsc8yduztkhpwbdh     a2                  Ready               Active              Leader              18.09.5
4ynd2ad1aogobb589q1zmfrq1     a3                  Ready               Active                                  18.09.5
ku7b7yovpnlexznkq0gqblwtj *   a4                  Ready               Active              Reachable           18.09.5

root@a1:~# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
a1                   172.31.20.244     bbef3674   sds        normal     
a2                   172.31.23.155     81673d3b   backup1    normal     
a3                   172.31.26.219     9510272b   backup2    normal     
a4                   172.31.28.40      aea803f4   standard   normal
```

In addition, the Portainer UI is launched in a container. Verify with `docker service ps portainer`:
```
root@a1:~# docker service ps portainer
ID                  NAME                IMAGE                          NODE                DESIRED STATE       CURRENT STATE           ERROR               PORTS
ymkpiuhpyazc        portainer.1         portainerci/portainer:pr2711   c-bbef3674          Running             Running 4 minutes ago    
```

Note: to access Portainer's container management UI you will need to add a rule to the security group allowing inbound TCP traffic on port 9000.

Login to the container management UI by pointing your browser at any node's public IP and port 9000. The public IP addresses of the AWS instances can be found in the EC2 Management Console under Instances.
