---
title: cio network
description: cio network command; docker volumes for containers; persistent volumes for pods
lang: en-US
---

# cio network

<h3>Usage</h3>

`cio network COMMAND <NETWORK-NAME> <OPTIONS>`

Create, display, list or remove network

<h3>Child commands</h3>

| Command            | Description                      |
|:-------------------|:---------------------------------|
| cio network create | Create a cio network             |
| cio network info   | Display info on cio network      |
| cio network list   | List cio cluster network         |
| cio profile remove | Remove cio cluster network       |

## cio network create

<h3>Usage</h3>

`cio network create <NETWORK-NAME> <OPTIONS>`

`cio network add <NETWORK-NAME> <OPTIONS>`

Add cio network to Swarm cluster

<h3>Options</h3>

| Name       | Valid Values         | Description                            |
|:-----------|:---------------------|:---------------------------------------|
| --driver   | macvlan              | Network driver to use                  |
| --iprange  | CIDR, IPSTART-IPEND  | Range of IP addresses IPAM will manage |
| --subnet   | SUBNET               | Subnetwork                             |
| --gateway  | GATEWAY-IP           | Gateway IP for subnetwork              |
| --port     | INTERFACE            | Port to use for creating cio network   |

<h3>Examples</h3>

**Create network**

Create network 'cionet' with IP range 192.168.3.128 to 192.168.3.255, on network interface enp0s3
```
cio network create cionet --driver macvlan --iprange 192.168.3.0/24 --subnet 192.168.3.0 --gateway 192.168.3.1 --port enp0s3
```

## cio network info

<h3>Usage</h3>

`cio network info <NETWORKNAME>`

`cio volume inspect <NETWORKNAME>`

Display network info by network name

<h3>Examples</h3>

Display info on network cionet
```
[root@c1 ~]# cio network inspect cionet
IP Address      Int Driver  IP Range         Subnet           Gateway          Port
192.168.3.231   yes macvlan 192.168.3.128/24 192.168.3.0/24   192.168.3.1      enp0s3
192.168.3.232   yes macvlan 192.168.3.128/24 192.168.3.0/24   192.168.3.1      enp0s3
192.168.3.233   yes macvlan 192.168.3.128/24 192.168.3.0/24   192.168.3.1      enp0s3
192.168.3.234   yes macvlan 192.168.3.128/24 192.168.3.0/24   192.168.3.1      enp0s3
192.168.3.235   yes macvlan 192.168.3.128/24 192.168.3.0/24   192.168.3.1      enp0s3
```

## cio network list

<h3>Usage</h3>

`cio network ls`

`cio network list`

List cio network

<h3>Examples</h3>

```
$ cio network list
```

## cio network remove

<h3>Usage</h3>

`cio network rm <NETWORKNAME>`

`cio network remove <NETWORKNAME>`

`cio network delete <NETWORKNAME>`

Remove cio network

<h3>Examples</h3>

```
$ cio network rm cionet
```
