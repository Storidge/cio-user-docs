---
title: Upgrade Volume Plugin
description: Steps to upgrade the Storidge volume plugin for Docker; docker volumes for containers
lang: en-US
---

# Upgrade Storidge Volume Plugin

This guide shows the steps to upgrade the Storidge docker volume plugin. Run the command sequence below on all nodes in the cluster.

## List the plugin

```
# docker plugin ls
ID                  NAME                DESCRIPTION                                ENABLED
663a4acd7b35        cio:latest          Storidge's ContainerIO plugin for Docker   true
```

If the volume plugin shows as enabled, disable the plugin first to proceed.

## Disable the plugin

```
# docker plugin disable cio
```

If you get the error "plugin cio:latest is in use", use the -f or --force flag.

```
# docker plugin disable cio -f
```

Using the `-f` flag could be disruptive to applications. See the section below for a non-disruptive upgrade.

## Upgrade the plugin

```
# docker plugin upgrade cio
```

Example

```
# docker plugin upgrade cio
Upgrading plugin cio:latest from storidge/cio:latest to storidge/cio:latest
Plugin "docker.io/storidge/cio:latest" is requesting the following privileges:
 - network: [host]
 - mount: [/dev]
 - allow-all-devices: [true]
 - capabilities: [CAP_SYS_ADMIN]
Do you grant the above permissions? [y/N] y
latest: Pulling from storidge/cio
fa1b662ea6b3: Download complete
Digest: sha256:d8666480fc9ae8beba283dd60b8b3b387b4afeef727e5a82b8ad573b4b808b87
Status: Downloaded newer image for storidge/cio:latest
Upgraded plugin cio:latest to docker.io/storidge/cio:latest
```

## Enable the plugin

```
# docker plugin enable cio
```

## Non-disruptive plugin upgrade

Note that using the  `-f` or `--force` flag could be disruptive to the containerized application on an operating cluster, e.g. the Docker propagated mount point could be removed.

An alternative way to update the plugin is to first set the Storidge nodes to drain state, update the plugin and then set the Storidge nodes back to active state to continue operation, i.e.:

1. Run `docker node update --availability drain <cio node name>` to set each node to drain state
2. Use the disable, upgrade and enable plugin commands above to update the volume plugin
3. Run  `docker node update --availability active <cio node name>` to set each node back to active state
