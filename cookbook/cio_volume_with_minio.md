---
meta:
  - name: description
    content: Storidge volume with Minio
---

# CIO Volume With Minio

[Minio](https://minio.io/) is an object storage server compatible with [Amazon S3 API](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html). It is suited for storing unstructured data such as photos, videos, log files, backups and container images.

Using CIO volumes with Minio is a great way to setup a highly available S3 compatible cloud storage service for development and testing environments.

In this recipe we use a Docker Stack file to define the Minio service and the CIO volume. Then, using a single command, we can create and launch the Minio instance with highly available persistent storage.



## **Prerequisites**

- Familiarity with [Docker Stack](https://docs.docker.com/docker-cloud/apps/stacks/).

- CIO installed on your machine. Install from [here](https://guide.storidge.com/getting_started/install.html). 

  ​

## **Create Docker secrets for Minio**

```
echo "secret" | docker secret create access_key -
echo "mysecret" | docker secret create secret_key -
```

## **Run Minio on Docker Stack**

To deploy the Minio service on Docker Stack, save the following into a minio.yml file in your current working directory. Docker will pull the Minio image and CIO will create the minio1-data volume using the pre-defined MINIO profile.

```
version: '3.1'

services:
  minio1:
    image: minio/minio
    volumes:
      - minio1-data:/export
    ports:
      - "9001:9000"
    networks:
      - minionet
    deploy:
      restart_policy:
        delay: 10s
        max_attempts: 10
        window: 60s
    command: server /export
    secrets:
      - secret_key
      - access_key

volumes:
  minio1-data:
    driver: cio
    driver_opts:
      profile: "MINIO"

networks:
  minionet:
    driver: overlay

secrets:
  secret_key:
    external: true
  access_key:
    external: true
```

Then run command

```
docker stack deploy --compose-file=minio.yml minio
```

The Minio instance is now available on the cluster at port 9001 and is accessible from any IP address of the cio cluster. List the node IPs with the `cio nodes` command:

```
$ cio nodes
NODENAME             IP                NODE_ID    ROLE       STATUS
c1                   192.168.3.95      4132353b   sds        normal
c2                   192.168.3.53      dceacd20   backup1    normal
c3                   192.168.3.145     9ee22782   backup2    normal
c4                   192.168.3.129     d2004822   standard   normal
```

In the above example, point the browser at any of the IP addresses, e.g. http://192.168.3.95:9001.

Login in with access key "secret" and secret key "mysecret" configured earlier.
