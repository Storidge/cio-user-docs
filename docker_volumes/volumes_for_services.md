# Volumes for Services

[Docker Swarm](https://docs.docker.com/engine/swarm/) is the cluster management component embedded in the Docker Engine. A swarm cluster consists of multiple hosts which run as manager or worker nodes. Containers run as a service within a swarm cluster and it is the role of the manager to maintain the desired state of the service. When a service is created the desired state can be defined in terms of the number of replicas, ports the service exposes, and network or storage resources allocated to the service.

CIO provides a data management platform for a swarm cluster so persistent storage can be programmatically provisioned and managed for stateful applications.

When a service is rescheduled by docker to a different node, the CIO volume plugin moves the volume to the new node where the service is restarting. More importantly when a node fails and Docker Swarm restarts services on new nodes, the CIO storage orchestrator fails over the correct volumes to keep the stateful services running. This greatly simplifies the operational burden of ensuring high availability for stateful services and applications.

## **Create**

To [start a service](https://docs.docker.com/engine/reference/commandline/service_create/) you use the `docker service create` command. A persistent volume for the service can be specified by using the `--mount` flag. If the volume does not already exist, Docker creates the volume.

**Note:**  that the `docker service create` command does not support the `-v` or `--volume` flag. To mount a volume into a service's container, you must use the `--mount` flag.

You specify a CIO volume in a `docker service create` command by using the `volume-driver` option to call the cio driver and the `volume-opt` option to set volume options. For example

```
docker service create \
--mount source=mysql-data,target=/var/lib/mysql,volume-driver=cio,volume-opt=profile=MYSQL \
--replicas 1 \
--detach=false \
-e MYSQL_ROOT_PASSWORD=mysecret \
--name mysql \
mysql
```

This creates a volume named mysql-data with volume options set in [profile](http://storidge.com/docs/profiles/) MYSQL for a MySQL database running as a service.

To create and mount a unique volume into each task of a service, use a templatized notation. The example below deploys a service with 5 tasks with the `.Task.Slot` template assigning volume N to task N.

```
docker service create \
--mount source={{.Service.Name}}-{{.Task.Slot}},target=/var/lib/mysql,volume-driver=cio,volume-opt=profile=MYSQL \
--replicas 5 \
--detach=false \
-e MYSQL_ROOT_PASSWORD=mysecret \
--name mysql \
mysql
```

Valid placeholders you can use with the template notation are:

| **Placeholder**            | **Description**             |
|----------------------------|-----------------------------|
| .Service.ID                | Service ID                  |
| .Service.Name              | Service name                |
| .Service.Labels            | Service labels              |
| .Node.ID                   | Node ID                     |
| .Node.Hostname             | Node Hostname               |
| .Task.ID                   | Task ID                     |
| .Task.Name                 | Task name                   |
| .Task.Slot                 | Task slot                   |


While the examples above uses a profile to set multiple volume options, volume options can also be individually set. Use comma separated key-value pairs to set multiple volume options.

The following options are supported by the CIO volume plugin:  

| **option** | **description**              | value               | example         |
| ---------- | ---------------------------- | ------------------- | --------------- |
| capacity   | Size in GB                   | 1 to 64000          | capacity=25     |
| directory  | Host path to bind mount      | /path/to/volume     | directory=/cio  |
| level      | Level of data redundancy     | 1, 2, 3             | level=2         |
| type       | Type of backend storage      | ssd, hdd            | type=ssd        |
| iops       | Performance in min/max IOPS  | 30 min, 1000000 max | iops=100,5000   |
| bandwidth  | Performance in min/max MB/s  | 1 min, 1000 max     | bandwidth=10,50 |
| provision  | Thick or thin provisioning   | thin, thick         | provision=thick |
| profile    | Template for volume creation | profile name        | profile=MYSQL   |

## **Inspect**

Use `docker service inspect mysql` to verify that the volume above was created and mounted correctly. Look for the `Mounts` section.

```
"Mounts": [
    {
        "Type": "volume",
        "Source": "mysql-data",
        "Target": "/var/lib/mysql",
        "VolumeOptions": {
            "DriverConfig": {
                "Name": "cio",
                "Options": {
                    "profile": "MYSQL"
                }
            }
        }
    }
],
```

This shows that the mount is a volume, with the source (volume name mysql-data) mounted in the container at directory /var/lib/mysql. The driver configuration section shows that profile MYSQL was used to set the volume options.

## **Remove**

To remove the volume, first remove the service.

```
$ docker service rm mysql

$ docker volume rm mysql
```

## **docker volume create**

You can create and manage volumes separate from a service with the `docker volume create` command. The `--driver` flag is used to call the cio volume plugin and volume options are passed to the driver using the `-o` or `--opt` flag. For example

```
docker volume create --driver cio
--name mysqldb \
--opt size=50 \
--opt type=ssd \
--opt iops=1000,2000 \
--label version=3.3 --label release=stable
```

The volume created as `mysqldb` can now be passed to the `docker service create` command in the source field. Example

```
docker service create \
--mount source=mysqldb,target=/var/lib/mysql,volume-driver=cio \
--replicas 1 \
-e MYSQL_ROOT_PASSWORD=mysecret \
--name mysql \
mysql
```
