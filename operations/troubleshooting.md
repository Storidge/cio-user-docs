---
title: Troubleshooting
description: Troubleshooting issues on a Storidge cluster
lang: en-US
---

# Troubleshooting

## Useful commands

Get Storidge cluster information
```
cio info
```

Get node status and installed software version
```
cio node ls
```

List Storidge volumes with allocated capacity
```
cio volume ls -a
```

Get drive status
```
cioctl drive ls
```

Get Storidge software version
```
cio version
```

List events with warning tag
```
cio events |grep warning
```

Get cluster report
```
cioctl report
```

## Get cluster report

Run `cioctl report` to gather troubleshooting information to help with cluster diagnostics. The logs and info collected from all nodes are saved as file report.txz in location /var/lib/storidge.

Information gathered includes:
- cluster configuration
- drive list
- event logs
- node list
- operating system
- performance logs
- platform
- running CIO processes
- running services
- software version
- Storidge configuration files
- system logs
- system uptime

Include the cluster report (report.txz) when contacting us for support.

## Get support

If you have a Workgroup or Enterprise license, please contact us at support@storidge.com with your license key and cluster report.

We are also available on Slack. [Join us!](https://storidge.com/join-cio-slack/)
