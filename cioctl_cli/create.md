---
title: cioctl create
description: cioctl create command; docker volumes for containers; persistent volumes for pods
lang: en-US
---

# cioctl create

<h3>Usage</h3>

`cioctl create [options]`

Generate command strings for creating a new cluster.

Node where create command runs, becomes the primary (sds) node of a cluster. Outputs command string for joining other nodes to cluster and displays command string for primary node to initialize the cluster.

Run the `cioctl join` command string on nodes to be added to the cluster. Run the `cioctl init` command string on the primary node, after adding nodes to cluster.

<h3>Options</h3>

| Name            | Valid Values         | Description                                           |
|:----------------|:---------------------|:------------------------------------------------------|
| --all-managers  |                      | Set all nodes to manager role in Swarm cluster        |
| --drive         | auto, ssd, hdd       | Force a drive type for initialization                 |
| --email         | EMAIL_ADDRESS        | Register email address for CE token and notifications |
| --ip            | IP_ADDRESS, HOSTNAME | Network interface to use for data path traffic        |
| --kubernetes    |                      | Configure persistent storage cluster for Kubernetes   |
| --noportainer   |                      | Initialize cluster without Portainer service          |
| --single-node   |                      | Initialize single node cluster                        |
| --swarm         |                      | Configure Storidge and Docker Swarm cluster (default) |
| --token         | TOKEN                | Use token to enable more cluster capabilities         |
| --zone          | ZONE1, ZONE2         | Specify zone names for multi-zone cluster             |

Use the `--drive` option to set the drive type for cluster initialization. This is useful for virtual servers where caching software may confuse drive type discovery. 

Specify the email address to register using the `--email` option. This enables a token for CE software license to be generated and used for initializing the cluster.

Use the `--ip` option to specify the network interface to use for the storage traffic. This option is used when there are more than one network interface, and it is desirable to keep host and storage traffic separate. Separating storage traffic is recommended for production clusters. You can also use the host name to specify the network interface to use in environments that support DNS.

Use the `--kubernetes` option to configure the Storidge cluster for a Kubernetes environment.  

Use the `--noportainer` option when you prefer not to have the Portainer service automatically started. This provides an option for the Portainer admin credentials to be preset before launching the service.

Run `cioctl create --single-node` to quickly create a single node cluster. This eliminates the extra step of running the `cioctl init` command.

Use the `--swarm` option to specify creating a Swarm cluster together with the Storidge cluster. This is the default when creating a new cluster. Three manager nodes will be configured unless the `--all-managers` option is used. 

Specify the token to use with `--token` option. The token is used to add Workgroup and Enterprise Edition capabilities.

Using `cioctl create` command again on an already running cluster provides the option to delete current cluster configuration, destroy the cluster and reboot all nodes. After running this command to erase the cluster, the nodes will be left in a clean state and a new cluster can be created. This command will prompt for confirmation to destroy the cluster.


<h3>Examples</h3>

**Create cluster with default settings**

To create a new cluster run `cioctl create` as root user on the SDS node and follow the instructions. If multiple IPs are available a message will prompt to specify IP to use.
```
$ cioctl create
[sudo] password for centos:
Cluster started. The current node is now the sds controller node. To add a storage node to this cluster, run the following command:
    cioctl join 192.168.1.131 root db667503

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init db667503
```

**Specify network interface to use for storage traffic**

Use the `--ip` option to specify the network interface to use for the storage traffic. If there is only one network interface on the instance, it will be automatically selected. 
```
$ cioctl create --ip 10.0.1.5
```

**Create single node cluster**

Use the `--single-node` option to quickly create a single node cluster for exploring Storidge features. 
```
$ cioctl create --single-node
```

**Force drive type to ssd**

Force all discovered drives to be of type ssd when creating a new cluster. 
```
$ cioctl create --ssd
```

**Create cluster with Workgroup Edition token**

Use the `--token` option to add more features when creating a Storidge cluster. Tokens are available from buy.storidge.com
```
$ cioctl create --token CIO-8893-9175-2625
```

## Delete cluster

To delete an existing cluster run `cioctl create` as root user on the current SDS node and the cluster will be de-configured and rebooted.
```
$ cioctl create
This is an active cluster. This operation will remove all member nodes for a new cluster
Data on existing volumes will be deleted!
Please confirm you wish to proceed [Y/N]: Y
The cluster will be de-configured then rebooted. After reboot enter following command to start a new cluster:
    cioctl create
```
