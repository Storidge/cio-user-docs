# **Overview**

Storidge’s CIO (container I/O) software was created to simplify the life of developers, DevOps and storage administrators. CIO is purpose built to remove the pain of managing storage for applications. We make storage simple so you can focus on applications instead of managing infrastructure. 

CIO is a clustered block storage solution which is tightly integrated with container orchestrators. It provides a persistent storage layer from which applications can programmatically consume block, file and object storage services through the scheduler. In an orchestrated environment, the data volumes are hyper-converged and exposed on the same host where the application container is running. When a container is rescheduled to another host, CIO's storage orchestrator automatically moves the volume to the new host. 

## Features

- **Decentralized design:** Roles for nodes are dynamically assigned or reassigned (if node failure) during runtime. Any node can be primary, backup or a storage node. This enables an entire cluster to be built from a single image. 

- **Distributed metadata:** Metadata in the cluster is distributed so each node manages metadata for which it has volume ownership. This minimizes latency in the data path. The size of the failure domain is reduced with no single point of failure or contention.    

- **Scaling:** You can scale the total available performance and capacity of a cluster. Simply add nodes when additional resources are required and remove nodes to save costs when no longer needed. 

- **Declarative model:** Storidge uses a declarative approach that lets you define the desired properties of a volume. Requirements are defined in a YAML file called a [profile](http://storidge.com/docs/profiles/). This capability is enabled by an architecture that manages volumes as block objects to minimize the need for storage operations. 

- **Container granular:** Provisions and manages storage for applications at a container level 

- **API:** Provides programmatic approach to provision storage through the scheduler and orchestration software

- **Scheduler aware:** Embedded storage orchestration provides data persistence and high availability across multiple physical nodes, virtual servers or cloud instances

- **QoS:** Provides performance isolation for containerized applications running in a shared environment. Guaranteed quality of service means not having to overprovision resources. 

  ​

## **Cluster CLI Commands**

The `cioctl` command set is used for cluster management. 

```
$ cioctl
Usage: cioctl COMMAND [arg...]

Commands:
    create         start configuration of cluster for cio operation
    init           initialize cluster for cio operation
    join-token     create token to add new node to cluster
    load           start cio operation on single node cluster
    reboot         reboot all nodes in cluster
    remove         remove node from cluster
    shutdown       shutdown all nodes in cluster
    unload         stop cio operation on single node cluster
```

