---
title: cioctl join-token
description: cioctl join-token command usage 
lang: en-US
---

# cioctl join-token

<h3>Usage</h3>

`cioctl join-token`

Generates a join-token to add a node to an existing cluster.

Run the command string on the new node to be added. The creation of new join tokens will be disabled when there are on-going node operations, e.g. cordon, uncordon or removing a node from cluster. Wait and re-run the `join-token` command when the node operation is completed.

<h3>Example</h3>

```
root@sds:~# cioctl join-token
    cioctl node add 192.168.3.122 909ab2a6afad21f26369c00a8ba7307e-076f50d0
```
