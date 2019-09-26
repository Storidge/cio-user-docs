---
title: Volumes for Docker Compose
description: Provision volumes from Docker compose files with Storidge persistent storage
lang: en-US
---

# Volumes for Docker Compose

[Docker Compose](https://docs.docker.com/compose/overview/) allows users to define an application which consists of multiple services. A definition file describes the inter-dependencies between the services, including details such network or storage requirements, in a manner that is easy to maintain.

Compose includes the ability to attach volumes to any service that has persistent storage requirements. With Compose version 3 and the Storidge volume plugin, you can easily create persistent storage for any stateful applications.  

## **Wordpress MySQL Example**

This guide uses an example to show how the CIO volume plugin is called within a Docker Compose file. Additional examples of Compose files with the CIO volume plugin are available [here](https://github.com/Storidge/docker-stacks).

The example below shows a file with two services, a MySQL database (key db:) and a WordPress (key wordpress:) installation. The MySQL service will use volume mysql-data to persist data which is accessed inside the container at path /var/lib/mysql.

A volume specification (volumes:)  at the end of the wordpress-mysql.yml file completes the definition of the volume. Note the key mysql-data names the volume and calls the cio driver/volume plugin. Under driver options, the volume definition also specifies a MYSQL [profile](http://storidge.com/docs/profiles/) to be used for creating the volume.

```
# wordpress-mysql.yml
version: '3'
services:
  db:
    image: mysql:5.7
    volumes:
        # Pass volume named mysql-data to mysql container
      - "mysql-data:/var/lib/mysql"
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: wordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    links:
      - db
    ports:
      - "8080:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_PASSWORD: wordpress

# Add volumes definition to create volume mysql-data referenced above
volumes:
  mysql-data:
    driver: cio
    driver_opts:
      profile: "MYSQL"
```

## **Mongo Example**

The example [mongo3.yml](https://github.com/Storidge/docker-stacks/blob/master/mongo3.yml) file below deploys 3 tasks as part of a mongo service. Each task has unique volumes (data and config) mounted using templatized notation.

Keys mongoData and mongoConfig in the volume specification (volumes:) calls the cio driver and the `.Task.Slot` template assigns volume N to task N. Under driver options, the volume definition specifies [profile GOLD](https://github.com/Storidge/cio-profiles/blob/master/GOLD) to be used for creating the volume.

```
version: '3.4'

services:
  mongo:
    image: mongo:4.2.0
    deploy:
      replicas: 3
    volumes:
      - mongoData:/data/db
      - mongoConfig:/data/configdb
    entrypoint: [ "/usr/bin/mongod", "--bind_ip_all", "--replSet", "rs0" ]

volumes:
  mongoData:
    driver: cio
    driver_opts:
      profile: "GOLD"
    name: '{{.Service.Name}}-{{.Task.Slot}}-data'
  mongoConfig:
    driver: cio
    driver_opts:
      profile: "GOLD"
    name: '{{.Service.Name}}-{{.Task.Slot}}-config'

networks:
  mongo:
    driver: overlay
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


## **Driver Options**

The driver options supported by Storidge's volume plugin in a Docker Compose file include:

| **option** | **description**                        |
| ---------- | -------------------------------------- |
| capacity   | Size in GB                             |
| directory  | Host path container is bind mounted to |
| level      | Level of data redundancy desired       |
| type       | Type of backend device                 |
| iops       | Performance in min/max IOPS            |
| bandwidth  | Performance in min/max MB/s            |
| provision  | Thick or thin provisioning             |
| profile    | Template to use for volume creation    |
