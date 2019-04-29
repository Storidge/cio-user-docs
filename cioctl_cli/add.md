# cioctl add

<h3>Usage</h3>

**`cioctl node add`**

The add command is generated through the `cioctl join-token` command to add a node to an existing cluster.  

<h3>Example</h3>

On the SDS node run `cioctl join-token`:
```
[root@sds ~]# cioctl join-token
    cioctl node add 192.168.1.136 root 6850ba5d
```

Then run the generated add string on the node to be added:
```
[root@worker ~]# cioctl node add 192.168.1.136 root 6850ba5d
Adding this node to cluster as a storage node
...
node: Initializing metadata
cluster: Starting cio daemon
cluster: Starting API
```
