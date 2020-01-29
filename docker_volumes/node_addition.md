---
title: Node Addition
description: Adding new node to Storidge cluster  
lang: en-US
---

# Adding new node

Running `cioctl join-token` generates a token to add a new node to an existing Storidge cluster. Copy the `cioctl node add ...` command string generated, and run on the new node.

Example:
```
root@sds:~# cioctl join-token
    cioctl node add 192.168.3.122 909ab2a6afad21f26369c00a8ba7307e-076f50d0
```

::: tip
The creation of new join tokens is disabled when there are on-going node operations, e.g. cordon, uncordon or removing a node from cluster. Wait and re-run the join-token command when the node operation is completed.
:::
