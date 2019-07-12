# cio node

<h3>Usage</h3>

`cio node ls`

`cio node list`

List nodes in the cluster with node name, IP address, node identifier, role and cluster status.

<h3>Examples</h3>

```
$ cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
n1                   192.168.1.10      f2385660   sds        normal     
n2                   192.168.1.11      4c7545a5   backup1    normal     
n3                   192.168.1.12      99f8673e   backup2    normal     
n4                   192.168.1.13      1862a9a1   standard   normal
```
