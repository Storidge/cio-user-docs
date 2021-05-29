---
title: Backup to MinIO
description: configure backup to MinIO repo
lang: en-US
---

# Backup

The Storidge cluster includes a built-in backup and restore capability to cover critical data management and protection use cases. This capability balances the needs of developers and operators, making it simple to deploy, and manage data for containerized applications at scale.

You can apply the backup and restore capability for the following use cases:

- Application migration
- Backup and recovery
- Cluster cloning for dev and test
- Disaster recovery

::: tip
The backup capability requires a Workgroup or Enterprise Edition license to operate
:::

In this guide we will walk through how to configure backups for containerized apps running on a Docker Swarm cluster. 

The backup data will be pushed to another Storidge cluster serving as a remote backup repo. The backup repo will be presented using a MinIO object storage interface. This covers environments where you want to manage data internally, and do not want any backup data on public clouds. 

This guide assumes a Docker Swarm and Storidge cluster is already deployed that you wish to setup backup services for. If not, you can follow the steps [here](https://docs.storidge.com/docker_volumes/install.html) to deploy a cluster.

The instructions in this guide are organized in four sections:
- Create Storidge cluster to use as remote backup target
- Create Storidge volume as backup repo with MinIO interface
- Setup credentials for MinIO (S3) interface
- Create backup service for volumes and stateful services 

## 1. Create cluster as backup target

The example below sets up a single node cluster to use as the backup target. This node will present storage via a MinIO interface to store the backup data. 

Note that you can also configure a multi-node Storidge cluster as a backup target. This enables you to easily scale storage capacity and performance, while keeping separate backup repositories for different users, departments, projects, etc. A multi-node cluster also ensures no single point failure for your backup infrastructure. 

In addition, if you are operating more than one cluster in different locations, you can configure cross-cluster backups so each cluster serves as the backup target for the other. 

### Download

Download and install the Storidge software using a convenience script. For additional details, follow this [link](https://docs.storidge.com/docker_volumes/install.html).

```
curl -fsSL https://download.storidge.com/pub/ce/cio-ce | sudo bash
```
### Initialize

Initialize a single node cluster with `cioctl create --single-node`. 

::: warning Important
If you are running a virtual machine or server, enable 'promiscuous mode' on the VM.

This allows network requests for IP addresses other than the host IP to be passed through to the network port and forwarded to the macvlan driver.
:::

### Create "cionet"

The Storidge software includes an IP address management (IPAM) function to allocate/deallocate IP addresses for MinIO/S3 volumes. 

To enable this capability, create a network named 'cionet' and pass a range of IP addresses that will be managed by the IPAM function. The Storidge software will assign IP addresses from this range. For details on the `cio network` command, follow this [link](https://docs.storidge.com/cio_cli/network.html#cio-network-create).

The example below assigns 192.168.1.100 to 192.168.1.150 on subnet 192.168.1.0/24 as address range that will be managed by the Storidge software. 
```
cio network create cionet --driver macvlan --iprange 192.168.1.100-192.168.1.150 --subnet 192.168.1.0/24 --gateway 192.168.1.1 --port enp0s3
```

Run `cio network ls` or `docker network ls` to confirm that cionet is created. 

## 2. Create volume as backup repo

Create a volume with a MinIO (S3) interface. This volume will provide storage capacity for backup data. 

The example below uses default profile S3 to create the volume backup-repo. The default S3 profile can be found at /etc/storidge/profiles. Modify the profile to suit your environment, then save the changes to the datastore. For more info on the `cio profile` command, follow this [link](https://docs.storidge.com/cio_cli/profile.html#cio-profile-create).

```
cio volume create backup-repo --profile S3
```

Find the container ID of the MinIO service with the `docker ps` command. Example: 
```
root@u20:/etc/storidge/profiles# docker ps
CONTAINER ID   IMAGE                           COMMAND                  CREATED         STATUS         PORTS                    NAMES
8792637333d5   minio/minio                     "/usr/bin/docker-ent…"   45 hours ago    Up 45 hours                             repo
```

Show the endpoint for the MinIO interface with the `docker logs` command. Example: 
```
root@u20:/etc/storidge/profiles# docker logs 8792637333d5
Attempting encryption of all config, IAM users and policies on MinIO backend
Endpoint: http://192.168.1.100:9001  http://127.0.0.1:9001

Browser Access:
   http://192.168.1.100:9001  http://127.0.0.1:9001

Object API (Amazon S3 compatible):
   Go:         https://docs.min.io/docs/golang-client-quickstart-guide
   Java:       https://docs.min.io/docs/java-client-quickstart-guide
   Python:     https://docs.min.io/docs/python-client-quickstart-guide
   JavaScript: https://docs.min.io/docs/javascript-client-quickstart-guide
   .NET:       https://docs.min.io/docs/dotnet-client-quickstart-guide
IAM initialization complete
```

The example above shows the MinIO endpoint available at http://192.168.1.100:9001. The backup cluster and backup repo is now ready for use. 

## 3. Setup credentials for MinIO

On the cluster where backup services will be started, setup credentials to access the backup repo. For the MinIO repo, the following four credentials are needed. Example: 
```
cio credential create cio_minio_backup_repo s3:http://192.168.1.100:9001/cio-backup-bucket
cio credential create cio_minio_access_key secret
cio credential create cio_minio_secret_key mysecret
cio credential create cio_minio_backup_password password
```

`cio_minio_backup_repo` sets the URL for the MinIO interface. The URL consists of the endpoint and fixed path 'cio-backup-bucket'.

The `cio_minio_access_key` and `cio_minio_secret_key` values are defined in the S3 profile that was used for volume creation on the backup cluster. Modify the values accordingly for your environment. 

`cio_minio_backup_password` sets the password for the backup repo. Modify as appropriate for your environment. 

Verify credentials are correctly configured and the backup repo is accessible. Run:
```
cio backup info --backupid --provider minio
```

For details on `cio credential` command, follow [link](https://docs.storidge.com/cio_cli/credential.html).

## 4. Create backup service  

Create a volume test for the backup service. 
```
cio volume create test -D
```

Enable backup on the volume. The backup interval is every one hour with a maximum of four most recent backups retained. 
```
cio backup create test --backupinterval 1 --backupmax 4 --provider minio
```

Confirm that a backup service has been enabled for the volume. Run:
```
[root@c1 config]# cio backup ls
NODENAME             VDISK     VOLUMENAME
c4                   vd3       mysql-2
c5                   vd4       mysql-4
c2                   vd5       mysql-3
c3                   vd6       backup
c2                   vd7       test
```

Backups in the repository will be indexed with a backup identifier. You can list the backup identifiers with `cio backup info --backupid --provider minio`. Example: 
```
[root@c1 config]# cio backup info --backupid --provider minio
BACKUPID  TIME                 HOST          SOURCE                             PATH
0bf5b0bb  2021-05-09 20:42:28  574eafb9ac1f  478166ef:test            /data
6a80d9f4  2021-05-09 21:42:29  e226779264bf  478166ef:test            /data
00b8ae08  2021-05-09 22:42:28  744fb87801a4  478166ef:test            /data
e13b56bd  2021-05-09 23:42:26  2318516c8376  478166ef:test:profile    /data/.backup/profile
95836b8e  2021-05-09 23:42:28  2318516c8376  478166ef:test            /data
```

For details on `cio backup` command, follow [link](https://docs.storidge.com/cio_cli/backup.html).
