---
title: cio info
description: cio info command; ocker volumes for containers; persistent volumes for pods 
lang: en-US
---

# cio info

<h3>Usage</h3>

`cio info [options]`

Display cluster or node information.

<h3>Options</h3>

| Name                | Description                          |
|:--------------------|:-------------------------------------|
| --capacity, -c      | Display capacity details             |
| --node, -n NODENAME | Display info for node name           |
| --nodeid, -N NODEID | Display info for node identifier     |
| --nounits           | Display information using byte units |

<h3>Examples</h3>

Display cluster information:
```
$ cio info
Domain: 2c19b9f6
Domain ID: 4c91166f

Metadata Version: 1.0
Nodes: 4
Vdisks: 4
SSDs: 16
HDDs: 0
Total capacity: 0.297TB
Used capacity: 0.034TB
Free capacity: 0.263TB
Provisioned capacity: 0.156TB
Total IOPS: 69166
Used IOPS: 0
Free IOPS: 69166
Provisioned IOPS: 846
Total bandwidth: 4751.998MiB/s
Used bandwidth: 0.000MiB/s
Free bandwidth: 4751.998MiB/s
Provisioned bandwidth: 53.185MiB/s
Condition: Normal
```

Display node information:
```
$ cio info -n cio1
Domain: 2c19b9f6
Domain ID: 4c91166f

Metadata Version: 1.0
Nodes: 4
Vdisks: 1
SSDs: 4
HDDs: 0
Total capacity: 0.074TB
Used capacity: 0.012TB
Free capacity: 0.062TB
Provisioned capacity: 0.039TB
Total IOPS: 17290
Used IOPS: 0
Free IOPS: 17290
Provisioned IOPS: 18
Total bandwidth: 1392.800MiB/s
Used bandwidth: 0.000MiB/s
Free bandwidth: 1392.800MiB/s
Provisioned bandwidth: 1.449MiB/s
Condition: normal
Status: normal
```

Display node capacity information:
```
$ cio info -n cio1 -c
Total capacity: 0.074TB
SSD capacity: 0.074TB
HDD capacity: 0.000TB
Used SSD: 0.012TB
Used HDD: 0.000TB
Free SSD: 0.062TB
Free HDD: 0.000TB
Provisioned SSD: 0.039TB
Provisioned HDD: 0.000TB
```
