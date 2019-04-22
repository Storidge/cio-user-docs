# cioctl join-token

<h3>Usage</h3>

**`cioctl join-token`**

Generates a join-token to add a node to an existing cluster.

Run the command string on the new node to be added. The creation of new join tokens will be disabled when there are on-going node operations, e.g. cordon, uncordon or removing a node from cluster. Wait and re-run the `join-token` command when the node operation is completed. 

#### **Example**

```
$ cioctl join-token
    cioctl node add 192.168.1.131 root 4758b5fc
```
