# How It Works

## **Overview**

Storidge volumes are hyper-converged. The volumes created by Storidge draw from storage resources on the same hosts where the application containers are running. These storage resources can be local attached (e.g. physical disks on host, ephemeral drives on AWS) or networked attached (e.g. LUN from a SAN, EBS volumes). The storage resources that Storidge consumes are block devices that shows in /dev without partitions or file systems. 

During intialization of a cluster, CIO will automatically discover, add and organize drive types (hard disks, SSDs, NVMe devices) it finds in /dev into separate storage groups. A mix of drive types is supported to have different classes of performance and media costs. 

Within a cluster, each node has the Container IO (CIO) software and the Docker daemon. The CIO software pools storage resources from each host to form a persistent storage layer (Container IO Distributed Storage below) from which applications can programmatically consume block, file and object storage. This virtualization layer provide not just storage capacity but also data management capabilities to protect data and keep it highly available. Just as an Orchestration System provides management across a cluster for application containers,  Storidge plays a parallel role to provide storage orchestration and data management services for stateful applications in the cluster. 

![cio swarm cluster](C:\Users\jk\Documents\Images\cio swarm cluster.png)

Storidge integrates with orchestration systems through a plugin API. Our volume plugin and Container IO (CIO) software is installed on every member node of a cluster and enables storage to be natively provisioned from within a Docker environment. Application containers consume Storidge volumes by passing requests through the Orchestration System. Requests for Docker storage are forwarded through the CIO volume plugin and processed by the Container IO Distributed Storage layer which manages the lifecycle of the virtual volumes. 

## **Why Container IO Distributed Storage?**

Storidge's Container IO (CIO) software adds the capabilities below to a container cluster. 

- isolation from limitations of underlying infrastructure
- volume management for cluster
- redundancy and availability for containers
- efficiency of shared storage
- pooled performance from storage aggregation

Why add a persistent storage layer when volumes can be attached to instances on the cloud or from traditional storage in a private cloud? The following sections step through what happens when no abstraction layer exists, and how life improves with a persistent storage layer. 

## **Isolate Infrastructure Limitations**

You can run multiple containers in a cloud instance. Using AWS as an example, EBS volumes can be provisioned, attached to the instance and passed to each container through a bind mount directory after formatting a file system and mounting the volume. This works well for single instance configurations but does not deliver the benefits of availability and scalability that comes with an orchestrated cluster of nodes. 

With a cluster the same approach can be taken to provision multiple EBS volumes, sized to each application container.  When a node fails or if the container is rescheduled, the container restarts on a new node and the volume for the container has to be detached and remounted to the new node. Moving the volume takes a long time, requires scripting to cloud APIs and is sometimes inconsistent. When a volume cannot be successfully remounted to an operational node, the application container cannot be restarted. Similar remounting issues happen in a private cloud with LUNs that are moved between virtual servers, using protocols such as iSCSI that were designed for static environments instead of dynamic, short lived, mobile containers.  

With a persistent storage layer, provisioning a volume is as simple as running

```
docker service create \
--mount source=mysql-data,target=/var/lib/mysql,volume-driver=cio,volume-opt=profile=MYSQL \
--replicas 1 \
--detach=false \
-e MYSQL_ROOT_PASSWORD=mysecret \
--name mysql \
mysql
```

The `--mount` flag calls the cio volume plugin to create a virtual volume 'mysql-data' for the MySQL container. This virtual volume is provisioned within a Docker environment and the capacity for the volume is allocated from the persistent storage layer. This removes the need to write scripts for provisioning and managing volumes individually through cloud APIs. 

When the mysql container is rescheduled, the mysql-data volume automatically moves to the new node, remounts to the same directory path and attaches to the restarted container. Since the container interacts with a virtual volume, there is no need to detach and remount cloud volumes or LUNs through cloud provider APIs. The reason is because a virtualization layer exists which removes the need for containers to operate directly with cloud volumes. This greatly simplifies operations and eliminates the need to write and maintain scripts which create platform lock-in. 

The Container IO abstraction layer also provides the benefit of a consistent interface and application environment. Since the Storidge CIO software runs on virtual machines, cloud instances and bare metal servers, the APIs, commands and user experience does not change. This enables the same Docker compose files and manifests to be used on any compute platform without having to edit for platform differences.

## **Volume Management**

Just as [LVM](https://wiki.ubuntu.com/Lvm) provides volume management within an instance or host, Storidge's persistent storage layer provides volume management for a cluster of nodes. 

When a volume creation request is received, the CIO software instantiates a local block device with a virtual disk ID at /dev/vdisk. This block device is created on the same node where the container will be running. Since containers consume storage through a file system, the block device is auto-formatted, mounted at the specified directory and passed to the container through a propagated mount in a Docker managed directory. 

Using `docker service create` as an example

```
$ docker service create \
--mount source=mysql-data,target=/var/lib/mysql,volume-driver=cio,volume-opt=profile=MYSQL \
--replicas 1 \
--detach=false \
-e MYSQL_ROOT_PASSWORD=mysecret \
--name mysql \
mysql
```

This command calls the CIO volume plugin to create a volume named 'mysql-data'. The `--mount` flag uses [profile](https://storidge.com/docs/profiles/) MYSQL to create the volume. 

The profile is a [YAML](http://yaml.org/spec/current.html) formatted file used to specify an application’s storage requirements in terms of resources, data protection, access methods and placement. The following sample MYSQL profile comes with the CIO software installation. This profile should be edited to fit operational needs.  

```
---
capacity: 10
directory: /cio/mysql
iops:
  min: 1000
  max: 5000
level: 3
local: no
provision: thin
type: ssd
service:
  compression: no
  dedupe: no
  encryption:
    enabled: no
  replication:
    enabled: no
    destination: none
    interval: 120
    type: synchronous
  snapshot:
    enabled: no
    interval: 60
    max: 10
```

In this example, the path to mount the virtual disk is defined in the profile as /cio/mysql. The result is a named volume 'mysql-data' with a unique virtual disk ID 'vd2' mounted at /cio/mysql/vd2. 

```
$ docker volume ls
DRIVER              VOLUME NAME
cio:latest          mysql

$ mount | grep vd2
/dev/vdisk/vd2 on /cio/mysql/vd2 type xfs (rw,relatime,attr2,inode64,noquota)
```

Per the MYSQL profile, the mysql-data volume is thin provisioned, using capacity only as the application consumes it. This volume is replicated and striped across the cluster nodes and drives to ensure data redundancy and availability. 

![mysql volume](C:\Users\jk\Documents\Images\mysql volume.png)

From the application point of view:

- The MySQL application is unchanged. Data continues to be written to /var/lib/mysql
- The MySQL data is written to a virtual volume on the persistent storage layer managed by Storidge
- The MySQL data is protected with redundancy and data services provided at the persistent storage layer
- The MySQL application is highly available as Storidge ensures the data is always accessible even in the event of drive and node failures

## **Redundancy and Availability**

While cloud volumes can be provisioned for each container running in an instance, they represent single points of failures. If a volume is detached and cannot be remounted, or when access to the cloud volume is lost, the application container cannot run. 

Storidge's Container IO software creates a persistent storage layer that ensures containers have continuous access to their data even when there are hardware failures. After a virtual volume is created, as the application container writes to the volume, it's data is replicated synchronously to other nodes for redundancy. Writes are strictly consistent and all copies are written before acknowledgement is returned. 

Metadata in a Storidge cluster is fully distributed. Each node manages three copies of the metadata for volumes that it owns. Since the metadata is in the data path, this approach reduces latency by not having to reference a “master”. In addition, the size of the failure domain is reduced since there is no single point of failure. 

Data redundancy is built around the concept of microdisks. Microdisks are small allocation units that are interchangeable horizontally across nodes and vertically across tiers of storage. A volume is composed of arrays of microdisks which are fully redundant. When a node fails, remaining operational nodes rebuild the volumes that it owns to restore data redundancy. Since microdisks are interchangeable, the recovery compute and IO workloads are distributed over all nodes and drives in a cluster. Recovery is fast as Storidge tracks and rebuilds only the microdisks with data written. 

When a node fails, the Orchestration System will restart failed services on operational nodes. Storidge will automatically detach volumes from the failed node and mount it to the node where the container is restarting. With redundant copies in the cluster, the restarted container has immediate access to data and continues running. The rebuilding of the container's volume is non-blocking and continues in the background even after an application container is rescheduled to a new node. Failed nodes are completely removed from metadata in the cluster. This eliminates the possibility of a failed node rejoining the cluster and potentially corrupting data. 

The data redundancy and availability provided by the persistent storage layer protects application containers that do not replicate their own data. This is useful for microservices and ported legacy apps that operate on the assumption of data persistence provided by underlying infrastructure. 

## **Efficient Capacity Sharing**

Cloud volumes can be provisioned for each container running in a cloud instance. 1GB each for Grafana and Kibana, 10GB for Elasticsearch, 20GB for MySQL, etc. Each cloud volume is sized to the application and generally oversized to anticipate data growth and hopefully avoid service disruptions due to cloud volumes running out of capacity. This creates a need to monitor many individual cloud volumes, results in under utilization initially and creates the possibility of stranded capacity that is provisioned but never used. 

With Storidge, storage resources from cloud volumes are aggregated into a shared pool. Virtual volumes are created on demand  from the shared pool and can be thick or thin provisioned. Thin provisioned volumes starts at 32MB allocated capacity and grows as the application writes to the virtual volume. The thin provisioned volumes can be created with a capacity limit and expanded as needs grow. 

Having a persistent storage layer allows for efficient capacity sharing as thin provisioned volumes are only allocated capacity when the application consumes it. It eliminates stranded capacity and the costs of oversizing to anticipated usage. Since Storidge supports 4095 virtual volumes per node, there is no practical limit to the number of application containers.  

Monitoring is simplified as it is easier to manage usage of a central resource. For each virtual volume, events are sent when capacity usage hits 70%, 80%, 90% or full capacity. These early warnings provide ample time to expand a container's volume based on usage trends. 

## **Pooled Performance**

When cloud volumes are provisioned, the available performance is scaled to the size of the volume. Using EBS volumes as an example, the available performance is set by an initial IOPS budget, plus credits that accumulate based on the capacity of the volume. The available performance for the application is tightly coupled to that of the cloud volume. The inherent assumption that larger capacities require more performance is true for some but not all use cases. 

Just as pooling cloud volumes results in higher capacity utilization and efficiency, a persistent storage layer enables performance to be pooled and shared. In using a microdisk concept to allocate storage for virtual volumes, Storidge decouples the link between capacity and performance. Storage for a virtual volume spans multiple nodes and cloud volumes, making the IOPS budget and accumulated credits of multiple cloud volumes available to a single virtual volume. 

Combined with Storidge's QoS feature, this allows important databases to be provided guaranteed performance based on needs of the application. It eliminates the waste of provisioning larger capacities just to scale performance. 

## **Summary**

The Container IO Distributed Storage layer is a useful abstraction that separates applications from the underlying infrastructure. As an abstraction layer it plays an important role in helping applications become more portable. 

Since Storidge's Container IO software can be deployed on bare metal servers, virtual servers and multi clouds, it helps deliver applications faster because it enables uniformity across development, test and production environments. When used as part of a flexible application architecture, Storidge helps organizations retain the ability to innovate faster. 
