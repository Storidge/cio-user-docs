# cio info

**`cio info [options]`**

Display information about the cluster.

### **Options**

- **-c , --capacity** : Display capacity details.

- **-n , --node &lt;node&gt;** : Display information for a specific node identified by the node name.

- **-N , --nodeid &lt;nodeid&gt;** : Display information for a specific node identified by the node id.


- **--nounits** : Display cluster information using byte units.

### **Examples**

Display cluster information:
```
$ cio info
Domain: f2385660
Domain ID: b922ab4a

Metadata Version: 1.0
Nodes: 4
Vdisks: 6
SSDs: 12
HDDs: 0
Total capacity: 0.105TB
Used capacity: 0.037TB
Free capacity: 0.069TB
Provisioned capacity: 0.234TB
Total IOPS: 83925
Used IOPS: 0
Free IOPS: 83925
Provisioned IOPS: 1092
Total bandwidth: 1041.774MiB/s
Used bandwidth: 0.000MiB/s
Free bandwidth: 1041.774MiB/s
Provisioned bandwidth: 8.910MiB/s
Status: Normal
```

Display cluster capacity information:
```
$ cio info -c
Total capacity: 0.105TB
SSD capacity: 0.105TB
HDD capacity: 0.000TB
Used SSD: 0.037TB
Used HDD: 0.000TB
Free SSD: 0.069TB
Free HDD: 0.000TB
Provisioned SSD: 0.234TB
Provisioned HDD: 0.000TB
```
