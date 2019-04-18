# cioctl node

**`cioctl node COMMAND <nodename | node-id>`**

Add, get info about, list, or remove drive resources.

## **cordon**

**`cioctl node cordon <nodename | node-id>`**

Drain and cordon node for maintenance.

## **remove**

**`cioctl node rm <nodename | node-id>`**
**`cioctl node remove <nodename | node-id>`**

Remove a node from the cluster. In a multi-node cluster a minimum of three nodes are required for redundancy.

## **uncordon**

**`cioctl node uncordon <nodename | node-id>`**

Rejoin cluster and resume scheduling onto node.
