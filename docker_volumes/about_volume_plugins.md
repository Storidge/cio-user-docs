# About Volume Plugins

Docker integrates with external storage systems through the volume plugin API. The API enables data volumes to be natively provisioned in a Docker environment and then attached to an application running in a container. Since the data volume survives termination of the container, stateful data written by the application persists beyond the lifetime of the container.

The volume plugin system was introduced with Docker version 1.8.0 and continues through to version 1.12.0. As of Docker version 1.13.0, the original volume plugin is considered “legacy” as the v2 plugin architecture was introduced.

A CIO installation installs the original volume plugin(v1) for Docker version 1.12.6 and below. The new volume plugin (v2) is installed for Docker version 1.13.0 and above.  The volume plugin enables requests for storage to be passed to the CIO software.

If the v2 volume plugin is not already installed, it can be downloaded and installed by using:

```
docker plugin install storidge/cio --grant-all-permissions --alias cio
```
