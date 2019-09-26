---
title: Volumes and Dockerfiles
description: Provision volumes from Dockerfile with Storidge persistent storage
lang: en-US
---

# Volumes and Dockerfiles

Docker provides a number of ways to work with volume for containers and services. You can specify the volume for a service using the `--mount` flag. For containers, you can use either the `--volume` flag or the recommended `--mount` flag which is supported for `docker run` as of Docker 17.06.

The `--mount` and `--volume` flags are the recommended way to work with volumes. But what if you need to work with a [Dockerfile](https://docs.docker.com/engine/reference/builder/#usage) for an application on Docker Hub? The Dockerfile itself may include a `VOLUME` instruction.

## VOLUME Instruction

The `VOLUME` instruction is used to specify one or more directories that bypass the Union File System. This instruction is how the author of the Dockerfile defines where stateful information should be written.

The benefits of using the `VOLUME` instruction are higher performance I/Os as changes are made directly to the host volume. Data written to the host volume persist even if the container is deleted. Also the volume can be shared and reused with other containers.

The `VOLUME` instruction tells Docker to create a mount point with the specified path inside the container. This mount point is marked as holding an external volume from the host. The value for the `VOLUME` instruction can be a JSON array, `VOLUME ["/data/db/"]` or a string with one or more arguments, e.g. `VOLUME /var/log` or `VOLUME /var/log /data`.

## **MongoDB Example**

We will use [MongoDB on Docker Hub](https://hub.docker.com/_/mongo/) as an example for this guide. Most application vendors post their Dockerfile on the main page for the image. Generally multiple versions with links to the Dockerfile are available. In our example with MongoDB, we’ll use their latest version - [Dockerfile version 3.7](https://github.com/docker-library/mongo/blob/5ad7b10217359104c1870d2d79bcb6498bf76b70/3.7/Dockerfile).

Looking at the `VOLUME` instruction in the Dockerfile for MongoDB, we can see that two container mount points and therefore two host volumes will be created for this image.

```
VOLUME /data/db /data/configdb
```

We’ll use the CIO volume plugin, `--volume-driver=cio` and the `--mount` flag of the `docker service create` command to create the volumes for both paths.

The volume properties for the first path (/data/db) will be specified using `--volume-opt` option and the MONGODB [profile](http://storidge.com/docs/profiles/). Source specifies the name of the volume, mongodb.

```
--mount source=mongodb,target=/data/db,volume-driver=cio,volume-opt=profile=MONGODB
```

The volume for the second path (/data/configdb) is created without setting volume options, i.e. it will be provisioned using default parameters of 20 GB, thin provisioned volume. The name of the volume is mongoconfig.

```
--mount source=mongoconfig,target=/data/configdb,volume-driver=cio
```

We could have decided not to define the second volume for /data/configdb. Docker would then create a local volume without a name. The result will be a long unique id string for the volume that contains no reference to the container it's attached to. Unless Docker is told to to remove volumes when containers are removed, these 'anonymous' volumes will remain, unlikely to be used again.

Defining the second volume keeps the named volume visible in `docker volume ls`.

Finally to start the service, we run

```
$ docker service create \
--mount source=mongodb,target=/data/db,volume-driver=cio,volume-opt=profile=MONGODB \
--mount source=mongoconfig,target=/data/configdb,volume-driver=cio \
--replicas 1 \
--name mongo \
mongo
```

## **Inspect**

We use `docker service inspect mongo` to verify that the volumes above were created and mounted correctly. Looking in the `Mounts` section we see both volumes.

```
"Mounts": [
    {
        "Type": "volume",
        "Source": "mongodb",
        "Target": "/data/db",
        "VolumeOptions": {
            "DriverConfig": {
                "Name": "cio",
                "Options": {
                    "profile": "MONGODB"
                }
            }
        }
    },
    {
        "Type": "volume",
        "Source": "mongoconfig",
        "Target": "/data/configdb",
        "VolumeOptions": {
            "DriverConfig": {
                "Name": "cio"
            }
        }
    }
],
```
