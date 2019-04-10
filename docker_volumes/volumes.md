# Volumes

Storidge provides scalable and persistent storage for your Docker infrastructure. Our CIO (continer I/O) software aggregates storage from a cluster of nodes into a global capacity and performance pool. The CIO software creates volumes and allocates capacity and performance for containers and services from this global resource. 

Capacity and performance can be scaled by adding new nodes to or removing existing nodes from the cluster. Storidge's CIO software runs hyperconverged with Docker on both physical and virtual servers to enable consistent and repeatable deployments across public and private clouds. 

The data volumes created by Storidge's CIO software:

- are protected from hardware and node failures through automatic replication
- writes are synchronous and strongly consistent
- are highly performant with data distributed across multiple nodes and drives
- are managed through profiles to greatly simplify operations
- are provisioned programmatically in seconds through a scheduler or orchestration system

## **Docker Volume**

Docker integrates with external storage systems through the [volume plugin API](https://docs.docker.com/engine/extend/plugins_volume/). The API enables volumes to be natively provisioned in a Docker environment and then attached to an application running in a container or service. 

The CIO installation package installs a v2 volume plugin for Docker version 1.13.0 and above. The volume plugin enables request for storage to be passed to the CIO software whether from a `docker run`, `docker service create`, `docker volume create` command or [Docker Compose](https://docs.docker.com/compose/overview/) file. 

**Create volumes**

You can create and manage volumes separate from a container using the `docker volume create` command. Use the `--driver` flag to specify the volume plugin and use the `-o` or `--opt` flag to set options for creating a volume. 

For example, create a CIO volume with name “foo” and use profile MYSQL to set volume options.

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

Volume options supported by the CIO plugin are:  

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

**List volumes**

```
$ docker volume ls
DRIVER              VOLUME NAME
cio:latest          bar
```

**Inspect a volume**

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

**Remove a volume**

```
$ docker volume rm bar
bar
```



**Create and manage with cio cli**

Volumes can be created and managed using the cio cli commands. The named volume is then passed to docker using the `-v` or `--volume` flag in a `docker run` command or the `--mount` flag in a `docker service create` command. 

The `cio volume create ` command creates a virtual disk (vdisk) as a Linux block devices in /dev/vdisk and works with standard Linux utilities. When a bind mount directory is specified, the vdisk is automatically formatted and mounted as a volume. The created volume can be used with containers, virtual machines or native apps. 

Use the `-h` or `--help` to show available options.  

```
$ cio volume create --help
Usage: cio volume create [<volumename>] [options]

Create a volume

    --bandwidthmin <min BW>             set min bandwidth in MiB/s
    --bandwidthmax <max BW>             set max bandwidth in MiB/s
    -c | --capacity <size in GB>        volume size in GB
    -d | --dedupe                       enable de-duplication
    -D | --directory <directory>        set bind mount directory for Docker, defaults to /cio
    -e | --encryption                   enable encryption
    -f | --filesystem <filesystemtype>  set a filesystem for this volume
    -h | --help                         show usage information
    --iopsmin <min IOPS>                set min IOPS
    --iopsmax <max IOPS>                set max IOPS
    -I | --interface interface_params   set interface parameters
    --interval <snapshot interval>      snapshot interval in minutes
    --label key'='value                 set a label on this volume
    -l | --level <2 | 3>                set redundancy level to 2 copy or 3 copy
    -m | --compress                     enable compression
    -n | --node <nodename>              create volume on named node
    -N | --nodeid <nodeid>              create volume on named node
    -o | --local                        create volume with drives of local node
    -p | --profile <profile>            use profile to add volume
    -P | --provision <thin | thick>     select thin or thick provisioned volume
    -q | --quiet                        display the assigned vdisk ID
    -s | --snapshot                     create volume with snapshot enabled
    --snapshotMax <max snapshots>       maximum number of snapshots
    -t | --type <SSD | HDD>             set backend drive type
    -v | --volume <volumename>          volume name
```


