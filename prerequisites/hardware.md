---
title: Hardware
description: Hardware prerequisites for persistent storage with Storidge
lang: en-US
---

# Hardware

<h3>Server</h3>

The CIO software runs on bare metal servers, virtual machines, or cloud instances. Three nodes minimum are required for data redundancy. Four nodes are recommended for production clusters.

| Bare Metal Server                  |                               |
| -----------------------------------|:------------------------------|
| CPU                                | Duo-Core Intel x86            |
| RAM                                | 64GB                          |
| Boot Drive                         | 20GB                          |
| Data Drive                         | 3 x 100GB SSDs (recommended)  |
| Ethernet NIC                       | Dual 10GigE (recommended)     |


| Virtual Server/Cloud Instance   |                               |
| --------------------------------|:------------------------------|
| CPU                             | 2 or more virtual CPUs        |
| RAM                             | 16GB                          |
| Boot Drive                      | 20GB                          |
| Data Drive                      | 3 x 100GB SSDs (recommended   |
| Ethernet NIC                    | Dual 1GigE+ (recommended)     |

While Storidge CIO will operate off one network interface, dual interfaces provides greater network bandwidth and isolation. It allows one interface to be dedicated to internode storage traffic (storage network), and the second interface assigned for front end applications.

::: warning Important
Four nodes minimum are recommended for production clusters
:::


<h3>Data Drive</h3>

During installation, CIO will automatically discover and aggregate data drives from each node into a shared storage pool. CIO will only add raw devices to the storage pool, i.e. drives formatted with a file system or partitioned will not be added. Delete the partitions or clear the drive metadata as needed.

Drives with partitions can be cleared using tools such as `fdisk`. To clear drives that are mounted, first unmount and then clear the metadata area. Example, for device sdb below:

```
dd if=/dev/zero of=/dev/sdb bs=1M count=300
```

::: tip
The CIO volume management capabilities duplicate and conflict with volume management software such as LVM.

Do not use two volume management software on the same drives.
:::
