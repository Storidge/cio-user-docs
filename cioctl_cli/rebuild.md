# cioctl rebuild

<h3>Usage</h3>

`cioctl rebuild`

Restart volume rebuilds 

The `cioctl rebuild` command is used to manually restart volume rebuilding and recovery in the cluster. The volume rebuilding could have been stopped earlier because available capacity in the storage pool was less than 10%. This ensures capacity is available in the storage pool for volume expansion of thin provisioned volumes, and avoids potential disruptions to running services. 


