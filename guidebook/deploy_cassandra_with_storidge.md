---
title: Deploy Cassandra Cluster with Storidge
description: Deploying Cassandra for Storidge on Docker Swarm cluster
lang: en-US
---

# Deploying Cassandra Cluster on Storidge Volume with Docker Swarm

[Apache Cassandra]() is a NoSQL database that we can use to deal with larger amounts of data across a cluster. It has Docker support and can be deployed and accessed through Portainer in conjunction with Storidge CIO software. This guide will show how to deploy Cassandra using a CIO cluster and Docker, while accessing it through Portainer.

## Prerequisites

- Storidge CIO software installed on your machine. Install from [here](https://guide.storidge.com/getting_started/install.html).

- Familiarity with with [Cassandra](https://cassandra.apache.org/doc/latest/).

- Familiarity with [Docker Stack](https://docs.docker.com/docker-cloud/apps/stacks/).

## Setup

The [YAML](http://abiasforaction.net/apache-cassandra-cluster-docker/) file below will be used for deployment. We first create a seed node called `DC1N1` and an additional non-seed node. Seed nodes discover the cluster in the time it takes to start it up, as well as [gossip](https://www.geeksforgeeks.org/gossip-protocol-in-cassandra/), with new nodes joining the cluster.

Since we don't want to boot up all of the nodes at once, we boot the seed node first and wait 2 minutes between each node boot ONLY on the first boot. The first command `command: bash -c 'if [ -z "$$(ls -A /var/lib/cassandra/)" ] ; then sleep 0; fi && /docker-entrypoint.sh cassandra -f'` in each node ensures that we can recognize when we're first booting up (when the Cassandra directory is empty).

Each node will specify a network name for the nodes to communicate over (`dc1ring`), as well as a volume directory to preserve data (automatically created). Basic environment variables are also specified to name the cluster, as well as the seed that each non-seed node depends on. The basic Cassandra [ports](https://cassandra.apache.org/doc/latest/faq/#what-ports) are exposed and recommended ulimit settings are also specified.

```
#cassandra.yml
version: '3'
services:
    DC1N1:
        image: cassandra:3.10
        command: bash -c 'if [ -z "$$(ls -A /var/lib/cassandra/)" ] ; then sleep 0; fi && /docker-entrypoint.sh cassandra -f'
        networks:
            - dc1ring
        volumes:
            - ./n1data:/var/lib/cassandra
        environment:
            - CASSANDRA_CLUSTER_NAME=dev_cluster
            - CASSANDRA_SEEDS=DC1N1
        expose:
            - 7000
            - 7001
            - 7199
            - 9042
            - 9160
        ulimits:
            memlock: -1
            nproc: 32768
            nofile: 100000
    DC1N2:
        image: cassandra:3.10
        command: bash -c 'if [ -z "$$(ls -A /var/lib/cassandra/)" ] ; then sleep 60; fi && /docker-entrypoint.sh cassandra -f'
        networks:
            - dc1ring
        volumes:
            - ./n2data:/var/lib/cassandra
        environment:
            - CASSANDRA_CLUSTER_NAME=dev_cluster
            - CASSANDRA_SEEDS=DC1N1
        depends_on:
              - DC1N1
        expose:
            - 7000
            - 7001
            - 7199
            - 9042
            - 9160
        ulimits:
            memlock: -1
            nproc: 32768
            nofile: 100000
networks:
    dc1ring:

```

## **Deployment, Usage, and Teardown**

Create and save the YAML file above. We will deploy this by running `docker stack deploy -c cassandra.yml test`. Open up Portainer on the lead Docker Swarm node on port 9000 and navigate to the stacks tab under your portainer stack.

You will see that the 2 nodes have been created. Go to the console under the seed node container and enter `nodetool status`. It will return the IP addresses of each connected node.

Once you are done with your cluster, you can simply click the checkbox next to the Cassandra containers on your stacks tab and click the Remove button to remove the service.