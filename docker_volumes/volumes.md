---
title: Pre-povisioned Volumes
description: Provision Docker volumes for Swarm clusters with Storidge
lang: en-US
---

# Docker Volume Create

You can create and manage volumes separate from a container using the `docker volume create` command. Use the `--driver` flag to specify the volume plugin and use the `-o` or `--opt` flag to set options for creating a volume.

## Create

For example, create a Storidge volume with name “foo” and use profile MYSQL to set volume options.

```
docker volume create --driver cio --name foo --opt profile=MYSQL
```

You can also set multiple volume options.

```
docker volume create --driver cio
--name mysqldb \
--opt capacity=50 \
--opt type=ssd \
--opt iopsmin=1000 \
--opt iopsmax=2000 \
--label version=3.3 --label release=stable
```

Volume options supported by the plugin are:  

| **option** | **description**              | value           | example          |
| ---------- | ---------------------------- | --------------- | ---------------- |
| capacity   | Size in GB                   | 1 to 65536      | capacity=25      |
| directory  | Host path to bind mount      | /path/to/volume | directory=/cio   |
| level      | Level of data redundancy     | 2, 3            | level=2          |
| type       | Type of backend storage      | ssd, hdd        | type=ssd         |
| min iops   | Performance in min IOPS      | 30 min          | iopsmin=100      |
| max iops   | Performance in max IOPS      | 10,000,000 max  | iopsmax=5000     |
| bandwidth  | Performance in min MB/s      | 1 min           | bandwidthmin=10  |
| bandwidth  | Performance in max MB/s      | 1000 max        | bandwidthmax=100 |
| provision  | Thick or thin provisioning   | thin, thick     | provision=thick  |
| profile    | Template for volume creation | profile name    | profile=MYSQL    |

Create a thick provisioned 88 GB volume name bar with bind mount directory /cio/volumes.

```
docker volume create --driver cio --name bar \
--opt capacity=88 --opt directory=/cio/volumes --opt provision=thick
```

## List

```
$ docker volume ls
DRIVER              VOLUME NAME
cio:latest          bar
```

## Inspect

```
$ docker volume inspect bar
[
    {
        "CreatedAt": "0001-01-01T00:00:00Z",
        "Driver": "cio:latest",
        "Labels": {},
        "Mountpoint": "/cio/volumes/vd12",
        "Name": "bar",
        "Options": {
            "capacity": "88",
            "directory": "/cio/volumes"
        },
        "Scope": "local"
    }
]
```

## Remove

```
$ docker volume rm bar
bar
```
