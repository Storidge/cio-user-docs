# Data Drive

During installation, CIO will automatically discover and aggregate drives from each node into a shared storage pool. A minimum of three drives per node is required to ensure data redundancy. CIO will only add raw devices to the storage pool, i.e. drives formatted with a file system or partitioned will not be added. Delete the partitions or clear the drive metadata as needed. 

Drives with partitions can be cleared using tools such as `fdisk`. To clear drives that are mounted, first unmount and then clear the metadata area, e.g. for device sdb:  

```dd if=/dev/zero
dd if=/dev/zero of=/dev/sdb bs=1M count=300
```

The CIO software delivers powerful but easy to use volume management across a cluster of nodes. Some of CIO’s capabilities duplicate and conflict with volume management software such as LVM. Due to unpredictable results, it is highly recommended not to use two volume management software on the same drive. 
