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

<h3>Options</h3>

| Name            | Valid Values         | Description                                    |
|:----------------|:---------------------|:-----------------------------------------------|
| --all-managers  |                      | Set all nodes to manager role in Swarm cluster |
| --drive         | auto, ssd, hdd       | Force a drive type for initialization          |
| --ip            | IP_ADDRESS, HOSTNAME | Network interface to use for data path traffic |
| --no-portainer  |                      | Initialize without Portainer service           |
| --single-node   |                      | Initialize for single node cluster             |
| --zone          |                      | Specify zone names for multi-zone cluster      |

Run the `cioctl join` command string on nodes to be added to the cluster. Run the `cioctl init` command string on the primary node, after adding nodes to cluster.

Use the `--ip` option to specify the network interface to use for the storage traffic. This option is used when there are more than one network interface, and it is desirable to keep host and storage traffic separate, e.g. in production cluster.

You can also use the host name to specify network interface to use in environments that support DNS.

Use the `--no-portainer` option when you prefer not to have the Portainer service automatically started. This provides an option for the Portainer admin credentials to be preset before launching the service.

Run `cioctl create --single-node` to quickly create a single node cluster. This eliminates the extra step of running the `cioctl init` command.

Using `cioctl create` command again on an already running cluster provides the option to delete current cluster configuration, destroy the cluster and reboot all nodes. After running this command to erase the cluster, the nodes will be left in a clean state and a new cluster can be created. This command will prompt for confirmation to destroy the cluster.

<h3>Examples</h3>

<h4>Create cluster</h4>

To create a new cluster run `cioctl create` as root user on the SDS node and follow the instructions. If multiple IPs are available a message will prompt to specify IP to use.
```
$ cioctl create
[sudo] password for centos:
Cluster started. The current node is now the sds controller node. To add a storage node to this cluster, run the following command:
    cioctl join 192.168.1.131 root db667503

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init db667503
```

<h4>Delete cluster</h4>

To delete an existing cluster run `cioctl create` as root user on the current SDS node and the cluster will be de-configured and rebooted.
```
$ cioctl create
This is an active cluster. This operation will remove all member nodes for a new cluster
Data on existing volumes will be deleted!
Please confirm you wish to proceed [Y/N]: Y
The cluster will be de-configured then rebooted. After reboot enter following command to start a new cluster:
    cioctl create
```
