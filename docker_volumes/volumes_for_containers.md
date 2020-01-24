---
title: Docker Run
description: Provision volumes for Docker containers with Storidge persistent storage
lang: en-US
---


# Volumes for Containers

## Create

To start a container you use the `docker run` command. You can specify a volume in a `docker run` command by using the `-v` or `--volume` flag. If the volume does not yet exist, Docker creates the volume.

You can specify a Storidge volume in a `docker run` command by using the `--volume-driver` flag to call the cio driver. The example below calls the cio volume plugin to create a volume named foo, for the alpine container.

```
docker run -it --volume-driver cio -v foo:/tmp --name foo alpine sh
```

Note that the `-v` flag does not support volume options. The example above will create a CIO volume with default parameters. At the time of install, the default parameters will create a volume of 20 GB capacity, thin provisioned, mounted at /cio/volumes and with no performance limits.

To specify volume options, you use the `--mount` flag. Support for using the `--mount` flag with containers was added in Docker 17.06. The example below produces the same results. Source is the name of the volume and target is the directory mounted in the container.

```
docker run -it --mount source=foo,target=/tmp,volume-driver=cio --name foo alpine sh
```

The `--mount` flag supports the use of volume options. The options are specified as key-value pairs. For example

```
docker run -it --mount source=bar,target=/tmp,volume-driver=cio,volume-opt=profile=GOLD --name bar alpine sh
```

This creates a volume named bar with volume options set in [profile](http://storidge.com/docs/profiles/) GOLD. Volume options can also be individually set. For multiple volume options, use comma separation between key-value pairs.

```
docker run -it --mount source=foobar,target=/tmp,volume-driver=cio,volume-opt=capacity=88,volume-opt=type=ssd --name foobar alpine  sh
```

The following options are supported by the CIO volume plugin:  

| **option** | **description**              | value               | example         |
| ---------- | ---------------------------- | ------------------- | --------------- |
| capacity   | Size in GB                   | 1 to 65536          | capacity=25     |
| directory  | Host path to bind mount      | /path/to/volume     | directory=/cio  |
| level      | Level of data redundancy     | 1, 2, 3             | level=2         |
| type       | Type of backend storage      | ssd, hdd            | type=ssd        |
| iops       | Performance in min/max IOPS  | 10 min, 1000000 max | iops=100,5000   |
| bandwidth  | Performance in min/max MB/s  | 1 min, 1000 max     | bandwidth=10,50 |
| provision  | Thick or thin provisioning   | thin, thick         | provision=thick |
| profile    | Template for volume creation | profile name        | profile=MYSQL   |

## Inspect

Use `docker inspect foobar` to verify that the volume above was created and mounted correctly. Look for the `Mounts` section.

```
"Mounts": [
    {
        "Type": "volume",
        "Name": "foobar",
        "Source": "/var/lib/docker/plugins/663a4acd7b35a93dd6d76980e60eaad720895a6594ee2666312a37da8eaa288a/rootfs/cio/volumes/vd8",
        "Destination": "/tmp",
        "Driver": "cio:latest",
        "Mode": "",
        "RW": true,
        "Propagation": ""
    }
],
```

This shows that the mount is a volume, with the source (volume name foobar) a propagated mount from /cio/volumes/vd8 and the mount is readable and writable.

## Remove

To remove the volume, first stop and remove the container.

```
$ docker stop bar

$ docker rm bar

$ docker volume rm bar
```
